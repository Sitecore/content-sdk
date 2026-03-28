import type { SitecoreConfig, SitecoreConfigInput } from '@sitecore-content-sdk/content/config';
import {
  defineConfig as baseDefineConfig,
  buildFallbackConfig,
} from '@sitecore-content-sdk/content/config';

/**
 * Converts an Angular environment record to a content SDK config record.
 * @param {Record<string, string | undefined>} angularEnv - The Angular environment record.
 * @returns The content SDK config input record.
 */
export const angularEnvToConfig = (angularEnv: { [key: string]: string | undefined }) => {
  return buildFallbackConfig({
    ...angularEnv,
    SITECORE_EDGE_CLIENT_CONTEXT_ID:
      angularEnv.SITECORE_EDGE_CLIENT_CONTEXT_ID || angularEnv.SITECORE_EDGE_CONTEXT_ID,
  });
};

/**
 * Resolves Sitecore config by applying the content SDK baseline with an explicit empty env record,
 * then merging `sitecore.config.ts` overrides. This avoids reading `process.env` inside the content
 * SDK `defineConfig` (CLI mode, validation, and Edge hostname fallback).
 * @public
 */
export function defineConfig(config: SitecoreConfigInput = {}): SitecoreConfig {
  return baseDefineConfig(config, {});
}
