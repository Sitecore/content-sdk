import type { EPResponse } from '@sitecore-content-sdk/__core__/internal';
import { getCloudSDKSettingsBrowser as getCloudSDKSettings } from '@sitecore-content-sdk/__core__/internal';
import { getCookieValueClientSide } from '@sitecore-content-sdk/utils';
import { awaitInit } from '../../initializer/browser/initializer';
import { sendEvent } from '../send-event/sendEvent';
import type { PageViewData } from './page-view-event';
import { PageViewEvent } from './page-view-event';

/**
 * A function that sends a VIEW event to SitecoreCloud API
 * @param {PageViewData} [pageViewData] - The optional attributes in order to be send to SitecoreCloud API
 * This object will be flattened and sent in the ext object of the payload
 * @returns The response object that Sitecore EP returns
 */
export async function pageView(pageViewData?: PageViewData): Promise<EPResponse | null> {
  await awaitInit();

  const settings = getCloudSDKSettings();
  const id = getCookieValueClientSide(settings.cookieSettings.name.browserId);

  return new PageViewEvent({
    id,
    pageViewData,
    searchParams: window.location.search,
    sendEvent,
    settings,
  }).send();
}
