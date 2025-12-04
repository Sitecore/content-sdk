import type { MiddlewareRequest, Request } from '../interfaces';

/**
 * Checks if the given 'request' object is a valid Middleware Request
 * by verifying the presence of necessary properties.
 *
 * @param request - The request object to be validated.
 * @returns Returns true if 'request' is a valid Middleware Request, otherwise false.
 */
export function isNextJsMiddlewareRequest(request: Request): request is MiddlewareRequest {
  return 'cookies' in request && 'get' in request.cookies && 'set' in request.cookies;
}
