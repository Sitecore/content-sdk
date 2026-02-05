import * as analyticsCore from '@sitecore-content-sdk/analytics-core/internal';
import * as utils from '@sitecore-content-sdk/analytics-core/utils';
import { PACKAGE_VERSION, X_CLIENT_SOFTWARE_ID } from '../../consts';
import { sendEvent } from './sendEvent';
import { jest, expect } from '@jest/globals';
import * as debugModule from '../../debug';

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

const settingsObj = {
  contextId: '123',
  edgeUrl: 'http://testurl',
  siteName: 'site',
};

describe('EventApiClient', () => {
  const normalizeHeadersSpy = jest.spyOn(utils, 'normalizeHeaders');

  const eventData = {
    client_id: 'cbb8da7f-ef24-48fe-89f4-f5c5186b607d',
    channel: 'WEB',
    client_key: 'key',
    currency: 'EUR',
    language: 'EN',
    page: 'races',
    pos: 'spinair.com',
    requested_at: '2024-01-01T00:00:00.000Z',
    type: 'CUSTOM_TYPE',
  };
  const mockDebugEvents = jest.spyOn(debugModule.debug, 'events');

  beforeEach(() => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ status: 'OK' } as analyticsCore.EPResponse),
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch) as typeof fetch;

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Sends event with the correct values to Sitecore Cloud and show debug', async () => {
    jest.spyOn(analyticsCore, 'processDebugResponse').mockReturnValue({
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

    await sendEvent(eventData, settingsObj).then((data) => {
      expect(data).toEqual({
        status: 'OK',
      });
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expectedUrl, {
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

    expect(mockDebugEvents).toHaveBeenCalled();
  });

  it('Sends event with the correct values to Sitecore Cloud and show debug', async () => {
    jest.spyOn(analyticsCore, 'processDebugResponse').mockReturnValue({});
    let currentTime = 1609459200000;
    jest.spyOn(Date, 'now').mockImplementation(() => {
      const returnTime = currentTime;
      currentTime += 1000;
      return returnTime;
    });

    const expectedBody = JSON.stringify(eventData);
    const expectedUrl = 'http://testurl/v1/events/v1.2/events?siteId=site';

    await sendEvent(eventData, settingsObj).then((data) => {
      expect(data).toEqual({
        status: 'OK',
      });
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expectedUrl, {
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

    expect(normalizeHeadersSpy).toHaveBeenCalledTimes(0);
    expect(mockDebugEvents).toHaveBeenCalled();
  });

  it('should return null if an error occurs and show debug', async () => {
    const mockFetch = Promise.reject('Error');

    global.fetch = jest.fn().mockImplementation(() => mockFetch) as any;

    const response = await sendEvent(eventData, settingsObj);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response).toEqual(null);

    expect(mockDebugEvents).toHaveBeenCalled();
  });
});
