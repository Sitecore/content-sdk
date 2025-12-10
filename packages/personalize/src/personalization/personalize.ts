import {
  getCloudSDKSettingsBrowser as getCloudSDKSettings,
  getEnabledPackageBrowser as getEnabledPackage,
} from '@sitecore-content-sdk/__core__/internal';
import { getCookieValueClientSide } from '@sitecore-content-sdk/utils';
import { PACKAGE_NAME } from '../consts';
import { awaitInit } from '../initializer/browser/initializer';
import type { PersonalizeSettings } from '../initializer/browser/interfaces';
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
  await awaitInit();

  const cloudSDKSettings = getCloudSDKSettings();
  const personalizeSettings = getEnabledPackage(PACKAGE_NAME)?.settings as PersonalizeSettings;
  const browserId = getCookieValueClientSide(cloudSDKSettings.cookieSettings.name.browserId);
  const guestId = getCookieValueClientSide(personalizeSettings.cookieSettings.name.guestId);

  return new Personalizer(browserId, guestId).getInteractiveExperienceData(
    personalizeData,
    cloudSDKSettings,
    window.location.search,
    {
      timeout: opts?.timeout,
    }
  );
}
