import { LoaderCacheConfig, ResolvedConfig, CacheKeyDimensions, DEFAULT_CACHE_TTL } from './models';
import { LoaderContext } from '../../loaders/models';

/**
 * @deprecated only used for demo purposes. remove before release.
 */
export function approxByteSize(value: unknown): number {
  try {
    return JSON.stringify(value).length;
  } catch {
    return 0;
  }
}

/**
 * Builder hook for tests and the admin endpoint: turn a LoaderContext into the
 * dimensions used by the key + tag builders.
 * @internal
 */
export function dimensionsFromContext(loaderId: string, ctx: LoaderContext): CacheKeyDimensions {
  const params = (ctx.params ?? {}) as Record<string, unknown>;
  const site = (params?.['site'] as string) || 'default';
  const locale = (params?.['locale'] as string) || 'en';
  const route = stripQuery(ctx.url || '/');

  return {
    site,
    locale,
    variantId: 'default',
    loaderId,
    route,
  };
}

function stripQuery(url: string): string {
  const i = url.indexOf('?');
  return i === -1 ? url : url.slice(0, i);
}

/**
 * Build a {@link ResolvedConfig} from a {@link LoaderCacheConfig}. Shared by
 * every backend so config semantics stay identical regardless of driver.
 * @internal
 */
export function resolveConfig(config: LoaderCacheConfig): ResolvedConfig {
  return {
    revalidate: config.revalidate ?? DEFAULT_CACHE_TTL,
    enabled: config.enabled ?? true,
  };
}
