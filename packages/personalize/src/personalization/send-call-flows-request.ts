import { generateCorrelationId } from '@sitecore-content-sdk/analytics-core/internal';
import type { NestedObject } from '@sitecore-content-sdk/analytics-core/utils';
import { PACKAGE_VERSION } from '../consts';
import { GetInteractiveExperienceDataOpts } from './personalizer';
import { CoreContext, NativeDataFetcher } from '@sitecore-content-sdk/core';
import { debug } from '../debug';

/**
 * A function that sends a CallFlow request to Sitecore Edge Proxy
 * @param {EPCallFlowsBody} epCallFlowsBody - Properties to be sent to Sitecore Edge Proxy
 * @param {CoreContext['config']} config - Configuration for the url params
 * @param {GetInteractiveExperienceDataOpts} opts - Optional configuration object
 * @returns {Promise<unknown | null | FailedCalledFlowsResponse>} A promise that resolves with either the Sitecore Edge Proxy response object or unknown
 * @internal
 */
export async function sendCallFlowsRequest(
  epCallFlowsBody: EPCallFlowsBody,
  config: CoreContext['config'],
  opts?: GetInteractiveExperienceDataOpts
) {
  // eslint-disable-next-line max-len
  const requestUrl = `${config.edgeUrl}/v1/personalize?siteId=${config.siteName}`;

  const fetchOptions: FetchOptions = {
    body: JSON.stringify(epCallFlowsBody),
    headers: {
      /* eslint-disable @typescript-eslint/naming-convention */
      'Content-Type': 'application/json',
      'X-Library-Version': PACKAGE_VERSION,
      'x-sc-correlation-id': generateCorrelationId(),
      'x-sitecore-contextid': config.contextId,
      /* eslint-enable @typescript-eslint/naming-convention */
    },
    method: 'POST',
  };

  if (opts?.userAgent) fetchOptions.headers['User-Agent'] = opts.userAgent;

  const fetcher = new NativeDataFetcher({ timeout: opts?.timeout, debugger: debug.personalize });

  return fetcher
    .fetch(requestUrl, fetchOptions)
    .then((response) => {
      if (!response) return null;

      return response.data;
    })
    .catch((error) => {
      if (error.message.includes('IV-002') || error.message.includes('IE-003'))
        throw new Error(error.message);

      return null;
    });
}

/**
 * An interface with the basic functionality that the derived classes needs to implement
 * @internal
 */
export interface PersonalizeClient {
  config: CoreContext['config'];
  sendCallFlowsRequest: (
    epCallFlowAttributes: EPCallFlowsBody,
    timeout?: number
  ) => Promise<unknown | null | FailedCalledFlowsResponse>;
}

/**
 * An interface that describes the failed response model from Sitecore Edge Proxy
 * @public
 */
export interface FailedCalledFlowsResponse {
  /**
   * The status of the response.
   */
  status: string;
  /**
   * The error code.
   */
  code: string;
  /**
   * A message describing the error.
   */
  message: string;
  /**
   * A more detailed message intended for developers.
   */
  developerMessage: string;
  /**
   * A URL with more information about the error.
   */
  moreInfoUrl: string;
}

/**
 * An interface that describes the identifier model attributes for the library
 * @internal
 */
export interface EPIdentifier {
  id: string;
  provider: string;
}

/**
 * An interface that describes the payload sent to Sitecore Edge Proxy library
 * @internal
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
 * @internal
 */
export type EPCallFlowsParams = NestedObject;

/**
 * Interface for the fetch options we need
 * @internal
 */
interface FetchOptions extends RequestInit {
  headers: Record<string, string>;
}
