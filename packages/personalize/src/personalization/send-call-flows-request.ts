import type { DebugResponse, Settings } from '@sitecore-content-sdk/__core__/internal';
import {
  debug,
  generateCorrelationId,
  processDebugResponse,
} from '@sitecore-content-sdk/__core__/internal';
import type { NestedObject } from '@sitecore-content-sdk/utils';
import { fetchWithTimeout } from '@sitecore-content-sdk/utils';
import { PACKAGE_VERSION, PERSONALIZE_NAMESPACE } from '../consts';
import { GetInteractiveExperienceDataOpts } from './personalizer';

/**
 * A function that sends a CallFlow request to Sitecore EP
 * @param {EPCallFlowsBody} epCallFlowsBody - Properties to be send to Sitecore EP
 * @param {Settings} settings - Settings for the url params
 * @param {GetInteractiveExperienceDataOpts} opts - Optional configuration object
 * @returns {Promise<unknown | null | FailedCalledFlowsResponse>} A promise that resolves with either the Sitecore EP response object or unknown
 */
export async function sendCallFlowsRequest(
  epCallFlowsBody: EPCallFlowsBody,
  settings: Settings,
  opts?: GetInteractiveExperienceDataOpts
) {
  const startTimestamp = Date.now();
  let debugResponse: DebugResponse = {};

  // eslint-disable-next-line max-len
  const requestUrl = `${settings.sitecoreEdgeUrl}/v1/personalize?siteId=${settings.siteName}`;

  const fetchOptions: FetchOptions = {
    body: JSON.stringify(epCallFlowsBody),
    headers: {
      /* eslint-disable @typescript-eslint/naming-convention */
      'Content-Type': 'application/json',
      'X-Library-Version': PACKAGE_VERSION,
      'x-sc-correlation-id': generateCorrelationId(),
      'x-sitecore-contextid': settings.sitecoreEdgeContextId,
      /* eslint-enable @typescript-eslint/naming-convention */
    },
    method: 'POST',
  };

  if (opts?.userAgent) fetchOptions.headers['User-Agent'] = opts.userAgent;

  debug(PERSONALIZE_NAMESPACE)(
    'Personalize request: %s with options: %O' as const,
    requestUrl,
    fetchOptions
  );

  if (opts?.timeout === undefined)
    return fetch(requestUrl, fetchOptions)
      .then((response) => {
        debugResponse = processDebugResponse(PERSONALIZE_NAMESPACE, response);

        return response.json();
      })
      .then((data) => {
        debugResponse.body = data;

        debug(PERSONALIZE_NAMESPACE)(
          'Personalize response in %dms : %O',
          Date.now() - startTimestamp,
          debugResponse
        );

        return data;
      })
      .catch((error) => {
        debug(PERSONALIZE_NAMESPACE)('Error personalize response: %O' as const, error);
        return null;
      });

  return fetchWithTimeout(requestUrl, opts.timeout, fetchOptions)
    .then((response) => {
      if (!response) return null;

      debugResponse = processDebugResponse(PERSONALIZE_NAMESPACE, response);

      return response.json();
    })
    .then((data) => {
      debugResponse.body = data;

      debug(PERSONALIZE_NAMESPACE)(
        'Personalize response in %dms : %O',
        Date.now() - startTimestamp,
        debugResponse
      );

      return data;
    })
    .catch((error) => {
      debug(PERSONALIZE_NAMESPACE)('Error personalize response: %O' as const, error);
      if (error.message.includes('IV-0006') || error.message.includes('IE-0002'))
        throw new Error(error.message);

      return null;
    });
}

/**
 * An interface with the basic functionality that the derived classes needs to implement
 */
export interface PersonalizeClient {
  settings: Settings;
  sendCallFlowsRequest: (
    epCallFlowAttributes: EPCallFlowsBody,
    timeout?: number
  ) => Promise<unknown | null | FailedCalledFlowsResponse>;
}

/**
 * An interface that describes the failed response model from Sitecore EP
 */
export interface FailedCalledFlowsResponse {
  status: string;
  code: string;
  message: string;
  developerMessage: string;
  moreInfoUrl: string;
}

/**
 * An interface that describes the identifier model attributes for the library
 */
export interface EPIdentifier {
  id: string;
  provider: string;
}

/**
 * An interface that describes the payload sent to Sitecore EP library
 */
export interface EPCallFlowsBody {
  browserId?: string;
  email?: string;
  friendlyId: string;
  identifiers?: EPIdentifier;
  channel: string;
  clientKey: string;
  currencyCode?: string;
  language: string | undefined;
  params?: EPCallFlowsParams;
  pointOfSale: string;
  guestRef?: string;
  variants?: string[];
}

/**
 * A type that describes the params property of the EPCallFlowsBody
 */
export type EPCallFlowsParams = NestedObject;

/**
 * Interface for the fetch options we need
 */
interface FetchOptions extends RequestInit {
  headers: Record<string, string>;
}
