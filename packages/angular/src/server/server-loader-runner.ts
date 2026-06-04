import {
  LoaderApiRequest,
  LoaderContext,
  isLoaderRedirectResult,
  LoaderCache,
  LoaderDataResult,
} from '../loaders/models';
import { LoaderRegistry } from '../loaders/loader-registry.token';
import { buildCacheKey } from './cache/cache-key';
import { buildLoaderCacheTags } from './cache/cache-tags';

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
  constructor(private readonly registry: LoaderRegistry, private readonly cache?: LoaderCache) {}

  /**
   * Resolve loader data with optional cache read-through and SWR refresh.
   * @param {LoaderApiRequest} request - Loader id, URL, params, optional request context and cache overrides.
   * @returns {Promise<LoaderDataResult>} Data, redirect, or error result for the middleware / SSR resolver.
   */
  async resolve(request: LoaderApiRequest): Promise<LoaderDataResult> {
    const { loaderId, url, params, query, angularRequestContext, cacheOptions } = request;
    const loader = this.registry[loaderId];
    if (!loader) {
      return { kind: 'error', status: 500, message: `No loader registered for id "${loaderId}"` };
    }

    const ctx: LoaderContext = { url, params, query, requestContext: angularRequestContext };

    const cacheable = this.cache && (cacheOptions?.enabled ?? this.cache.enabled());

    if (cacheable) {
      const { key } = buildCacheKey(loaderId, ctx);
      const read = await this.cache.get(key);

      if (read.kind === 'hit') {
        return { kind: 'data', data: read.value };
      }

      if (read.kind === 'stale') {
        this.scheduleBackgroundRefresh(request, ctx, key, cacheOptions);
        return { kind: 'data', data: read.value };
      }
    }

    return this.runLoader({ request, ctx, cacheable: !!cacheable, cacheOptions });
  }

  /**
   * Fire-and-forget SWR refresh; skipped when a refresh is already in flight for the key.
   * @param {LoaderApiRequest} request - The loader request
   * @param {LoaderContext} ctx - The loader context
   * @param {string} cacheKey - The cache key
   * @param {LoaderApiRequest['cacheOptions']} cacheOptions - The cache options
   */
  private scheduleBackgroundRefresh(
    request: LoaderApiRequest,
    ctx: LoaderContext,
    cacheKey: string,
    cacheOptions: LoaderApiRequest['cacheOptions']
  ): void {
    if (ServerLoaderRunner.pendingCacheOps.has(cacheKey)) {
      return;
    }
    ServerLoaderRunner.pendingCacheOps.add(cacheKey);
    void this.runLoader({
      request,
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
    request,
    ctx,
    cacheable,
    cacheOptions,
    knownCacheKey,
  }: {
    request: LoaderApiRequest;
    ctx: LoaderContext;
    cacheable: boolean;
    cacheOptions?: LoaderApiRequest['cacheOptions'];
    knownCacheKey?: string;
  }): Promise<LoaderDataResult> {
    const { loaderId } = request;
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
