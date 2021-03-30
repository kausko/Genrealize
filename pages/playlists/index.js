import {
  Avatar,
  Card,
  CardActionArea,
  CardHeader,
  Container,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core';
import { Delete } from 'mdi-material-ui';
import { getSession, useSession } from 'next-auth/client';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { deletePlaylist as deletePlaylistXHR } from '../../apis/playlist';
import Playlist from '../../models/Playlist';
import { stopPropagation } from '../../utils/eventHandler';

/**
 * @param  {import('next').GetServerSidePropsContext} context
 */
export async function getServerSideProps(context) {
  const email = (await getSession({ req: context.req })).user?.email
  const playlists = JSON.parse(JSON.stringify(await Playlist.find({ email })))
  return {
    props: {
      playlists
    }
  }
}

export default function Playlists ({ playlists: initialPlaylists }) {
  const [playlists, setPlaylists] = useState([...initialPlaylists])
  const [session] = useSession();
  const router = useRouter()
  
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
      .catch(err => alert(err.message))
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
            Array.isArray(playlists) && playlists.map(playlist => 
              <Grid item xs={12} key={playlist._id}>
                <Card style={{ margin: "8px" }}>
                  <CardActionArea onClick={openPlaylist(playlist._id)}>
                    <CardHeader
                      title={playlist.name}
                      subheader={playlist.songs.length + ' songs'}
                      action={
                        <IconButton
                          onClick={deletePlaylist(playlist._id)}
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
