import {
  getGroupSettings,
  getInitState,
  getPlugin,
  TrackingGroupSettings,
} from '@sitecore-content-sdk/core';
import { getCookieValueClientSide } from '@sitecore-content-sdk/utils';
import { PACKAGE_NAME } from '../consts';
import type { PersonalizePluginSettings } from '../plugin/personalize-plugin-base';
import type { PersonalizeData } from './personalizer';
import { Personalizer } from './personalizer';
import type { FailedCalledFlowsResponse } from './send-call-flows-request';

/**
 * Options for the personalize function
 */
interface PersonalizeOpts {
  /**
   * Timeout in milliseconds for the personalize request
   */
  timeout?: number;
}

/**
 * A function that executes an interactive experiment or web experiment over any web-based or mobile application.
 * @param {PersonalizeData} personalizeData - The required/optional attributes in order to create a flow execution
 * @param {PersonalizeOpts} opts - An object containing additional options
 * @returns {Promise<unknown | null | FailedCalledFlowsResponse>} A flow execution response
 */
export async function personalize(
  personalizeData: PersonalizeData,
  opts?: PersonalizeOpts
): Promise<unknown | null | FailedCalledFlowsResponse> {
  const initState = getInitState();
  const config = initState.config!;

  // Get browser ID cookie name from tracking group
  const trackingSettings = getGroupSettings<TrackingGroupSettings>('tracking');
  const browserId = trackingSettings?.browserIdCookieName
    ? getCookieValueClientSide(trackingSettings.browserIdCookieName)
    : undefined;

  // Get guest ID cookie name from personalize plugin settings
  const personalizePlugin = getPlugin<PersonalizePluginSettings>(PACKAGE_NAME);
  const guestId = personalizePlugin?.settings?.guestIdCookieName
    ? getCookieValueClientSide(personalizePlugin.settings.guestIdCookieName)
    : undefined;

  // Build settings object for Personalizer (compatible with legacy Settings interface)
  const settings = {
    sitecoreEdgeContextId: config.sitecoreContextId,
    sitecoreEdgeUrl: config.sitecoreEdgeUrl || 'https://edge-platform.sitecorecloud.io',
    siteName: '', // Not required for personalize API
    cookieSettings: {
      name: {
        browserId: trackingSettings?.browserIdCookieName || '',
      },
      expiryDays: 365,
    },
  };

  return new Personalizer(browserId || '', guestId).getInteractiveExperienceData(
    personalizeData,
    settings,
    window.location.search,
    {
      timeout: opts?.timeout,
    }
  );
}
