import { dedupeSitecoreCacheTags } from '../cache/sitecore-cache-tags';
import debug from '../debug';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Second argument to Next.js `revalidateTag` (cache profile: e.g. `"max"` or `{ expire }`).
 * Aligns with the installed `next/cache` typings.
 * @public
 */
export type RevalidateTagCacheProfile = Parameters<typeof revalidateTag>[1];

type RevalidateRequestBody = {
  tag?: string;
  tags?: string[];
};

/**
 * Options for {@link createRevalidateRouteHandler}.
 * @public
 */
export type RevalidateRouteHandlerOptions = {
  /**
   * Shared secret. If omitted, the handler reads `process.env.SITECORE_REVALIDATE_SECRET`.
   * Callers must send the same value in the **`x-revalidate-secret`** request header (fixed contract; not Sitecore “authorization item” config).
   */
  secret?: string;
  /**
   * Next.js `revalidateTag` cache profile (second argument). Default is `"max"` (recommended).
   * Other string values may match profiles from `cacheLife` in `next.config`; objects may use `{ expire }` per Next.js docs.
   */
  cacheProfile?: RevalidateTagCacheProfile;
};

const DEFAULT_SECRET_ENV_VAR = 'SITECORE_REVALIDATE_SECRET';
const DEFAULT_SECRET_HEADER = 'x-revalidate-secret';

/** @param {RevalidateRequestBody} body - Parsed JSON body with optional `tag` or `tags`. */
function normalizeTags(body: RevalidateRequestBody): string[] {
  const fromSingle = body.tag ? [body.tag] : [];
  const fromMany = body.tags ?? [];
  const normalized = [...fromSingle, ...fromMany].map((tag) => tag.trim()).filter(Boolean);
  return dedupeSitecoreCacheTags(normalized);
}

/**
 * Creates a route handler for manual/automated tag revalidation.
 * @param {RevalidateRouteHandlerOptions} [options] - Handler options.
 * @returns The route handler with POST method.
 * @public
 */
export function createRevalidateRouteHandler(options: RevalidateRouteHandlerOptions = {}) {
  const { secret, cacheProfile = 'max' } = options;

  const POST = async (req: NextRequest) => {
    const startTimestamp = Date.now();
    try {
      const configuredSecret = secret ?? process.env[DEFAULT_SECRET_ENV_VAR];
      if (!configuredSecret) {
        debug.revalidate('revalidate route handler: %s is not configured', DEFAULT_SECRET_ENV_VAR);
        return NextResponse.json(
          { error: `${DEFAULT_SECRET_ENV_VAR} is not configured.` },
          { status: 500 }
        );
      }

      const providedSecret = req.headers.get(DEFAULT_SECRET_HEADER);
      if (providedSecret !== configuredSecret) {
        debug.revalidate('revalidate route handler: unauthorized (secret mismatch or missing header)');
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
      }

      let body: RevalidateRequestBody;
      try {
        body = (await req.json()) as RevalidateRequestBody;
      } catch {
        debug.revalidate('revalidate route handler: invalid JSON body');
        return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
      }

      const tags = normalizeTags(body);
      if (tags.length === 0) {
        debug.revalidate('revalidate route handler: no tags in body after %dms', Date.now() - startTimestamp);
        return NextResponse.json(
          { error: 'Provide a non-empty `tag` or `tags` in the request body.' },
          { status: 400 }
        );
      }

      debug.revalidate('revalidate route handler start: %o', { tagsCount: tags.length });

      for (const tag of tags) {
        revalidateTag(tag, cacheProfile);
      }

      debug.revalidate('revalidate route handler end in %dms: %o', Date.now() - startTimestamp, {
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

      console.log('Revalidate route handler failed:');
      console.log(error);

      return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
    }
  };

  return { POST };
}
