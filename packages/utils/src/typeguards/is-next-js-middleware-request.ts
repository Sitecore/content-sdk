import type { MiddlewareRequest, Request } from '../interfaces';

/**
 * Determines whether the given request is a Next.js middleware request.
 * @param {Request} request The request candidate to validate.
 * @returns {request is MiddlewareRequest} True when the request exposes middleware cookie helpers.
 */
export function isNextJsMiddlewareRequest(request: Request): request is MiddlewareRequest {
  return 'cookies' in request && 'get' in request.cookies && 'set' in request.cookies;
}
