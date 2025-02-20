import { SiteInfo } from "../site/models";

export let sites: SiteInfo[] = [];

export let components = {};

/**
 * Initialize app with initial data
 * @param {SiteInfo[]} sitesList list of sites (usually retrieved at build time)
 * @param {Map<string, unknown>} componentsList list of component implementation for component resolver
 */
export const initApp = (sitesList: SiteInfo[], componentsList?: Map<string, unknown>) => {
  sites = sitesList;
  components = componentsList || {};
};
