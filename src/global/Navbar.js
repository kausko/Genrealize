import {
  AppBar,
  Card,
  IconButton,
  makeStyles,
  MenuItem,
  MenuList,
  Paper,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { signOut, useSession } from 'next-auth/client';
import { useContext, useState } from 'react';
import PopupButton from '../components/utils/PopupButton';
import SignIn from '../components/auth/SignIn';
import { ThemeContext } from './theme';
import { Brightness4, Brightness7 } from 'mdi-material-ui';
import { useRouter } from 'next/router';
import Image from 'next/image'
import ReactPlayer from 'react-player/youtube';
import Draggable from 'react-draggable';

const useStyles = makeStyles(theme => ({
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
  dragger: {
    position: 'absolute',
    right: theme.spacing(10),
    top: theme.spacing(10),
  },
  draggerTypography: {
    cursor: "move"
  }
}));

export default function Navbar({ Component, pageProps }) {
  const [session, loading] = useSession();

  if (loading)
    return <Image
      src="/preloader.svg"
      alt="Preloader"
      layout="fill"
      objectFit="contain"
    />

  const [urls, setUrls] = useState([])
  const { theme, toggleTheme } = useContext(ThemeContext);
  const classes = useStyles();
  const router = useRouter();
  const finalProps = {...pageProps, urls, setUrls}
  const toDash = () => router.push('/dashboard');
  const toPlaylists = () => router.push('/playlists');
  
  const handleSignOut = () => signOut({redirect: false}).then(() => setUrls([])).catch(err => alert(err.message))
  return (
    <div className={classes.root}>
      <AppBar position='sticky' className={classes.appBar} color='transparent'>
        <Toolbar>
          <Typography variant='h6' className={classes.root}>
            Genrealize
          </Typography>
          {
            session ?
            <PopupButton 
              text={session.user.name || session.user.email} 
              children={
                <Paper>
                  <MenuList>
                    <MenuItem onClick={toDash}>Dashboard</MenuItem>
                    <MenuItem onClick={toPlaylists}>Playlists</MenuItem>
                    <MenuItem onClick={toggleTheme}>Theme: {theme.palette.type}</MenuItem>
                    <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                  </MenuList>
                </Paper>
              }
            /> :
            <PopupButton text='Sign In' children={<SignIn />} />
          }
          <IconButton color='inherit' onClick={toggleTheme}>
            {theme.palette.type === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Component {...finalProps} />
      {
        session && !!urls.length &&
        <Draggable
          defaultClassName={classes.dragger}
          scale={1}
        >
          <Card>
              <Typography 
                align="center" 
                className={classes.draggerTypography}
                gutterBottom
              >
                ...
              </Typography>
              <ReactPlayer
                url={urls}
                onEnded={() => setUrls([])}
                controls={true}
              />
          </Card>
        </Draggable>
      }
    </div>
  );
}
