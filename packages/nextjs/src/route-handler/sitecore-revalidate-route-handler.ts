import {
  collectSitecoreTagsFromEdgeRevalidateRequestBody,
  type SitecoreEdgeRevalidateRequestBody,
} from '../cache/sitecore-edge-webhook-revalidation';
import { buildSitecoreDictionaryCacheTagsFromSites, dedupeSitecoreCacheTags } from '../cache/sitecore-cache-tags';
import debug from '../debug';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import type { WebhookRevalidateRouteHandlerOptions } from './webhook-revalidate-route-handler';

const DEFAULT_SECRET_ENV_VAR = 'SITECORE_REVALIDATE_SECRET';
const DEFAULT_SECRET_HEADER = 'x-revalidate-secret';

/**
 * Options for {@link createSitecoreRevalidateRouteHandler}.
 * Same as {@link WebhookRevalidateRouteHandlerOptions} (webhook mapping + optional sites / defaultSite for dictionary tags).
 * @public
 */
export type SitecoreRevalidateRouteHandlerOptions = WebhookRevalidateRouteHandlerOptions;

/** @param {Record<string, unknown>} body - Parsed JSON object with optional `tag` or `tags` for manual revalidation. */
function normalizeManualTags(body: Record<string, unknown>): string[] {
  const fromSingle =
    typeof body.tag === 'string' && body.tag.trim() ? [body.tag.trim()] : [];
  const fromMany = Array.isArray(body.tags)
    ? body.tags
        .filter((t): t is string => typeof t === 'string')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  const normalized = [...fromSingle, ...fromMany];
  return dedupeSitecoreCacheTags(normalized);
}

/** @param {Record<string, unknown>} body - Parsed JSON object that may include `invocation_id`. */
function hasNonEmptyInvocationId(body: Record<string, unknown>): boolean {
  const v = body.invocation_id;
  return typeof v === 'string' && v.trim().length > 0;
}

/**
 * When true, the body is handled like an Experience Edge / Content Operations webhook:
 * `updates` identifiers and bare values in `tags` are mapped to `sc:item:...` tags.
 * @param {Record<string, unknown>} body - Parsed JSON revalidate request body.
 */
function mustUseWebhookTagResolution(body: Record<string, unknown>): boolean {
  if (body.continues === true) {
    return true;
  }
  if (hasNonEmptyInvocationId(body)) {
    return true;
  }
  if (Array.isArray(body.updates) && body.updates.length > 0) {
    return true;
  }

  const singleTag = typeof body.tag === 'string' ? body.tag.trim() : '';
  if (singleTag && !singleTag.startsWith('sc:')) {
    return true;
  }

  if (Array.isArray(body.tags)) {
    for (const t of body.tags) {
      if (typeof t === 'string' && t.trim() && !t.trim().startsWith('sc:')) {
        return true;
      }
    }
  }
  return false;
}

/** @param {Record<string, unknown>} body - Parsed JSON object with optional manual `tag` / `tags` input. */
function hasManualTagInput(body: Record<string, unknown>): boolean {
  if (typeof body.tag === 'string' && body.tag.trim()) {
    return true;
  }
  if (Array.isArray(body.tags) && body.tags.some((t) => typeof t === 'string' && t.trim())) {
    return true;
  }
  return false;
}

/**
 * Creates a single `POST` handler for `/api/revalidate` that supports:
 *
 * - **Explicit tags** — JSON `{ tag }` or `{ tags }` where every value starts with `sc:` (manual revalidation;
 *   same behavior as {@link createRevalidateRouteHandler}).
 * - **Webhook-style bodies** — non-empty `updates`, `continues: true`, non-empty `invocation_id`, or any
 *   `tag` / `tags` entry that does not start with `sc:` (bare item ids are mapped like
 *   {@link createWebhookRevalidateRouteHandler}).
 *
 * Uses the same secret env/header defaults as {@link createRevalidateRouteHandler}.
 * @param {SitecoreRevalidateRouteHandlerOptions} [options] - Secret, cache profile, locale, sites, and dictionary options.
 * @public
 */
export function createSitecoreRevalidateRouteHandler(
  options: SitecoreRevalidateRouteHandlerOptions = {}
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
        debug.revalidate('sitecore revalidate: %s is not configured', secretEnvVarName);
        return NextResponse.json(
          { error: `${secretEnvVarName} is not configured.` },
          { status: 500 }
        );
      }

      const providedSecret = req.headers.get(secretHeaderName);
      if (providedSecret !== configuredSecret) {
        debug.revalidate('sitecore revalidate: unauthorized (secret mismatch or missing header)');
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
      }

      let body: unknown;
      try {
        body = await req.json();
      } catch {
        debug.revalidate('sitecore revalidate: invalid JSON body');
        return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
      }

      if (typeof body !== 'object' || body === null || Array.isArray(body)) {
        debug.revalidate('sitecore revalidate: body must be a JSON object');
        return NextResponse.json({ error: 'Request body must be a JSON object.' }, { status: 400 });
      }

      const obj = body as Record<string, unknown>;

      if (mustUseWebhookTagResolution(obj)) {
        const webhookBody = obj as SitecoreEdgeRevalidateRequestBody;
        debug.revalidate('sitecore revalidate webhook path start: %o', {
          invocation_id: webhookBody.invocation_id ?? null,
          continues: webhookBody.continues ?? false,
          updatesCount: webhookBody.updates?.length ?? 0,
          tagsCount: Array.isArray(webhookBody.tags) ? webhookBody.tags.length : 0,
          dictionaryTagsCount: dictionaryTags.length,
          defaultLocale,
        });

        const tags = dedupeSitecoreCacheTags([
          ...collectSitecoreTagsFromEdgeRevalidateRequestBody(webhookBody, { defaultLocale }),
          ...dictionaryTags,
        ]);
        if (tags.length === 0) {
          debug.revalidate(
            'sitecore revalidate webhook path: no tags resolved in %dms',
            Date.now() - startTimestamp
          );
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

        debug.revalidate('sitecore revalidate webhook path end in %dms: %o', Date.now() - startTimestamp, {
          tagsCount: tags.length,
          invocation_id: webhookBody.invocation_id ?? null,
          continues: webhookBody.continues ?? false,
        });

        return NextResponse.json({
          revalidated: true,
          tags,
          invocation_id: webhookBody.invocation_id ?? null,
          continues: webhookBody.continues ?? false,
        });
      }

      if (!hasManualTagInput(obj)) {
        debug.revalidate('sitecore revalidate: missing tag or tags in manual path');
        return NextResponse.json(
          { error: 'Provide a non-empty `tag` or `tags` in the request body.' },
          { status: 400 }
        );
      }

      const tags = normalizeManualTags(obj);
      if (tags.length === 0) {
        debug.revalidate('sitecore revalidate manual path: no valid tags after normalization');
        return NextResponse.json(
          { error: 'Provide a non-empty `tag` or `tags` in the request body.' },
          { status: 400 }
        );
      }

      debug.revalidate('sitecore revalidate manual path start: %o', {
        tagsCount: tags.length,
      });

      for (const tag of tags) {
        revalidateTag(tag, cacheProfile);
      }

      debug.revalidate('sitecore revalidate manual path end in %dms: %o', Date.now() - startTimestamp, {
        tagsCount: tags.length,
      });

      return NextResponse.json({
        revalidated: true,
        tags,
      });
    } catch (error) {
      if (error instanceof Error && (error as any).digest === 'NEXT_PRERENDER_INTERRUPTED') {
        throw error;
      }

      console.log('Sitecore revalidate route handler failed:');
      console.log(error);

      return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
    }
  };

  return { POST };
}
