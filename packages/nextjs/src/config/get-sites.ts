import { SiteInfo } from '../site';
import sites from './injected-sites';

/**
 *
 */
export function getSites(): SiteInfo[] {
  if (sites) {
    return sites;
  }

  throw new Error('Sitecore site list is not available. Please check your setup.');
}
