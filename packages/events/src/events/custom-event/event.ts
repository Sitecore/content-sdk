import type { EPResponse } from '@sitecore-content-sdk/analytics-core/internal';
import { getCloudSDKSettingsBrowser as getCloudSDKSettings } from '@sitecore-content-sdk/analytics-core/internal';
import { getCookieValueClientSide } from '@sitecore-content-sdk/utils';
import { awaitInit } from '../../initializer/browser/initializer';
import { sendEvent } from '../send-event/sendEvent';
import { CustomEvent } from './custom-event';
import type { EventData } from './custom-event';

/**
 * A function that sends an event to SitecoreCloud API with the specified type
 * @param {EventData} eventData - The required/optional attributes in order to be send to SitecoreCloud API
 * @returns The response object that Sitecore EP returns
 */
export async function event(eventData: EventData): Promise<EPResponse | null> {
  await awaitInit();

  const settings = getCloudSDKSettings();
  const id = getCookieValueClientSide(settings.cookieSettings.name.browserId);

  return new CustomEvent({
    eventData,
    id,
    sendEvent,
    settings: settings,
  }).send();
}
