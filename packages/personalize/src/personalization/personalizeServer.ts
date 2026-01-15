import {
  getCloudSDKSettingsServer,
  getCookieValueFromRequest,
  getEnabledPackageServer,
} from '@sitecore-content-sdk/analytics-core/internal';
import type { Settings as CloudSDKSettings } from '@sitecore-content-sdk/analytics-core/server';
import type { Request } from '@sitecore-content-sdk/utils';
import { isNextJsMiddlewareRequest } from '@sitecore-content-sdk/utils';
import { PACKAGE_NAME } from '../consts';
import type { PersonalizeSettings } from '../initializer/browser/interfaces';
import { verifyPersonalizePackageExistence } from '../initializer/server/initializer';
import type { PersonalizeData } from './personalizer';
import { Personalizer } from './personalizer';
import type { FailedCalledFlowsResponse } from './send-call-flows-request';

/**
 * A function that executes an interactive experiment or web experiment over any web-based or mobile application.
 * @param {T} request - The request object, either a Middleware Request or an HTTP Request
 * @param {PersonalizeData} personalizeData - The required/optional attributes in order to create a flow execution
 * @param {PersonalizeServerOpts} opts - An optional object containing additional options such as timeout.
 * Used to abort the request to execute an interactive experiment or web experiment.
 * @returns {Promise<unknown | null | FailedCalledFlowsResponse>} A flow execution response
 */
export function personalizeServer<T extends Request>(
  request: T,
  personalizeData: PersonalizeData,
  opts?: PersonalizeServerOpts
): Promise<unknown | null | FailedCalledFlowsResponse> {
  verifyPersonalizePackageExistence();
  const requestUrl = new URL(request.url as string, `https://localhost`);
  const userAgent = isNextJsMiddlewareRequest(request)
    ? request.headers.get('user-agent')
    : request.headers['user-agent'];

  const settings: CloudSDKSettings = getCloudSDKSettingsServer();

  const personalizeSettings = getEnabledPackageServer(PACKAGE_NAME)
    ?.settings as PersonalizeSettings;

  const browserId: string = getCookieValueFromRequest(
    request,
    settings.cookieSettings.name.browserId
  );
  const guestId: string = getCookieValueFromRequest(
    request,
    personalizeSettings.cookieSettings.name.guestId
  );

  return new Personalizer(browserId, guestId).getInteractiveExperienceData(
    personalizeData,
    settings,
    requestUrl.search,
    {
      timeout: opts?.timeout,
      userAgent,
    }
  );
}

/**
 * Options for the personalizeServer method
 */
interface PersonalizeServerOpts {
  /**
   * Timeout in milliseconds for the personalize request
   */
  timeout?: number;
}
