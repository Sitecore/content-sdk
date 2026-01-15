import type { EPResponse } from '@sitecore-content-sdk/analytics-core/internal';
import {
  getCloudSDKSettingsServer,
  getCookieValueFromRequest,
} from '@sitecore-content-sdk/analytics-core/internal';
import type { Request } from '@sitecore-content-sdk/utils';
import { verifyEventsPackageExistence } from '../../initializer/server/initializer';
import { sendEvent } from '../send-event/sendEvent';
import { CustomEvent } from './custom-event';
import type { EventData } from './custom-event';

/**
 * A function that sends an event to SitecoreCloud API with the specified type
 * @param {T} request - Interface with constraint for extending request
 * @param {EventData} eventData - The required/optional attributes in order to be send to SitecoreCloud API
 * @returns The response object that Sitecore EP returns
 */
export function eventServer<T extends Request>(
  request: T,
  eventData: EventData
): Promise<EPResponse | null> {
  verifyEventsPackageExistence();
  const settings = getCloudSDKSettingsServer();
  const browserId: string = getCookieValueFromRequest(
    request,
    settings.cookieSettings.name.browserId
  );

  return new CustomEvent({
    eventData,
    id: browserId,
    sendEvent,
    settings,
  }).send();
}
