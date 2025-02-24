import { defineConfig } from '@sitecore-content-sdk/core/config';

export const configInput = {
  api: {
    edge: {
      contextId: 'context-id',
      clientContextId: 'client-id',
    },
    local: {
      apiHost: 'api-host.com',
      apiKey: 'api-key',
    },
  },
  defaultSite: 'unit-site',
  defaultLanguage: 'en',
  multisite: {
    enabled: true,
  },
  retries: {
    count: 3,
  },
  personalize: {
    enabled: true,
    edgeTimeout: 1000,
    cdpTimeout: 1000,
    scope: 'unit-scope',
  },
  redirects: {
    enabled: true,
    locales: ['en'],
  },
};

export default defineConfig(configInput);
