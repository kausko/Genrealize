import { Card, CardActionArea, CardContent, CardHeader, Checkbox, Chip, Grid, Typography, Tooltip } from "@material-ui/core";
import { useState } from "react";
import { getYTdata } from "../../../apis/song";
import { stopPropagation } from "../../../utils/eventHandler";
import { useSnackbar } from 'notistack'

const MusicCard = ({ item, selectedSongs, setSelectedSongs, setSongs }) => {

  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

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
      enqueueSnackbar(error.message, { variant: 'error'})
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
      enqueueSnackbar(err.message, { variant: 'error'})
    }
  }

  return (
      <Card>
        <Tooltip title="Click to play Song">
        <CardActionArea onClick={handleMusicCardClick}>
          <CardHeader
            title={item.title}
            subheader={item.artists.map(artist => artist.name).join(", ")}
            action={
              <Tooltip title="Select Song" onMouseOver={stopPropagation}>
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
              </Tooltip>
            }
          />
        </CardActionArea>
        </Tooltip>
      </Card>
  )
}

export default MusicCard