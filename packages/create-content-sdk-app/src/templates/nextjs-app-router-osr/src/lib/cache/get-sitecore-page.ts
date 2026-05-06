import { collectSitecorePageCacheTags, Page } from '@sitecore-content-sdk/nextjs';
import { cacheTag } from 'next/cache';
import client from 'src/lib/sitecore-client';

type GetSitecorePageParams = {
  site: string;
  locale: string;
  path: string[];
};

/**
 * Gets page data using Next.js Cache Components and deterministic Sitecore cache tags.
 */
export async function getSitecorePage(params: GetSitecorePageParams): Promise<Page | null> {
  'use cache';

  const { site, locale, path } = params;
  const page = await client.getPage(path, { site, locale });

  const personalizedPathname = path.length ? `/${path.join('/')}` : '/';
  const tags = collectSitecorePageCacheTags({
    site,
    locale,
    personalizedPathname,
    route: page?.layout?.sitecore?.route ?? {},
  });

  for (const tag of tags) {
    cacheTag(tag);
  }

  return page;
}
