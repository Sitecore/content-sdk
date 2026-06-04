import { defineConfig } from '@sitecore-content-sdk/angular';
import { environment } from './src/environments/environment';

/**
 * Client fields come from `environment*.ts` (CSDK_PUBLIC_*); server fields from `process.env`.
 * Pass overrides in the first argument when needed.
 * @see https://doc.sitecore.com/xmc/en/developers/content-sdk/the-sitecore-configuration-file.html
 */
export default defineConfig(
  {},
  environment satisfies Record<string, string | undefined>
);
