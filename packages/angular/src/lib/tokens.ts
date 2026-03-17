import { InjectionToken } from '@angular/core';
import type { SitecoreConfig } from '@sitecore-content-sdk/content/config';

/**
 * Injection token for the Sitecore configuration.
 * Provided by `provideSitecoreAngular({ sitecoreConfig })`. Inject this to read config app-wide.
 * @public
 */
export const SITECORE_CONFIG_TOKEN = new InjectionToken<SitecoreConfig>('SITECORE_CONFIG_TOKEN');
export const NOT_FOUND_ROUTE_TOKEN = new InjectionToken<string>('NOT_FOUND_ROUTE_TOKEN');

/**
 * Injection token for the error route.
 * @public
 */
export const ERROR_ROUTE_TOKEN = new InjectionToken<string>('ERROR_ROUTE_TOKEN');
