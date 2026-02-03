import { InjectionToken } from '@angular/core';

/**
 * Configuration for internationalization (i18n) in the Sitecore Content SDK.
 * @public
 */
export interface I18nConfig {
  /**
   * Array of supported language codes (e.g., ['en', 'de', 'fr']).
   */
  supportedLanguages: string[];

  /**
   * Default language to use when no language segment is found in the URL.
   */
  defaultLanguage: string;
}

/**
 * Injection token for i18n configuration.
 * Provides language settings for the language matcher and other i18n utilities.
 * @public
 */
export const I18N_CONFIG = new InjectionToken<I18nConfig>('I18N_CONFIG');
