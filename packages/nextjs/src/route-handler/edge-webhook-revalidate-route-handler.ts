import {
  collectSitecoreTagsFromEdgeRevalidateRequestBody,
  type SitecoreEdgeRevalidateRequestBody,
} from '../cache/sitecore-edge-webhook-revalidation';
import { dedupeSitecoreCacheTags } from '../cache/sitecore-cache-tags';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import type { RevalidateRouteHandlerOptions } from './revalidate-route-handler';

const DEFAULT_SECRET_ENV_VAR = 'SITECORE_REVALIDATE_SECRET';
const DEFAULT_SECRET_HEADER = 'x-revalidate-secret';

export type EdgeWebhookRevalidateRouteHandlerOptions = RevalidateRouteHandlerOptions & {
  /**
   * Fallback locale for item tags when `entity_culture` is missing, and for bare item ids in `tags`.
   * Default is `en`.
   */
  defaultLocale?: string;
  /**
   * Extra tags to always revalidate for each accepted webhook call.
   * This is useful for coarse invalidation strategies (e.g. dictionary buckets) when webhook payloads
   * do not carry enough information to map a change to deterministic cache tags.
   */
  additionalTags?: string[] | ((body: SitecoreEdgeRevalidateRequestBody) => string[]);
};

function normalizeAdditionalTags(
  additionalTags: EdgeWebhookRevalidateRouteHandlerOptions['additionalTags'],
  body: SitecoreEdgeRevalidateRequestBody
): string[] {
  const values = typeof additionalTags === 'function' ? additionalTags(body) : additionalTags;
  return (values ?? []).map((tag) => tag.trim()).filter(Boolean);
}

/**
 * Creates a POST route handler for Experience Edge / Content Operations style webhook bodies (POC-aligned).
 * Maps `updates[].identifier` (+ optional `entity_culture`) to Content SDK **item** cache tags (`sc:item:...`)
 * so invalidation matches tags from {@link collectSitecorePageCacheTags}.
 *
 * Uses the same secret env/header defaults as {@link createRevalidateRouteHandler}.
 * @public
 */
export function createEdgeWebhookRevalidateRouteHandler(
  options: EdgeWebhookRevalidateRouteHandlerOptions = {}
) {
  const {
    defaultLocale = 'en',
    additionalTags,
    secret,
    secretEnvVarName = DEFAULT_SECRET_ENV_VAR,
    secretHeaderName = DEFAULT_SECRET_HEADER,
    cacheProfile = 'max',
  } = options;

  const POST = async (req: NextRequest) => {
    const configuredSecret = secret ?? process.env[secretEnvVarName];
    if (!configuredSecret) {
      return NextResponse.json(
        { error: `${secretEnvVarName} is not configured.` },
        { status: 500 }
      );
    }

    const providedSecret = req.headers.get(secretHeaderName);
    if (providedSecret !== configuredSecret) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    let body: SitecoreEdgeRevalidateRequestBody;
    try {
      body = (await req.json()) as SitecoreEdgeRevalidateRequestBody;
    } catch {
      return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
    }

    const tags = dedupeSitecoreCacheTags([
      ...collectSitecoreTagsFromEdgeRevalidateRequestBody(body, { defaultLocale }),
      ...normalizeAdditionalTags(additionalTags, body),
    ]);
    if (tags.length === 0) {
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

    return NextResponse.json({
      revalidated: true,
      tags,
      invocation_id: body.invocation_id ?? null,
      continues: body.continues ?? false,
    });
  };

  return { POST };
}
