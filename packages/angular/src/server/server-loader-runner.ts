import {
  LoaderRunnerInit,
  LoaderContext,
  isLoaderRedirectResult,
  LoaderCache,
  LoaderDataResult,
} from '../loaders/models';
import { LoaderRegistry } from '../loaders/loader-registry.token';
import { buildCacheKey } from './cache/cache-key';
import { buildLoaderCacheTags } from './cache/cache-tags';
import { DEFAULT_VARIANT } from '@sitecore-content-sdk/content/personalize';
import { AngularSitecoreConfig } from '../config/define-config';

/**
 * Server-side cache aware loader data resolver.
 * LoaderResolver is exposed to both server and browser. This layer ensures browser safety and acts as connecting layer to cache.
 *
 * Resolution order when a {@link LoaderCache} is attached:
 * 1. **hit** — return cached value immediately.
 * 2. **stale** — return cached value immediately and schedule a background refresh
 *    (coalesced per cache key via `pendingCacheOps`).
 * 3. **miss** — run the loader, persist the result with OSR tags, return data.
 *
 * Redirect responses are never cached. Per-route LoaderCacheConfig overrides
 * from `loaderResolver(id, cacheOptions)` control TTL, tags, and opt-in caching when
 * the global cache is disabled.
 * @public
 */
export class ServerLoaderRunner {
  /** Process-wide coalescing for stale-while-revalidate background refreshes. */
  private static readonly pendingCacheOps = new Set<string>();

  /**
   * @param {LoaderRegistry} registry - Same loader map as `provideLoaderRegistry` / `/_data` middleware.
   * @param {LoaderCache | undefined} cache - Optional cache instance from createLoaderCache.
   */
  constructor(
    private readonly registry: LoaderRegistry,
    private readonly config: AngularSitecoreConfig,
    private readonly cache?: LoaderCache
  ) {}

  /**
   * Resolve loader data with optional cache read-through and SWR refresh.
   * @param {LoaderRunnerInit} init - Loader id, URL, params, server-derived request data, and cache overrides.
   * @returns {Promise<LoaderDataResult>} Data, redirect, or error result for the middleware / SSR resolver.
   */
  async resolve(init: LoaderRunnerInit): Promise<LoaderDataResult> {
    const { loaderId, url, routeParams, query, cacheOptions, csdkRequestData } = init;
    const loader = this.registry[loaderId];
    if (!loader) {
      return { kind: 'error', status: 500, message: `No loader registered for id "${loaderId}"` };
    }

    const scParams = {
      siteName: csdkRequestData?.scParams?.siteName ?? this.config.defaultSite,
      variantId: csdkRequestData?.scParams?.variantId ?? DEFAULT_VARIANT,
      componentVariantIds: csdkRequestData?.scParams?.componentVariantIds ?? [],
    };

    // ctx carries everything the loader and cache key need; only loaderId travels
    // alongside it, so the init object is not passed any further.
    const ctx: LoaderContext = {
      url,
      routeParams,
      query,
      scParams,
      csdkRequestData: csdkRequestData ?? undefined,
    };

    const cacheable = this.cache && (cacheOptions?.enabled ?? this.cache.enabled());

    if (cacheable) {
      const { key } = buildCacheKey(loaderId, ctx);
      const read = await this.cache.get(key);

      if (read.kind === 'hit') {
        return { kind: 'data', data: read.value };
      }

      if (read.kind === 'stale') {
        this.scheduleBackgroundRefresh(loaderId, ctx, key, cacheOptions);
        return { kind: 'data', data: read.value };
      }
    }

    return this.runLoader({ loaderId, ctx, cacheable: !!cacheable, cacheOptions });
  }

  /**
   * Fire-and-forget SWR refresh; skipped when a refresh is already in flight for the key.
   * @param {string} loaderId - The loader id
   * @param {LoaderContext} ctx - The loader context
   * @param {string} cacheKey - The cache key
   * @param {LoaderRunnerInit['cacheOptions']} cacheOptions - The cache options
   */
  private scheduleBackgroundRefresh(
    loaderId: string,
    ctx: LoaderContext,
    cacheKey: string,
    cacheOptions: LoaderRunnerInit['cacheOptions']
  ): void {
    if (ServerLoaderRunner.pendingCacheOps.has(cacheKey)) {
      return;
    }
    ServerLoaderRunner.pendingCacheOps.add(cacheKey);
    void this.runLoader({
      loaderId,
      ctx,
      cacheable: true,
      cacheOptions,
      knownCacheKey: cacheKey,
    }).then(
      () => {
        ServerLoaderRunner.pendingCacheOps.delete(cacheKey);
      },
      () => {
        ServerLoaderRunner.pendingCacheOps.delete(cacheKey);
      }
    );
  }

  private async runLoader({
    loaderId,
    ctx,
    cacheable,
    cacheOptions,
    knownCacheKey,
  }: {
    loaderId: string;
    ctx: LoaderContext;
    cacheable: boolean;
    cacheOptions?: LoaderRunnerInit['cacheOptions'];
    knownCacheKey?: string;
  }): Promise<LoaderDataResult> {
    const loader = this.registry[loaderId]!;

    let value: unknown;
    try {
      value = await loader(ctx);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Loader failed';
      return {
        kind: 'error',
        status: 500,
        message,
        ...(err instanceof Error ? { cause: err } : {}),
      };
    }

    if (isLoaderRedirectResult(value)) {
      return { kind: 'redirect', redirect: value };
    }

    if (cacheable && this.cache) {
      const { key, dimensions } = buildCacheKey(loaderId, ctx);
      const cacheKey = knownCacheKey ?? key;
      const tags = buildLoaderCacheTags(
        loaderId,
        dimensions,
        cacheKey,
        value,
        cacheOptions?.tags ?? []
      );
      const ttl = cacheOptions?.revalidate ?? this.cache.ttl;
      try {
        await this.cache.set(cacheKey, value, ttl, tags);
      } catch (err) {
        console.warn(
          '[sitecore-loader-cache] background refresh failed to write cache entry:',
          err instanceof Error ? err.message : err
        );
      }
    }

    return { kind: 'data', data: value };
  }
}
