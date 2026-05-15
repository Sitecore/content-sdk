import { defineConfig } from '@sitecore-content-sdk/angular';
import { environment } from './src/environments/environment';

/**
 * Client fields come from `environment*.ts` (CSDK_PUBLIC_*); server fields from `process.env`.
 * Pass overrides in the first argument when needed.
 * @see https://doc.sitecore.com/xmc/en/developers/content-sdk/the-sitecore-configuration-file.html
 */
export default defineConfig(
  {
    /**
     * Locales for this app (optional leading URL segment). Mirrored to `redirects.locales` for Edge.
     * Override with `CSDK_PUBLIC_LOCALES` (comma-separated) in `.env` when you prefer env-driven lists.
     * @example Multi-locale: `locales: ['en', 'fr']` → `/fr/about` alongside `/about` (default language).
     */
    locales: ['en'],
    defaultLanguage: 'en',
  },
  environment satisfies Record<string, string | undefined>
);
