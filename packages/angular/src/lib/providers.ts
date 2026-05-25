import type { SitecoreClient } from '@sitecore-content-sdk/content/client';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { UrlSerializer } from '@angular/router';
import {
  SITECORE_CONFIG_TOKEN,
  SITECORE_CLIENT_TOKEN,
  ERROR_ROUTE_TOKEN,
  NOT_FOUND_ROUTE_TOKEN,
} from './tokens';
import type { AngularSitecoreConfig } from '../config/define-config';
import { SitecoreContextService } from './sitecore-context.service';

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
 *
 * When `sitecoreConfig.angular.locales` is configured, this call also registers a
 * locale-aware {@link UrlSerializer}. {@link SitecoreContextService} is always registered
 * and derives page, dictionary, and locale state reactively from the Router.
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
export function provideSitecoreAngular(init: AngularCSDKAppInit): EnvironmentProviders {
  const providers: Array<unknown> = [];

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

  return makeEnvironmentProviders(providers as Parameters<typeof makeEnvironmentProviders>[0]);
}
