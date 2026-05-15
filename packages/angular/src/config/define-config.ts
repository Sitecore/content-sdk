import type { SitecoreConfigInput } from '@sitecore-content-sdk/content/config';
import { defineConfig as baseDefineConfig } from '@sitecore-content-sdk/content/config';
import type { SitecoreAngularConfig, SitecoreAngularConfigInput } from './models';

/**
 * Reads `process.env` when running under Node; otherwise returns an empty object.
 * @returns {Record<string, string | undefined>} Environment map for merging into config.
 */
function getProcessEnv(): Record<string, string | undefined> {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;
  return env ? env : {};
}

/**
 * Parses a comma-separated locale list from env (e.g. `CSDK_PUBLIC_LOCALES`).
 * @param {string | undefined} raw - Raw env value
 * @returns {string[]} Trimmed non-empty locale codes
 */
export function parseLocalesEnv(raw: string | undefined): string[] {
  if (!raw?.trim()) {
    return [];
  }
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Ensures `defaultLanguage` is present and returns a non-empty locale list.
 * @param {string[]} locales - Candidate locales
 * @param {string} defaultLanguage - Default site language
 * @returns {string[]} Deduplicated locales (at least `[defaultLanguage]`)
 */
export function normalizeLocales(locales: string[], defaultLanguage: string): string[] {
  const deduped = [...new Set(locales)];
  if (deduped.length === 0) {
    return [defaultLanguage];
  }
  if (!deduped.includes(defaultLanguage)) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn(
        `[defineConfig] defaultLanguage "${defaultLanguage}" was not in locales; it has been prepended.`
      );
    }
    return [defaultLanguage, ...deduped];
  }
  return deduped;
}

/**
 * Merges `clientEnv` (browser-safe `environment*.ts`) with `process.env` for server-only variables,
 * applies Angular-specific `locales` (mirrored to `redirects.locales`), and returns a config that
 * includes {@link SitecoreAngularConfig.locales}.
 * @param {SitecoreAngularConfigInput} [config] - Sitecore configuration input (Angular shape).
 * @param {Record<string, string | undefined>} [clientEnv] - Browser-safe env from `environment*.ts`.
 * @returns {SitecoreAngularConfig} Fully merged configuration for Angular apps.
 * @public
 */
export function defineConfig(
  config: SitecoreAngularConfigInput = {},
  clientEnv: Record<string, string | undefined> = {}
): SitecoreAngularConfig {
  const env = { ...clientEnv, ...getProcessEnv() };
  const envLocales = parseLocalesEnv(env.CSDK_PUBLIC_LOCALES);
  const defaultLanguage =
    config.defaultLanguage ?? env.CSDK_PUBLIC_DEFAULT_LANGUAGE ?? 'en';
  const locales = normalizeLocales(config.locales ?? envLocales, defaultLanguage);

  const baseInput: SitecoreConfigInput = {
    ...config,
    defaultLanguage,
    redirects: { ...(config.redirects ?? {}), locales },
  };

  const baseConfig = baseDefineConfig(baseInput, env);
  return { ...baseConfig, locales };
}
