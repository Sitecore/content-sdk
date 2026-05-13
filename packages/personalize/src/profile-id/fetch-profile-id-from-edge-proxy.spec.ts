/* eslint-disable max-len */
import { constants } from '@sitecore-content-sdk/core';
import { PACKAGE_VERSION } from '../consts';
import type {
  GetProfileIdResponse,
  GetProfileIdResponseError,
} from './fetch-profile-id-from-edge-proxy';
import { fetchProfileIdFromEdgeProxy } from './fetch-profile-id-from-edge-proxy';
import { jest, expect } from '@jest/globals';

const { ERROR_MESSAGES } = constants;

const API_VERSION = 'v1.2';
const SITECORE_EDGE_URL = 'https://edge-platform.sitecorecloud.io';

jest.mock('@sitecore-content-sdk/analytics-core/internal', () => ({
  __esModule: true,
  API_VERSION: 'v1.2',
  SITECORE_EDGE_URL: 'https://edge-platform.sitecorecloud.io',
}));

describe('fetchProfileIdFromEdgeProxy', () => {
  const cid = 'cid';
  const contextId = 'contextId';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the profile id', async () => {
    const expectedResponse = 'ref';
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ customer: { ref: expectedResponse } } as GetProfileIdResponse),
      ok: true,
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch) as typeof fetch;
    const response = await fetchProfileIdFromEdgeProxy(cid, contextId, SITECORE_EDGE_URL);
    expect(response).toBe(expectedResponse);
  });

  it('should call fetch with the correct url', async () => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ customer: { ref: 'ref' } } as GetProfileIdResponse),
      ok: true,
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch) as typeof fetch;

    const expectedUrl = `${SITECORE_EDGE_URL}/v1/events/${API_VERSION}/browser/${cid}/show.json?client_key=&api_token=`;
    await fetchProfileIdFromEdgeProxy(cid, contextId, SITECORE_EDGE_URL);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expectedUrl, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'X-Library-Version': PACKAGE_VERSION,
        'x-sitecore-contextid': contextId,
      },
    });
  });

  it('should return the error message if invalid params are passed', () => {
    const expectedMsg = 'error_message';
    const expectedMoreInfo = 'more_info';
    const mockFetch = Promise.resolve({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      json: () =>
        Promise.resolve({
          error_msg: expectedMsg,
          moreInfo: expectedMoreInfo,
        } as GetProfileIdResponseError),
      ok: false,
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch) as typeof fetch;

    const expectedErrorMessage = `${expectedMsg}, for more info: ${expectedMoreInfo}`;
    expect(() => fetchProfileIdFromEdgeProxy(cid, contextId, SITECORE_EDGE_URL)).rejects.toThrow(
      expectedErrorMessage
    );
  });

  it('should throw IE-006 error if no ref exists', async () => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ customer: {} }),
      ok: true,
    });

    global.fetch = jest.fn().mockImplementation(() => mockFetch) as typeof fetch;

    expect(async () => {
      await fetchProfileIdFromEdgeProxy(cid, contextId, SITECORE_EDGE_URL);
    }).rejects.toThrow(ERROR_MESSAGES.IE_006);
  });
});
