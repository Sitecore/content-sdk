import { loadConfig } from './sitecore-config';
export { initApp, sites, components } from './init-app';
export { loadConfig, SitecoreConfig } from './sitecore-config';
// separate export to have more controlled unit tests
export const runtimeConfig = loadConfig();
