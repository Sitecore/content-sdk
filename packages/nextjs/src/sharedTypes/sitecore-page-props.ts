import { DictionaryPhrases } from '@sitecore-content-sdk/core/i18n';
import { NextjsPage } from '../client/index.js';

export type SitecorePageProps = NextjsPage & {
  dictionary: DictionaryPhrases;
};
