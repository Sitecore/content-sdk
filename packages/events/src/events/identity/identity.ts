import type { EPResponse } from '@sitecore-content-sdk/analytics-core/internal';
import { getCloudSDKSettingsBrowser as getCloudSDKSettings } from '@sitecore-content-sdk/analytics-core/internal';
import { getCookieValueClientSide } from '@sitecore-content-sdk/analytics-core/utils';
import { awaitInit } from '../../initializer/browser/initializer';
import { sendEvent } from '../send-event/sendEvent';
import type { IdentityData } from './identity-event';
import { IdentityEvent } from './identity-event';

/**
 * A function that sends an IDENTITY event to SitecoreCloud API
 * @param {IdentityData} identityData - The required/optional attributes in order to be send to SitecoreCloud API
 * @returns The response object that Sitecore EP returns
 */
export async function identity(identityData: IdentityData): Promise<EPResponse | null> {
  await awaitInit();

  const settings = getCloudSDKSettings();
  const id = getCookieValueClientSide(settings.cookieSettings.name.browserId);

  return new IdentityEvent({
    id,
    identityData,
    sendEvent,
    settings,
  }).send();
}
