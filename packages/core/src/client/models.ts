import { SitecoreConfig } from '../config';
import { SiteInfo } from '../site';

export type SitecoreClientInit = Omit<SitecoreConfig, 'multisite' | 'redirects' | 'personalize'> & {
  sites: SiteInfo[];
};
