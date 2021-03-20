import {
  AppBar,
  Button,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { signOut, useSession } from 'next-auth/client';
import { useContext } from 'react';
import PopupButton from '../components/utils/PopupButton';
import SignIn from '../components/auth/SignIn';
import { ThemeContext } from './theme';
import { Brightness4, Brightness7 } from 'mdi-material-ui';
import { useRouter } from 'next/router';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    boxShadow: 'none',
  },
  title: {
    position: 'relative',
    marginLeft: 0,
  },
}));

export default function Navbar({ Component, pageProps }) {
  const [session] = useSession();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const classes = useStyles();
  const router = useRouter();

  const toDash = () => router.push('/dashboard');
  const toPlaylists = () => router.push('/playlists');
  return (
    <div className={classes.root}>
      <AppBar position='sticky' className={classes.appBar} color='transparent'>
        <Toolbar>
          <Typography variant='h6' className={classes.root}>
            Genrealize
          </Typography>
          {session ? (
            <>
              <Button onClick={toPlaylists}>Playlists</Button>
              <Button onClick={toDash}>
                {session.user.name || session.user.email}
              </Button>
              <Button
                onClick={() =>
                  signOut({ callbackUrl: 'http://localhost:3000/' })
                }
              >
                Sign Out
              </Button>
            </>
          ) : (
            <PopupButton text='Sign In' children={<SignIn />} />
          )}
          <IconButton color='inherit' onClick={toggleTheme}>
            {theme.palette.type === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Component {...pageProps} />
    </div>
  );
}
