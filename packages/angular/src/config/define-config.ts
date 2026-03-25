import type { SitecoreConfig, SitecoreConfigInput } from '@sitecore-content-sdk/content/config';
import { defineConfig as baseDefineConfig } from '@sitecore-content-sdk/content/config';

/**
 * Sitecore-related fields from a typical Angular `environment.ts` (often generated from `.env`).
 * @public
 */
export interface AngularSitecoreEnvironment {
  edgeContextId?: string;
  edgeClientContextId?: string;
  edgePlatformHostname?: string;
  experienceEdgeHostname?: string;
  apiKey?: string;
  apiHost?: string;
  editingSecret?: string;
  defaultSite?: string;
  defaultLanguage?: string;
  personalizeScope?: string;
  personalizeEdgeTimeout?: string;
  personalizeCdpTimeout?: string;
  jssAllowedOrigins?: string;
}

/**
 * Angular application environment shape used by {@link defineConfig}.
 * @public
 */
export interface AngularAppEnvironment {
  production: boolean;
  sitecore: AngularSitecoreEnvironment;
}

function omitEmpty(value: string | undefined): string | undefined {
  return value === undefined || value === '' ? undefined : value;
}

/**
 * Maps {@link AngularAppEnvironment} to the env-var names consumed by
 * {@link getFallbackConfigFromEnvVars}, so browser bundles do not rely on `process.env`.
 */
export function angularEnvironmentToEnvRecord(
  environment: AngularAppEnvironment
): Record<string, string | undefined> {
  const sc = environment.sitecore;
  return {
    NODE_ENV: environment.production ? 'production' : 'development',
    SITECORE_EDGE_CONTEXT_ID: omitEmpty(sc.edgeContextId),
    SITECORE_EDGE_CLIENT_CONTEXT_ID: omitEmpty(sc.edgeClientContextId),
    SITECORE_EDGE_PLATFORM_HOSTNAME: omitEmpty(sc.edgePlatformHostname),
    SITECORE_EXPERIENCE_EDGE_HOSTNAME: omitEmpty(sc.experienceEdgeHostname),
    SITECORE_API_KEY: omitEmpty(sc.apiKey),
    SITECORE_API_HOST: omitEmpty(sc.apiHost),
    SITECORE_EDITING_SECRET: omitEmpty(sc.editingSecret),
    SITECORE_DEFAULT_SITE: omitEmpty(sc.defaultSite),
    SITECORE_DEFAULT_LANGUAGE: omitEmpty(sc.defaultLanguage),
    SITECORE_PERSONALIZE_SCOPE: omitEmpty(sc.personalizeScope),
    PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT: omitEmpty(sc.personalizeEdgeTimeout),
    PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT: omitEmpty(sc.personalizeCdpTimeout),
    JSS_ALLOWED_ORIGINS: omitEmpty(sc.jssAllowedOrigins),
  };
}

/**
 * Sitecore configuration for Angular: merges `config` over defaults derived from the provided
 * `environment` (instead of `process.env`, which is not populated in typical browser builds).
 *
 * When `environment` is omitted, behavior matches the content package `defineConfig`
 * (Node / `process.env` fallbacks).
 * @public
 */
export function defineConfig(
  config: SitecoreConfigInput = {},
  environment: AngularAppEnvironment
): SitecoreConfig {
  return baseDefineConfig(config, angularEnvironmentToEnvRecord(environment));
}
