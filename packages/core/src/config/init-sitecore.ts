import { SiteInfo } from '../site/models';

export let sites: SiteInfo[] = [];

export let components = {};

export type SitecoreIntializationOptions = {
  sites: SiteInfo[];
  components?: Map<string, unknown>;
};

/**
 * Initialize app with initial data
 * @param {SitecoreIntializationOptions} options initial site, component and other data for app initialization
 */
export const initSitecore = (options: SitecoreIntializationOptions) => {
  sites = options.sites;
  components = options.components || {};
};
