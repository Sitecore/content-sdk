import { collectSitecorePageCacheTags, ErrorPage, type Page } from '@sitecore-content-sdk/nextjs';
import { cacheTag } from 'next/cache';
import client from 'src/lib/sitecore-client';

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

/**
 * Loads Sitecore error pages with Next.js Cache Components and the same tag strategy as
 * {@link getSitecorePage}, so webhook / `revalidateTag` flows can invalidate updated error experiences.
 */
export async function getSitecoreErrorPage(params: GetSitecoreErrorPageParams): Promise<Page | null> {
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
