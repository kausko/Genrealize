import React from 'react';
import Image from 'next/image'
import { Container, Grid, makeStyles, Typography, useMediaQuery, useTheme } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  gridContainer: {
    minHeight: `calc(100vh - ${theme.spacing(8)}px)`,
  }
}))

export default function Index() {
  const classes = useStyles()
  const muiTheme = useTheme()
  const mdDown = useMediaQuery(muiTheme.breakpoints.down('sm'))
  const titleSize = mdDown ? "h2" : "h1"
  return (
    <>
      <Image
        src="/landingBackground.jpg"
        alt="landing background"
        className="next-image"
        layout="fill"
        objectFit="cover"
        objectPosition="left center"
      />
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
    </>
  );
}
