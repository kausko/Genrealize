import axios from "axios";
const BASE_URI = window?.location?.hostname?.includes("localhost") ? "http://localhost:8000" : "https://genrealize.azurewebsites.net"

/**
 * @param {FormData} formdata 
 */
export const uploadSong = formData => axios.post(
  `${BASE_URI}/api/song`,
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