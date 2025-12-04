import { API_VERSION } from '../consts';
/**
 * Constructs the URL for retrieving the proxy settings from EDGE events proxy
 * @param sitecoreEdgeUrl - The baseURL for the EDGE proxy
 * @param sitecoreEdgeContextId - The sitecoreContextId for the EDGE proxy
 * @returns The URL string for retrieving the browser ID and ClientKey
 */

export function constructGetBrowserIdUrl(
  sitecoreEdgeUrl: string,
  sitecoreEdgeContextId: string
): string {
  // eslint-disable-next-line max-len
  return `${sitecoreEdgeUrl}/v1/events/${API_VERSION}/browser/create.json?sitecoreContextId=${sitecoreEdgeContextId}&client_key=`;
}
