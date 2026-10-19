import {
  collectSitecorePageCacheTags,
  getPersonalizeTokens,
  Page,
} from '@sitecore-content-sdk/nextjs';
import { cacheTag } from 'next/cache';
import { headers } from 'next/headers';
import client from 'src/lib/sitecore-client';

type GetSitecorePageParams = {
  site: string;
  locale: string;
  path: string[];
};

/**
 * Gets page data using Next.js Cache Components and deterministic Sitecore cache tags.
 * Requests that carry dynamic content tokens (forwarded by PersonalizeProxy) contain visitor data,
 * so they are rendered per request and never stored in the shared cache.
 */
export async function getSitecorePage(params: GetSitecorePageParams): Promise<Page | null> {
  const tokens = await getPersonalizeTokens(params.path, headers);
  if (tokens) {
    return client.getPage(params.path, { site: params.site, locale: params.locale, tokens });
  }
  return getCachedSitecorePage(params);
}

/**
 * Cached page data for renders without visitor tokens.
 */
async function getCachedSitecorePage(params: GetSitecorePageParams): Promise<Page | null> {
  'use cache';

  const { site, locale, path } = params;
  const page = await client.getPage(path, { site, locale });

  const tags = collectSitecorePageCacheTags({
    site,
    locale,
    path: client.parsePath(path),
    route: page?.layout?.sitecore?.route,
  });

  for (const tag of tags) {
    cacheTag(tag);
  }

  return page;
}
