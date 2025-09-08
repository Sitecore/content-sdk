import { DictionaryPhrases } from '@sitecore-content-sdk/core/i18n';
import { Page } from '@sitecore-content-sdk/core/client';
import { ComponentPropsCollection } from './component-props';

export type SitecorePageProps = {
  page: Page | null;
  dictionary?: DictionaryPhrases;
  componentProps?: ComponentPropsCollection;
  notFound?: boolean;
};
