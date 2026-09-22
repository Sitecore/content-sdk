import { Html, Head, Main, NextScript } from 'next/document';
import { isSiteThemingEnabled, THEMING_BODY_CLASS_NAME } from '@sitecore-content-sdk/nextjs';
import scConfig from 'sitecore.config';

export default function Document() {
  return (
    <Html>
      <Head />
      <body
        className={
          isSiteThemingEnabled(scConfig.theming.mode) ? THEMING_BODY_CLASS_NAME : undefined
        }
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
