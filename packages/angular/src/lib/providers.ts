import type { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import { SitecoreClient } from '@sitecore-content-sdk/content/client';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import {
  SITECORE_CONFIG_TOKEN,
  SITECORE_CLIENT_TOKEN,
  ERROR_ROUTE_TOKEN,
  NOT_FOUND_ROUTE_TOKEN,
} from './tokens';

/**
 * Configuration for the Sitecore Angular SDK.
 * @public
 */
export interface SitecoreAngularConfig {
  /**
   * Sitecore configuration (e.g. from sitecore.config.ts).
   * When provided, both the config and a SitecoreClient instance are injectable app-wide
   * via SITECORE_CONFIG_TOKEN and SITECORE_CLIENT_TOKEN.
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
 *     provideSitecoreAngular({ sitecoreConfig: scConfig }),
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

    providers.push({
      provide: SITECORE_CLIENT_TOKEN,
      useFactory: () => new SitecoreClient({ ...config.sitecoreConfig! }),
    });
  }
  if (config.notFoundRoute) {
    providers.push({ provide: NOT_FOUND_ROUTE_TOKEN, useValue: config.notFoundRoute });
  }
  if (config.errorRoute) {
    providers.push({ provide: ERROR_ROUTE_TOKEN, useValue: config.errorRoute });
  }

  return makeEnvironmentProviders(providers);
}
