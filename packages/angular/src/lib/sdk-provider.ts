import { EnvironmentProviders, makeEnvironmentProviders, Type } from '@angular/core';
import { COMPONENT_MAP, ComponentMap } from './component-map.token';
import { LOADER_REGISTRY } from './loader-registry.token';
import { LoaderFn } from './types';
import { provideLoaderPrefetch, LoaderPrefetchConfig } from './loader-prefetch.config';
import { I18N_CONFIG, I18nConfig } from './i18n-config.token';

/**
 * Configuration options for the Sitecore Content SDK (client/shared).
 * @public
 */
export interface SitecoreContentSdkConfig {
  /**
   * Map of Sitecore component names to Angular component types.
   * Required for rendering Sitecore components in placeholders.
   */
  componentMap?: ComponentMap | Map<string, Type<unknown>>;

  /**
   * Configuration for parallel loader prefetching.
   * When enabled (default), all loaders in the matched route tree
   * are fetched in parallel before resolvers run sequentially.
   * Set to `false` to disable, or pass a config object.
   * @default true
   */
  prefetch?: boolean | Partial<LoaderPrefetchConfig>;

  /**
   * Internationalization (i18n) configuration for language-aware routing.
   * Required when using `languageMatcher()` in route configuration.
   */
  i18n?: I18nConfig;
}

/**
 * Configuration options for the Sitecore Content SDK server.
 * @public
 */
export interface SitecoreContentSdkServerConfig {
  /**
   * Registry of loader functions for server-side data fetching.
   */
  loaders: Record<string, LoaderFn>;
}

/**
 * Provides Sitecore Content SDK services and configuration to the Angular application.
 * Use this in your shared/client app configuration (app.config.ts).
 * @param {SitecoreContentSdkConfig} config Configuration object with componentMap and prefetch options
 * @returns {EnvironmentProviders} EnvironmentProviders for the Angular application
 * @public
 */
export function provideSitecoreContentSdk(config: SitecoreContentSdkConfig): EnvironmentProviders {
  const providers = [];

  // Component map
  if (config.componentMap) {
    providers.push({ provide: COMPONENT_MAP, useValue: config.componentMap });
  }

  // Prefetch configuration
  if (config.prefetch !== false) {
    const prefetchConfig =
      typeof config.prefetch === 'object' ? config.prefetch : { enabled: true };
    providers.push(...provideLoaderPrefetch(prefetchConfig));
  }

  // i18n configuration for language-aware routing
  if (config.i18n) {
    providers.push({ provide: I18N_CONFIG, useValue: config.i18n });
  }

  // Always provide empty loader registry for client-side
  // Loaders are only registered on server via provideSitecoreContentSdkServer
  providers.push({ provide: LOADER_REGISTRY, useValue: {} });

  return makeEnvironmentProviders(providers);
}

/**
 * Provides Sitecore Content SDK server-side configuration.
 * Use this in your server app configuration (app.config.server.ts).
 *
 * This function registers loader functions that run on the server
 * to fetch data for route resolvers.
 * @param {SitecoreContentSdkServerConfig} config Server configuration with loader functions
 * @returns {EnvironmentProviders} EnvironmentProviders for the Angular server application
 * @public
 */
export function provideSitecoreContentSdkServer(
  config: SitecoreContentSdkServerConfig
): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: LOADER_REGISTRY, useValue: config.loaders }]);
}
