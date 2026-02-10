import * as utils from '../utils';
import { ERROR_MESSAGES, LIBRARY_VERSION } from '../consts';
import type { EPResponse } from '../interfaces';
import { constants, NativeDataFetcher } from '@sitecore-content-sdk/core';
import * as constructGetBrowserIdUrl from './construct-get-browser-id-url';
import { fetchBrowserIdFromEdgeProxy } from './fetch-browser-id-from-edge-proxy';
import { jest, expect } from '@jest/globals';

const { SITECORE_EDGE_URL_DEFAULT: SITECORE_EDGE_URL } = constants;

describe('fetchBrowserIdFromEdgeProxy', () => {
  const constructBrowserIdUrlSpy = jest.spyOn(constructGetBrowserIdUrl, 'constructGetBrowserIdUrl');
  const sitecoreEdgeContextId = '83d8199c-2837-4c29-a8ab-1bf234fea2d1';
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

    const res = await fetchBrowserIdFromEdgeProxy(SITECORE_EDGE_URL, sitecoreEdgeContextId, 3000);
    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledWith(
      // eslint-disable-next-line max-len
      `${SITECORE_EDGE_URL}/v1/events/v1.2/browser/create.json?client_key=`,
      {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'X-Library-Version': LIBRARY_VERSION,
          'x-sitecore-contextid': sitecoreEdgeContextId,
        },
      }
    );
    expect(res).toMatchObject({ browserId: mockResponse.ref });
    expect(constructBrowserIdUrlSpy).toHaveBeenCalledWith(SITECORE_EDGE_URL);
  });

  it('should resolve with an appropriate response object', () => {
    const fetchSpy = jest.spyOn(NativeDataFetcher.prototype, 'fetch');
    fetchSpy.mockResolvedValue({ data: mockResponse as EPResponse, status: 200, statusText: 'OK' });
    fetchBrowserIdFromEdgeProxy(SITECORE_EDGE_URL, sitecoreEdgeContextId).then((res) => {
      expect(res).toMatchObject({ browserId: mockResponse.ref });
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        // eslint-disable-next-line max-len
        `${SITECORE_EDGE_URL}/v1/events/v1.2/browser/create.json?client_key=`,
        {
          headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'X-Library-Version': LIBRARY_VERSION,
            'x-sitecore-contextid': sitecoreEdgeContextId,
          },
        }
      );
      expect(constructBrowserIdUrlSpy).toHaveBeenCalledWith(SITECORE_EDGE_URL);
    });
  });

  it('should throw IE-0003 error if fetch fails', async () => {
    const abortError = new Error('abc');
    abortError.name = 'AbortError';

    const fetchSpy = jest.spyOn(NativeDataFetcher.prototype, 'fetch');
    fetchSpy.mockRejectedValueOnce(abortError);

    const expectedError = ERROR_MESSAGES.IE_0003;

    expect(async () => {
      await fetchBrowserIdFromEdgeProxy(SITECORE_EDGE_URL, sitecoreEdgeContextId);
    }).rejects.toThrow(expectedError);
  });

  it('should throw IE-0003 error if fetch returns null - fetchWithTimeout', async () => {
    const nativeDataFetcherSpy = jest
      .spyOn(NativeDataFetcher.prototype, 'fetch')
      .mockResolvedValue({ data: null, status: 200, statusText: 'OK' });

    const expectedError = ERROR_MESSAGES.IE_0003;

    expect(async () => {
      await fetchBrowserIdFromEdgeProxy(SITECORE_EDGE_URL, sitecoreEdgeContextId, 100);
    }).rejects.toThrow(expectedError);
    expect(nativeDataFetcherSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw IE-0003 error if fetch rejects - fetchWithTimeout', async () => {
    const nativeDataFetcherSpy = jest
      .spyOn(NativeDataFetcher.prototype, 'fetch')
      .mockRejectedValueOnce({ message: 'random error' });

    const expectedError = ERROR_MESSAGES.IE_0003;

    expect(async () => {
      await fetchBrowserIdFromEdgeProxy(SITECORE_EDGE_URL, sitecoreEdgeContextId, 100);
    }).rejects.toThrow(expectedError);
    expect(nativeDataFetcherSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw [IV-0006] when we pass negative timeout value', async () => {
    const nativeDataFetcherSpy = jest
      .spyOn(NativeDataFetcher.prototype, 'fetch')
      .mockRejectedValueOnce({
        message: utils.ERROR_MESSAGES.IV_0006,
      });

    expect(async () => {
      await fetchBrowserIdFromEdgeProxy(SITECORE_EDGE_URL, sitecoreEdgeContextId, -100);
    }).rejects.toThrow(utils.ERROR_MESSAGES.IV_0006);
    expect(nativeDataFetcherSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw [IE-0002] when we get an AbortError', async () => {
    const nativeDataFetcherSpy = jest
      .spyOn(NativeDataFetcher.prototype, 'fetch')
      .mockRejectedValueOnce({
        message: utils.ERROR_MESSAGES.IE_0002,
      });

    await expect(async () => {
      await fetchBrowserIdFromEdgeProxy(SITECORE_EDGE_URL, sitecoreEdgeContextId, 100);
    }).rejects.toThrow(utils.ERROR_MESSAGES.IE_0002);
    expect(nativeDataFetcherSpy).toHaveBeenCalledTimes(1);
  });
});
