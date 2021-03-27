import { Card, CardActionArea, CardContent, CardHeader, Checkbox, Chip, Grid, Typography } from "@material-ui/core";
import { useState } from "react";
import { getYTdata } from "../../../apis/song";

const MusicCard = ({ item, selectedSongs, setSelectedSongs, setYtData }) => {

  const [loading, setLoading] = useState(false)

  const selectSong = async _event => {
    setLoading(true)
    try {
      const songID = item.id
      let newSelectedSong = {
        ...selectedSongs[songID],
        selected: !selectedSongs[songID].selected
      }
      if (!selectedSongs[songID].ytData) {
        const ytData = (await getYTdata(item)).data
        newSelectedSong.ytData = ytData
      }
      setSelectedSongs({
        ...selectedSongs,
        [songID]: newSelectedSong
      })
    } catch (error) {
      alert(error.message)
    }
    setLoading(false)
  }

  const handleMusicCardClick = async _event => {
    try {
      const songID = item.id
      let { ytData } = selectedSongs[songID]
      if (!ytData) {
        ytData = (await getYTdata(item)).data
      }
      console.log(ytData)
      setYtData([ytData])
    } catch (err) {
      alert(err.message)
    }
  }

  const stopPropagation = event => {
    event.stopPropagation()
    event.preventDefault()
  }

  return (
      <Card>
        <CardActionArea onClick={handleMusicCardClick}>
          <CardHeader
            title={item.title}
            subheader={
              Math.floor(item.duration / 60) +
              'm' +
              (item.duration % 60) +
              's'
            }
            action={
              <Checkbox 
                name={item.id}
                checked={selectedSongs?.[item.id]?.selected || false} 
                onChange={selectSong}
                onClick={stopPropagation}
                onMouseDown={stopPropagation}
                onMouseOver={stopPropagation}
                onTouchStart={stopPropagation}
                indeterminate={loading}
              />
            }
          />
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Artists
            </Typography>
            <Grid container direction="row" spacing={1}>
              {item.artists.map(artist =>
                <Grid item key={artist.id}>
                  <Chip key={artist.id} label={artist.name}/>
                </Grid>  
              )}
            </Grid>
          </CardContent>
        </CardActionArea>
      </Card>
  )
}

export default MusicCard