import { Html, Head, Main, NextScript } from 'next/document';
import { getThemingBodyClassName } from '@sitecore-content-sdk/nextjs';
import scConfig from 'sitecore.config';

export default function Document() {
  return (
    <Html>
      <Head />
      <body className={getThemingBodyClassName(scConfig.theming.mode)}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
