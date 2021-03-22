import {
  Container,
  Grid,
  Typography,
} from '@material-ui/core';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

export default () => {
  const [session] = useSession();
  const router = useRouter()
  
  if (!session)
    router.push('/')

  return (
    <Container>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant='h3' align='center'>
            Playlists
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};
