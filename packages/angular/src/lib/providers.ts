import { EnvironmentProviders, makeEnvironmentProviders, Type } from '@angular/core';
import type { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import { SITECORE_CONFIG_TOKEN } from './tokens';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ERROR_ROUTE_TOKEN, NOT_FOUND_ROUTE_TOKEN } from './tokens';

/**
 * Configuration for the Sitecore Angular SDK.
 * @public
 */
export interface SitecoreAngularConfig {
  /**
   * Sitecore configuration (e.g. from sitecore.config.ts).
   * When provided, the config is injectable app-wide via SITECORE_CONFIG_TOKEN.
   */
  sitecoreConfig?: SitecoreConfig;
  notFoundRoute?: string;
  errorRoute?: string;
}

/**
 * Provides Sitecore Angular SDK services to the application.
 * Call this in your `app.config.ts` `providers` array.
 * @example
 * // app.config.ts
 * import scConfig from '../sitecore.config';
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideSitecoreAngular({ sitecoreConfig: scConfig, componentMap }),
 *   ],
 * };
 * @param {SitecoreAngularConfig} config SDK configuration
 * @returns {EnvironmentProviders} Angular environment providers
 * @public
 */
export function provideSitecoreAngular(config: SitecoreAngularConfig): EnvironmentProviders {
  const providers = [];

  if (config.sitecoreConfig !== undefined) {
    providers.push({ provide: SITECORE_CONFIG_TOKEN, useValue: config.sitecoreConfig });
  }
  if (config.notFoundRoute) {
    providers.push({ provide: NOT_FOUND_ROUTE_TOKEN, useValue: config.notFoundRoute });
  }
  if (config.errorRoute) {
    providers.push({ provide: ERROR_ROUTE_TOKEN, useValue: config.errorRoute });
  }

  return makeEnvironmentProviders(providers);
}
