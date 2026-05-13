import { API_VERSION } from '@sitecore-content-sdk/analytics-core/internal';
import { PACKAGE_VERSION } from '../consts';
import { constants } from '@sitecore-content-sdk/core';

const { ERROR_MESSAGES } = constants;

/**
 * Gets the profile id from Edge Proxy.
 * @param {string} clientId - The client ID of the client.
 * @param {string} contextId - The Sitecore Edge context ID.
 * @param {string} edgeUrl - The Sitecore Edge base URL.
 * @returns {Promise<string>} A promise that resolves with the profile id.
 * @throws Will throw an error if the client key or client ID is invalid.
 * @internal
 */
export async function fetchProfileIdFromEdgeProxy(
  clientId: string,
  contextId: string,
  edgeUrl: string
): Promise<string> {
  // eslint-disable-next-line max-len
  const url = `${edgeUrl}/v1/events/${API_VERSION}/browser/${clientId}/show.json?client_key=&api_token=`;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const response = await fetch(url, {
    headers: {
      'X-Library-Version': PACKAGE_VERSION,
      'x-sitecore-contextid': contextId,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    const { error_msg: errorMsg, moreInfo } = data as GetProfileIdResponseError;

    throw new Error(`${errorMsg}, for more info: ${moreInfo}`);
  }

  if (!data.customer.ref) throw new Error(ERROR_MESSAGES.IE_006);

  return (data as GetProfileIdResponse).customer.ref;
}

/**
 * Represents the common properties of the response from the Edge Proxy when fetching the profile id.
 * @internal
 */
interface GetProfileIdCommon {
  status: string;
  version: string;
  clientKey: string;
}

/**
 * Represents the successful response from the Edge Proxy when fetching the profile id.
 * @internal
 */
export interface GetProfileIdResponse extends GetProfileIdCommon {
  ref: string;
  customer: { ref: string };
}

/**
 * Represents the error response from the Edge Proxy when fetching the profile id.
 * @internal
 */
export interface GetProfileIdResponseError extends GetProfileIdCommon {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  error_msg: string;
  moreInfo: string;
}
