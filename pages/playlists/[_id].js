import { Avatar, Card, CardHeader, CardActionArea, Container, Grid, IconButton, useTheme } from '@material-ui/core'
import { Delete, Play, Shuffle } from 'mdi-material-ui'
import { getSession, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { deleteSong } from '../../apis/song'
import PlaylistModel from '../../models/Playlist'
import { stopPropagation } from '../../utils/eventHandler'
import { useSnackbar } from 'notistack'

/**
 * @param  {import('next').GetServerSidePropsContext} context
 */
export async function getServerSideProps(context) {
  const { _id } = context.params
  const email = (await getSession({ req: context.req })).user?.email
  const playlist = JSON.parse(JSON.stringify((await PlaylistModel
    .findOne({ _id, email })
    .populate({
      path: 'songs',
      populate: {
        path: 'artists'
      }
    })
  )))
  return {
    props: {
      playlist
    }
  }
}

export default function Playlist({ playlist, playlistName, setPlaylistName, running, setRunning, songs, setSongs }) {
  const theme = useTheme()
  const [session] = useSession()
  const [orderedSongs, setOrderedSongs] = useState([])
  const router = useRouter()
  const { _id } = router.query
  const { enqueueSnackbar } = useSnackbar()
  useEffect(() => {
    setOrderedSongs(playlist?.name === playlistName ? songs : playlist.songs)
  }, [])

  if (!session) {
    router.push('/')
  }

  const playSongs = () => {
    setPlaylistName(playlist.name)
    setRunning(0)
    setSongs(orderedSongs)
  }

  const shuffleSongs = () => {
    let array = [...orderedSongs]
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    setOrderedSongs(array)
  }

  const playSong = index => _event => {
    setRunning(index)
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
            <CardHeader
              title={playlist.name}
              subheader={playlist.songs.length + ' songs'}
              avatar={
                <Avatar component="button" onClick={playSongs} style={{ cursor: "pointer" }}>
                  <Play fontSize="large" />
                </Avatar>
              }
              action={
                <IconButton onClick={shuffleSongs}>
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
          </Card>
        </Grid>
        <Grid container item xs={12}>
          {
            orderedSongs.map((song, index) =>
              <Grid item xs={12} key={song._id}>
                <Card
                  style={{ backgroundColor: (running === index && !!songs.length) ? theme.palette.action.hover : "inherit" }}
                >
                  <CardActionArea onClick={playSong(index)}>
                    <CardHeader
                      title={song.title}
                      subheader={song.artists.filter(a => !!a.name).map(a => a.name || a.id).join(', ')}
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