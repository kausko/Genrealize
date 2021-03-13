import React, { useContext } from 'react';
import Image from 'next/image'
import { AppBar, Button, Container, Grid, IconButton, makeStyles, Toolbar, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import SignIn from '../src/components/auth/SignIn';
import PopupButton from '../src/components/utils/PopupButton';
import { signOut, useSession } from 'next-auth/client';
import { ThemeContext } from '../src/global/theme';
import { Brightness4, Brightness7 } from 'mdi-material-ui';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  appBar: {
    boxShadow: "none",
    backgroundColor: "rgba(128,128,128,0.5)"
  },
  gridContainer: {
    minHeight: `calc(100vh - ${theme.spacing(8)}px)`,
    color: "white"
  }
}))

export default function Index() {
  const [session, loading] = useSession()
  const { theme, toggleTheme } = useContext(ThemeContext)
  const classes = useStyles()
  const muiTheme = useTheme()
  const mdDown = useMediaQuery(muiTheme.breakpoints.down('sm'))
  const titleSize = mdDown ? "h2" : "h1"
  return (
    <div className={classes.root}>
      <Image
        src="https://cdn.pixabay.com/photo/2016/11/23/00/58/record-player-1851576_1280.jpg"
        alt="landing background"
        className="next-image"
        layout="fill"
        objectFit="cover"
        objectPosition="left center"
      />
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.root}>
            Genrealize
          </Typography>
          {
            session
            ?
            <>
            <Button>
              {session.user.name || session.user.email}
            </Button>
            <Button onClick={signOut}>
              Sign Out
            </Button>
            </>
            :
            <PopupButton text="Sign In" children={<SignIn/>}/>
          }
          <IconButton color="inherit" onClick={toggleTheme}>
            {theme.palette.type === "dark" ? <Brightness7/> : <Brightness4/> }
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container>
        <Grid container alignItems="center" className={classes.gridContainer}>
          <Grid item xs={12} lg={6}>
            <Typography variant={titleSize}>
              Genrealize
            </Typography>
            <Typography variant="h4">
              1,000,000 Songs.
            </Typography>
            <Typography variant="h4">
              1000 Genres.
            </Typography>
            <Typography variant="h4">
              1 Platform.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
