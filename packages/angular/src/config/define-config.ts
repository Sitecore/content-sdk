import type { SitecoreConfig, SitecoreConfigInput } from '@sitecore-content-sdk/content/config';
import { defineConfig as baseDefineConfig } from '@sitecore-content-sdk/content/config';

/**
 * Reads `process.env` when running under Node; otherwise returns an empty object.
 * @returns {Record<string, string | undefined>} Environment map for merging into config.
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
 * @param {SitecoreConfigInput} [config] - Base Sitecore configuration input.
 * @param {Record<string, string | undefined>} [clientEnv] - Browser-safe env from `environment*.ts`.
 * @returns {SitecoreConfig} Fully merged Sitecore configuration.
 * @public
 */
export function defineConfig(
  config: SitecoreConfigInput = {},
  clientEnv: Record<string, string | undefined> = {}
): SitecoreConfig {
  return baseDefineConfig(config, { ...clientEnv, ...getProcessEnv() });
}
