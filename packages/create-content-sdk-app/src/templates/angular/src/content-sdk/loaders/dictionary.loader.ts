import type { LoaderFn } from '@sitecore-content-sdk/angular';
import type { DictionaryPhrases } from '@sitecore-content-sdk/content/i18n';
import { resolveLocale } from '@sitecore-content-sdk/angular';
import scConfig from '../../../sitecore.config';
import { getClient } from '../client/sitecore-client';

/**
 * Dictionary loader: fetches dictionary phrases from Sitecore for the current site/locale.
 */
export const dictionaryLoader: LoaderFn<DictionaryPhrases> = async (context) => {
  const locale = resolveLocale(context.params, scConfig.defaultLanguage ?? 'en');
  return await getClient().getDictionary({ locale });
};
