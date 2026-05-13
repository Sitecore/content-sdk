import {
  collectSitecoreTagsFromEdgeRevalidateRequestBody,
  type SitecoreEdgeRevalidateRequestBody,
} from '../cache/sitecore-edge-webhook-revalidation';
import { buildSitecoreDictionaryCacheTagsFromSites, dedupeSitecoreCacheTags } from '../cache/sitecore-cache-tags';
import debug from '../debug';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import type { SiteInfo } from '@sitecore-content-sdk/content/site';
import type { RevalidateRouteHandlerOptions } from './revalidate-route-handler';

const DEFAULT_SECRET_ENV_VAR = 'SITECORE_REVALIDATE_SECRET';
const DEFAULT_SECRET_HEADER = 'x-revalidate-secret';

/**
 * Options for {@link createWebhookRevalidateRouteHandler}.
 * @public
 */
export type WebhookRevalidateRouteHandlerOptions = RevalidateRouteHandlerOptions & {
  /** Locale for item tags when culture is missing, and for dictionary tags when a site has no language. */
  defaultLocale?: string;
  /** Sites list; merges dictionary cache tags for each site on webhook calls. */
  sites?: SiteInfo[];
  /** Optional site name for an extra dictionary tag scoped to the handler locale option. */
  defaultSite?: string;
};

/**
 * Creates a POST route handler for Experience Edge / Content Operations style webhook bodies (POC-aligned).
 * Maps `updates[].identifier` (+ optional `entity_culture`) to Content SDK **item** cache tags (`sc:item:...`)
 * so invalidation matches tags from {@link collectSitecorePageCacheTags}.
 *
 * Uses the same secret env/header defaults as {@link createRevalidateRouteHandler}.
 * @param {WebhookRevalidateRouteHandlerOptions} [options] - Secret, cache profile, locale, sites, and dictionary options.
 * @public
 */
export function createWebhookRevalidateRouteHandler(
  options: WebhookRevalidateRouteHandlerOptions = {}
) {
  const {
    defaultLocale = 'en',
    sites,
    defaultSite,
    secret,
    secretEnvVarName = DEFAULT_SECRET_ENV_VAR,
    secretHeaderName = DEFAULT_SECRET_HEADER,
    cacheProfile = 'max',
  } = options;

  const dictionaryTags =
    sites !== undefined || defaultSite?.trim()
      ? buildSitecoreDictionaryCacheTagsFromSites({
          sites: sites ?? [],
          baseLocale: defaultLocale,
          extraDictionarySite: defaultSite,
        })
      : [];

  const POST = async (req: NextRequest) => {
    const startTimestamp = Date.now();
    try {
      const configuredSecret = secret ?? process.env[secretEnvVarName];
      if (!configuredSecret) {
        debug.revalidate('webhook revalidate: %s is not configured', secretEnvVarName);
        return NextResponse.json(
          { error: `${secretEnvVarName} is not configured.` },
          { status: 500 }
        );
      }

      const providedSecret = req.headers.get(secretHeaderName);
      if (providedSecret !== configuredSecret) {
        debug.revalidate('webhook revalidate: unauthorized (secret mismatch or missing header)');
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
      }

      let body: SitecoreEdgeRevalidateRequestBody;
      try {
        body = (await req.json()) as SitecoreEdgeRevalidateRequestBody;
      } catch {
        debug.revalidate('webhook revalidate: invalid JSON body');
        return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
      }

      debug.revalidate('webhook revalidate start: %o', {
        invocation_id: body.invocation_id ?? null,
        continues: body.continues ?? false,
        updatesCount: body.updates?.length ?? 0,
        tagsCount: Array.isArray(body.tags) ? body.tags.length : 0,
        dictionaryTagsCount: dictionaryTags.length,
        defaultLocale,
      });

      const tags = dedupeSitecoreCacheTags([
        ...collectSitecoreTagsFromEdgeRevalidateRequestBody(body, { defaultLocale }),
        ...dictionaryTags,
      ]);
      if (tags.length === 0) {
        debug.revalidate('webhook revalidate: no tags resolved in %dms', Date.now() - startTimestamp);
        return NextResponse.json(
          {
            error:
              'Provide non-empty `updates` (with identifiers) and/or `tags` that resolve to at least one cache tag.',
          },
          { status: 400 }
        );
      }

      for (const tag of tags) {
        revalidateTag(tag, cacheProfile);
      }

      debug.revalidate('webhook revalidate end in %dms: %o', Date.now() - startTimestamp, {
        tagsCount: tags.length,
        invocation_id: body.invocation_id ?? null,
        continues: body.continues ?? false,
      });

      return NextResponse.json({
        revalidated: true,
        tags,
        invocation_id: body.invocation_id ?? null,
        continues: body.continues ?? false,
      });
    } catch (error) {
      if (error instanceof Error && (error as any).digest === 'NEXT_PRERENDER_INTERRUPTED') {
        throw error;
      }

      console.log('Webhook revalidate route handler failed:');
      console.log(error);

      return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
    }
  };

  return { POST };
}

/**
 * @deprecated Use {@link WebhookRevalidateRouteHandlerOptions}.
 * @public
 */
export type EdgeWebhookRevalidateRouteHandlerOptions = WebhookRevalidateRouteHandlerOptions;

/**
 * @deprecated Use {@link createWebhookRevalidateRouteHandler}.
 * @public
 */
export const createEdgeWebhookRevalidateRouteHandler = createWebhookRevalidateRouteHandler;
