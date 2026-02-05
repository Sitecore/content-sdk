import { API_VERSION } from '../consts';

/**
 * Constructs the URL for retrieving the proxy settings from the EDGE events proxy.
 * @param {string} edgeUrl - The base URL for the EDGE proxy.
 * @returns {string} The URL string for retrieving the client ID and client key.
 */
export function constructGetClientIdUrl(edgeUrl: string): string {
  return `${edgeUrl}/v1/events/${API_VERSION}/browser/create.json?client_key=`;
}
