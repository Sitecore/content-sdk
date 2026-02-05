import * as utils from '../utils';
import { ERROR_MESSAGES, LIBRARY_VERSION, SITECORE_EDGE_URL } from '../consts';
import type { EPResponse } from '../interfaces';
import * as constructGetClientIdUrl from './construct-get-client-id-url';
import { fetchClientIdFromEdgeProxy } from './fetch-client-id-from-edge-proxy';
import { jest, expect } from '@jest/globals';

describe('fetchClientIdFromEdgeProxy', () => {
  const constructClientIdUrlSpy = jest.spyOn(constructGetClientIdUrl, 'constructGetClientIdUrl');
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
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve(mockResponse as EPResponse),
    });
    global.fetch = jest.fn().mockImplementationOnce(() => mockFetch) as typeof fetch;
    const fetchWithTimeoutSpy = jest.spyOn(utils, 'fetchWithTimeout');

    const res = await fetchClientIdFromEdgeProxy(SITECORE_EDGE_URL, contextId, 3000);
    expect(fetchWithTimeoutSpy).toHaveBeenCalled();
    expect(fetchWithTimeoutSpy).toHaveBeenCalledWith(
      // eslint-disable-next-line max-len
      `${SITECORE_EDGE_URL}/v1/events/v1.2/browser/create.json?client_key=`,
      3000,
      {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'X-Library-Version': LIBRARY_VERSION,
          'x-sitecore-contextid': contextId,
        },
      }
    );

    expect(fetch).toHaveBeenCalledWith(
      // eslint-disable-next-line max-len
      `${SITECORE_EDGE_URL}/v1/events/v1.2/browser/create.json?client_key=`,
      {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'X-Library-Version': LIBRARY_VERSION,
          'x-sitecore-contextid': contextId,
        },
        signal: new AbortController().signal,
      }
    );
    expect(res).toMatchObject({ clientId: mockResponse.ref });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(constructClientIdUrlSpy).toHaveBeenCalledWith(SITECORE_EDGE_URL);
  });

  it('should resolve with an appropriate response object', () => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve(mockResponse as EPResponse),
    });
    global.fetch = jest.fn().mockImplementationOnce(() => mockFetch) as typeof fetch;
    fetchClientIdFromEdgeProxy(SITECORE_EDGE_URL, contextId).then((res) => {
      expect(res).toMatchObject({ clientId: mockResponse.ref });
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
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

    global.fetch = jest.fn(() => Promise.reject(abortError));

    const expectedError = ERROR_MESSAGES.IE_005;

    expect(async () => {
      await fetchClientIdFromEdgeProxy(SITECORE_EDGE_URL, contextId);
    }).rejects.toThrow(expectedError);
  });

  it('should throw IE-005 error if fetch returns null - fetchWithTimeout', async () => {
    const fetchWithTimeoutSpy = jest.spyOn(utils, 'fetchWithTimeout').mockResolvedValue(null);

    const expectedError = ERROR_MESSAGES.IE_005;

    expect(async () => {
      await fetchClientIdFromEdgeProxy(SITECORE_EDGE_URL, contextId, 100);
    }).rejects.toThrow(expectedError);
    expect(fetchWithTimeoutSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw IE-005 error if fetch rejects - fetchWithTimeout', async () => {
    const fetchWithTimeoutSpy = jest
      .spyOn(utils, 'fetchWithTimeout')
      .mockRejectedValueOnce({ message: 'random error' });

    const expectedError = ERROR_MESSAGES.IE_005;

    expect(async () => {
      await fetchClientIdFromEdgeProxy(SITECORE_EDGE_URL, contextId, 100);
    }).rejects.toThrow(expectedError);
    expect(fetchWithTimeoutSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw [IV-002] when we pass negative timeout value', async () => {
    const fetchWithTimeoutSpy = jest.spyOn(utils, 'fetchWithTimeout').mockRejectedValueOnce({
      message: utils.ERROR_MESSAGES.IV_002,
    });

    expect(async () => {
      await fetchClientIdFromEdgeProxy(SITECORE_EDGE_URL, contextId, -100);
    }).rejects.toThrow(utils.ERROR_MESSAGES.IV_002);
    expect(fetchWithTimeoutSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw [IE-003] when we get an AbortError', async () => {
    const fetchWithTimeoutSpy = jest.spyOn(utils, 'fetchWithTimeout').mockRejectedValueOnce({
      message: utils.ERROR_MESSAGES.IE_003,
    });

    await expect(async () => {
      await fetchClientIdFromEdgeProxy(SITECORE_EDGE_URL, contextId, 100);
    }).rejects.toThrow(utils.ERROR_MESSAGES.IE_003);
    expect(fetchWithTimeoutSpy).toHaveBeenCalledTimes(1);
  });
});
