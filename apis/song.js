import axios from "axios";

/**
 * @param {FormData} formdata 
 */
export const uploadSong = formData => axios.post(
  '/api/song',
  formData,
  {
    headers: {
      'content-type': 'multipart/form-data',
    }
  }
)

/**
 * @param  {Object} obj
 * @param  {string} obj.title
 * @param  {import("gimme-the-song/dist/common/types").TrackArtist[]} obj.artists
 */
export const getYTdata = ({ title, artists }) => axios.get(
  `/api/song?q=${title} ${artists.length ? artists.map(a => a.name || '').join(' ') : ''}`
)

export const deleteSong = (playlistId, songId) => axios.delete(
  `/api/song?playlist=${playlistId}&song=${songId}`
)