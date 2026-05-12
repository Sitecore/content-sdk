import type { SitecoreConfig, SitecoreConfigInput } from '@sitecore-content-sdk/content/config';
import { defineConfig as baseDefineConfig } from '@sitecore-content-sdk/content/config';

/**
 * Get the process environment variables in a browser-safe way.
 * @returns {Record<string, string | undefined>} The process environment variables.
 */
function getProcessEnv(): Record<string, string | undefined> {
  // Use globalThis so we do not need @types/node (lib tsconfig uses "types": []).
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;
  return env ? env : {};
}
/**
 * Merges `clientEnv` (browser-safe `environment*.ts`) with `process.env` for server-only variables.
 * On Node/SSR, load `.env` in the app entry before importing `sitecore.config` (see `load-env.ts` in the sample).
 * @param {SitecoreConfigInput} [config] - Sitecore configuration input
 * @param {Record<string, string | undefined>} [clientEnv] - Browser-safe env map (e.g. from `environment.ts`)
 * @public
 */
export function defineConfig(
  config: SitecoreConfigInput = {},
  clientEnv: Record<string, string | undefined> = {}
): SitecoreConfig {
  return baseDefineConfig(config, { ...clientEnv, ...getProcessEnv() });
}
