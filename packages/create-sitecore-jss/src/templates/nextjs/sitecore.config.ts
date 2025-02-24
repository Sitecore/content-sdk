import { defineConfig } from '@sitecore-content-sdk/nextjs/config';
/**
 * @type {import('@sitecore-content-sdk/nextjs/config').SitecoreConfig}
 */
export default defineConfig({
  api: {
    edge: {
      contextId: process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID || process.env.SITECORE_EDGE_CONTEXT_ID,
      clientContextId: process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID,
      edgeUrl: process.env.NEXT_PUBLIC_SITECORE_EDGE_URL || process.env.SITECORE_EDGE_URL,
    },
    local: {
      apiKey: process.env.NEXT_PUBLIC_SITECORE_API_KEY || process.env.SITECORE_API_KEY,
      apiHost: process.env.NEXT_PUBLIC_SITECORE_API_HOST || process.env.SITECORE_API_HOST,
    },
  },
  defaultSite: process.env.SITECORE_SITE_NAME || 'sitecore-headless',
  defaultLanguage: process.env.DEFAULT_LANGUAGE || 'en',
  editingSecret: process.env.JSS_EDITING_SECRET,
  redirects: {
    enabled: process.env.NODE_ENV !== 'development',
  },
  multisite: {
    enabled: true,
    useCookieResolution: () => process.env.VERCEL_ENV === 'preview',
  },
  personalize: {
    enabled: true,
    scope: process.env.NEXT_PUBLIC_PERSONALIZE_SCOPE,
    edgeTimeout: process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT
      ? parseInt(process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT, 10)
      : 400,
    cdpTimeout: process.env.PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT
      ? parseInt(process.env.PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT, 10)
      : 400,
  },
});
