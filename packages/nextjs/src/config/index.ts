import { loadConfig, SitecoreConfig } from '@sitecore-content-sdk/core/config';
export { SitecoreConfig, initApp, sites } from '@sitecore-content-sdk/core/config';
// default env values stop working in browser
// TODO: adjust this when separating server and client edge context details
const nextConfig = {
  api: {
    edge: {
      contextId: process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID || '',
      edgeUrl:
        process.env.NEXT_PUBLIC_SITECORE_EDGE_URL || 'https://edge-platform.sitecorecloud.io',
    },
    local: {
      apiKey: process.env.NEXT_PUBLIC_SITECORE_API_KEY || '',
      apiHost: process.env.NEXT_PUBLIC_SITECORE_API_HOST || '',
    },
  },
  defaultSite: process.env.NEXT_PUBLIC_SITECORE_SITE_NAME || 'jss',
};
export const runtimeConfig = loadConfig(nextConfig as SitecoreConfig);
