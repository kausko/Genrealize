import { useState } from 'react';
import {
  Container,
  Grid,
  Hidden,
  makeStyles,
} from '@material-ui/core';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import Tracks from '../../src/components/dashboard/Tracks';
import Upload from '../../src/components/dashboard/Upload';
import PlayListAdd from '../../src/components/dashboard/PlaylistAdd';
import Image from 'next/image';

const useStyles = makeStyles(theme => ({
  dashboard: {
    minHeight: `calc(100vh - ${theme.spacing(8)}px)`
  }
}))

export default function DashLanding({ setSongs }) {
  const classes = useStyles()
  const [track, setTrack] = useState(null);
  const [trackVariants, setTrackVariants] = useState([]);
  const [trackNotFound, setTrackNotFound] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedSongs, setSelectedSongs] = useState({})
  const [session] = useSession()
  const router = useRouter()

  if (!session) {
    router.push('/')
  }

  return (
    <Container>
      <Grid container spacing={1} className={classes.dashboard} alignItems="center">
        <Hidden smDown>
          <Grid item xs={12} md={6}>
            <Image
              src="/dashboard.svg"
              alt="Dashboard landing"
              width="612"
              height="530"
              layout="intrinsic"
            />
          </Grid>
        </Hidden>
        <Grid container spacing={1} item xs={12} md={6}>
          <Tracks {...{
            selectedSongs,
            setSelectedSongs,
            setSongs,
            track,
            trackNotFound,
            trackVariants
          }}/>
          <Upload {...{
            loading,
            setLoading,
            setSelectedSongs,
            setTrack,
            setTrackNotFound,
            setTrackVariants
        }}/>
        </Grid>
      </Grid>
      <PlayListAdd {...{selectedSongs}}/>
    </Container>
  );
}
