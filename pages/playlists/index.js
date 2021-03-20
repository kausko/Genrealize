import { useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { useSession } from 'next-auth/client';
import PopupButton from '../../src/components/utils/PopupButton';
import SignIn from '../../src/components/auth/SignIn';
export default () => {
  const [session] = useSession();
  return (
    <Container>
      {session ? (
        <>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant='h3' align='center'>
                Playlists
              </Typography>
            </Grid>
          </Grid>
        </>
      ) : (
        <Typography variant='h3' align='center'>
          Sign in to view your Playlists
        </Typography>
      )}
    </Container>
  );
};
