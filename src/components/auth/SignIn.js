import { Avatar, Button, Card, CardActions, CardContent, Grid, TextField, makeStyles, LinearProgress } from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import { Google, Github } from 'mdi-material-ui'
import { signIn } from "next-auth/client";
import { useState } from "react";

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

export default function Login() {
    const classes = useStyles()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = e => setEmail(e.target.value)

    const handleSignIn = type => _e => {
        setLoading(true)
        return signIn(type, { email })
    }

    return (
        <Card style={{ maxWidth: "400px" }}>
            <form onSubmit={handleSignIn('email')}>
                <CardContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                type="email"
                                variant="outlined"
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleSignIn('email')}
                            >
                                Sign In
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            {
                                loading ?
                                <LinearProgress/> :
                                <Button disabled fullWidth>
                                    Or
                                </Button>
                            }
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleSignIn('google')}
                                className={classes.google}
                                startIcon={<Google />}
                            >
                                Sign In with Google
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </form>
        </Card>
    )
}