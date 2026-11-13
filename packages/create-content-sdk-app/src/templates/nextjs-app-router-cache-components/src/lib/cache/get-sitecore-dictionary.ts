import { buildSitecoreDictionaryCacheTag, DictionaryPhrases } from '@sitecore-content-sdk/nextjs';
import { cacheLife, cacheTag } from 'next/cache';
import client from 'src/lib/sitecore-client';

type GetSitecoreDictionaryParams = {
  site: string;
  locale: string;
};

/**
 * Fetches dictionary phrases using Next.js Cache Components and a deterministic dictionary tag.
 */
export async function getSitecoreDictionary(params: GetSitecoreDictionaryParams): Promise<DictionaryPhrases> {
  'use cache';

  // Update the cacheLife profile to control the lifespan of Cache Components.
  // NextJS defaults to the 'default' profile if not called, we explicity call it to make the policy clear.
  // https://nextjs.org/docs/app/api-reference/functions/cacheLife
  cacheLife('default');

  const { site, locale } = params;
  cacheTag(buildSitecoreDictionaryCacheTag({ site, locale }));

  return client.getDictionary({ site, locale });
}
