import { InjectionToken } from '@angular/core';
import type { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import { ComponentMap } from './types';

/**
 * Injection token for the initial component map.
 * Provide this to pre-register components without using `ComponentMapService` directly.
 * @public
 */
export const COMPONENT_MAP_TOKEN = new InjectionToken<ComponentMap>('COMPONENT_MAP_TOKEN');

/**
 * Injection token for the Sitecore configuration.
 * Provided by `provideSitecoreAngular({ sitecoreConfig })`. Inject this to read config app-wide.
 * @public
 */
export const SITECORE_CONFIG_TOKEN = new InjectionToken<SitecoreConfig>('SITECORE_CONFIG_TOKEN');
