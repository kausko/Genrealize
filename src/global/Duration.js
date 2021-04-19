import { Box, Typography } from "@material-ui/core"

const pad = str => ('0' + str).slice(-2)

const format = seconds => {
  const date = new Date(seconds * 1000)
  const hh = date.getUTCHours()
  const mm = date.getUTCMinutes()
  const ss = pad(date.getUTCSeconds())
  if (hh) {
    return hh + ":" + pad(mm) + ":" + ss
  }
  return mm + ":" + ss
}

export default function Duration({ seconds }) {
  return(
    <Box minWidth={35}>
      <Typography variant="body2" color="textSecondary">
        {format(seconds)}
      </Typography>
    </Box>
  )
}