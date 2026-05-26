import {
  LoaderApiRequest,
  LoaderContext,
  isLoaderRedirectResult,
  LoaderCache,
  LoaderDataResult,
} from '../loaders/models';
import { LoaderRegistry } from '../loaders/loader-registry.token';
import { buildCacheKey, buildDefaultTags } from './cache/cache-key';

/**
 * Server-side loader data provider. Runs loaders from the shared cross-boundary
 * {@link LoaderRegistry} with optional global {@link LoaderCache} backing.
 * Used by Express middleware and SSR (via {@link SERVER_LOADER_DATA_PROVIDER}).
 * @public
 */
export class ServerLoaderDataProvider {
  constructor(
    private readonly registry: LoaderRegistry,
    private readonly cache?: LoaderCache
  ) {}

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

    const cacheable = this.cache && (cacheOptions?.enabled || this.cache.enabled());

    if (cacheable) {
      const { key } = buildCacheKey(loaderId, ctx);
      const hit = await this.cache!.get(key);
      if (hit) {
        return { kind: 'data', data: hit.value };
      }
    }

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

    if (cacheable) {
      const { key, dimensions } = buildCacheKey(loaderId, ctx);
      const tags = [...buildDefaultTags(dimensions), ...(cacheOptions?.tags ?? [])];
      const ttl = cacheOptions?.revalidate ?? this.cache!.resolveTtl();
      await this.cache!.set(key, value, ttl, tags);
    }

    return { kind: 'data', data: value };
  }
}
