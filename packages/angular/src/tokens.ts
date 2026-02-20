import { InjectionToken } from '@angular/core';
import { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import { ComponentMap } from './types';

/**
 * Injection token for the Sitecore SDK configuration.
 * Provide this token in your application root or feature module to configure the SDK.
 * @public
 */
export const SITECORE_CONFIG_TOKEN = new InjectionToken<SitecoreConfig['api']>(
  'SITECORE_CONFIG_TOKEN'
);

/**
 * Injection token for the initial component map.
 * Provide this to pre-register components without using `ComponentMapService` directly.
 * @public
 */
export const COMPONENT_MAP_TOKEN = new InjectionToken<ComponentMap>('COMPONENT_MAP_TOKEN');
