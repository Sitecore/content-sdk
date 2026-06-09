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
  const itemPath = sitecore?.context?.itemPath;
  const personalizedPathname =
    typeof itemPath === 'string' && itemPath
      ? itemPath
      : sitecore?.route?.name
        ? `/${sitecore.route.name}`
        : undefined;

  const tags = collectSitecorePageCacheTags({
    site,
    locale,
    ...(personalizedPathname !== undefined ? { personalizedPathname } : {}),
    route: sitecore?.route,
  });

  for (const tag of tags) {
    cacheTag(tag);
  }

  return page;
}
