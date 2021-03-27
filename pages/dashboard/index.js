import { useState } from 'react';
import {
  Container,
  Grid,
} from '@material-ui/core';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import Tracks from '../../src/components/dashboard/Tracks';
import Upload from '../../src/components/dashboard/Upload';
import PlayListAdd from '../../src/components/dashboard/PlaylistAdd';

export default function DashLanding({ setYtData }) {
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
      <Grid container spacing={1}>
        <Tracks
          selectedSongs={selectedSongs}
          setSelectedSongs={setSelectedSongs}
          setYtData={setYtData}
          track={track}
          trackNotFound={trackNotFound}
          trackVariants={trackVariants}
        />
        <Upload
          loading={loading}
          setLoading={setLoading}
          setSelectedSongs={setSelectedSongs}
          setTrack={setTrack}
          setTrackNotFound={setTrackNotFound}
          setTrackVariants={setTrackVariants}
        />
      </Grid>
      <PlayListAdd selectedSongs={selectedSongs}/>
    </Container>
  );
}
