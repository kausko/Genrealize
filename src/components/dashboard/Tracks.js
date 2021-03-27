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
  setYtData 
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
                Similar songs
              </Typography>
            </Grid>
            {trackVariants.map(track => (
              <Grid item key={track.id} xs={12} md>
                {/* <MusicCard {...{ item: track, selectedSongs, setSelectedSongs, setYtData }} /> */}
                <MusicCard
                  item={track}
                  selectedSongs={selectedSongs}
                  setSelectedSongs={setSelectedSongs}
                  setYtData={setYtData}
                />
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
        <Grid item xs={12} md={4}>
          <MusicCard 
            item={track} 
            selectedSongs={selectedSongs}
            setSelectedSongs={setSelectedSongs}
            setYtData={setYtData}
          />
        </Grid>
        <TrackVariants/>
      </>
    )
  }

  return <></>
}

export default Tracks