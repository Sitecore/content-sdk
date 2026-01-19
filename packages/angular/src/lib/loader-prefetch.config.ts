import { InjectionToken, Provider } from '@angular/core';
import { LoaderPrefetchService } from './loader-prefetch.service';

/**
 * Configuration options for the loader prefetch feature.
 * @public
 */
export interface LoaderPrefetchConfig {
  /**
   * Whether parallel prefetching is enabled.
   * When enabled, all loaders in the matched route tree are fetched in parallel
   * before resolvers run sequentially.
   * @default true
   */
  enabled: boolean;
}

/**
 * Injection token for loader prefetch configuration.
 * @internal
 */
export const LOADER_PREFETCH_CONFIG = new InjectionToken<LoaderPrefetchConfig>(
  'LOADER_PREFETCH_CONFIG'
);

/**
 * Provides the loader prefetch feature to the application.
 * When enabled, all loaders in the matched route tree are fetched in parallel,
 * improving performance for routes with multiple resolvers.
 *
 * @param config - Optional configuration. Defaults to { enabled: true }
 * @returns Provider array to add to application providers
 *
 * @example
 * ```typescript
 * import { provideLoaderPrefetch } from '@sitecore-content-sdk/angular';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     // ... other providers
 *     provideLoaderPrefetch(), // Enable parallel prefetching
 *   ],
 * };
 * ```
 *
 * @example
 * ```typescript
 * // To explicitly disable:
 * provideLoaderPrefetch({ enabled: false })
 * ```
 *
 * @public
 */
export function provideLoaderPrefetch(config: Partial<LoaderPrefetchConfig> = {}): Provider[] {
  return [
    {
      provide: LOADER_PREFETCH_CONFIG,
      useValue: { enabled: true, ...config },
    },
    // Eagerly instantiate the service so it subscribes to router events
    LoaderPrefetchService,
  ];
}
