import { ErrorMessages } from '../consts';

/**
 * Fetches data from the specified URL within the given timeout period.
 *
 * @param url - The URL to fetch data from.
 * @param timeout - The time in milliseconds to wait before timing out the request.
 * @param fetchOptions - The options to pass to the fetch API.
 * @returns - A Promise that resolves to the fetched data, or null if the request was aborted or timed out.
 * @throws  - If the timeout value is invalid.
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
