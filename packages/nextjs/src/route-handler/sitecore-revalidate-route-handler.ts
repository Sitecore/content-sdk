import {
  collectSitecoreTagsFromEdgeRevalidateRequestBody,
  type SitecoreEdgeRevalidateRequestBody,
} from '../cache/sitecore-edge-webhook-revalidation';
import { buildSitecoreDictionaryCacheTagsFromSites, dedupeSitecoreCacheTags } from '../cache/sitecore-cache-tags';
import debug from '../debug';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import type { SiteInfo } from '@sitecore-content-sdk/content/site';

const DEFAULT_SECRET_ENV_VAR = 'SITECORE_REVALIDATE_SECRET';
const DEFAULT_SECRET_HEADER = 'x-revalidate-secret';

/** Returns a non-empty trimmed secret, or `undefined` when unset or whitespace-only. */
function resolveConfiguredRevalidateSecret(
  secretOption: string | undefined,
  envValue: string | undefined
): string | undefined {
  const raw = secretOption !== undefined ? secretOption : envValue;
  const trimmed = raw?.trim();
  return trimmed || undefined;
}

/**
 * Second argument to Next.js `revalidateTag` (cache profile: e.g. `"max"` or `{ expire }`).
 * Aligns with the installed `next/cache` typings.
 * @public
 */
export type RevalidateTagCacheProfile = Parameters<typeof revalidateTag>[1];

/**
 * Options for {@link createSitecoreRevalidateRouteHandler}.
 * @public
 */
export type SitecoreRevalidateRouteHandlerOptions = {
  /**
   * Shared secret for `POST /api/revalidate`. If omitted, the handler reads `process.env.SITECORE_REVALIDATE_SECRET`.
   * When a non-empty value is configured (here or via env), callers must send the same value in the
   * **`x-revalidate-secret`** header. When empty/omitted, revalidation proceeds without that header.
   */
  secret?: string;
  /**
   * Next.js `revalidateTag` cache profile (second argument). Default is `"max"` (recommended).
   * Other string values may match profiles from `cacheLife` in `next.config`; objects may use `{ expire }` per Next.js docs.
   */
  cacheProfile?: RevalidateTagCacheProfile;
  /** Locale for item tags when culture is missing, and for dictionary tags when a site has no language. */
  defaultLocale?: string;
  /** Sites list; merges one `sc:dict:<site>:<locale>` cache tag per site on every revalidation call. */
  sites?: SiteInfo[];
  /**
   * Optional **dictionary-only** site name. When set, the handler appends one extra
   * `sc:dict:<extraDictionarySite>:<defaultLocale>` tag on top of the per-site tags above.
   * Use this as a defensive guarantee that the canonical site's dictionary tag is always
   * invalidated even if the `sites` list is empty or carries a different language string.
   * Note: this option does **not** influence routing or any other tag family.
   */
  extraDictionarySite?: string;
};

/**
 * Creates a single `POST` handler for `/api/revalidate` that consumes Sitecore Experience Edge / Content
 * Operations webhook bodies (and equivalent ad-hoc calls that reuse the same body shape).
 *
 * The body is expected to be a JSON object that resolves to at least one Sitecore cache tag:
 *
 * - **`updates[]`** — Sitecore publish-event rows. Each row's `identifier` (with `-media` / `-layout`
 *   suffix stripped) maps to an `sc:item:<id>:<locale>:latest` tag, using `entity_culture` for locale
 *   (falling back to the handler's `defaultLocale`).
 * - **`tags[]`** — pass-through and convenience array:
 *   - Strings already starting with `sc:` are used verbatim (e.g. `sc:route:...`, `sc:item:...`, `sc:dict:...`).
 *   - Bare values are treated as Sitecore item ids and mapped to `sc:item:<id>:<defaultLocale>:latest`.
 *
 * When **`sites`** / **`extraDictionarySite`** are configured, the handler also appends one
 * `sc:dict:<site>:<locale>` tag per site (and one extra `sc:dict:<extraDictionarySite>:<defaultLocale>`
 * tag if set) so dictionary updates flow through the same call.
 *
 * Auth (optional): when `SITECORE_REVALIDATE_SECRET` (or the `secret` option) is non-empty, callers must
 * send the same value in the **`x-revalidate-secret`** header. When unset or blank, no header is required.
 * @param {SitecoreRevalidateRouteHandlerOptions} [options] - Optional inline `secret`, `cacheProfile`, locale, sites, and dictionary options.
 * @public
 */
export function createSitecoreRevalidateRouteHandler(
  options: SitecoreRevalidateRouteHandlerOptions = {}
) {
  const {
    defaultLocale = 'en',
    sites,
    extraDictionarySite,
    secret,
    cacheProfile = 'max',
  } = options;

  const dictionaryTags =
    sites !== undefined || extraDictionarySite?.trim()
      ? buildSitecoreDictionaryCacheTagsFromSites({
          sites: sites ?? [],
          baseLocale: defaultLocale,
          extraDictionarySite,
        })
      : [];

  const POST = async (req: NextRequest) => {
    const startTimestamp = Date.now();
    try {
      const configuredSecret = resolveConfiguredRevalidateSecret(
        secret,
        process.env[DEFAULT_SECRET_ENV_VAR]
      );

      if (configuredSecret) {
        const providedSecret = req.headers.get(DEFAULT_SECRET_HEADER);
        if (providedSecret !== configuredSecret) {
          debug.revalidate('sitecore revalidate: unauthorized (secret mismatch or missing header)');
          return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
        }
      } else {
        debug.revalidate('sitecore revalidate: no secret configured, skipping auth');
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

      const webhookBody = body as SitecoreEdgeRevalidateRequestBody;

      debug.revalidate('sitecore revalidate start: %o', {
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
          'sitecore revalidate: no tags resolved in %dms',
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

      debug.revalidate('sitecore revalidate end in %dms: %o', Date.now() - startTimestamp, {
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
