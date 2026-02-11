import * as core from '@sitecore-content-sdk/core';
import { PACKAGE_VERSION, X_CLIENT_SOFTWARE_ID } from '../../consts';
import { sendEvent } from './sendEvent';
import { jest, expect } from '@jest/globals';

jest.mock('@sitecore-content-sdk/analytics-core/internal', () => {
  const originalModule: object = jest.requireActual(
    '@sitecore-content-sdk/analytics-core/internal'
  );

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

jest.mock('../../debug', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  debug: {
    events: jest.fn(),
  },
}));

jest.mock('@sitecore-content-sdk/analytics-core/utils', () => {
  const originalModule: object = jest.requireActual('@sitecore-content-sdk/analytics-core/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

const config = {
  contextId: '123',
  edgeUrl: 'http://testurl',
  siteName: 'site',
};

describe('EventApiClient', () => {
  const eventData = {
    browser_id: 'cbb8da7f-ef24-48fe-89f4-f5c5186b607d',
    channel: 'WEB',
    client_key: 'key',
    currency: 'EUR',
    language: 'EN',
    page: 'races',
    pos: 'spinair.com',
    requested_at: '2024-01-01T00:00:00.000Z',
    type: 'CUSTOM_TYPE',
  };

  let fetchSpy: any;

  beforeEach(() => {
    fetchSpy = jest.spyOn(core.NativeDataFetcher.prototype, 'fetch').mockResolvedValue({
      data: { status: 'OK' },
    } as core.NativeDataFetcherResponse<unknown>);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Sends event with the correct values to Sitecore Cloud and show debug', async () => {
    jest.spyOn(core, 'processDebugResponse').mockReturnValue({
      headers: {},
      redirected: undefined,
      status: undefined,
      statusText: undefined,
      url: undefined,
    });
    let currentTime = 1609459200000;
    jest.spyOn(Date, 'now').mockImplementation(() => {
      const returnTime = currentTime;
      currentTime += 1000;
      return returnTime;
    });

    const expectedBody = JSON.stringify(eventData);
    const expectedUrl = 'http://testurl/v1/events/v1.2/events?siteId=site';

    await sendEvent(eventData, config).then((data) => {
      expect(data).toEqual({
        status: 'OK',
      });
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(expectedUrl, {
      body: expectedBody,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Software-ID': X_CLIENT_SOFTWARE_ID,
        'X-Library-Version': PACKAGE_VERSION,
        'x-sitecore-contextid': '123',
      },
      method: 'POST',
    });
  });

  it('Sends event with the correct values to Sitecore Cloud and show debug', async () => {
    jest.spyOn(core, 'processDebugResponse').mockReturnValue({});
    let currentTime = 1609459200000;
    jest.spyOn(Date, 'now').mockImplementation(() => {
      const returnTime = currentTime;
      currentTime += 1000;
      return returnTime;
    });

    const expectedBody = JSON.stringify(eventData);
    const expectedUrl = 'http://testurl/v1/events/v1.2/events?siteId=site';

    await sendEvent(eventData, config).then((data) => {
      expect(data).toEqual({
        status: 'OK',
      });
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(expectedUrl, {
      body: expectedBody,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Software-ID': X_CLIENT_SOFTWARE_ID,
        'X-Library-Version': PACKAGE_VERSION,
        'x-sitecore-contextid': '123',
      },
      method: 'POST',
    });
  });

  it('should return null if an error occurs and show debug', async () => {
    fetchSpy = jest.spyOn(core.NativeDataFetcher.prototype, 'fetch').mockRejectedValue({
      message: 'Error',
    });

    const response = await sendEvent(eventData, config);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(response).toEqual(null);
  });
});
