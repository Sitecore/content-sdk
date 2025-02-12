import { SiteInfo } from '@sitecore-jss/sitecore-jss-nextjs/site';
import { SiteResolverPlugin } from '..';

class MultisitePlugin implements SiteResolverPlugin {
  exec(sites: SiteInfo[]): SiteInfo[] {
    // Add preloaded sites
    // TODO: load sites from separate file

    return sites;
  }
}

export const multisitePlugin = new MultisitePlugin();
