import { NativeDataFetcher, constants } from '@sitecore-content-sdk/core';
import type { EPResponse, ProxySettings } from '../interfaces';
import { ERROR_MESSAGES, LIBRARY_VERSION } from '../consts';
import { constructGetBrowserIdUrl } from './construct-get-browser-id-url';

const UTILS_ERROR_MESSAGES = constants.ERROR_MESSAGES;

/**
 * Gets the browser ID and client key from Sitecore Edge proxy.
 * @param {string} sitecoreEdgeUrl - The base URL for the Edge proxy API.
 * @param {string} sitecoreEdgeContextId - The Sitecore context ID parameter for the Edge proxy API.
 * @param {number} [timeout] - The timeout in milliseconds for the call to the proxy.
 * @returns {Promise<ProxySettings>} The browser ID and guest ID from the proxy.
 */
export async function fetchBrowserIdFromEdgeProxy(
  sitecoreEdgeUrl: string,
  sitecoreEdgeContextId: string,
  timeout?: number
): Promise<ProxySettings> {
  const fetchOptions = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: {
      'X-Library-Version': LIBRARY_VERSION,
      'x-sitecore-contextid': sitecoreEdgeContextId,
    },
  };

  const url = constructGetBrowserIdUrl(sitecoreEdgeUrl);

  const fetcher = new NativeDataFetcher({ timeout });

  const payload = await fetcher
    .fetch<EPResponse>(url, fetchOptions)
    .then((response) => {
      return response.data || null;
    })
    .catch((err) => {
      if (
        err.message === UTILS_ERROR_MESSAGES.IV_0006 ||
        err.message === UTILS_ERROR_MESSAGES.IE_0002
      )
        throw new Error(err.message);

      return null;
    });

  if (!payload?.ref) throw new Error(ERROR_MESSAGES.IE_0003);

  const { ref: browserId, customer_ref: guestId } = payload;
  return { browserId, guestId };
}
