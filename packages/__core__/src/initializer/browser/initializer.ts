import { createCookieString, getCookie } from '@sitecore-content-sdk/utils';
import { fetchBrowserIdFromEdgeProxy } from '../../browser-id/fetch-browser-id-from-edge-proxy';
import { getBrowserId } from '../../browser-id/get-browser-id';
import {
  BROWSER_ID_COOKIE_NAME,
  COOKIE_NAME_PREFIX,
  DEFAULT_COOKIE_EXPIRY_DAYS,
  ErrorMessages,
  LIBRARY_VERSION,
  SITECORE_EDGE_URL,
} from '../../consts';
import { getDefaultCookieAttributes } from '../../cookie/get-default-cookie-attributes';
import { debug } from '../../debug/debug';
import { CORE_NAMESPACE } from '../../debug/namespaces';
import { getGuestId } from '../../guest-id/get-guest-id';
import type { ProxySettings } from '../../interfaces';
import type { BrowserSettings, Core, Settings } from './interfaces';
import type { PackageInitializer } from './package-initializer';

export let cloudSDKSettings: Settings;
export const enabledPackages = new Map<string, PackageInitializer>();
export let initCoreState: Promise<void> | null = null;
export let cookiesValuesFromEdge: ProxySettings | undefined;

export class CloudSDKBrowserInitializer {
  /**
   * Runs the initialization logic. Enables packages and creates cookies for CloudSDK.
   * @param {BrowserSettings} settings - Common settings for the CloudSDK.
   * @throws ErrorMessages.MV_0001
   * @throws ErrorMessages.MV_0002
   * @throws ErrorMessages.IE_0001
   * @throws ErrorMessages.IV_0001
   */
  constructor(settings: BrowserSettings) {
    if (typeof window === 'undefined') throw new Error(ErrorMessages.IE_0001);

    this.validateSettings(settings);
    cloudSDKSettings = this.createSettings(settings);
  }

  /**
   * Runs the initialization logic. Enables packages and create cookies for CloudSDK.
   */
  initialize() {
    if (!enabledPackages.size) debug(CORE_NAMESPACE)('CloudSDK was initialized with no packages');

    if (cloudSDKSettings.cookieSettings.enableBrowserCookie) initCoreState = this.createCookies();
    else initCoreState = Promise.resolve();

    this.sideEffects();

    enabledPackages.forEach((pkg) => {
      pkg.exec();
    });
  }

  /**
   * Runs any necessary side effects.
   */
  private sideEffects() {
    window.scCloudSDK = {
      ...window.scCloudSDK,
      core: {
        getBrowserId,
        getGuestId,
        settings: {
          siteName: cloudSDKSettings.siteName,
          sitecoreEdgeContextId: cloudSDKSettings.sitecoreEdgeContextId,
          sitecoreEdgeUrl: cloudSDKSettings.sitecoreEdgeUrl,
        },
        version: LIBRARY_VERSION,
      },
    };
  }

  /**
   * Validates the core settings to ensure they meet required criteria.
   * This function validates the provided core settings object to ensure that essential properties
   * such as "sitecoreEdgeContextId" and "siteName" meet specific criteria and are not empty.
   * @param {BrowserSettings} settings - The settings object to validate.
   * @throws Error with specific error codes if any required property is missing or empty.
   */
  private validateSettings(settings: BrowserSettings) {
    const { sitecoreEdgeContextId, siteName, sitecoreEdgeUrl } = settings;
    if (!sitecoreEdgeContextId || sitecoreEdgeContextId.trim().length === 0)
      throw new Error(ErrorMessages.MV_0001);

    if (!siteName || siteName.trim().length === 0) throw new Error(ErrorMessages.MV_0002);

    if (sitecoreEdgeUrl !== undefined)
      try {
        new URL(sitecoreEdgeUrl);
      } catch {
        throw new Error(ErrorMessages.IV_0001);
      }
  }

  /**
   * Creates the settings object for CloudSDK.
   * @param {BrowserSettings} settings - The browser settings to process.
   * @returns {Settings} The processed settings object.
   */
  private createSettings(settings: BrowserSettings): Settings {
    const {
      siteName,
      sitecoreEdgeContextId,
      cookieDomain,
      cookiePath,
      cookieExpiryDays,
      sitecoreEdgeUrl,
      enableBrowserCookie,
    } = settings;

    return {
      cookieSettings: {
        domain: cookieDomain,
        enableBrowserCookie: enableBrowserCookie ?? false,
        expiryDays: cookieExpiryDays || DEFAULT_COOKIE_EXPIRY_DAYS,
        name: {
          browserId: `${COOKIE_NAME_PREFIX}${BROWSER_ID_COOKIE_NAME}`,
        },
        path: cookiePath || '/',
      },
      siteName,
      sitecoreEdgeContextId,
      sitecoreEdgeUrl: sitecoreEdgeUrl ?? SITECORE_EDGE_URL,
    };
  }

  private async createCookies(): Promise<void> {
    const attributes = getDefaultCookieAttributes(
      cloudSDKSettings.cookieSettings.expiryDays,
      cloudSDKSettings.cookieSettings.domain
    );

    const browserIdCookie = getCookie(
      window.document.cookie,
      cloudSDKSettings.cookieSettings.name.browserId
    );

    if (browserIdCookie) return;

    const cookiesValues = await fetchBrowserIdFromEdgeProxy(
      cloudSDKSettings.sitecoreEdgeUrl,
      cloudSDKSettings.sitecoreEdgeContextId
    );

    document.cookie = createCookieString(
      cloudSDKSettings.cookieSettings.name.browserId,
      cookiesValues.browserId,
      attributes
    );

    cookiesValuesFromEdge = cookiesValues;
  }
}

/**
 * Gets the current CloudSDK settings.
 * @returns {Settings} The CloudSDK settings.
 * @throws ErrorMessages.IE_0012 if settings are not initialized.
 */
export function getCloudSDKSettings() {
  if (!cloudSDKSettings) throw new Error(ErrorMessages.IE_0012);
  return cloudSDKSettings;
}

/**
 * Gets an enabled package by name.
 * @param {string} packageName - The name of the package to retrieve.
 * @returns {PackageInitializer | undefined} The package initializer or undefined if not found.
 */
export function getEnabledPackage(packageName: string) {
  return enabledPackages.get(packageName);
}

export let builderInstance: null | CloudSDKBrowserInitializer = null;

/**
 * Gets the cookie values fetched from Edge.
 * @returns {ProxySettings | undefined} The proxy settings from Edge or undefined if not available.
 */
export function getCookiesValuesFromEdge() {
  return cookiesValuesFromEdge;
}

/**
 * Runs the initialization logic. Enables packages and creates cookies for CloudSDK.
 * @param {BrowserSettings} settings - Common settings for the CloudSDK.
 * @returns {CloudSDKBrowserInitializer} An instance of CloudSDKBrowserInitializer.
 * @throws ErrorMessages.MV_0001
 * @throws ErrorMessages.MV_0002
 * @throws ErrorMessages.IE_0001
 * @throws ErrorMessages.IV_0001
 */
export function CloudSDK(settings: BrowserSettings): CloudSDKBrowserInitializer {
  builderInstance = new CloudSDKBrowserInitializer(settings);
  return builderInstance;
}

/* eslint-disable @typescript-eslint/naming-convention*/
declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Personalize {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Events {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Search {}
  // eslint-disable-next-line no-unused-vars
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scCloudSDK: {
      core: Core;
      personalize: Personalize;
      events: Events;
      search: Search;
    };
  }
}
