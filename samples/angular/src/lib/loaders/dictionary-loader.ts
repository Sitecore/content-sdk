import { LoaderFn, DictionaryPhrases, getLanguageFromParams } from '@sitecore-content-sdk/angular';
import { client } from '../sitecore-client';
import config from '../../sitecore.config';

export const dictionaryLoader: LoaderFn<DictionaryPhrases> = async ({ url, params }) => {
  const locale = getLanguageFromParams(params, config.defaultLanguage);
  console.log('dictionaryLoader called for url:', url, 'locale:', locale);

  const dictionary = await client.getDictionary({
    site: config.defaultSite,
    locale,
  });

  return dictionary;
};
