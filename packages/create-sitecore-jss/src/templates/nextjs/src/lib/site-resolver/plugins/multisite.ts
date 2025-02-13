import { SiteInfo } from '@sitecore-jss/sitecore-jss-nextjs/site';
import { SiteResolverPlugin } from '..';
import sitesJson from 'temp/sites';

class MultisitePlugin implements SiteResolverPlugin {
  exec(sites: SiteInfo[]): SiteInfo[] {
    // Add preloaded sites
    sites.push(...(sitesJson as SiteInfo[]));
    return sites;
  }
}

export const multisitePlugin = new MultisitePlugin();
