import { Box, Button, Card, CardContent, Grid, TextField, makeStyles, CircularProgress, Typography } from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import { Google } from 'mdi-material-ui'
import { signIn } from "next-auth/client";
import { useState } from "react";

const useStyles = makeStyles(_theme => ({
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
                    <Grid container spacing={1} justify="center">
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
                        <Grid item>
                            <Box position="relative" display="inline-flex">
                                <CircularProgress variant={loading ? "indeterminate" : "determinate"} value={0}/>
                                {
                                    !loading &&
                                    <Box
                                        top={0}
                                        left={0}
                                        bottom={0}
                                        right={0}
                                        position="absolute"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Typography variant="caption" component="div" color="textSecondary">
                                            OR
                                        </Typography>
                                    </Box>
                                }
                            </Box>
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