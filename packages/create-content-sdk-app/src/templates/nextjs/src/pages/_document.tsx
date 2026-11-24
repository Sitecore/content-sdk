import { Html, Head, Main, NextScript } from 'next/document';
import { getThemingHtmlAttributes } from '@sitecore-content-sdk/nextjs';
import scConfig from 'sitecore.config';

export default function Document() {
  return (
    <Html {...getThemingHtmlAttributes(scConfig.theming.mode)}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
