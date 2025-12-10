import type { EPResponse } from '@sitecore-content-sdk/__core__/internal';
import {
  getCloudSDKSettingsServer,
  getCookieValueFromRequest,
} from '@sitecore-content-sdk/__core__/internal';
import type { Request } from '@sitecore-content-sdk/utils';
import { verifyEventsPackageExistence } from '../../initializer/server/initializer';
import { sendEvent } from '../send-event/sendEvent';
import type { PageViewData } from './page-view-event';
import { PageViewEvent } from './page-view-event';

/**
 * A function that sends a VIEW event to SitecoreCloud API
 * @param {T} request - Interface with constraint for extending request
 * @param {PageViewData} [pageViewData] - The required/optional attributes in order to be send to SitecoreCloud API
 * @returns The response object that Sitecore EP returns
 */
export function pageViewServer<T extends Request>(
  request: T,
  pageViewData?: PageViewData
): Promise<EPResponse | null> {
  verifyEventsPackageExistence();
  const settings = getCloudSDKSettingsServer();
  const browserId: string = getCookieValueFromRequest(
    request,
    settings.cookieSettings.name.browserId
  );

  // Host is irrelevant but necessary to support relative URL
  const requestUrl = new URL(request.url as string, `https://localhost`);

  return new PageViewEvent({
    id: browserId,
    pageViewData,
    searchParams: requestUrl.search,
    sendEvent,
    settings,
  }).send();
}
