import { Card, CardActionArea, CardContent, CardHeader, Checkbox, Chip, Grid, Typography } from "@material-ui/core";
import { useState } from "react";
import { getYTdata } from "../../../apis/song";
import { stopPropagation } from "../../../utils/eventHandler";

const MusicCard = ({ item, selectedSongs, setSelectedSongs, setSongs }) => {

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
      setLoading(false)
      setSelectedSongs({
        ...selectedSongs,
        [songID]: newSelectedSong
      })
    } catch (error) {
      alert(error.message)
    }
  }

  const handleMusicCardClick = async _event => {
    try {
      const songID = item.id
      const song = { ...selectedSongs[songID] }
      if (!song.ytData) {
        const ytData = (await getYTdata(item)).data
        song.ytData = ytData
      }
      setSelectedSongs({
        ...selectedSongs,
        [songID]: song
      })
      setSongs([song])
    } catch (err) {
      alert(err.message)
    }
  }

  return (
      <Card>
        <CardActionArea onClick={handleMusicCardClick}>
          <CardHeader
            title={item.title}
            subheader={item.artists.map(artist => artist.name).join(", ")}
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
        </CardActionArea>
      </Card>
  )
}

export default MusicCard