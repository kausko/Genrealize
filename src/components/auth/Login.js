import { Button, Card, CardContent, Grid, TextField } from "@material-ui/core";
import OAuth from "./OAuth";

export default function Login() {
    return (
        <Card style={{maxWidth:"400px"}}>
            <form>
                <CardContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                type="email"
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Password"
                                type="password"
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button 
                                fullWidth
                                variant="contained"
                                color="primary"
                            >
                                Login
                            </Button>
                        </Grid>
                        <OAuth/>
                    </Grid>
                </CardContent>
            </form>
        </Card>
    )
}