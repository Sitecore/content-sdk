import type { EPResponse } from '@sitecore-content-sdk/analytics-core/internal';
import {
  getCloudSDKSettingsServer as getCloudSDKSettings,
  getCookieValueFromRequest,
} from '@sitecore-content-sdk/analytics-core/internal';
import type { Request } from '@sitecore-content-sdk/utils';
import { verifyEventsPackageExistence } from '../../initializer/server/initializer';
import { sendEvent } from '../send-event/sendEvent';
import type { IdentityData } from './identity-event';
import { IdentityEvent } from './identity-event';

/**
 * A function that sends an IDENTITY event to SitecoreCloud API
 * @param {Request} request - Interface with constraint for extending request
 * @param {IdentityData} identityData - The required/optional attributes in order to be send to SitecoreCloud API
 * @returns The response object that Sitecore EP returns
 */
export function identityServer(
  request: Request,
  identityData: IdentityData
): Promise<EPResponse | null> {
  verifyEventsPackageExistence();
  const settings = getCloudSDKSettings();
  const browserId: string = getCookieValueFromRequest(
    request,
    settings.cookieSettings.name.browserId
  );

  return new IdentityEvent({
    id: browserId,
    identityData,
    sendEvent,
    settings,
  }).send();
}
