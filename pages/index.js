import React from 'react';
import Image from 'next/image'
import { AppBar, Button, Card, CardContent, Container, Grid, makeStyles, TextField, Toolbar, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import Login from '../src/components/auth/Login';
import Register from '../src/components/auth/Register';
import PopupButton from '../src/components/utils/PopupButton';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  appBar: {
    boxShadow: "none",
    color: "white !important"
  },
  gridContainer: {
    minHeight: `calc(100vh - ${theme.spacing(8)}px)`,
  }
}))

export default function Index() {

  const classes = useStyles()
  const theme = useTheme()
  const mdDown = useMediaQuery(theme.breakpoints.down('sm'))
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
      <AppBar position="static" color="transparent" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.root}>
            Genrealize
          </Typography>
          <PopupButton text="Login" children={<Login/>}/>
          <PopupButton text="Register" children={<Register/>}/>
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
