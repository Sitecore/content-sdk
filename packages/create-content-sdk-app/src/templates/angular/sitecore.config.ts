import { defineConfig } from '@sitecore-content-sdk/angular';
import { environment } from './src/environments/environment';

const sc = environment.sitecore;

/**
 * Sitecore configuration driven by generated environment.
 * @see scripts/generate-environment.ts
 * @see https://doc.sitecore.com/xmc/en/developers/content-sdk/the-sitecore-configuration-file.html
 */
export default defineConfig({
  api: {
    edge: {
      contextId: sc.edgeContextId,
      clientContextId: sc.edgeClientContextId || undefined,
      edgeUrl: sc.edgePlatformHostname || undefined,
    },
    local: {
      apiKey: sc.apiKey,
      apiHost: sc.apiHost,
    },
  },
  editingSecret: sc.editingSecret || undefined,
  defaultSite: sc.defaultSite,
  defaultLanguage: sc.defaultLanguage || 'en',
  personalize: {
    scope: sc.personalizeScope || undefined,
    edgeTimeout: sc.personalizeEdgeTimeout ? parseInt(sc.personalizeEdgeTimeout, 10) : undefined,
    cdpTimeout: sc.personalizeCdpTimeout ? parseInt(sc.personalizeCdpTimeout, 10) : undefined,
  },
});
