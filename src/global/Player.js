import { Avatar, Box, Card, CardContent, CardHeader, CardMedia, Grid, IconButton, makeStyles, Slider, Typography } from "@material-ui/core"
import { Close, Pause, Play, Repeat, RepeatOff, SkipBackward, SkipForward, Video, VideoOff } from "mdi-material-ui"
import { useSession } from "next-auth/client"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState, useRef, useEffect } from "react"
import Draggable from "react-draggable"
import YouTubePlayer from "react-player/youtube"

const useStyles = makeStyles(theme => ({
  draggable: {
    position: 'absolute',
    right: theme.spacing(10),
    top: theme.spacing(10),
  },
  card: {
    cursor: "move"
  },
  media: {
    height: 0,
    paddingTop: '56.25%'
  }
}))

const Player = ({ Component, pageProps }) => {
  const [session] = useSession()
  const [playlistName, setPlaylistName] = useState('')
  const [songs, setSongs] = useState([])
  const [loop, setLoop] = useState(false)
  const [playing, setPlaying] = useState(true)
  const [running, setRunning] = useState(0)
  const [played, setPlayed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [seeking, setSeeking] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [pageLoading, setPageLoading] = useState(false)
  const player = useRef(null)
  const classes = useStyles()
  const router = useRouter()

  useEffect(() => {
    const toggleLoading = state => () => setPageLoading(state)
    router.events.on('routeChangeStart', toggleLoading(true))
    router.events.on('routeChangeComplete', toggleLoading(false))
    return () => {
      router.events.off('routeChangeStart', toggleLoading(true))
      router.events.off('routeChangeComplete', toggleLoading(false))
    }
  }, [])

  const handleClose = () => setSongs([])
  const toggleLoop = () => setLoop(!loop)
  const toggleShowVideo = () => setShowVideo(!showVideo)

  const handleSeeking = handling => (_e,v) => {
    setSeeking(handling)
    setPlayed(v/100)
    if(!handling) {
      player.current.seekTo(v/100)
    }
  }

  const setPlayingStatus = (status = !playing) => () => setPlaying(status)

  const handleEnded = (unit = 1) => () => {
    const nextRunner = (running + unit) % songs.length
    setRunning(nextRunner)
    setPlaying(true)
    if (!loop && !nextRunner) {
      setSongs([])
    }
  }

  const handleProgress = ({ played }) => {
    if (!seeking) {
      setPlayed(played)
    }
  }

  const handleDuration = duration => setDuration(duration)

  const Duration = ({ seconds }) => {

    const pad = str => ('0' + str).slice(-2)

    const format = seconds => {
      const date = new Date(seconds*1000)
      const hh = date.getUTCHours()
      const mm = date.getUTCMinutes()
      const ss = pad(date.getUTCSeconds())
      if (hh) {
        return hh + ":" + pad(mm) + ":" + ss
      }
      return mm + ":" + ss
    }
    return(
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">
          {format(seconds)}
        </Typography>
      </Box>
    )
  }

  return(
    <>
    {
      pageLoading ?
      <Image
        src="/preloader.svg"
        alt="Preloader"
        layout="fill"
        objectFit="contain"
      /> :
      <Component {...{...pageProps, running, setRunning, songs, setSongs, playlistName, setPlaylistName}} />
    }
    {
      !!session && !!songs.length &&
      <Draggable defaultClassName={classes.draggable} scale={1}>
        <Card className={classes.card}>
          <CardHeader
            title={!showVideo && songs[running].title}
            subheader={!showVideo && songs[running].artists?.map(a => a.name || a.id).join(", ")}
            avatar={
              showVideo ?
              <IconButton onClick={toggleShowVideo}>
                <VideoOff/>
              </IconButton> :
              <Avatar alt={songs[running].title} src={songs[running].ytData.author?.bestAvatar?.url}/>
            }
            action={
              <IconButton onClick={handleClose}>
                <Close/>
              </IconButton>
            }
          />
          {
            !showVideo &&
            <>
              <CardMedia
                image={songs[running].ytData.bestThumbnail?.url}
                className={classes.media}
                title="Thumbnail"
              />
              <CardContent>
                <Grid container justify="center" alignItems="center" spacing={1}>
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center">
                      <Duration seconds={duration*played}/>
                      <Box width="100%" mr={1}>
                        <Slider 
                          value={played*100} 
                          onChange={handleSeeking(true)}
                          onChangeCommitted={handleSeeking(false)}
                        />
                      </Box>
                      <Duration seconds={duration*(1-played)}/>
                    </Box>
                  </Grid>
                  <Grid item>
                    <IconButton onClick={toggleLoop}>
                      { loop ? <RepeatOff/> : <Repeat/> }
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <IconButton onClick={handleEnded(-1)}>
                      <SkipBackward/>
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <IconButton onClick={setPlayingStatus()}>
                      {
                        playing ? <Pause/> : <Play/>
                      }
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <IconButton onClick={handleEnded(1)}>
                      <SkipForward/>
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <IconButton onClick={toggleShowVideo}>
                      <Video/>
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </>
          }
        <YouTubePlayer
          ref={player}
          style={{display: showVideo ? 'initial' : 'none'}}
          url={songs[running].ytData.url}
          playing={playing}
          controls={true}
          onReady={console.log}
          onStart={console.log}
          onPlay={setPlayingStatus(true)}
          onPause={setPlayingStatus(false)}
          onSeek={console.log}
          onEnded={handleEnded()}
          onProgress={handleProgress}
          onDuration={handleDuration}
        />
        </Card>
      </Draggable>
    }
    </>
  )
}

export default Player