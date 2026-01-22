import { client } from '../../lib/sitecore-client';
import config from '../../sitecore.config';

/**
 * Server-side data loader for the shared layout.
 * Loads dictionary data once for all child pages.
 */
export const load = async () => {
  console.log('Analog layout server loader - loading dictionary');

  const dictionary = await client.getDictionary({
    site: config.defaultSite,
    locale: config.defaultLanguage,
  });

  return {
    dictionary,
  };
};
