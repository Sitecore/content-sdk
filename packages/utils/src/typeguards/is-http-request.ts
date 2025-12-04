import type { HttpRequest, Request } from '../interfaces';

/**
 * Determines whether the given request is an HTTP request instance.
 * @param {Request} request The request candidate to validate.
 * @returns {request is HttpRequest} True when the request exposes HTTP headers.
 */
export function isHttpRequest(request: Request): request is HttpRequest {
  return 'headers' in request;
}
