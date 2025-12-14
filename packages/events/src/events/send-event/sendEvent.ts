import { API_VERSION, debug, processDebugResponse } from '@sitecore-content-sdk/__core__/internal';
import type {
  BasePayload,
  CustomEventPayload,
  IdentityEventPayload,
  PageViewEventPayload,
} from '..';
import type { DebugResponse, EPResponse, Settings } from '@sitecore-content-sdk/__core__/internal';
import { EVENTS_NAMESPACE, PACKAGE_VERSION, X_CLIENT_SOFTWARE_ID } from '../../consts';

/**
 * This factory function sends an event to Edge Proxy
 * @param {EPFetchBody & BasePayload} body - The event data to send
 * @param {Settings} settings - The global settings
 */
export async function sendEvent(
  body: EPFetchBody & BasePayload,
  settings: Settings
): Promise<EPResponse | null> {
  // eslint-disable-next-line max-len
  const eventUrl = `${settings.sitecoreEdgeUrl}/v1/events/${API_VERSION}/events?sitecoreContextId=${settings.sitecoreEdgeContextId}&siteId=${settings.siteName}`;
  const startTimestamp = Date.now();
  let debugResponse: DebugResponse = {};

  const fetchOptions = {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Software-ID': X_CLIENT_SOFTWARE_ID,
      'X-Library-Version': PACKAGE_VERSION,
    },
    method: 'POST',
  };

  debug(EVENTS_NAMESPACE)('Events request: %s with options: %O', eventUrl, fetchOptions);

  return await fetch(eventUrl, fetchOptions)
    .then((response) => {
      debugResponse = processDebugResponse(EVENTS_NAMESPACE, response);

      return response.json();
    })
    .then((data) => {
      debugResponse.body = data;

      debug(EVENTS_NAMESPACE)(
        'Events response in %dms : %O',
        Date.now() - startTimestamp,
        debugResponse
      );

      return data;
    })
    .catch((error) => {
      debug(EVENTS_NAMESPACE)('Error: events response: %O', error);
      return null;
    });
}

/**
 * The type of sendEvent function
 */
export type SendEvent = (
  body: EPFetchBody & BasePayload,
  settings: Settings
) => Promise<EPResponse | null>;

/**
 * The type describing all possible event payloads
 */
type EPFetchBody = PageViewEventPayload | IdentityEventPayload | CustomEventPayload;
