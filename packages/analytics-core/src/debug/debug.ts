import { normalizeHeaders } from '../utils';
import type { DebugResponse } from '../interfaces';
import { isNamespaceEnabled } from '@sitecore-content-sdk/core';

/**
 * Extracts debug information from an HTTP response if debugging is enabled.
 * @param {string} namespace - The debug namespace used to check if debugging is enabled.
 * @param {Response} response - The HTTP response object from fetch.
 * @returns {object} An object containing selected response details for debugging purposes.
 * @internal
 */
export function processDebugResponse(namespace: string, response: Response): object {
  let debugResponse: DebugResponse = {};

  if (isNamespaceEnabled(namespace))
    debugResponse = {
      headers: normalizeHeaders(response.headers),
      redirected: response.redirected,
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    };

  return debugResponse;
}
