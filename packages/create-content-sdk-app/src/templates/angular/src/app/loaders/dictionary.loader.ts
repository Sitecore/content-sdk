import type { LoaderFn } from '@sitecore-content-sdk/angular';
import type { DictionaryPhrases } from '@sitecore-content-sdk/content/i18n';
import { SITECORE_CLIENT_TOKEN } from '@sitecore-content-sdk/angular';
import { inject } from '@angular/core';

/**
 * Dictionary loader: fetches dictionary phrases from Sitecore for the current site/locale.
 * Uses the injected SitecoreClient, mirroring the Next.js pattern.
 */
export const dictionaryLoader: LoaderFn<DictionaryPhrases> = async () => {
  const client = inject(SITECORE_CLIENT_TOKEN);
  return client.getDictionary();
};
