import { Box, Grid, Slider } from "@material-ui/core";
import Duration from "./Duration";

export default function Seeker({ duration, played, handleSeeking }) {
  return(
    <Grid item xs={12} md={6}>
        <Box display="flex" alignItems="center" height="100%">
          <Duration seconds={duration * played}/>
          <Box width="100%" mr={1}>
            <Slider
                value={played * 100}
                onChange={handleSeeking(true)}
                onChangeCommitted={handleSeeking(false)}
            />
          </Box>
          <Duration seconds={duration * (1 - played)}/>
        </Box>
      </Grid>
  )
}