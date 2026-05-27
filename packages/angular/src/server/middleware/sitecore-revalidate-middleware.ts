import type { SiteInfo } from '@sitecore-content-sdk/content/site';
import { ExpressMiddleware, ExpressNextFunction, ExpressRequest, ExpressResponse } from '../models';
import { LoaderCache } from '../../loaders/models';
import { buildLoaderDictionaryCacheTagsFromSites } from '../cache/cache-tags';
import { dedupeCacheStrings } from '../cache/utils';
import {
  collectSitecoreTagsFromEdgeRevalidateRequestBody,
  type SitecoreEdgeRevalidateRequestBody,
} from './sitecore-edge-webhook-revalidation';

const DEFAULT_SECRET_ENV_VAR = 'SITECORE_REVALIDATE_SECRET';
const DEFAULT_SECRET_HEADER = 'x-revalidate-secret';
const DEFAULT_ENDPOINT = '/api/revalidate';

function readProcessEnv(name: string): string | undefined {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  return proc?.env?.[name];
}

/**
 * Returns a non-empty trimmed secret, or `undefined` when unset or whitespace-only.
 * Authority: `packages/nextjs/src/route-handler/sitecore-revalidate-route-handler.ts`.
 * @internal
 */
export function resolveConfiguredRevalidateSecret(
  secretOption: string | undefined,
  envValue: string | undefined
): string | undefined {
  const raw = secretOption !== undefined ? secretOption : envValue;
  const trimmed = raw?.trim();
  return trimmed || undefined;
}

/**
 * Options for {@link createSitecoreRevalidateMiddleware}.
 * @public
 */
export interface SitecoreRevalidateMiddlewareOptions {
  cache: LoaderCache;
  /** Default: `process.env.SITECORE_REVALIDATE_SECRET` */
  secret?: string;
  /** Locale fallback when an update has no entity_culture; default `'en'`. */
  defaultLocale?: string;
  /**
   * Optional sites list; when set, every call also marks stale one
   * `sc:loader:dictionary:<site>:<locale>` entry per site.
   */
  sites?: SiteInfo[];
  /** Endpoint path; default `/api/revalidate`. */
  endpoint?: string;
}

/**
 * Express middleware aligned with Next.js `createSitecoreRevalidateRouteHandler`.
 * Marks matching loader cache entries stale via tag index (SWR semantics).
 * @public
 */
export function createSitecoreRevalidateMiddleware(
  options: SitecoreRevalidateMiddlewareOptions
): ExpressMiddleware {
  const { cache, secret, defaultLocale = 'en', sites, endpoint = DEFAULT_ENDPOINT } = options;

  const dictionaryTags =
    sites !== undefined
      ? buildLoaderDictionaryCacheTagsFromSites({ sites, baseLocale: defaultLocale })
      : [];

  return async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
    if (req.method !== 'POST' || req.path !== endpoint) {
      next();
      return;
    }

    const startTimestamp = Date.now();

    try {
      const configuredSecret = resolveConfiguredRevalidateSecret(
        secret,
        readProcessEnv(DEFAULT_SECRET_ENV_VAR)
      );

      if (configuredSecret) {
        const headers = req.headers as Record<string, string | string[] | undefined>;
        const providedSecret = headers[DEFAULT_SECRET_HEADER];
        const headerValue = Array.isArray(providedSecret) ? providedSecret[0] : providedSecret;
        if (headerValue !== configuredSecret) {
          res.status(401).json({ error: 'Unauthorized.' });
          return;
        }
      }

      const body = req.body;
      if (typeof body !== 'object' || body === null || Array.isArray(body)) {
        res.status(400).json({ error: 'Request body must be a JSON object.' });
        return;
      }

      const webhookBody = body as SitecoreEdgeRevalidateRequestBody;

      const tags = dedupeCacheStrings([
        ...collectSitecoreTagsFromEdgeRevalidateRequestBody(webhookBody, { defaultLocale }),
        ...dictionaryTags,
      ]);

      if (tags.length === 0) {
        res.status(400).json({
          error:
            'Provide non-empty `updates` (with identifiers) and/or `tags` that resolve to at least one cache tag.',
        });
        return;
      }

      const marked = await cache.invalidate({ tags });

      res.status(200).json({
        revalidated: true,
        tagsCount: tags.length,
        marked,
        invocation_id: webhookBody.invocation_id ?? null,
        continues: webhookBody.continues ?? false,
        durationMs: Date.now() - startTimestamp,
      });
    } catch (error) {
      console.error('Sitecore revalidate middleware failed:', error);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  };
}
