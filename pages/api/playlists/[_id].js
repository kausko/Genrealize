import dbConnect from '../../../utils/dbConnect';
import Playlist from '../../../models/Playlist';
import { getSession } from 'next-auth/client';
import nestedUpsert from '../../../utils/nestedUpsert';
import Song from '../../../models/Song';
import Artist from '../../../models/Artist';
/**
 * @param  {import('next').NextApiRequest} req
 * @param  {import('next').NextApiResponse} res
 */
export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session.user) {
    res.status(401).send("User not logged in")
  }
  try {
    const {
      query: { _id },
      method,
      body
    } = req
    await dbConnect()
    let result

    if (method === "GET") {
      result = await Playlist.findOneAndUpdate(
        { _id, email: session.user.email },
        { $set: { lastPlayedAt: new Date() }}
      ).populate({
        path: 'songs',
        model: Song,
        populate: {
          path: 'artists',
          model: Artist
        }
      })
      if (!result)
        throw new Error('Playlist not found')
    }

    else if (method === "PUT") {
      const upsertedSongs = await nestedUpsert(body.songs)
      result = await Playlist.updateOne({ _id }, { $push: { songs: { $each: upsertedSongs } } }).exec()
    }

    else if (method === "DELETE") {
      result = await Playlist.deleteOne({ _id }).exec()
    }

    else {
      res.status(405).send("INVALID METHOD: " + method)
    }

    res.status(200).json(result)
    
  } catch (error) {
    if (error instanceof TypeError) {
      res.status(400).send(error.message)
    }
    res.status(500).send(error.message)
  }
}