import { ErrorMessages } from '../consts';

/**
 * Fetches a resource while enforcing a timeout guard.
 * @param {string} url The URL to fetch.
 * @param {number} timeout Timeout window in milliseconds.
 * @param {RequestInit} fetchOptions Options forwarded to the Fetch API.
 * @returns {Promise<Response | null>} Fetch response or null when the request is aborted or times out.
 * @throws {Error} When the timeout value is not a non-negative integer or when the request aborts.
 */
export async function fetchWithTimeout(
  url: string,
  timeout: number,
  fetchOptions: RequestInit
): Promise<Response | null> {
  if (!Number.isInteger(timeout) || timeout < 0) throw new Error(ErrorMessages.IV_0006);

  const abortController = new AbortController();
  const signal = abortController.signal;

  const timeoutHandler = setTimeout(() => {
    abortController.abort();
  }, timeout);

  return fetch(url, { ...fetchOptions, signal })
    .then((response) => {
      clearTimeout(timeoutHandler);
      return response;
    })
    .catch((error) => {
      if (error.name === 'AbortError') throw new Error(ErrorMessages.IE_0002);
      return null;
    });
}
