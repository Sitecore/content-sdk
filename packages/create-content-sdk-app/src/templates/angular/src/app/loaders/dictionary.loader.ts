import type { LoaderFn } from '@sitecore-content-sdk/angular';
import type { DictionaryPhrases } from '@sitecore-content-sdk/content/i18n';
import { getClient } from '../lib/sitecore-client';

/**
 * Dictionary loader: fetches dictionary phrases from Sitecore for the current site/locale.
 * Uses the lazily-initialized SitecoreClient, mirroring the Next.js pattern.
 */
export const dictionaryLoader: LoaderFn<DictionaryPhrases> = async () => {
  return getClient().getDictionary();
};
