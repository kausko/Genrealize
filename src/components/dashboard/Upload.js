import { Avatar, Card, CardActionArea, CardHeader, CircularProgress, Grid, makeStyles } from "@material-ui/core"
import { Upload as UploadIcon } from "mdi-material-ui"
import { uploadSong } from "../../../apis/song"
import { useSnackbar } from 'notistack'

const useStyles = makeStyles(() => ({
  input: {
    display: 'none'
  }
}))

const Upload = ({ 
  loading, 
  setLoading, 
  setTrackNotFound,
  setTrack,
  setTrackVariants,
  setSelectedSongs
}) => {

  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const handleFileSelect = event => {
    setTrackNotFound(false)
    setLoading(true)
    if (event.target.files?.length) {
      const formData = new FormData();
      formData.append(event.target.name, event.target.files[0]);
      uploadSong(formData)
      .then(res => {
        const { track, trackVariants } = res.data;
          if (track) {
            let sel = { 
              [track.id]: {
                ...track,
                selected: false
              } 
            }
            trackVariants.forEach(track => {
              sel[track.id] = {
                ...track,
                selected: false
              }
            })
            setTrack(track)
            setTrackVariants(trackVariants)
            setSelectedSongs(sel)
          }
          else {
            setTrackNotFound(true)
          }
      })
      .catch(err => enqueueSnackbar(err.message, { variant: 'error'}))
      .finally(() => setLoading(false))
    }
  }

  const nullifyEventValue = event => {
    event.target.value = null
  }

  return(
    <Grid item xs={12} md='auto'>
      <input
        accept='audio/*'
        name='audiofile'
        className={classes.input}
        id='audio-upload-button'
        type='file'
        onChange={handleFileSelect}
        onClick={nullifyEventValue}
      />
      <label htmlFor='audio-upload-button'>
        <Card>
          <CardActionArea component="span">
            <CardHeader
              title='Upload Music'
              subheader='Select an full-length mp3 song file and get a list of similar songs'
              avatar={
                <Avatar>
                  <UploadIcon fontSize="large"/>
                </Avatar>
              }
              action={loading && <CircularProgress/>}
              titleTypographyProps={{
                variant: 'h5',
                component: 'h5',
              }}
              subheaderTypographyProps={{
                variant: 'body1',
              }}
            />
          </CardActionArea>
        </Card>
      </label>
    </Grid>
  )
}

export default Upload
