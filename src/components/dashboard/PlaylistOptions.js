import { makeStyles } from "@material-ui/core"
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@material-ui/lab"
import { Heart, PlaylistPlus } from "mdi-material-ui"
import { useState } from "react"

const useStyles = makeStyles(theme => ({
  speedDial: {
    position: 'absolute',
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  }
}))

const PlaylistOptions = ({
  selectedSongs,
  toggleDLG,
  handleSubmit
}) => {

  const classes = useStyles()

  const [openFAB, setOpenFAB] = useState(false)
  const toggleFAB = () => setOpenFAB(!openFAB)

  const handleFav = () => {
    handleSubmit()
    toggleFAB()
  }

  const handleAdd = () => {
    toggleDLG()
    toggleFAB()
  }

  if (!Object.values(selectedSongs).some(song => song.selected))
    return null

  return(
    <SpeedDial
      ariaLabel="Playlist picker"
      className={classes.speedDial}
      onOpen={toggleFAB}
      onClose={toggleFAB}
      open={openFAB}
      icon={<SpeedDialIcon/>}
    >
      {
        [
          { icon: <Heart/>, name: 'Favorite', action: handleFav },
          { icon: <PlaylistPlus/>, name: 'Add to Playlist', action: handleAdd }
        ]
        .map(({ icon, name, action}) => 
          <SpeedDialAction
            key={name}
            icon={icon}
            tooltipTitle={name}
            onClick={action}
          />
        )
      }
    </SpeedDial>
  )
}

export default PlaylistOptions