import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from "@material-ui/core"
import { useEffect, useState } from "react"
import { fetchPlaylists as getPlaylists, upsertPlaylist } from "../../../apis/playlist"
import PlaylistOptions from './PlaylistOptions'

const PlayListAdd = ({
  selectedSongs
}) => {
  const [playlist, setPlaylist] = useState('')
  const [playlists, setPlaylists] = useState([{ name: 'Loading', _id: 'loading'}])
  const [openDLG, setOpenDLG] = useState(false)

  useEffect(() => {
    getPlaylists()
    .then(res => setPlaylists(res.data))
    .catch(err => alert(err.message))
  },[])

  const toggleDLG = () => setOpenDLG(!openDLG)

  const handlePlaylistChange = event => setPlaylist(event.target.value)

  const handleSubmit = () => {
    setOpenDLG(false)
    upsertPlaylist(playlist, Object.values(selectedSongs).filter(song => song.selected))
    .then(() => alert('Playlist added'))
    .catch(err => alert(err.message))
  }
  
  return(
    <>
    <PlaylistOptions {...{
      selectedSongs,
      toggleDLG,
      handleSubmit
    }}/>
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
      <FormControl variant="outlined" fullWidth>
        <InputLabel id="outlined-select-playlist">Add to an existing playlist</InputLabel>
        <Select
          fullWidth
          variant="outlined"
          label="Add to an existing playlist"
          labelId="outlined-select-playlist"
          value={playlist}
          onChange={handlePlaylistChange}
        >
          {playlists.map(playlist => 
          <MenuItem key={playlist._id} value={playlist}>
            {playlist.name}
          </MenuItem>)}
        </Select>
      </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary">Submit</Button>
      </DialogActions>
    </Dialog>
    </>
  )
}

export default PlayListAdd