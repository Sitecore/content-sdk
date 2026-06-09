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
  const page = await client.getErrorPage(code, { site, locale });

  const sitecore = page?.layout?.sitecore;
  let path: string[] | undefined;
  const itemPath = sitecore?.context?.itemPath;
  if (typeof itemPath === 'string' && itemPath.trim()) {
    const normalized = itemPath.trim();
    path =
      normalized === '/'
        ? []
        : (normalized.startsWith('/') ? normalized.slice(1) : normalized).split('/').filter(Boolean);
  } else {
    const routeName = sitecore?.route?.name?.trim();
    if (routeName) {
      path = [routeName];
    }
  }

  const tags = collectSitecorePageCacheTags({
    site,
    locale,
    ...(path !== undefined ? { path } : {}),
    route: sitecore?.route,
  });

  for (const tag of tags) {
    cacheTag(tag);
  }

  return page;
}
