import { DictionaryPhrases } from '@sitecore-content-sdk/content/i18n';
import { Page } from '@sitecore-content-sdk/content/client';
import { ComponentPropsCollection } from './component-props';

/**
 * The interface for the application page props.
 * @public
 */
export type SitecorePageProps = {
  page: Page | null;
  dictionary?: DictionaryPhrases;
  componentProps?: ComponentPropsCollection;
  notFound?: boolean;
};
