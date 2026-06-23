import { collectSitecorePageCacheTags, ErrorPage, type Page } from '@sitecore-content-sdk/nextjs';
import { cacheTag } from 'next/cache';
import client from 'src/lib/sitecore-client';

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

  let page: Page | null;
  try {
    page = await client.getErrorPage(code, { site, locale });
  } catch {
    return null;
  }

  const sitecore = page?.layout?.sitecore;
  const itemPath = sitecore?.context?.itemPath;

  const tags = collectSitecorePageCacheTags({
    site,
    locale,
    path: typeof itemPath === 'string' && itemPath ? itemPath : undefined,
    route: sitecore?.route,
  });

  for (const tag of tags) {
    cacheTag(tag);
  }

  return page;
}
