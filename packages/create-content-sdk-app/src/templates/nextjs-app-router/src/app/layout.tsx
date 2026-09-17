import './globals.css';
import scConfig from 'sitecore.config';
import { getThemingBodyClassName } from '@sitecore-content-sdk/nextjs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={getThemingBodyClassName(scConfig.theming.mode)}>{children}</body>
    </html>
  );
}
