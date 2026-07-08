import type { SitecoreClient } from '@sitecore-content-sdk/content/client';
import {
  EnvironmentProviders,
  makeEnvironmentProviders,
  Provider,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  SITECORE_CONFIG_TOKEN,
  SITECORE_CLIENT_TOKEN,
  ERROR_ROUTE_TOKEN,
  NOT_FOUND_ROUTE_TOKEN,
} from './tokens';
import { SITECORE_ANALYTICS } from './analytics/sitecore-analytics';
import { SitecoreAnalyticsBrowser } from './analytics/sitecore-analytics.browser';
import { SitecoreAnalyticsServer } from './analytics/sitecore-analytics.server';
import type { AngularSitecoreConfig } from '../config/define-config';

/**
 * Configuration for the Sitecore Angular SDK.
 * @public
 */
export interface AngularCSDKAppInit {
  /**
   * Sitecore configuration (e.g. from sitecore.config.ts).
   * When provided, {@link sitecoreClient} must also be set; both are registered for DI.
   */
  sitecoreConfig?: AngularSitecoreConfig;
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
 * @param {AngularCSDKAppInit} init SDK configuration
 * @param {AngularCSDKAppInit} init.sitecoreConfig - Sitecore configuration
 * @param {AngularCSDKAppInit} init.sitecoreClient - Sitecore client
 * @param {AngularCSDKAppInit} init.notFoundRoute - Not found route
 * @param {AngularCSDKAppInit} init.errorRoute - Error route
 * @returns {EnvironmentProviders} Angular environment providers
 * @example
 * // app.config.ts
 * import scConfig from '../sitecore.config';
 * import { getClient } from '../content-sdk/client/sitecore-client';
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideSitecoreAngular({ sitecoreConfig: scConfig, sitecoreClient: getClient() }),
 *   ],
 * };
 * @public
 */
export function provideSitecoreAngular(init: AngularCSDKAppInit): EnvironmentProviders {
  const providers: Array<Provider | EnvironmentProviders> = [];

  if (init.sitecoreConfig !== undefined || init.sitecoreClient !== undefined) {
    if (init.sitecoreConfig === undefined || init.sitecoreClient === undefined) {
      throw new Error(
        'provideSitecoreAngular: `sitecoreConfig` and `sitecoreClient` must both be provided together.'
      );
    }
    providers.push({ provide: SITECORE_CONFIG_TOKEN, useValue: init.sitecoreConfig });
    providers.push({ provide: SITECORE_CLIENT_TOKEN, useValue: init.sitecoreClient });
  }
  if (init.notFoundRoute) {
    providers.push({ provide: NOT_FOUND_ROUTE_TOKEN, useValue: init.notFoundRoute });
  }
  if (init.errorRoute) {
    providers.push({ provide: ERROR_ROUTE_TOKEN, useValue: init.errorRoute });
  }

  // Browser-only analytics façade. The server implementation is a no-op, so consumers
  // (e.g. CdpPageView) can inject SITECORE_ANALYTICS without platform guards.
  providers.push({
    provide: SITECORE_ANALYTICS,
    useFactory: () =>
      isPlatformBrowser(inject(PLATFORM_ID))
        ? new SitecoreAnalyticsBrowser()
        : new SitecoreAnalyticsServer(),
  });

  return makeEnvironmentProviders(providers as Parameters<typeof makeEnvironmentProviders>[0]);
}
