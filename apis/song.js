import axios from "axios";
let BASE_URI = "https://genrealize.azurewebsites.net"
try {
  if (window?.location?.hostname?.includes("localhost"))
    BASE_URI = "/api"
} catch (error) {
  // IGNORE ERROR IN PROD ENV AND USE ORIGINAL URI
}

/**
 * @param {FormData} formdata 
 */
export const uploadSong = formData => axios.post(
  `${BASE_URI}/song`,
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