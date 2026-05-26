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
 * Sitecore configuration input for Angular apps. Extends the base
 * {@link SitecoreConfigInput} with an `angular` section. `redirects.locales` is intentionally
 * omitted from the input — it is derived from `angular.locales` so there is a single
 * source of truth for the locale list.
 * @public
 */
export interface AngularSitecoreConfigInput extends Omit<SitecoreConfigInput, 'redirects'> {
  /**
   * Settings for redirects functionality. `locales` is derived automatically from
   * `angular.locales`; only `enabled` is configurable at this layer.
   */
  redirects?: Omit<NonNullable<SitecoreConfigInput['redirects']>, 'locales'>;
  /** Angular-specific configuration. */
  angular?: {
    /**
     * Locales supported by the Angular app.
     * `defaultLanguage` is prepended automatically when absent.
     */
    locales?: string[];
    /**
     * Configuration for the ISR-like cache. Both fields default when omitted
     * (`enabled: true`, `revalidate: 300`).
     */
    isrCache?: {
      /** Whether the cache is enabled. */
      enabled?: boolean;
      /** The global revalidate time in seconds. */
      revalidate?: number;
    };
  };
}

/**
 * Resolved Sitecore configuration for Angular apps. Extends the fully-resolved
 * {@link SitecoreConfig}; structurally still a `SitecoreConfig`, so existing callers that
 * type the value as `SitecoreConfig` continue to work. `redirects.locales` is intentionally
 * omitted at the type level — read the canonical locale list from `angular.locales`.
 * @public
 */
export interface AngularSitecoreConfig extends Omit<SitecoreConfig, 'redirects'> {
  redirects: Omit<SitecoreConfig['redirects'], 'locales'>;
  angular: {
    /** Resolved locales for the Angular app. Always contains at least `defaultLanguage`. */
    locales: string[];
    /**
     * Resolved configuration for the ISR-like cache. Defaults are applied by
     * `defineConfig`: `enabled: true`, `revalidate: 300`.
     */
    isrCache: {
      enabled: boolean;
      revalidate: number;
    };
  };
}

/** Defaults applied to `angular.isrCache` when input omits fields. */
const DEFAULT_ISR_CACHE = { enabled: true, revalidate: 300 } as const;

/**
 * Ensures `defaultLanguage` is present in the locales list (prepended when missing) and
 * returns an empty-input fallback of `[defaultLanguage]`.
 * @param {string[]} input - Locales from `sitecore.config` (may be empty).
 * @param {string} defaultLanguage - Resolved `defaultLanguage` from the base config.
 * @returns {string[]} Locales with `defaultLanguage` guaranteed.
 */
function resolveLocales(input: string[], defaultLanguage: string): string[] {
  if (!input || input.length === 0) {
    return [defaultLanguage];
  }
  if (input.includes(defaultLanguage)) {
    return [...input];
  }
  return [defaultLanguage, ...input];
}

/**
 * Merges `clientEnv` (browser-safe `environment*.ts`) with `process.env` for server-only variables,
 * then delegates to the base content `defineConfig` and adds the Angular-specific config layer.
 *
 * - `angular.locales` is the single source of truth for the locale list; `defaultLanguage` is
 *   added when missing.
 * - `redirects.locales` is overwritten from `angular.locales` so the redirects proxy stays in sync.
 *
 * On Node/SSR, load `.env` in the app entry before importing `sitecore.config` (see
 * `load-env.ts` in the sample).
 * @param {AngularSitecoreConfigInput} [config] - Base Sitecore configuration input.
 * @param {Record<string, string | undefined>} [clientEnv] - Browser-safe env from `environment*.ts`.
 * @returns {AngularSitecoreConfig} Fully merged Sitecore configuration for Angular.
 * @public
 */
export function defineConfig(
  config: AngularSitecoreConfigInput = {},
  clientEnv: Record<string, string | undefined> = {}
): AngularSitecoreConfig {
  const { angular, ...baseInput } = config;
  const scConfig = baseDefineConfig(baseInput as SitecoreConfigInput, {
    ...clientEnv,
    ...getProcessEnv(),
  });

  const locales = resolveLocales(angular?.locales ?? [], scConfig.defaultLanguage);

  scConfig.redirects.locales = locales;

  const isrCache = {
    enabled: angular?.isrCache?.enabled ?? DEFAULT_ISR_CACHE.enabled,
    revalidate: angular?.isrCache?.revalidate ?? DEFAULT_ISR_CACHE.revalidate,
  };

  return {
    ...scConfig,
    angular: { locales, isrCache },
  } as AngularSitecoreConfig;
}
