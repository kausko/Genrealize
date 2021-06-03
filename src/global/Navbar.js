import {
  AppBar,
  IconButton,
  Link,
  makeStyles,
  Toolbar,
  useScrollTrigger,
  Button,
  Tooltip
} from '@material-ui/core';
import { signOut, useSession } from 'next-auth/client';
import { useContext, useEffect } from 'react';
import PopupButton from '../components/utils/PopupButton';
import SignIn from '../components/auth/SignIn';
import { ThemeContext } from './theme';
import { Brightness4, Brightness7, Cog, PlaylistMusic, ViewDashboardVariant } from 'mdi-material-ui';
import { useRouter } from 'next/router';
import Image from 'next/image'
import Player from './Player';
import Settings from '../components/utils/Settings';

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
  button: {
    display: "flex",
    // '& > *': {
    //   margin: theme.spacing(1),
    // },
  },
}));

export default function Navbar(props) {
  const [session, loading] = useSession();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const classes = useStyles();
  const router = useRouter();
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 20 })

  useEffect(() => {
    router.prefetch('/dashboard')
    router.prefetch('/playlists')
  },[])

  if (loading)
    return <Image
      src="/preloader.svg"
      alt="Preloader"
      layout="fill"
      objectFit="contain"
    />

  const toLocation = location => () => router.push(location)

  return (
    <div className={classes.root}>
      <AppBar position='sticky' className={classes.appBar} color={trigger ? "inherit" : "transparent"}>
        <Toolbar>
          <Link variant='h6' className={classes.root} onClick={toLocation('/')}>
            Genrealize
          </Link>
          {
            session ?
            <div className={classes.button}>
              <IconButton onClick={toLocation('/dashboard')} title="Dashboard">
                <ViewDashboardVariant/>
              </IconButton>
              <IconButton onClick={toLocation('/playlists')} title="Playlists">
                <PlaylistMusic/>
              </IconButton>
              <PopupButton text={<Cog/>} children={<Settings user={session.user}/>} title="Settings"/>
            </div> :
              <PopupButton text='Sign In' children={<SignIn />} title="Sign In"/>
          }
          <IconButton color='inherit' onClick={toggleTheme} title="Toggle Theme">
            {theme.palette.type === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Player {...props}/>
    </div>
  );
}
