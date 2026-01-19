import type { HttpResponse, MiddlewareNextResponse } from '../interfaces';

/**
 * Determines whether the given response is a Next.js middleware response.
 * @param {MiddlewareNextResponse | HttpResponse} response The response candidate to validate.
 * @returns {response is MiddlewareNextResponse} True when the response exposes middleware cookie helpers.
 */
export function isNextJsMiddlewareResponse(
  response: MiddlewareNextResponse | HttpResponse
): response is MiddlewareNextResponse {
  return 'cookies' in response && 'set' in response.cookies;
}
