import { EnvironmentProviders, makeEnvironmentProviders, Type } from '@angular/core';
import type { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import { COMPONENT_MAP_TOKEN, SITECORE_CONFIG_TOKEN } from './tokens';
import { ComponentMap } from './types';

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
  /**
   * Map of Sitecore component names to Angular component types.
   * Required for rendering Sitecore components in placeholders.
   */
  componentMap?: ComponentMap | Map<string, Type<unknown>>;
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

  if (config.componentMap) {
    providers.push({ provide: COMPONENT_MAP_TOKEN, useValue: config.componentMap });
  }

  return makeEnvironmentProviders(providers);
}
