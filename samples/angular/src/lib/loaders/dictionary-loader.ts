import { LoaderFn, DictionaryPhrases, getLanguageFromParams } from '@sitecore-content-sdk/angular';
import { client } from '../sitecore-client';
import { resolveSite } from '../site-resolver';
import config from '../../sitecore.config';

export const dictionaryLoader: LoaderFn<DictionaryPhrases> = async ({
  url,
  params,
  requestContext,
}) => {
  const locale = getLanguageFromParams(params, config.defaultLanguage);

  // Resolve the current site from request context
  const { site, source } = resolveSite(requestContext || {});
  console.log(
    `dictionaryLoader called for url: ${url}, locale: ${locale}, site: ${site.name} (via ${source})`
  );

  const dictionary = await client.getDictionary({
    site: site.name,
    locale,
  });

  return dictionary;
};
