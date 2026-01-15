import { ErrorMessages } from '../consts';
import { fetchWithTimeout } from './fetch-with-timeout'; // Update with your actual module path

describe('fetchWithTimeout', () => {
  const url = 'https://example.com/api/data';
  const fetchOptions = {};
  beforeEach(() => {
    // Reset the fetch mock before each test
    jest.clearAllMocks();
    jest.useRealTimers();
  });
  it('should fetch data successfully when the server responds within the timeout', async () => {
    const timeout = 5000; // 5 seconds timeout

    const mockFetch = Promise.resolve({
      json: () =>
        Promise.resolve({
          ref: 'ref',
        }),
    });

    global.fetch = jest.fn().mockImplementationOnce(() => mockFetch) as typeof fetch;

    const result = await fetchWithTimeout(url, timeout, fetchOptions);

    expect(await result?.json()).toEqual({ ref: 'ref' });

    jest.restoreAllMocks();
  });

  it('should handle a timeout and return null when the server does not respond within the timeout', async () => {
    jest.useFakeTimers();
    global.fetch = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ json: () => Promise.resolve('anything') })
      ) as typeof fetch;

    const abortSpy = jest.spyOn(AbortController.prototype, 'abort');
    const timeout = 100;

    fetchWithTimeout(url, timeout, fetchOptions);
    jest.advanceTimersByTime(1000);

    expect(abortSpy).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });

  it('should throw an error if the timeout value is invalid (negative)', async () => {
    const timeout = -100; // Negative timeout value

    await expect(fetchWithTimeout(url, timeout, fetchOptions)).rejects.toThrow(
      ErrorMessages.IV_0006
    );
  });

  it('should throw an error if the timeout value is not an integer', async () => {
    const timeout = 5000.5; // Non-integer timeout value

    await expect(fetchWithTimeout(url, timeout, fetchOptions)).rejects.toThrow(
      ErrorMessages.IV_0006
    );
  });

  it('should catch an error with the appropriate message error if the fetch request fails', async () => {
    const timeout = 1000; // 1 second timeout

    const abortError = new Error(ErrorMessages.IE_0002);
    abortError.name = 'AbortError';

    global.fetch = jest.fn(() => Promise.reject(abortError)) as typeof fetch;
    let result;
    try {
      result = await fetchWithTimeout(url, timeout, fetchOptions);
    } catch (error: any) {
      expect(result).toBeUndefined();
      expect(error).toBeInstanceOf(Error);
      expect(abortError.name).toBe('AbortError');
      expect(error.message).toBe(ErrorMessages.IE_0002);
    }
  });

  it('should catch an error with the appropriate message error if the fetch request fails version 2', async () => {
    const timeout = 1000; // 1 second timeout

    const abortError = new Error(ErrorMessages.IE_0002);
    abortError.name = 'AbortError';

    global.fetch = jest.fn(() => Promise.reject(abortError)) as typeof fetch;

    const result = await fetchWithTimeout(url, timeout, fetchOptions).catch((error) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(ErrorMessages.IE_0002);
      expect(error.message).toBe(ErrorMessages.IE_0002);
    });

    expect(result).toBeUndefined();
  });

  it('should catch an error with the appropriate message error if the fetch request fails', async () => {
    const timeout = 1000; // 1 second timeout

    const abortError = new Error(ErrorMessages.IE_0002);
    abortError.name = 'AbortError ';

    global.fetch = jest.fn(() => Promise.reject(abortError)) as typeof fetch;

    expect(async () => {
      const result = await fetchWithTimeout(url, timeout, fetchOptions);
      expect(result).toBeNull();
    }).not.toThrow(ErrorMessages.IE_0002);
  });

  it('should catch an error with the appropriate message error if the fetch request fails', async () => {
    const timeout = 1000; // 1 second timeout

    const abortError = new Error(ErrorMessages.IV_0006);
    abortError.name = '  ';

    global.fetch = jest.fn(() => Promise.reject(abortError)) as typeof fetch;

    expect(async () => {
      const result = await fetchWithTimeout(url, timeout, fetchOptions);
      expect(result).toBeNull();
    }).not.toThrow(ErrorMessages.IE_0002);
  });

  it('should catch an error and return null if the fetch request fails', async () => {
    const timeout = 1000; // 1 second timeout

    global.fetch = jest.fn(() => Promise.reject()) as typeof fetch;

    let result;
    try {
      result = await fetchWithTimeout(url, timeout, fetchOptions);
    } catch (error: any) {
      expect(result).toBeUndefined();
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Cannot read properties of undefined (reading 'name')");
    }
  });

  it('should return null if an unhandled error occurs with empty name', async () => {
    const timeout = 1000; // 1 second timeout

    const abortError = new Error('Failed to fetch');
    abortError.name = 'abc';

    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.reject(abortError as any)) as typeof fetch;

    expect(async () => {
      const result = await fetchWithTimeout(url, timeout, fetchOptions);
      expect(result).toBeNull();
      expect(abortError.name.length).toBeGreaterThan(0);
      expect(abortError.name).toEqual('abc');
    }).not.toThrow(ErrorMessages.IE_0002);
  });

  it('should return bad object if response has no .json method', async () => {
    const timeout = 1000; // 1 second timeout

    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve('bad object')) as typeof fetch;

    const result = await fetchWithTimeout(url, timeout, fetchOptions);

    expect(result).toBe('bad object');
  });
});
