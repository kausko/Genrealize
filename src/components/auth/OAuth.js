import { Avatar, Button, CardActions, makeStyles } from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import { Google, Github } from 'mdi-material-ui'

const useStyles = makeStyles(theme => ({
    cardActions: {
        width: "100%",
        justifyContent: "center"
    },
    google: {
        backgroundColor: red[500],
        color: "white"
    },
    github: {
        backgroundColor: "black",
        color: "white"
    }
}))

export default function OAuth() {

    const classes = useStyles()

    return(
        <>
        <Button disabled fullWidth>
            Or
        </Button>
        <CardActions className={classes.cardActions}>
            <Avatar variant="rounded" className={classes.google}>
                <Google/>
            </Avatar>
            <Avatar variant="rounded" className={classes.github}>
                <Github/>
            </Avatar>
        </CardActions>
        </>
    )
}