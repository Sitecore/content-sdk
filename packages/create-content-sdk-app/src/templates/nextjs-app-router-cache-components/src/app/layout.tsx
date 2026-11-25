import './globals.css';
import scConfig from 'sitecore.config';
import { getThemingHtmlAttributes } from '@sitecore-content-sdk/nextjs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...getThemingHtmlAttributes(scConfig.theming.mode)}>
      <body>{children}</body>
    </html>
  );
}
