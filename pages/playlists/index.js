import {
  Card,
  CardActionArea,
  Container,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core';
import { Delete } from 'mdi-material-ui';
import { useSession } from 'next-auth/client';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { deletePlaylist as deletePlaylistXHR, fetchPlaylists } from '../../apis/playlist';
import { stopPropagation } from '../../utils/eventHandler';
import { useSnackbar } from 'notistack'
import { LoadableCardHeader } from '../../src/components/utils/Loadable';

export default function Playlists () {
  const [loading, setLoading] = useState(true)
  const [playlists, setPlaylists] = useState(Array.from(5).fill(false))
  const [session] = useSession();
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    fetchPlaylists()
    .then(res => setPlaylists(res.data))
    .catch(err => enqueueSnackbar(err.message, { variant: 'error' }))
  },[])

  useEffect(() => {
    if (!!playlists[0])
      setLoading(false)
  },[playlists])

  if (!session)
    router.push('/')

  const openPlaylist = _id => _e => router.push(`/playlists/${_id}`)
  const deletePlaylist = _id => event => {
    stopPropagation(event)
    if (confirm('Are you sure you want to delete this playlist?')) {
      deletePlaylistXHR(_id)
      .then(() => {
        setPlaylists(playlists.filter(playlist => playlist._id !== _id))
      })
      .catch(err => enqueueSnackbar(err.message, { variant: 'error'}))
    }
  }

  return (
    <Container>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant='h4' gutterBottom>
            Playlists
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          {
            Array.isArray(playlists) && playlists.map((playlist,index) => 
              <Grid item xs={12} key={`${index}`}>
                <Card style={{ margin: "8px" }}>
                  <CardActionArea onClick={openPlaylist(playlist?._id)}>
                    <LoadableCardHeader
                      loading={loading}
                      title={playlist?.name}
                      subheader={playlist?.songs?.length + ' songs'}
                      action={
                        <IconButton
                          onClick={deletePlaylist(playlist?._id)}
                          onMouseDown={stopPropagation}
                          onMouseOver={stopPropagation}
                          onTouchStart={stopPropagation}
                        >
                          <Delete/>
                        </IconButton>
                      }
                    />
                  </CardActionArea>
                </Card>
              </Grid>  
            )
          }
        </Grid>
        <Grid item xs={false} md={8}>
          <Image
            src="/playlist.svg"
            alt="Playlists"
            width="955"
            height="680.5"
            layout="intrinsic"
          />
        </Grid>
      </Grid>
     </Container>
  );
};
