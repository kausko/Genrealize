import { Grid, makeStyles, Typography } from "@material-ui/core"
import MusicCard from "./MusicCard"

const useStyles = makeStyles(theme => ({
  title: {
    marginTop: theme.spacing(1)
  }
}))

const Tracks = ({ 
  trackNotFound, 
  track, 
  trackVariants, 
  selectedSongs, 
  setSelectedSongs, 
  setSongs 
}) => {

  const classes = useStyles()

  if (trackNotFound) {
    return(
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom className={classes.title}>
          Could not identify song
        </Typography>
      </Grid>
    )
  }

  if (track) {
    const TrackVariants = () => {
      if (trackVariants.length > 0) {
        return(
          <>
            <Grid item xs={12}>
              <Typography variant='h4' gutterBottom className={classes.title}>
                Song variants by AcoustID
              </Typography>
            </Grid>
            {trackVariants.map(track => (
              <Grid item key={track.id} xs={12} md='auto'>
                <MusicCard {...{
                  item: track,
                  selectedSongs,
                  setSelectedSongs,
                  setSongs
                }}/>
              </Grid>
            ))}
          </>
        )
      }
      return(
        <Grid item xs={12}>
          <Typography variant='h4' gutterBottom className={classes.title}>
            Could not find similar songs
          </Typography>
        </Grid>
      )
    }
    return (
      <>
        <Grid item xs={12}>
          <Typography variant='h4' gutterBottom>
            Identified Song
          </Typography>
        </Grid>
        <Grid item xs={12} md='auto'>
          <MusicCard {...{
            item: track,
            selectedSongs,
            setSelectedSongs,
            setSongs
          }}/>
        </Grid>
        <TrackVariants/>
      </>
    )
  }

  return <></>
}

export default Tracks