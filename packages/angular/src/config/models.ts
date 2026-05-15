import type { SitecoreConfig, SitecoreConfigInput } from '@sitecore-content-sdk/content/config';

/**
 * Angular-only Sitecore config input. Use top-level {@link SitecoreAngularConfigInput.locales}
 * instead of `redirects.locales`; {@link defineConfig} mirrors `locales` into `redirects.locales`.
 * @public
 */
export interface SitecoreAngularConfigInput extends Omit<SitecoreConfigInput, 'redirects'> {
  /**
   * Locales served by this Angular app (URL prefix + i18n). Mirrored to `redirects.locales`
   * when calling the base content `defineConfig`.
   */
  locales?: string[];
  /** Redirect options; `locales` is omitted — set top-level {@link SitecoreAngularConfigInput.locales}. */
  redirects?: Omit<NonNullable<SitecoreConfigInput['redirects']>, 'locales'>;
}

/**
 * Resolved Sitecore configuration for Angular, including effective `locales`.
 * @public
 */
export interface SitecoreAngularConfig extends SitecoreConfig {
  /** Effective locales for routing and i18n (never empty). */
  locales: string[];
}
