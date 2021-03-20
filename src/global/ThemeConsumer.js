import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import { Provider } from "next-auth/client";
import { useContext } from "react";
import Navbar from "./Navbar";
import { ThemeContext } from "./theme";

export default function ThemeConsumer(props) {
  const { theme } = useContext(ThemeContext)
  return(
    <MuiThemeProvider theme={theme}>
      <Provider session={props.pageProps.session}>
        <CssBaseline/>
        <Navbar {...props}/>
      </Provider>
    </MuiThemeProvider>
  )
}