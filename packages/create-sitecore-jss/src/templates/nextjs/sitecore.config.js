export default {
  api: {
    contextId: process.env.SITECORE_EDGE_CONTEXT_ID,
    edgeUrl: process.env.SITECORE_EDGE_URL,
  },
  defaultSite: '134',
  defaultLanguage: 'en',
  editingSecret: process.env.JSS_EDITING_SECRET,
  retries: {
    count: 3,
  },
  multisite: {
    enabled: true,
  },
  personalize: {
    enabled: true,
    scope: process.env.NEXT_PUBLIC_PERSONALIZE_SCOPE || '',
    edgeTimeout: process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT || 100,
    cdpTimeout: process.env.PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT || 100,
  },
};
