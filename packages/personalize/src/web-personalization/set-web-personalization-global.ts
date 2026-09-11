import { getAnalyticsPlugin } from '@sitecore-content-sdk/analytics-core/internal';
import { getProfileId } from '../initialization/get-profile-id';
import { PACKAGE_VERSION } from '../consts';
import { WebPersonalizationOptions } from '../initialization/types';

/**
 * Core configuration values required to construct the web personalization global.
 * @internal
 */
export interface WebPersonalizationGlobalConfig {
  siteName: string;
  contextId: string;
  edgeUrl: string;
}

/**
 * Returns the browser id, read from the `sc_cid` cookie via the analytics adapter.
 * @returns {string} The browser id, or an empty string when it is not available.
 * @internal
 */
function getBrowserId(): string {
  return getAnalyticsPlugin().adapter.getClientId() || '';
}

/**
 * Populates the `window.scCloudSDK` global that the Sitecore-hosted web personalization library
 * (the `cloud-version.min.js` / `cloud-lib.min.js` scripts injected from the Personalize CDN) reads
 * at load time. That library is served by Sitecore Edge - it is not shipped with this SDK - and
 * `scCloudSDK` is the global name it looks for:
 *
 * - `scCloudSDK.personalize.settings` is read by the CDN bootstrap; an undefined value throws
 *   `Cannot read properties of undefined (reading 'personalize')`.
 * - `scCloudSDK.core.getGuestId()` / `scCloudSDK.core.getBrowserId()` provide the guest identity
 *   used to render web experiences; an undefined `core` throws
 *   `Cannot read properties of undefined (reading 'getGuestId')`.
 * - `scCloudSDK.core.settings.{siteName,sitecoreEdgeContextId,sitecoreEdgeUrl}` are used to send
 *   the WEB event back to Sitecore Edge.
 *
 * The Content SDK otherwise only sets `window.scContentSDK`, so the library found no global to read
 * and threw. This builds `window.scCloudSDK` entirely from the Content SDK's own identity functions
 * (`getClientId` for the browser id, `getProfileId` for the guest id); no additional Sitecore Edge
 * calls are made and nothing outside `@sitecore-content-sdk/*` is used.
 *
 * A `window.scCloudSDK` already registered by another script is preserved and never overridden, so
 * existing consumers keep working.
 * @param {WebPersonalizationGlobalConfig} coreConfig - The resolved core configuration (site name, context id, edge url).
 * @param {WebPersonalizationOptions} webPersonalization - The resolved web personalization options.
 * @internal
 */
export function setWebPersonalizationGlobal(
  coreConfig: WebPersonalizationGlobalConfig,
  webPersonalization: WebPersonalizationOptions
): void {
  if (typeof window === 'undefined') return;

  const existing = window.scCloudSDK;

  window.scCloudSDK = {
    ...existing,
    core: {
      getBrowserId,
      getGuestId: getProfileId,
      settings: {
        siteName: coreConfig.siteName,
        sitecoreEdgeContextId: coreConfig.contextId,
        sitecoreEdgeUrl: coreConfig.edgeUrl,
      },
      version: PACKAGE_VERSION,
      // Preserve a runtime another script may have registered; don't clobber it.
      ...existing?.core,
    },
    personalize: {
      version: PACKAGE_VERSION,
      // Copy the options so the library writing guestId/params onto settings does not mutate the
      // options exposed on window.scContentSDK.personalize.options.
      settings: { ...webPersonalization },
      ...existing?.personalize,
    },
  };
}

declare global {
  // eslint-disable-next-line no-unused-vars
  interface WebPersonalizationGlobalCore {
    getBrowserId: () => string;
    getGuestId: () => Promise<string>;
    settings: {
      siteName: string;
      sitecoreEdgeContextId: string;
      sitecoreEdgeUrl: string;
    };
    version: string;
  }
  // eslint-disable-next-line no-unused-vars
  interface WebPersonalizationGlobalPersonalize {
    settings: WebPersonalizationOptions;
    version: string;
  }
  // eslint-disable-next-line no-unused-vars
  interface WebPersonalizationGlobal {
    core: WebPersonalizationGlobalCore;
    personalize: WebPersonalizationGlobalPersonalize;
  }
  // eslint-disable-next-line no-unused-vars
  interface Window {
    scCloudSDK?: WebPersonalizationGlobal;
  }
}
