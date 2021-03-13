import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeContext, ThemeProvider } from '../src/global/theme';
import '../styles/index.css'
import { Provider } from 'next-auth/client';

function ThemeConsumer({ Component, pageProps }) {
  const { theme } = useContext(ThemeContext)
  return(
    <MuiThemeProvider theme={theme}>
      <Provider session={pageProps.session}>
        <CssBaseline/>
        <Component {...pageProps}/>
      </Provider>
    </MuiThemeProvider>
  )
}

export default function MyApp(props) {

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Genrealize</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider>
        <ThemeConsumer {...props}/>
      </ThemeProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
