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
import { Brightness4, Brightness7 } from 'mdi-material-ui';
import { useRouter } from 'next/router';
import Image from 'next/image'
import Player from './Player';

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
    '& > *': {
      margin: theme.spacing(1),
    },
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
  
  const handleSignOut = () => signOut({ redirect: false })
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
              <Button variant="text" onClick={toLocation('/dashboard')}>Dashboard</Button>
              <Button variant="text" onClick={toLocation('/playlists')}>Playlists</Button>
              <Tooltip title="Sign Out">
                <Button 
                  variant="text" 
                  onClick={handleSignOut}>{session.user.name || session.user.email}
                </Button>
              </Tooltip>
            </div> :
              <PopupButton text='Sign In' children={<SignIn />} />
          }
          <IconButton color='inherit' onClick={toggleTheme}>
            {theme.palette.type === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Player {...props}/>
    </div>
  );
}
