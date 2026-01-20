import { LoaderFn, DictionaryPhrases } from '@sitecore-content-sdk/angular';
import { client } from './sitecore-client';
import config from '../sitecore.config';

/**
 * Loader for fetching dictionary data.
 * This loader runs at the root of the route tree and provides
 * dictionary phrases to all child routes.
 */
export const dictionaryLoader: LoaderFn<DictionaryPhrases> = async ({ url }) => {
  console.log('dictionaryLoader called for url:', url);

  const dictionary = await client.getDictionary({
    site: config.defaultSite,
    locale: config.defaultLanguage,
  });

  return dictionary;
};
