import * as core from '@sitecore-content-sdk/analytics-core/internal';
import * as utils from '@sitecore-content-sdk/utils';
import { EVENTS_NAMESPACE, PACKAGE_VERSION, X_CLIENT_SOFTWARE_ID } from '../../consts';
import { sendEvent } from './sendEvent';

jest.mock('@sitecore-content-sdk/analytics-core/internal', () => {
  const originalModule = jest.requireActual('@sitecore-content-sdk/analytics-core/internal');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

jest.mock('@sitecore-content-sdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-content-sdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

const settingsObj: core.Settings = {
  cookieSettings: {
    domain: 'cDomain',
    expiryDays: 730,
    name: { browserId: 'bid_name' },
    path: '/',
  },
  siteName: 'site',
  sitecoreEdgeContextId: '123',
  sitecoreEdgeUrl: 'http://testurl',
};

describe('EventApiClient', () => {
  const normalizeHeadersSpy = jest.spyOn(utils, 'normalizeHeaders');
  let debugMock: jest.SpyInstance;

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
  beforeEach(() => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ status: 'OK' } as core.EPResponse),
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    debugMock = jest.spyOn(core, 'debug');
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

    expect(debugMock).toHaveBeenCalled();
    expect(debugMock).toHaveBeenCalledWith(EVENTS_NAMESPACE);
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
    expect(debugMock).toHaveBeenCalled();
    expect(debugMock).toHaveBeenCalledWith(EVENTS_NAMESPACE);
  });

  it('should return null if an error occurs and show debug', async () => {
    const mockFetch = Promise.reject('Error');

    global.fetch = jest.fn().mockImplementation(() => mockFetch) as any;

    const response = await sendEvent(eventData, settingsObj);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response).toEqual(null);

    expect(debugMock).toHaveBeenCalled();
    expect(debugMock).toHaveBeenCalledWith(EVENTS_NAMESPACE);
  });
});
