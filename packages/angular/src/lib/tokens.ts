import { InjectionToken } from '@angular/core';
import type { SitecoreClient } from '@sitecore-content-sdk/content/client';
import type { AngularSitecoreConfig } from '../config/define-config';

/**
 * Injection token for the Sitecore configuration.
 * Provided by `provideSitecoreAngular({ sitecoreConfig, sitecoreClient })`. Inject this to read config app-wide.
 * `AngularSitecoreConfig` extends `SitecoreConfig`, so consumers that previously typed the
 * value as `SitecoreConfig` remain structurally compatible.
 * @public
 */
export const SITECORE_CONFIG_TOKEN = new InjectionToken<AngularSitecoreConfig>(
  'SITECORE_CONFIG_TOKEN'
);

/**
 * Injection token for the SitecoreClient instance.
 * Provided by `provideSitecoreAngular({ sitecoreConfig, sitecoreClient })` with the app-supplied client instance.
 * @public
 */
export const SITECORE_CLIENT_TOKEN = new InjectionToken<SitecoreClient>('SITECORE_CLIENT_TOKEN');

export const NOT_FOUND_ROUTE_TOKEN = new InjectionToken<string>('NOT_FOUND_ROUTE_TOKEN');

/**
 * Injection token for the error route.
 * @public
 */
export const ERROR_ROUTE_TOKEN = new InjectionToken<string>('ERROR_ROUTE_TOKEN');
