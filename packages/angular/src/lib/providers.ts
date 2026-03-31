import type { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import type { SitecoreClient } from '@sitecore-content-sdk/content/client';
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
   * When provided, {@link sitecoreClient} must also be set; both are registered for DI.
   */
  sitecoreConfig?: SitecoreConfig;
  /**
   * Application-owned {@link SitecoreClient} instance (e.g. from a module singleton).
   * Required when {@link sitecoreConfig} is set; registered as {@link SITECORE_CLIENT_TOKEN}.
   */
  sitecoreClient?: SitecoreClient;
  notFoundRoute?: string;
  errorRoute?: string;
}

/**
 * Provides Sitecore Angular SDK services to the application.
 * Call this in your `app.config.ts` `providers` array.
 * @example
 * // app.config.ts
 * import scConfig from '../sitecore.config';
 * import { getClient } from '../content-sdk/client/sitecore-client';
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideSitecoreAngular({ sitecoreConfig: scConfig, sitecoreClient: getClient() }),
 *   ],
 * };
 * @param {SitecoreAngularConfig} config SDK configuration
 * @returns {EnvironmentProviders} Angular environment providers
 * @public
 */
export function provideSitecoreAngular(config: SitecoreAngularConfig): EnvironmentProviders {
  const providers = [];

  if (config.sitecoreConfig !== undefined || config.sitecoreClient !== undefined) {
    if (config.sitecoreConfig === undefined || config.sitecoreClient === undefined) {
      throw new Error(
        'provideSitecoreAngular: `sitecoreConfig` and `sitecoreClient` must both be provided together.'
      );
    }
    providers.push({ provide: SITECORE_CONFIG_TOKEN, useValue: config.sitecoreConfig });
    providers.push({ provide: SITECORE_CLIENT_TOKEN, useValue: config.sitecoreClient });
  }
  if (config.notFoundRoute) {
    providers.push({ provide: NOT_FOUND_ROUTE_TOKEN, useValue: config.notFoundRoute });
  }
  if (config.errorRoute) {
    providers.push({ provide: ERROR_ROUTE_TOKEN, useValue: config.errorRoute });
  }

  return makeEnvironmentProviders(providers);
}
