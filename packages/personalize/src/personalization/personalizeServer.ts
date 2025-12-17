import {
  getGroupSettings,
  getInitState,
  getPlugin,
  TrackingGroupSettings,
} from '@sitecore-content-sdk/core';
import { PACKAGE_NAME } from '../consts';
import type { PersonalizePluginSettings } from '../plugin/personalize-plugin-base';
import type { PersonalizeData } from './personalizer';
import { Personalizer } from './personalizer';
import type { FailedCalledFlowsResponse } from './send-call-flows-request';

/**
 * Options for the personalizeServer method
 */
interface PersonalizeServerOpts {
  /**
   * Timeout in milliseconds for the personalize request
   */
  timeout?: number;
  /**
   * User agent string for the request
   */
  userAgent?: string;
}

/**
 * A function that executes an interactive experiment or web experiment over any web-based or mobile application.
 * This server-side version uses the init state environment for cookie access.
 * @param {PersonalizeData} personalizeData - The required/optional attributes in order to create a flow execution
 * @param {PersonalizeServerOpts} opts - An optional object containing additional options such as timeout.
 * Used to abort the request to execute an interactive experiment or web experiment.
 * @returns {Promise<unknown | null | FailedCalledFlowsResponse>} A flow execution response
 */
export function personalizeServer(
  personalizeData: PersonalizeData,
  opts?: PersonalizeServerOpts
): Promise<unknown | null | FailedCalledFlowsResponse> {
  const initState = getInitState();
  const config = initState.config!;
  const environment = initState.environment;

  // Get browser ID cookie name from tracking group
  const trackingSettings = getGroupSettings<TrackingGroupSettings>('tracking');
  const browserId = trackingSettings?.browserIdCookieName
    ? environment.getCookie?.(trackingSettings.browserIdCookieName)
    : undefined;

  // Get guest ID cookie name from personalize plugin settings
  const personalizePlugin = getPlugin<PersonalizePluginSettings>(PACKAGE_NAME);
  const guestId = personalizePlugin?.settings?.guestIdCookieName
    ? environment.getCookie?.(personalizePlugin.settings.guestIdCookieName)
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

  // Get search params from environment if available
  const getSearchParams = environment.getSearchParams as
    | (() => URLSearchParams | undefined)
    | undefined;
  const searchParams = getSearchParams?.()?.toString() || '';

  return new Personalizer(browserId || '', guestId).getInteractiveExperienceData(
    personalizeData,
    settings,
    searchParams ? `?${searchParams}` : '',
    {
      timeout: opts?.timeout,
      userAgent: opts?.userAgent,
    }
  );
}
