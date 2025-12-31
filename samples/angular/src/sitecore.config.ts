import { defineConfig } from '@sitecore-content-sdk/angular';

export default defineConfig({
  api: {
    edge: {
      contextId: 'sitecore',
      clientContextId: 'sitecore',
      edgeUrl: 'https://edge.sitecore.com',
    },
  },
  editingSecret: 'secret',
  defaultSite: 'site1',
  defaultLanguage: 'en',
});
