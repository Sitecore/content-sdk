import { NativeDataFetcher, constants } from '@sitecore-content-sdk/core';
import type { EPResponse, VisitorIds } from '../interfaces';
import { LIBRARY_VERSION } from '../consts';
import { resolveGetClientIdUrl } from './resolve-get-client-id-url';

const { ERROR_MESSAGES } = constants;

/**
 * Gets the client ID and client key from Sitecore Edge proxy.
 * @param {string} edgeUrl - The base URL for the Edge proxy API.
 * @param {string} contextId - The Sitecore context ID parameter for the Edge proxy API.
 * @param {number} [timeout] - The timeout in milliseconds for the call to the proxy.
 * @returns {Promise<VisitorIds>} The client ID and profile ID from the proxy.
 * @internal
 */
export async function fetchClientIdFromEdgeProxy(
  edgeUrl: string,
  contextId: string,
  timeout?: number
): Promise<VisitorIds> {
  const fetchOptions = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: {
      'X-Library-Version': LIBRARY_VERSION,
      'x-sitecore-contextid': contextId,
    },
  };

  const url = resolveGetClientIdUrl(edgeUrl);
  const fetcher = new NativeDataFetcher({ timeout });

  const payload = await fetcher
    .fetch<EPResponse>(url, fetchOptions)
    .then((response) => {
      return response.data || null;
    })
    .catch((err) => {
      if (
        err.message === ERROR_MESSAGES.IV_002 ||
        err.message === ERROR_MESSAGES.IE_003
      )
        throw new Error(err.message);

      return null;
    });

  if (!payload?.ref) throw new Error(ERROR_MESSAGES.IE_005);

  const { ref: clientId, customer_ref: profileId }: EPResponse = payload;
  return { clientId, profileId };
}
