import {
  Button,
  Card,
  CardActionArea, CardMedia,
  Container,
  Grid,
  IconButton,
  makeStyles,
  useTheme
} from '@material-ui/core'
import { Delete } from 'mdi-material-ui'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { deleteSong } from '../../apis/song'
import { stopPropagation } from '../../utils/eventHandler'
import { useSnackbar } from 'notistack'
import { fetchPlaylistById } from '../../apis/playlist'
import { LoadableCardHeader } from '../../src/components/utils/Loadable'

const useStyles = makeStyles(theme => ({
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  icon: {
    fontSize: "3.5rem"
  }
}))

export default function Playlist({ playlist, setPlaylist, running, setRunning, songs, setSongs }) {
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [session] = useSession()
  const [localPlaylist, setLocalPlaylist] = useState(null)
  const [orderedSongs, setOrderedSongs] = useState(Array(5).fill(false))
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const { _id } = router.query
  const classes = useStyles()

  useEffect(() => {
    fetchPlaylistById(_id)
    .then(res => {
      setOrderedSongs(res.data.name === playlist.name ? songs : res.data.songs)
      setLocalPlaylist(res.data)
    })
    .catch(err => enqueueSnackbar(err.message, { variant: 'error' }))
  }, [])

  useEffect(() => {
    if (!!orderedSongs[0])
      setLoading(false)
  },[orderedSongs])

  if (!session) {
    router.push('/')
  }

  const shuffleSongs = () => {
    let array = [...orderedSongs]
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    setOrderedSongs(array)
  }

  const playSong = (index = 0) => _event => {
    setPlaylist(localPlaylist)
    setRunning(index)
    setSongs(orderedSongs)
  }

  const removeSong = index => event => {
    stopPropagation(event)
    if (confirm('Are you sure you want to delete this song?')) {
      let newSongs = [...orderedSongs]
      const songId = newSongs.splice(index, 1)[0]._id
      setOrderedSongs(newSongs)
      deleteSong(localPlaylist._id, songId)
        .then(() => {
          if (index === orderedSongs.length - 1) {
            setSongs([])
            return
          }
          if (index <= running) {
            setRunning(running + 1)
          } else if (songs?.length) {
            setSongs(newSongs)
          }
        })
        .catch(err => enqueueSnackbar(err.message, { variant: 'error'}))
    }
  }

  return (
    <Container>
      <Grid container spacing={1}>
        <Grid item xs={12}>
            <LoadableCardHeader
                loading={loading}
                title={localPlaylist?.name || "Loading"}
                subheader={localPlaylist?.songs?.length + ' songs'}
                titleTypographyProps={{ variant: "h2" }}
                subheaderTypographyProps={{ variant: "h4" }}
            />
              <Button color="primary" onClick={playSong()}>Play</Button>
              <Button onClick={shuffleSongs} disabled={songs.length}>Shuffle</Button>
        </Grid>
        {
          orderedSongs.map((song, index) =>
            <Grid item xs={12} sm={4} md={3} key={`${index}`}>
              <Card>
                <CardActionArea
                  onClick={playSong(index)}
                  style={{ backgroundColor: (running === index && !!songs.length) ? theme.palette.action.disabledBackground : "inherit" }}
                >
                  <CardMedia image={song.ytData?.bestThumbnail?.url} className={classes.media}/>
                  <LoadableCardHeader
                    loading={loading}
                    title={song?.title}
                    subheader={song?.artists?.filter(a => !!a?.name).map(a => a?.name || a?.id).join(', ')}
                    action={
                      <IconButton
                        onClick={removeSong(index)}
                        onMouseDown={stopPropagation}
                        onMouseOver={stopPropagation}
                        onTouchStart={stopPropagation}
                      >
                        <Delete />
                      </IconButton>
                    }
                  />
                </CardActionArea>
              </Card>
            </Grid>
          )
        }
      </Grid>
    </Container>
  )
}