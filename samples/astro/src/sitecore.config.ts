import { defineConfig } from '@sitecore-content-sdk/atro';

export default defineConfig({
  api: {
    edge: {
      contextId: '2bzCMQpPKU6iZDaWF0eWme',
      clientContextId: '2bzCMQpPKU6iZDaWF0eWme',
      edgeUrl: 'https://edge-platform-staging.sitecore-staging.cloud',
    },
  },
  editingSecret: '2bzCMQpPKU6iZDaWF0eWme',
  defaultSite: 'site1',
  defaultLanguage: 'en',
});
