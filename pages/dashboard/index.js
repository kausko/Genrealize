import { useState } from 'react'
import { Avatar, Button, Card, CardActionArea, CardContent, CardHeader, Chip, Container, Grid, makeStyles, Typography } from "@material-ui/core";
import axios from "axios";
import { Upload } from "mdi-material-ui";

const useStyles = makeStyles(theme => ({
  input: {
    display: 'none',
  }
}))

export default function DashLanding() {
  const classes = useStyles()
  const [track, setTrack] = useState(null)
  const [trackVariants, setTrackVariants] = useState([])

  const handleChange = event => {
    if (event.target.files?.length) {
      const formData = new FormData()
      formData.append(event.target.name, event.target.files[0])
      axios
        .post(
          '/api/song',
          formData,
          {
            headers: {
              "content-type": "multipart/form-data"
            },
            onUploadProgress: e => {
              console.log(Math.round(e.loaded * 100 / e.total))
            }
          }
        )
        .then(res => {
          const { track, trackVariants } = res.data
          if (track) {
            setTrack(track)
            if (trackVariants?.length) {
              const vars = trackVariants.filter(variant => !!variant.title && track.title !== variant.title)
              console.log(vars)
              setTrackVariants(vars)
            }
          }
        })
        .catch(console.log)
    }
  }
  return (
    <Container>
      <Grid container spacing={1}>
        {
          !!track &&
          <>
          <Grid item xs={12}>
              <Typography variant="h4" gutterBottom>
                Identified Song
            </Typography>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Card>
              <CardHeader
                title={track.title}
                subheader={Math.floor(track.duration / 60) + "m" + track.duration % 60 + "s"}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Artists
                </Typography>
                <Grid container direction="row" spacing={1}>
                  {
                    track.artists.map((artist, i) =>
                      <Grid item key={i}>
                        <Chip key={i} label={artist.name} />
                      </Grid>
                    )
                  }
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          </>
        }
        {
          !!trackVariants.length &&
          <>
            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom>
                Similar songs
            </Typography>
            </Grid>
            {
              trackVariants.map((track, i) =>
                <Grid item>
                  <Card>
                    <CardHeader
                      title={track.title}
                      subheader={Math.floor(track.duration / 60) + "m" + track.duration % 60 + "s"}
                    />
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Artists
                      </Typography>
                      <Grid container direction="row" spacing={1}>
                        {
                          track.artists?.map((artist, i) =>
                            <Grid item key={i}>
                              <Chip key={i} label={artist.name} />
                            </Grid>
                          )
                        }
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )
            }
          </>
        }
        <Grid item xs={12} lg={6}>
          <input
            accept="audio/*"
            name="audiofile"
            className={classes.input}
            id="audio-upload-button"
            type="file"
            onChange={handleChange}
          />
          <label htmlFor="audio-upload-button">
            <Card>
              <CardActionArea component="span">
                <CardHeader
                  title="Upload Music"
                  subheader="Select any music file of your choice and get a list of similar songs"
                  avatar={
                    <Avatar className={classes.avatar}>
                      <Upload fontSize="large"/>
                    </Avatar>
                  }
                  titleTypographyProps={{
                    variant: "h5",
                    component: "h5"
                  }}
                  subheaderTypographyProps={{
                    variant: "body1"
                  }}
                />
              </CardActionArea>
            </Card>
          </label>
        </Grid>
      </Grid>
    </Container>
  )
}