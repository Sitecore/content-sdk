import { DictionaryPhrases } from '@sitecore-content-sdk/core/i18n';
import { NextjsPage } from '../client';

export type SitecorePageProps = NextjsPage & {
  dictionary: DictionaryPhrases;
};
