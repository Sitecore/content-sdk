import './globals.css';
import scConfig from 'sitecore.config';
import { isSiteThemingEnabled, THEMING_BODY_CLASS_NAME } from '@sitecore-content-sdk/nextjs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={
          isSiteThemingEnabled(scConfig.theming.mode) ? THEMING_BODY_CLASS_NAME : undefined
        }
      >
        {children}
      </body>
    </html>
  );
}
