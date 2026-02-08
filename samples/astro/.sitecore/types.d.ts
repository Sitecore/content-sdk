import type { SiteInfo } from '@sitecore-content-sdk/astro';

declare module '.sitecore/sites.json' {
  const sites: SiteInfo[];
  export default sites;
}
