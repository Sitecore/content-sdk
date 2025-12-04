import type { HttpRequest, Request } from '../interfaces';

/**
 * Checks if the given 'request' object is a valid HTTP Request
 * by verifying the presence of necessary properties.
 *
 * @param request - The request object to be validated.
 * @returns Returns true if 'request' is a valid HTTP Request, otherwise false.
 */

export function isHttpRequest(request: Request): request is HttpRequest {
  return 'headers' in request;
}
