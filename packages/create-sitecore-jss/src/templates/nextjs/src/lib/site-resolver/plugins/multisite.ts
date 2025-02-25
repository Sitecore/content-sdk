import { SiteInfo } from '@sitecore-content-sdk/nextjs/site';
import { SiteResolverPlugin } from '..';
import siteCollection from 'temp/sites';

class MultisitePlugin implements SiteResolverPlugin {
  exec(sites: SiteInfo[]): SiteInfo[] {
    // Add preloaded sites
    sites.push(...siteCollection);
    return sites;
  }
}

export const multisitePlugin = new MultisitePlugin();
