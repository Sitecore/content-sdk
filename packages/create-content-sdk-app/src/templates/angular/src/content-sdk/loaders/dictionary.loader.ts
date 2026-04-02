import type { LoaderFn } from '@sitecore-content-sdk/angular';
import type { DictionaryPhrases } from '@sitecore-content-sdk/content/i18n';
import { getClient } from '../client/sitecore-client';

/**
 * Dictionary loader: fetches dictionary phrases from Sitecore for the current site/locale.
 */
export const dictionaryLoader: LoaderFn<DictionaryPhrases> = async () => {
  return await getClient().getDictionary();
};
