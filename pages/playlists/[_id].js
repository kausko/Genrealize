import { Card, CardActionArea, Container, Grid, IconButton, useTheme } from '@material-ui/core'
import { Delete, Shuffle } from 'mdi-material-ui'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { deleteSong } from '../../apis/song'
import { stopPropagation } from '../../utils/eventHandler'
import { useSnackbar } from 'notistack'
import { fetchPlaylistById } from '../../apis/playlist'
import { LoadableCardHeader } from '../../src/components/utils/Loadable'

export default function Playlist({ playlistName, setPlaylistName, running, setRunning, songs, setSongs }) {
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [session] = useSession()
  const [playlist, setPlaylist] = useState(null)
  const [orderedSongs, setOrderedSongs] = useState(Array.from(5).fill(false))
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const { _id } = router.query

  useEffect(() => {
    fetchPlaylistById(_id)
    .then(res => {
      setOrderedSongs(res.data.name === playlistName ? songs : res.data.songs)
      setPlaylist(res.data)
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
    setPlaylistName(playlist.name)
    setRunning(index)
    setSongs(orderedSongs)
  }

  const removeSong = index => event => {
    stopPropagation(event)
    if (confirm('Are you sure you want to delete this song?')) {
      let newSongs = [...orderedSongs]
      const songId = newSongs.splice(index, 1)[0]._id
      setOrderedSongs(newSongs)
      deleteSong(playlist._id, songId)
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
          <Card>
            <CardActionArea onClick={playSong()}>
              <LoadableCardHeader
                loading={loading}
                title={playlist?.name}
                subheader={playlist?.songs?.length + ' songs'}
                action={
                  <IconButton 
                    onClick={shuffleSongs}
                    onMouseDown={stopPropagation}
                    onMouseOver={stopPropagation}
                    onTouchStart={stopPropagation}
                  >
                    <Shuffle />
                  </IconButton>
                }
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
        </Grid>
        <Grid container item xs={12}>
          {
            orderedSongs.map((song, index) =>
              <Grid item xs={12} key={`${index}`}>
                <Card
                  style={{ backgroundColor: (running === index && !!songs.length) ? theme.palette.action.hover : "inherit" }}
                >
                  <CardActionArea onClick={playSong(index)}>
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
      </Grid>
    </Container>
  )
}