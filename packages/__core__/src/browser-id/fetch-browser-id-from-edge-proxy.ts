import type { EPResponse, ProxySettings } from '../interfaces';
import { ErrorMessages, LIBRARY_VERSION } from '../consts';
import { ErrorMessages as UtilsErrorMessages, fetchWithTimeout } from '@sitecore-content-sdk/utils';
import { constructGetBrowserIdUrl } from './construct-get-browser-id-url';

/**
 * Gets the browser ID and Client Key from Sitecore Edge Proxy
 * @param sitecoreEdgeUrl - The baseURL for the Edge Proxy API.
 * @param sitecoreEdgeContextId - The sitecoreContextId param for the edge Proxy API.
 * @param timeout - The timeout for the call to proxy
 * @returns the browser ID
 */
export async function fetchBrowserIdFromEdgeProxy(
  sitecoreEdgeUrl: string,
  sitecoreEdgeContextId: string,
  timeout?: number
): Promise<ProxySettings> {
  const fetchOptions = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: { 'X-Library-Version': LIBRARY_VERSION },
  };

  const url = constructGetBrowserIdUrl(sitecoreEdgeUrl, sitecoreEdgeContextId);
  let payload;

  if (timeout !== undefined)
    payload = await fetchWithTimeout(url, timeout, fetchOptions)
      .then((response) => {
        return (response && response.json()) || null;
      })
      .catch((err) => {
        if (
          err.message === UtilsErrorMessages.IV_0006 ||
          err.message === UtilsErrorMessages.IE_0002
        )
          throw new Error(err.message);

        return null;
      });
  else
    payload = await fetch(url, fetchOptions)
      .then((res) => res.json())
      .catch(() => undefined);

  if (!payload?.ref) throw new Error(ErrorMessages.IE_0003);

  const { ref: browserId, customer_ref: guestId }: EPResponse = payload;
  return { browserId, guestId };
}
