import { collectSitecorePageCacheTags, ErrorPage, type Page } from '@sitecore-content-sdk/nextjs';
import { cacheTag } from 'next/cache';
import client from 'src/lib/sitecore-client';
import scConfig from 'sitecore.config';

/**
 * Stable synthetic pathnames for cache tags so error-page reads do not share the home route (`_`) tag
 * with normal layout data for `/`.
 */
const NOT_FOUND_TAG_PATH = '/__sitecore-content-sdk/error/not-found';
const SERVER_ERROR_TAG_PATH = '/__sitecore-content-sdk/error/server-error';

function personalizedPathnameForErrorCode(code: ErrorPage): string {
  switch (code) {
    case ErrorPage.NotFound:
      return NOT_FOUND_TAG_PATH;
    case ErrorPage.InternalServerError:
      return SERVER_ERROR_TAG_PATH;
    default:
      return NOT_FOUND_TAG_PATH;
  }
}

type GetSitecoreErrorPageParams = {
  site: string;
  locale: string;
  code: ErrorPage;
};

type CachedSitecoreErrorPageParams = {
  site: string;
  locale: string;
  code: ErrorPage;
};

async function getCachedSitecoreErrorPage(params: CachedSitecoreErrorPageParams): Promise<Page | null> {
  'use cache';

  const { site, locale, code } = params;
  const page = await client.getErrorPage(code, { site, locale });
  const personalizedPathname = personalizedPathnameForErrorCode(code);

  const tags = collectSitecorePageCacheTags({
    site,
    locale,
    personalizedPathname,
    route: page?.layout?.sitecore?.route,
  });

  for (const tag of tags) {
    cacheTag(tag);
  }

  return page;
}

/**
 * Loads Sitecore error pages with Next.js Cache Components and the same tag strategy as
 * {@link getSitecorePage}, so webhook / `revalidateTag` flows can invalidate updated error experiences.
 * Returns `null` when site is missing or the error page fetch fails.
 */
export async function getSitecoreErrorPage(params: GetSitecoreErrorPageParams): Promise<Page | null> {
  const site = params.site?.trim();
  const locale = params.locale?.trim() || scConfig.defaultLanguage;

  if (!site) {
    return null;
  }

  const resolved = { site, locale, code: params.code };

  try {
    return await getCachedSitecoreErrorPage(resolved);
  } catch {
    try {
      return await client.getErrorPage(params.code, { site, locale });
    } catch {
      return null;
    }
  }
}
