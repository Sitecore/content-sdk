import type { EPResponse, ProxySettings } from '../interfaces';
import { ERROR_MESSAGES, LIBRARY_VERSION } from '../consts';
import { ERROR_MESSAGES as UTILS_ERROR_MESSAGES, fetchWithTimeout } from '../utils';
import { constructGetClientIdUrl } from './construct-get-client-id-url';

/**
 * Gets the client ID and client key from Sitecore Edge proxy.
 * @param {string} edgeUrl - The base URL for the Edge proxy API.
 * @param {string} contextId - The Sitecore context ID parameter for the Edge proxy API.
 * @param {number} [timeout] - The timeout in milliseconds for the call to the proxy.
 * @returns {Promise<ProxySettings>} The client ID and profile ID from the proxy.
 * @internal
 */
export async function fetchClientIdFromEdgeProxy(
  edgeUrl: string,
  contextId: string,
  timeout?: number
): Promise<ProxySettings> {
  const fetchOptions = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: {
      'X-Library-Version': LIBRARY_VERSION,
      'x-sitecore-contextid': contextId,
    },
  };

  const url = constructGetClientIdUrl(edgeUrl);
  let payload;

  if (timeout !== undefined)
    payload = await fetchWithTimeout(url, timeout, fetchOptions)
      .then((response) => {
        return (response && response.json()) || null;
      })
      .catch((err) => {
        if (
          err.message === UTILS_ERROR_MESSAGES.IV_002 ||
          err.message === UTILS_ERROR_MESSAGES.IE_003
        )
          throw new Error(err.message);

        return null;
      });
  else
    payload = await fetch(url, fetchOptions)
      .then((res) => res.json())
      .catch(() => undefined);

  if (!payload?.ref) throw new Error(ERROR_MESSAGES.IE_005);

  const { ref: clientId, customer_ref: profileId }: EPResponse = payload;
  return { clientId, profileId };
}
