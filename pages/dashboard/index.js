import { useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import { Heart, PlaylistPlus, Upload } from 'mdi-material-ui';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  input: {
    display: 'none',
  },
  title: {
    marginTop: theme.spacing(1)
  },
  speedDial: {
    position: 'absolute',
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  }
}));

export default function DashLanding({ setUrls }) {
  const classes = useStyles();
  const [track, setTrack] = useState(null);
  const [trackVariants, setTrackVariants] = useState([]);
  const [trackNotFound, setTrackNotFound] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedSongs, setSelectedSongs] = useState({})
  const [openFAB, setOpenFAB] = useState(false)
  const [openDLG, setOpenDLG] = useState(false)
  const [playlist, setPlaylist] = useState('')
  const [playlists, setPlaylists] = useState([{ label: 'Loading', _id: 'loading'}])
  const [session] = useSession()
  const router = useRouter()

  if (!session) {
    router.push('/')
  }

  const handleFileSelect = (event) => {
    setTrackNotFound(false)
    setLoading(true)
    if (event.target.files?.length) {
      const formData = new FormData();
      formData.append(event.target.name, event.target.files[0]);
      axios
        .post('/api/song', formData, {
          headers: {
            'content-type': 'multipart/form-data',
          },
          onUploadProgress: (e) => {
            console.log(Math.round((e.loaded * 100) / e.total));
          },
        })
        .then((res) => {
          const { track, trackVariants } = res.data;
          if (track) {
            let sel = { 
              [track.id]: {
                ...track,
                selected: false
              } 
            }
            trackVariants.forEach(track => {
              sel[track.id] = {
                ...track,
                selected: false
              }
            })
            setTrack(track)
            setTrackVariants(trackVariants)
            setSelectedSongs(sel)
          }
          else {
            setTrackNotFound(true)
          }
        })
        .catch(console.log)
        .finally(() => setLoading(false))
    }
  };

  // const getYTURL = ({ title, artists }) => ytsr(`${title} ${artists.length ? artists.join(' ') : ''}`, { limit: 5 })
  const getYTURL = ({ title, artists }) => axios.get(`/api/song?q=${title} ${artists.length ? artists.map(a => a.name || '').join(' ') : ''}`)

  const selectSong = event => {
    const songID = event.target.name
    getYTURL(selectedSongs[songID])
    .then(res => {
      const yturl = res.data
      setSelectedSongs(
        { ...selectedSongs, 
          [songID]: { 
            ...selectedSongs[songID], 
            selected: !selectedSongs[songID].selected,
            url: yturl 
          }
        }
      )
    })
    .catch(err => alert(err.message))
  }

  
  const handleMusicCardClick = item => _event => {
    getYTURL(item)
    .then(res => {
      const yturl = res.data
      if (yturl)
        setUrls([yturl])
      else throw new Error('URL not found')
    })
    .catch(err => alert(err.message))
  }

  const toggleFAB = () => setOpenFAB(!openFAB)
  const toggleDLG = () => setOpenDLG(!openDLG)

  const handleAdd = (type = 'playlist') => _event => {
    if (type === 'favorite')
      handleSubmit(type)
    else
      toggleDLG()
    toggleFAB()
  }

  const handleSubmit = (type = 'playlist') => {
    if (type === 'playlist')
      toggleDLG()
    axios({
      method: typeof playlist === "string" ? "POST" : "PUT",
      headers: { 'Content-Type': 'application/json' },
      url: '/api/playlist/' + typeof playlist === "string" ? "" : playlist._id,
      data: {
        name: playlist,
        songs: selectedSongs
      }
    })
    .then(_r => alert('Playlist added'))
    .catch(err => alert(err.message))
  }

  const handlePlaylistChange = event => setPlaylist(event.target.value)

  const fetchPlaylists = () => axios.get('/api/playlists').then(res => setPlaylists(res.data)).catch(err => alert(err.message))

  const MusicCard = ({ item }) => (
    <Card>
        <CardHeader
          title={item.title}
          subheader={
            Math.floor(item.duration / 60) +
            'm' +
            (item.duration % 60) +
            's'
          }
          action={<Checkbox name={item.id} checked={selectedSongs[item.id]?.selected} onChange={selectSong}/>}
        />
        <CardActionArea onClick={handleMusicCardClick(item)}>
        <CardContent>
          <Typography variant='h6' gutterBottom>
            Artists
          </Typography>
          <Grid container direction='row' spacing={1}>
            {item.artists.map(artist => (
              <Grid item key={artist.id}>
                <Chip key={artist.id} label={artist.name} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  )

  return (
    <Container>
      <Grid container spacing={1}>
        {
          trackNotFound ?
            <Grid item xs={12}>
              <Typography variant='h4' gutterBottom>
                Could not identify song
              </Typography>
            </Grid>
            : !!track &&
            <>
              <Grid item xs={12}>
                <Typography variant='h4' gutterBottom>
                  Identified Song
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <MusicCard item={track} />
              </Grid>
              {
                trackVariants.length > 0 ?
                  <>
                    <Grid item xs={12}>
                      <Typography variant='h4' gutterBottom className={classes.title}>
                        Similar songs
                      </Typography>
                    </Grid>
                    {trackVariants.map(track => (
                      <Grid item key={track.id} xs={12} md>
                        <MusicCard item={track} />
                      </Grid>
                    ))}
                  </>
                  :
                  <Grid item xs={12}>
                    <Typography variant='h4' gutterBottom className={classes.title}>
                      Could not find similar songs
                    </Typography>
                  </Grid>
              }
            </>
        }
        <Grid item xs={12}>
          <input
            accept='audio/*'
            name='audiofile'
            className={classes.input}
            id='audio-upload-button'
            type='file'
            onChange={handleFileSelect}
          />
          <label htmlFor='audio-upload-button'>
            <Card>
              <CardActionArea component='span'>
                <CardHeader
                  title='Upload Music'
                  subheader='Select any music file of your choice and get a list of similar songs'
                  avatar={
                    <Avatar className={classes.avatar}>
                      <Upload fontSize='large' />
                    </Avatar>
                  }
                  action={loading && <CircularProgress />}
                  titleTypographyProps={{
                    variant: 'h5',
                    component: 'h5',
                  }}
                  subheaderTypographyProps={{
                    variant: 'body1',
                  }}
                />
              </CardActionArea>
            </Card>
          </label>
        </Grid>
      </Grid>
      <SpeedDial
        ariaLabel="Playlist picker"
        className={classes.speedDial}
        hidden={!Object.values(selectedSongs).some(song => song.selected)}
        onOpen={toggleFAB}
        onClose={toggleFAB}
        open={openFAB}
        icon={<SpeedDialIcon/>}
      >
        {
          [
            { icon: <Heart/>, name: 'Favorite', action: handleAdd('favorite') },
            { icon: <PlaylistPlus/>, name: 'Add to Playlist', action: handleAdd() }
          ]
          .map(({ icon, name, action}) => 
            <SpeedDialAction
              key={name}
              icon={icon}
              tooltipTitle={name}
              onClick={action}
            />
          )
        }
      </SpeedDial>
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
          {playlists.map(playlist => <MenuItem key={playlist._id} value={playlist}>{playlist.label}</MenuItem>)}
        </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
