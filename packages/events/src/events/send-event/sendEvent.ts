import { API_VERSION } from '@sitecore-content-sdk/analytics-core/internal';
import type {
  BasePayload,
  CustomEventPayload,
  IdentityEventPayload,
  PageViewEventPayload,
} from '..';
import type { EPResponse } from '@sitecore-content-sdk/analytics-core/internal';
import { PACKAGE_VERSION, X_CLIENT_SOFTWARE_ID } from '../../consts';
import { CoreContext, NativeDataFetcher } from '@sitecore-content-sdk/core';
import { debug } from '../../debug';

/**
 * This function sends an event to Sitecore Edge Proxy
 * @param {EPFetchBody & BasePayload} body - The event data to send
 * @param {CoreContext['config']} config - The global configuration
 * @internal
 */
export async function sendEvent(
  body: EPFetchBody & BasePayload,
  config: CoreContext['config']
): Promise<EPResponse | null> {
  // eslint-disable-next-line max-len
  const eventUrl = `${config.edgeUrl}/v1/events/${API_VERSION}/events?siteId=${config.siteName}`;

  const fetchOptions = {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Software-ID': X_CLIENT_SOFTWARE_ID,
      'X-Library-Version': PACKAGE_VERSION,
      'x-sitecore-contextid': config.contextId,
    },
    method: 'POST',
  };

  const fetcher = new NativeDataFetcher({ debugger: debug.events });

  return await fetcher
    .fetch<EPResponse>(eventUrl, fetchOptions)
    .then(async (response) => {
      return response.data;
    })
    .catch(() => {
      return null;
    });
}

/**
 * The type of sendEvent function
 * @internal
 */
export type SendEvent = (
  body: EPFetchBody & BasePayload,
  config: CoreContext['config']
) => Promise<EPResponse | null>;

/**
 * The type describing all possible event payloads
 * @internal
 */
type EPFetchBody = PageViewEventPayload | IdentityEventPayload | CustomEventPayload;
