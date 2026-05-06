import { dedupeSitecoreCacheTags } from '../cache/sitecore-cache-tags';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

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
   * Shared secret expected from request headers.
   * If omitted, handler uses process.env[secretEnvVarName].
   */
  secret?: string;
  /**
   * Environment variable name for resolving the shared secret.
   * Default is SITECORE_REVALIDATE_SECRET.
   */
  secretEnvVarName?: string;
  /**
   * Request header name used for passing the secret.
   * Default is x-revalidate-secret.
   */
  secretHeaderName?: string;
  /**
   * Next.js cache profile used by revalidateTag.
   * Default is max.
   */
  cacheProfile?: 'max';
};

const DEFAULT_SECRET_ENV_VAR = 'SITECORE_REVALIDATE_SECRET';
const DEFAULT_SECRET_HEADER = 'x-revalidate-secret';

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
  const {
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

    let body: RevalidateRequestBody;
    try {
      body = (await req.json()) as RevalidateRequestBody;
    } catch {
      return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
    }

    const tags = normalizeTags(body);
    if (tags.length === 0) {
      return NextResponse.json(
        { error: 'Provide a non-empty `tag` or `tags` in the request body.' },
        { status: 400 }
      );
    }

    for (const tag of tags) {
      revalidateTag(tag, cacheProfile);
    }

    return NextResponse.json({
      revalidated: true,
      tags,
    });
  };

  return { POST };
}
