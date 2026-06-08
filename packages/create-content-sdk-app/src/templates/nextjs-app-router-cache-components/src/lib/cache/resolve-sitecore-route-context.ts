import type { SiteInfo } from '@sitecore-content-sdk/nextjs';
import sites from '.sitecore/sites.json';
import scConfig from 'sitecore.config';

export type SitecoreRouteContext = {
  site: string;
  locale: string;
};

/**
 * Resolves site and locale for Sitecore reads when route params or cached params may be missing
 * (for example during SSG `notFound()` rendering).
 */
export function resolveSitecoreRouteContext(
  partial: Partial<SitecoreRouteContext> = {}
): SitecoreRouteContext | null {
  const site =
    partial.site?.trim() ||
    scConfig.defaultSite?.trim() ||
    (sites as SiteInfo[])[0]?.name?.trim() ||
    '';
  const locale = partial.locale?.trim() || scConfig.defaultLanguage?.trim() || 'en';

  if (!site) {
    return null;
  }

  return { site, locale };
}
