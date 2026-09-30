import { JSX } from 'react';
import type { AppProps } from 'next/app';
import { NextIntlClientProvider } from 'next-intl';
import Bootstrap from 'src/Bootstrap';
import { SitecorePageProps } from '@sitecore-content-sdk/nextjs';
import scConfig from 'sitecore.config';

function App({ Component, pageProps }: AppProps<SitecorePageProps>): JSX.Element {
  const { dictionary, ...rest } = pageProps;

  const site = pageProps.page?.siteName;
  const locale = pageProps.page?.locale || scConfig.defaultLanguage;

  // Key messages by site to match the App Router's dictionary shape (`messages[site]`).
  // Call sites therefore scope with `useTranslations(site)`.
  const messages = site ? { [site]: dictionary || {} } : dictionary || {};

  return (
    <>
      <Bootstrap {...pageProps} />
      {/*
        // Use next-intl to provide the Sitecore dictionary to the app as messages.
        // The Pages Router cannot use next-intl's RSC-only server config (getRequestConfig /
        // setRequestLocale / the next-intl plugin), so messages + locale are passed as props
        // to NextIntlClientProvider here from getStaticProps/getServerSideProps.
        // If your app is not multilingual, next-intl and references to it can be removed.
      */}
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Component {...rest} />
      </NextIntlClientProvider>
    </>
  );
}

export default App;
