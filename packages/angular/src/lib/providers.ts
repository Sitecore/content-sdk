import { EnvironmentProviders, makeEnvironmentProviders, Type } from '@angular/core';
import { COMPONENT_MAP_TOKEN } from './tokens';
import { ComponentMap } from './types';

/**
 * Configuration for the Sitecore Angular SDK.
 * @public
 */
export interface SitecoreAngularConfig {
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
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideSitecoreAngular({ componentMap }),
 *   ],
 * };
 * @param {SitecoreAngularConfig} config SDK configuration
 * @returns {EnvironmentProviders} Angular environment providers
 * @public
 */
export function provideSitecoreAngular(config: SitecoreAngularConfig): EnvironmentProviders {
  const providers = [];

  if (config.componentMap) {
    providers.push({ provide: COMPONENT_MAP_TOKEN, useValue: config.componentMap });
  }

  return makeEnvironmentProviders(providers);
}
