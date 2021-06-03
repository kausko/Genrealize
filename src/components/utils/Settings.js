import { Avatar, Button, Card, CardActions, CardHeader } from "@material-ui/core";
import { signOut } from "next-auth/client";

export default function Settings({ user }) {
  const handleSignOut = () => signOut({ redirect: false })
  return(
    <Card style={{ maxWidth: "400px" }}>
      <CardHeader
        title={user.name || user.email.split("@")[0]}
        subheader={user.email}
        avatar={
          <Avatar 
            alt={user.name || user.email}
            src={user.image}
          />
        }
      />
      <CardActions>
        <Button onClick={handleSignOut}>
          Sign Out
        </Button>
      </CardActions>
    </Card>
  )
}