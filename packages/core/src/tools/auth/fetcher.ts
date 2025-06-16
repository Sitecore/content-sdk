/* eslint-disable jsdoc/require-jsdoc */
export const unitMocks = {
  set sendPostRequest(mockImplementation) {
    sendPostRequest = mockImplementation;
  },
  get sendPostRequest() {
    return _sendPostRequest;
  },
};
/**
 * Performs a POST request with application/x-www-form-urlencoded headers.
 * @param {string} url - The endpoint to post to.
 * @param { URLSearchParams} params - A URLSearchParams instance representing the body.
 * @returns Parsed JSON response.
 * @throws Error if response is not OK.
 */
export let sendPostRequest = _sendPostRequest;

async function _sendPostRequest<T>(
  url: string,
  params: URLSearchParams,
  throwOnError = true
): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const data = await response.json();

  if (throwOnError && !response.ok) {
    throw new Error(data.error_description || data.error || 'Unknown error occurred');
  }

  return data;
}
