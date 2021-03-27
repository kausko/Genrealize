import axios from "axios";

export const upsertPlaylist = (playlist, selectedSongs) => axios({
  method: typeof playlist === "string" ? "POST" : "PUT",
  headers: { 'Content-Type': 'application/json' },
  url: '/api/playlist/' + typeof playlist === "string" ? "" : playlist._id,
  data: {
    name: playlist,
    songs: selectedSongs
  }
})

export const fetchPlaylists = () => axios.get('/api/playlists')