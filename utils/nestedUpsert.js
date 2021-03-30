import { Types } from "mongoose";
import Artist from "../models/Artist";
import Song from "../models/Song";
/**
 * @param  {import("gimme-the-song/dist/common/types").Track[]} songs
 */
export default async function nestedUpsert(songs) {

  const artistObjectIdMap = new Map()
  const artistSongIndices = new Map()
  const songObjectIdMap = new Map()
  const songIndices = Array.from(songs, () => [])

  songs.forEach((song, index) => {
    song.artists.forEach(artist => {
      artistObjectIdMap.set(artist.id, null)
      let indices = artistSongIndices.get(artist.id) || []
      indices = [...indices, index]
      artistSongIndices.set(artist.id, indices)
    })
    songObjectIdMap.set(song.id, null)
  })

  const foundArtists = await Artist.find({ id: { $in: [...artistObjectIdMap.keys()] }}).exec()

  foundArtists.forEach(artist => {
    artistObjectIdMap.set(artist.id, artist._id)
    artistSongIndices.get(artist.id).forEach(i => {
      songIndices[i] = [...songIndices[i], artist._id]
    })
  })

  let leftoverArtists = [], artistBulk = []
  songs.map(song => song.artists).flat().forEach(({ id, name },i) => {
    if (!artistObjectIdMap.get(id)) {
      leftoverArtists.push(id)
      // artistBulk.push({ insertOne: { document: { id, name } } })
      artistBulk.push({
        updateOne: {
          filter: { id },
          update: { name },
          upsert: true
        }
      })
    }
  })

  const upsertedArtists = Object.values((
    await Artist.bulkWrite(artistBulk)
  ).upsertedIds).filter(Boolean)

  upsertedArtists.forEach((v, i) => {
    artistSongIndices.get(leftoverArtists[i]).forEach(i => {
      songIndices[i] = [...songIndices[i], v]
    })
  })

  const foundSongs = await Song.find({ id: { $in: [...songObjectIdMap.keys()]}}).exec()

  foundSongs.forEach(song => {
    songObjectIdMap.set(song.id, song._id)
  })

  let leftOverSongs = [], songsBulk = []
  songs.map(({ id, title, ytData }, index) => {
    if (!songObjectIdMap.get(id)) {
      leftOverSongs.push(id)
      songsBulk.push({
        insertOne: {
          document: {
            id, title, ytData, artists: songIndices[index]
          }
        }
      })
    }
  })

  const insertedSongs = Object.values((
    await Song.bulkWrite(songsBulk)
  ).insertedIds)

  insertedSongs.forEach((song, index) => {
    songObjectIdMap.set(leftOverSongs[index], song._id)
  })

  return [...songObjectIdMap.values()]
}