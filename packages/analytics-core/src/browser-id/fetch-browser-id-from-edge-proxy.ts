import type { EPResponse, ProxySettings } from '../interfaces';
import { ERROR_MESSAGES, LIBRARY_VERSION } from '../consts';
import { ERROR_MESSAGES as UTILS_ERROR_MESSAGES, fetchWithTimeout } from '../utils';
import { constructGetBrowserIdUrl } from './construct-get-browser-id-url';

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
  let payload;

  if (timeout !== undefined)
    payload = await fetchWithTimeout(url, timeout, fetchOptions)
      .then((response) => {
        return (response && response.json()) || null;
      })
      .catch((err) => {
        if (
          err.message === UTILS_ERROR_MESSAGES.IV_0006 ||
          err.message === UTILS_ERROR_MESSAGES.IE_0002
        )
          throw new Error(err.message);

        return null;
      });
  else
    payload = await fetch(url, fetchOptions)
      .then((res) => res.json())
      .catch(() => undefined);

  if (!payload?.ref) throw new Error(ERROR_MESSAGES.IE_0003);

  const { ref: browserId, customer_ref: guestId }: EPResponse = payload;
  return { browserId, guestId };
}
