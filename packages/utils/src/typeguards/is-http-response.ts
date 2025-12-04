import type { HttpResponse, MiddlewareNextResponse } from '../interfaces';

/**
 * Checks if the given 'response' object is a valid HTTP Response
 * by verifying the presence of necessary properties.
 *
 * @param response - MiddlewareNextResponse | HttpResponse - The response object to be validated.
 * @returns Returns true if 'response' is a valid HTTP Response, otherwise false.
 */
export function isHttpResponse(
  response: MiddlewareNextResponse | HttpResponse
): response is HttpResponse {
  return 'setHeader' in response;
}
