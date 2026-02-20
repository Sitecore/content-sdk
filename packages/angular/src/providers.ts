import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import { SITECORE_CONFIG_TOKEN, COMPONENT_MAP_TOKEN } from './tokens';
import { ComponentMap } from './types';

/**
 * Configuration for the Sitecore Angular SDK.
 * @public
 */
export interface SitecoreAngularConfig {
  /**
   * The Sitecore API configuration.
   */
  api: SitecoreConfig['api'];
  /**
   * Optional initial component map. Components can also be registered at runtime
   * via `ComponentMapService`.
   */
  componentMap?: ComponentMap;
}

/**
 * Provides Sitecore Angular SDK services to the application.
 * Call this in your `app.config.ts` `providers` array (standalone) or in `AppModule.providers`.
 *
 * @example
 * // app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideSitecoreAngular({ api: { siteName: 'my-site', ... } }),
 *   ],
 * };
 * @param {SitecoreAngularConfig} config SDK configuration
 * @returns {EnvironmentProviders} Angular environment providers
 * @public
 */
export function provideSitecoreAngular(config: SitecoreAngularConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: SITECORE_CONFIG_TOKEN, useValue: config.api },
    ...(config.componentMap
      ? [{ provide: COMPONENT_MAP_TOKEN, useValue: config.componentMap }]
      : []),
  ]);
}
