import type { HttpResponse, MiddlewareNextResponse } from '../interfaces';

/**
 * Determines whether the given response is an HTTP response instance.
 * @param {MiddlewareNextResponse | HttpResponse} response The response candidate to validate.
 * @returns {response is HttpResponse} True when the response implements the required HTTP methods.
 */
export function isHttpResponse(
  response: MiddlewareNextResponse | HttpResponse
): response is HttpResponse {
  return 'setHeader' in response;
}
