/// <reference types="node" />
import type { SitecoreConfig, SitecoreConfigInput } from '@sitecore-content-sdk/content/config';
import { defineConfig as baseDefineConfig } from '@sitecore-content-sdk/content/config';

function getProcessEnv(): Record<string, string | undefined> {
  return typeof process !== 'undefined' && process.env
    ? (process.env as Record<string, string | undefined>)
    : {};
}

/**
 * Merges `clientEnv` (browser-safe `environment*.ts`) with `process.env` for server-only variables.
 * On Node/SSR, load `.env` in the app entry before importing `sitecore.config` (see `load-env.ts` in the sample).
 * @public
 */
export function defineConfig(
  config: SitecoreConfigInput = {},
  clientEnv: Record<string, string | undefined> = {}
): SitecoreConfig {
  return baseDefineConfig(config, { ...clientEnv, ...getProcessEnv() });
}
