import { defineConfig } from '@sitecore-content-sdk/nextjs/config';
/**
 * @type {import('@sitecore-content-sdk/nextjs/config').SitecoreConfig}
 */
export default defineConfig({
  api: {
    edge: {
      contextId:
        process.env.SITECORE_EDGE_CONTEXT_ID || process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID,
      clientContextId: process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID,
      edgeUrl: process.env.SITECORE_EDGE_URL || process.env.NEXT_PUBLIC_SITECORE_EDGE_URL,
    },
    local: {
      apiKey: process.env.NEXT_PUBLIC_SITECORE_API_KEY,
      apiHost: process.env.NEXT_PUBLIC_SITECORE_API_HOST,
    },
  },
  defaultSite: process.env.NEXT_PUBLIC_SITECORE_SITE_NAME || 'sitecore-headless',
  defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
  editingSecret: process.env.JSS_EDITING_SECRET,
  redirects: {},
  multisite: {
    enabled: true,
    useCookieResolution: () => process.env.VERCEL_ENV === 'preview',
  },
  personalize: {
    scope: process.env.NEXT_PUBLIC_PERSONALIZE_SCOPE,
    edgeTimeout: parseInt(process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT || '0', 10),
    cdpTimeout: parseInt(process.env.PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT || '0', 10),
  },
});
