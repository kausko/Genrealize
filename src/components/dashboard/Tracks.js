import { Grid, makeStyles, Typography } from "@material-ui/core"
import MusicCard from "./MusicCard"

const useStyles = makeStyles((theme) => ({
	title: {
		marginTop: theme.spacing(1),
	},
}))

const Header = ({ message }) => {
	const classes = useStyles()
	return (
		<Grid item xs={12}>
			<Typography variant="h4" gutterBottom className={classes.title}>
				{message}
			</Typography>
		</Grid>
	)
}

const Tracks = ({
	trackNotFound,
	track,
	trackVariants,
	selectedSongs,
	setSelectedSongs,
	setSongs,
}) => {
	if (trackNotFound) {
		return <Header message="Song identification unsuccessful" />
	}

	if (track) {
		const TrackVariants = () => {
			if (trackVariants.length > 0) {
				return (
					<>
						<Header message="Song variants by AcoustID" />
						{trackVariants.map((track) => (
							<Grid item key={track.id} xs={12} md="auto">
								<MusicCard
									{...{
										item: track,
										selectedSongs,
										setSelectedSongs,
										setSongs,
									}}
								/>
							</Grid>
						))}
					</>
				)
			}
			return <Header message="Could not find similar songs" />
		}

		return (
			<>
				{track.title && track.artists.length ? (
					<>
						<Grid item xs={12}>
							<Typography variant="h4" gutterBottom>
								Identified Song
							</Typography>
						</Grid>
						<Grid item xs={12} md="auto">
							<MusicCard
								{...{
									item: track,
									selectedSongs,
									setSelectedSongs,
									setSongs,
								}}
							/>
						</Grid>
					</>
				) : (
					<Header message="Song identification incomplete"/>
				)}
				<TrackVariants />
			</>
		)
	}

	return <></>
}

export default Tracks
