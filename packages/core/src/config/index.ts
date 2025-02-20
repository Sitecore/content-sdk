import { loadConfig } from './sitecore-config';
export { initSitecore, sites, components, SitecoreIntializationOptions } from './init-sitecore';
export { loadConfig, SitecoreConfig } from './sitecore-config';
// separate export to have more controlled unit tests
export const runtimeConfig = loadConfig();
