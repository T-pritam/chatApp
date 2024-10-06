// pages/_app.tsx
import { useEffect } from 'react';
import { AppProps } from 'next/app';

let socketInitialized = false;

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (!socketInitialized) {
      socketInitialized = true;
      fetch('/api/socket');
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
