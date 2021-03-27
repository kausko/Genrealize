import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, TextField } from "@material-ui/core"
import { useState } from "react"
import { fetchPlaylists as getPlaylists, upsertPlaylist } from "../../../apis/playlist"
import PlaylistOptions from './PlaylistOptions'

const PlayListAdd = ({
  selectedSongs
}) => {
  const [playlist, setPlaylist] = useState('')
  const [playlists, setPlaylists] = useState([{ label: 'Loading', _id: 'loading'}])
  const [openDLG, setOpenDLG] = useState(false)

  const toggleDLG = () => setOpenDLG(!openDLG)

  const handlePlaylistChange = event => setPlaylist(event.target.value)

  const fetchPlaylists = () => getPlaylists()
  .then(res => setPlaylists(res.data))
  .catch(err => alert(err.message))

  const handleSubmit = () => {
    setOpenDLG(false)
    upsertPlaylist(playlist, selectedSongs)
    .then(() => alert('Playlist added'))
    .catch(err => alert(err.message))
  }
  
  return(
    <>
    <PlaylistOptions
      selectedSongs={selectedSongs}
      toggleDLG={toggleDLG}
      handleSubmit={handleSubmit}
    />
    <Dialog open={openDLG} onClose={toggleDLG}>
      <DialogTitle>Add to playlist</DialogTitle>
      <DialogContent>
      <TextField
        autoFocus
        fullWidth
        variant="outlined"
        label="Create a new playlist"
        onChange={handlePlaylistChange}
      />
      <Button disabled fullWidth>
        OR
      </Button>
      <Select
        fullWidth
        variant="outlined"
        label="Add to an existing playlist"
        onClick={fetchPlaylists}
        onChange={handlePlaylistChange}
      >
        {playlists.map(playlist => 
        <MenuItem key={playlist._id} value={playlist}>
          {playlist.label}
        </MenuItem>)}
      </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary">Submit</Button>
      </DialogActions>
    </Dialog>
    </>
  )
}

export default PlayListAdd