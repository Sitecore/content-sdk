import { API_VERSION } from '../consts';
/**
 * Constructs the URL for retrieving the proxy settings from the EDGE events proxy.
 * @param {string} sitecoreEdgeUrl - The base URL for the EDGE proxy.
 * @returns {string} The URL string for retrieving the client ID and client key.
 */
export function constructGetClientIdUrl(sitecoreEdgeUrl: string): string {
  // eslint-disable-next-line max-len
  return `${sitecoreEdgeUrl}/v1/events/${API_VERSION}/browser/create.json?client_key=`;
}
