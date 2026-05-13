import { constants, NativeDataFetcher } from '@sitecore-content-sdk/core';
import { LIBRARY_VERSION } from '../consts';
import type { EPResponse } from '../interfaces';
import * as resolveGetClientIdUrl from './resolve-get-client-id-url';
import { fetchClientIdFromEdgeProxy } from './fetch-client-id-from-edge-proxy';
import { jest, expect } from '@jest/globals';

const { SITECORE_EDGE_PLATFORM_URL_DEFAULT: SITECORE_EDGE_URL, ERROR_MESSAGES } = constants;

describe('fetchClientIdFromEdgeProxy', () => {
  const constructClientIdUrlSpy = jest.spyOn(resolveGetClientIdUrl, 'resolveGetClientIdUrl');
  const contextId = '83d8199c-2837-4c29-a8ab-1bf234fea2d1';
  const mockResponse = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client_key: 'pqsDATA3lw12v5a9rrHPW1c4hET73GxQ',
    ref: 'dac13bc5-cdae-4e65-8868-13443409d05e',
    status: 'OK',
    version: '1.2',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should resolve with an appropriate response object when calling fetch with timeout', async () => {
    const fetchSpy = jest.spyOn(NativeDataFetcher.prototype, 'fetch');
    fetchSpy.mockResolvedValue({ data: mockResponse as EPResponse, status: 200, statusText: 'OK' });

    const res = await fetchClientIdFromEdgeProxy(SITECORE_EDGE_URL, contextId, 3000);
    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledWith(
      `${SITECORE_EDGE_URL}/v1/events/v1.2/browser/create.json?client_key=`,
      {
        headers: {
          'X-Library-Version': LIBRARY_VERSION,
          'x-sitecore-contextid': contextId,
        },
      }
    );

    expect(fetchSpy).toHaveBeenCalledWith(
      // eslint-disable-next-line max-len
      `${SITECORE_EDGE_URL}/v1/events/v1.2/browser/create.json?client_key=`,
      {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'X-Library-Version': LIBRARY_VERSION,
          'x-sitecore-contextid': contextId,
        },
      }
    );
    expect(res).toMatchObject({ clientId: mockResponse.ref });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(constructClientIdUrlSpy).toHaveBeenCalledWith(SITECORE_EDGE_URL);
  });

  it('should resolve with an appropriate response object', () => {
    const fetchSpy = jest.spyOn(NativeDataFetcher.prototype, 'fetch');
    fetchSpy.mockResolvedValue({ data: mockResponse as EPResponse, status: 200, statusText: 'OK' });

    fetchClientIdFromEdgeProxy(SITECORE_EDGE_URL, contextId).then((res) => {
      expect(res).toMatchObject({ clientId: mockResponse.ref });
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        // eslint-disable-next-line max-len
        `${SITECORE_EDGE_URL}/v1/events/v1.2/browser/create.json?client_key=`,
        {
          headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'X-Library-Version': LIBRARY_VERSION,
            'x-sitecore-contextid': contextId,
          },
        }
      );
      expect(constructClientIdUrlSpy).toHaveBeenCalledWith(SITECORE_EDGE_URL);
    });
  });

  it('should throw IE-005 error if fetch fails', async () => {
    const abortError = new Error('abc');
    abortError.name = 'AbortError';

    const fetchSpy = jest.spyOn(NativeDataFetcher.prototype, 'fetch');
    fetchSpy.mockRejectedValueOnce(abortError);

    const expectedError = ERROR_MESSAGES.IE_005;

    expect(async () => {
      await fetchClientIdFromEdgeProxy(SITECORE_EDGE_URL, contextId);
    }).rejects.toThrow(expectedError);
  });

  it('should throw IE-005 error if fetch returns null', async () => {
    const nativeDataFetcherSpy = jest
      .spyOn(NativeDataFetcher.prototype, 'fetch')
      .mockResolvedValue({ data: null, status: 200, statusText: 'OK' });

    const expectedError = ERROR_MESSAGES.IE_005;

    expect(async () => {
      await fetchClientIdFromEdgeProxy(SITECORE_EDGE_URL, contextId, 100);
    }).rejects.toThrow(expectedError);
    expect(nativeDataFetcherSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw IE-005 error if fetch rejects', async () => {
    const nativeDataFetcherSpy = jest
      .spyOn(NativeDataFetcher.prototype, 'fetch')
      .mockRejectedValueOnce({ message: 'random error' });

    const expectedError = ERROR_MESSAGES.IE_005;

    expect(async () => {
      await fetchClientIdFromEdgeProxy(SITECORE_EDGE_URL, contextId, 100);
    }).rejects.toThrow(expectedError);
    expect(nativeDataFetcherSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw [IV-002] when we pass negative timeout value', async () => {
    const nativeDataFetcherSpy = jest
      .spyOn(NativeDataFetcher.prototype, 'fetch')
      .mockRejectedValueOnce({
        message: ERROR_MESSAGES.IV_002,
      });

    expect(async () => {
      await fetchClientIdFromEdgeProxy(SITECORE_EDGE_URL, contextId, -100);
    }).rejects.toThrow(ERROR_MESSAGES.IV_002);
    expect(nativeDataFetcherSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw [IE-003] when we get an AbortError', async () => {
    const nativeDataFetcherSpy = jest
      .spyOn(NativeDataFetcher.prototype, 'fetch')
      .mockRejectedValueOnce({
        message: ERROR_MESSAGES.IE_003,
      });

    await expect(async () => {
      await fetchClientIdFromEdgeProxy(SITECORE_EDGE_URL, contextId, 100);
    }).rejects.toThrow(ERROR_MESSAGES.IE_003);
    expect(nativeDataFetcherSpy).toHaveBeenCalledTimes(1);
  });
});
