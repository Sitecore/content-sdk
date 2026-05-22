import {
  LoaderApiRequest,
  LoaderContext,
  LoaderRedirectResult,
  RequestContext,
  isLoaderRedirectResult,
} from '../../loaders/models';
import { LoaderRegistry } from '../models';
import { buildCacheKey, buildTags } from './cache-key';
import { LoaderCache } from './models';

/**
 * Result returned to call sites. Mirrors the raw loader return shape so the
 * SSR resolver branch and the Express middleware can wrap as they need.
 * @public
 */
export type ResolveLoaderDataResult =
  | { kind: 'data'; data: unknown }
  | { kind: 'redirect'; redirect: LoaderRedirectResult }
  | { kind: 'error'; status: number; message: string };

/**
 * Shared server-only entry point used by both:
 *   - loader-resolver.ts (SSR branch)
 *   - loader-data-service-middleware.ts (/_data endpoint)
 *
 * Mirrors browser LoaderDataService.getData semantically: check cache -> on
 * miss, run loader -> store. Errors are surfaced as `{ kind: 'error' }` to keep
 * the contract simple; callers map them to their wire/Router shapes.
 * @public
 */
export async function resolveLoaderData(
  request: LoaderApiRequest,
  registry: LoaderRegistry,
  cache: LoaderCache | undefined,
  requestContext?: RequestContext
): Promise<ResolveLoaderDataResult> {
  const { loaderId, url, params, query } = request;
  const loader = registry[loaderId];
  if (!loader) {
    return { kind: 'error', status: 500, message: `No loader registered for id "${loaderId}"` };
  }

  const ctx: LoaderContext = { url, params, query, requestContext };

  const cacheable = cache && cache.isEnabled(loaderId);

  if (cacheable) {
    const { key } = buildCacheKey(loaderId, ctx);
    const hit = await cache.get(key);
    if (hit) {
      return { kind: 'data', data: hit.value };
    }
  }

  let value: unknown;
  try {
    value = await loader(ctx);
  } catch (err) {
    // Preserve the existing wire-level error shape from executeLoader; the SSR
    // resolver re-throws to keep the Router error contract.
    const message = err instanceof Error ? err.message : 'Loader failed';
    return { kind: 'error', status: 500, message, ...wrapError(err) };
  }

  if (isLoaderRedirectResult(value)) {
    return { kind: 'redirect', redirect: value };
  }

  if (cacheable) {
    const { key, dimensions } = buildCacheKey(loaderId, ctx);
    const tags = buildTags(dimensions);
    await cache.set(key, value, cache.resolveTtl(loaderId), tags);
  }

  return { kind: 'data', data: value };
}

// Lets the SSR resolver re-throw with the original Error subclass when it
// needs to (LoaderHttpError, NotFoundNavigationError).
function wrapError(err: unknown): { cause?: unknown } {
  return err instanceof Error ? { cause: err } : {};
}
