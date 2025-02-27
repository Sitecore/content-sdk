import { SitecoreConfig } from '../config';
import { DictionaryPhrases } from '../i18n';
import { LayoutServiceData } from '../layout';
import { HTMLLink } from '../models';
import { SiteInfo } from '../site';

export type FetchOptions = SitecoreConfig['retries'];

// The same type returned from getPage and getPreviewPage
// represent a Page model returned from edge
export type Page = {
  layout: LayoutServiceData;
  site?: SiteInfo;
  locale: string;
  dictionary?: DictionaryPhrases;
  headLinks: HTMLLink[];
  notFound?: boolean;
};

export type SitecoreClientInit = Omit<SitecoreConfig, 'multisite' | 'redirects' | 'personalize'> & {
  sites: SiteInfo[];
};
