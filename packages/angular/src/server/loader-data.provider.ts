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
 * Server-side loader data provider with stale-while-revalidate cache reads (Phase 3).
 * @public
 */
export class ServerLoaderDataProvider {
  /** Process-wide coalescing for stale-while-revalidate background refreshes. */
  private static readonly pendingCacheOps = new Set<string>();

  constructor(private readonly registry: LoaderRegistry, private readonly cache?: LoaderCache) {}

  /**
   * Resolve loader data: check cache, run loader on miss, store result.
   * @param {LoaderApiRequest} request - Loader request payload
   * @returns {Promise<LoaderDataResult>} Resolved loader result
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
      const read = await this.cache!.get(key);

      if (read.kind === 'hit') {
        return { kind: 'data', data: read.value };
      }

      if (read.kind === 'stale') {
        this.scheduleBackgroundRefresh(request, ctx, key, cacheOptions);
        return { kind: 'data', data: read.value };
      }
    }

    return this.runLoader({ request, ctx, cacheable: !!cacheable });
  }

  private scheduleBackgroundRefresh(
    request: LoaderApiRequest,
    ctx: LoaderContext,
    cacheKey: string,
    cacheOptions: LoaderApiRequest['cacheOptions']
  ): void {
    if (ServerLoaderDataProvider.pendingCacheOps.has(cacheKey)) {
      return;
    }
    ServerLoaderDataProvider.pendingCacheOps.add(cacheKey);
    void this.runLoader({
      request,
      ctx,
      cacheable: true,
      cacheOptions,
      knownCacheKey: cacheKey,
    }).then(
      () => {
        ServerLoaderDataProvider.pendingCacheOps.delete(cacheKey);
      },
      () => {
        ServerLoaderDataProvider.pendingCacheOps.delete(cacheKey);
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
      const ttl = cacheOptions?.revalidate ?? this.cache.resolveTtl();
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
