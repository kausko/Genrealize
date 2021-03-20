import React from 'react';
import Head from 'next/head';
import { ThemeProvider } from '../src/global/theme';
import '../css/index.css'
import ThemeConsumer from '../src/global/ThemeConsumer';

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