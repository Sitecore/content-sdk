import { defineConfig } from '@sitecore-content-sdk/atro';

export default defineConfig({
  api: {
    edge: {
      contextId: '3w3aG9e6AFKr1asmzeERJa',
      clientContextId: '3w3aG9e6AFKr1asmzeERJa',
      edgeUrl: 'https://edge-platform-staging.sitecore-staging.cloud',
    },
  },
  editingSecret: '3merRz9GitzaP4gklUDcnR',
  defaultSite: 'site1',
  defaultLanguage: 'en',
});
