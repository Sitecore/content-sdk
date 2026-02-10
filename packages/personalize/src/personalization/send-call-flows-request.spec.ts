import * as coreModule from '@sitecore-content-sdk/core';
import * as utils from '@sitecore-content-sdk/analytics-core/utils';
import { PACKAGE_VERSION } from '../consts';
import type { EPCallFlowsBody } from './send-call-flows-request';
import { sendCallFlowsRequest } from './send-call-flows-request';
import { jest, expect } from '@jest/globals';

jest.mock('@sitecore-content-sdk/analytics-core/internal', () => ({
  __esModule: true,
  API_VERSION: 'v1.2',
  SITECORE_EDGE_URL: 'https://edge-platform.sitecorecloud.io',
  generateCorrelationId: () => 'b10bb699bfb3419bb63f638c62ed1aa7',
}));

jest.mock('../debug', () => {
  const originalModule: object = jest.requireActual('../debug');

  return {
    __esModule: true,
    ...originalModule,
    debug: {
      personalize: jest.fn(),
    },
  };
});

jest.mock('@sitecore-content-sdk/analytics-core/utils', () => {
  const originalModule: object = jest.requireActual('@sitecore-content-sdk/analytics-core/utils');

  return {
    __esModule: true,
    ...originalModule,
  };
});

describe('sendCallFlowsRequest', () => {
  let currentTime = 1609459200000; // Starting timestamp

  const settingsObj: { contextId: string; sitecoreEdgeUrl: string; siteName: string } = {
    siteName: 'site',
    contextId: '123',
    sitecoreEdgeUrl: 'http://testurl',
  };
  const personalizeDataOriginal = {
    channel: 'WEB',
    clientKey: '',
    currencyCode: 'EUR',
    friendlyId: 'personalizeintegrationtest',
    guestRef: 'guestRef',
    language: 'EN',
    pointOfSale: '',
  };
  let personalizeData: EPCallFlowsBody = { ...personalizeDataOriginal };
  let fetchSpy: any;

  beforeEach(() => {
    fetchSpy = jest.spyOn(coreModule.NativeDataFetcher.prototype, 'fetch').mockResolvedValue({
      data: { status: 'OK' },
    } as coreModule.NativeDataFetcherResponse<unknown>);

    personalizeData = { ...personalizeDataOriginal };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('requests', () => {
    personalizeData.email = 'test';
    personalizeData.identifiers = {
      id: '1',
      provider: 'email',
    };
    personalizeData.params = {
      customNumber: 123,
      customString: 'example value',
    };

    it('sends personalize with the correct values', async () => {
      jest.spyOn(Date, 'now').mockImplementation(() => {
        const returnTime = currentTime;
        currentTime += 1000;
        return returnTime;
      });
      personalizeData = {
        channel: 'WEB',
        clientKey: 'key',
        currencyCode: 'EUR',
        friendlyId: 'personalizeintegrationtest',
        guestRef: 'guestRef',
        language: 'EN',
        pointOfSale: '',
      };

      const payload = await sendCallFlowsRequest(personalizeData, settingsObj);

      expect(payload).toEqual({ status: 'OK' });

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith('http://testurl/v1/personalize?siteId=site', {
        headers: {
          'Content-Type': 'application/json',
          'X-Library-Version': PACKAGE_VERSION,
          'x-sc-correlation-id': 'b10bb699bfb3419bb63f638c62ed1aa7',
          'x-sitecore-contextid': '123',
        },
        method: 'POST',
        body: JSON.stringify(personalizeData),
      });

      // expect(debugMock).toHaveBeenCalled();
      // expect((debugMock as unknown as jest.Mock).mock.calls[0][0]).toBe(
      //   'Personalize request: %s with options: %O'
      // );
      // expect((debugMock as unknown as jest.Mock).mock.calls[0][1]).toBe(
      //   'http://testurl/v1/personalize?siteId=site'
      // );

      // expect((debugMock as unknown as jest.Mock).mock.calls[1][0]).toBe(
      //   'Personalize response in %dms : %O'
      // );
      // expect((debugMock as unknown as jest.Mock).mock.calls[1][1]).toBe(1000);
      // expect((debugMock as unknown as jest.Mock).mock.calls[1][2]).toStrictEqual({
      //   body: { status: 'OK' },
      //   headers: {},
      //   redirected: undefined,
      //   status: undefined,
      //   statusText: undefined,
      //   url: undefined,
      // });
    });

    it('should return null if an error occurs', async () => {
      jest
        .spyOn(coreModule.NativeDataFetcher.prototype, 'fetch')
        .mockRejectedValue(new Error('Error'));

      const response = await sendCallFlowsRequest(personalizeData, settingsObj);
      expect(response).toEqual(null);

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith('http://testurl/v1/personalize?siteId=site', {
        headers: {
          'Content-Type': 'application/json',
          'X-Library-Version': PACKAGE_VERSION,
          'x-sc-correlation-id': 'b10bb699bfb3419bb63f638c62ed1aa7',
          'x-sitecore-contextid': '123',
        },
        method: 'POST',
        body: JSON.stringify(personalizeData),
      });
    });

    it('should return null if resolved response equals null', async () => {
      jest.spyOn(Date, 'now').mockImplementation(() => {
        const returnTime = currentTime;
        currentTime += 1000;
        return returnTime;
      });

      const fetchSpy = jest
        .spyOn(coreModule.NativeDataFetcher.prototype, 'fetch')
        .mockResolvedValue({ data: null } as coreModule.NativeDataFetcherResponse<unknown>);

      const response = await sendCallFlowsRequest(personalizeData, settingsObj, { timeout: 100 });
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith('http://testurl/v1/personalize?siteId=site', {
        headers: {
          'Content-Type': 'application/json',
          'X-Library-Version': PACKAGE_VERSION,
          'x-sc-correlation-id': 'b10bb699bfb3419bb63f638c62ed1aa7',
          'x-sitecore-contextid': '123',
        },
        method: 'POST',
        body: JSON.stringify(personalizeData),
      });
      expect(response).toEqual(null);
    });

    it('should return the resolved value', async () => {
      jest.spyOn(Date, 'now').mockImplementation(() => {
        const returnTime = currentTime;
        currentTime += 1000;
        return returnTime;
      });
      const fetchSpy = jest
        .spyOn(coreModule.NativeDataFetcher.prototype, 'fetch')
        .mockResolvedValue({
          status: 200,
          statusText: 'OK',
          data: { status: 'OK' },
        } as coreModule.NativeDataFetcherResponse<unknown>);

      const response = await sendCallFlowsRequest(personalizeData, settingsObj, { timeout: 100 });
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(response).toEqual({ status: 'OK' });
      expect(fetchSpy).toHaveBeenCalledWith('http://testurl/v1/personalize?siteId=site', {
        headers: {
          'Content-Type': 'application/json',
          'X-Library-Version': PACKAGE_VERSION,
          'x-sc-correlation-id': 'b10bb699bfb3419bb63f638c62ed1aa7',
          'x-sitecore-contextid': '123',
        },
        method: 'POST',
        body: JSON.stringify(personalizeData),
      });
    });

    it('should throw [IV-0006] when we pass negative timeout value', async () => {
      const fetchSpy = jest
        .spyOn(coreModule.NativeDataFetcher.prototype, 'fetch')
        .mockImplementationOnce(() => {
          throw new Error(utils.ERROR_MESSAGES.IV_0006);
        });

      await expect(async () => {
        await sendCallFlowsRequest(personalizeData, settingsObj, { timeout: -100 });
      }).rejects.toThrow(utils.ERROR_MESSAGES.IV_0006);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw [IE-0002] when we get an AbortError', async () => {
      const fetchSpy = jest
        .spyOn(coreModule.NativeDataFetcher.prototype, 'fetch')
        .mockImplementationOnce(() => {
          throw new Error(utils.ERROR_MESSAGES.IE_0002);
        });

      await expect(async () => {
        await sendCallFlowsRequest(personalizeData, settingsObj, { timeout: -100 });
      }).rejects.toThrow(utils.ERROR_MESSAGES.IE_0002);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it('should return null if generic error is thrown', async () => {
      const fetchSpy = jest
        .spyOn(coreModule.NativeDataFetcher.prototype, 'fetch')
        .mockReturnValueOnce(Promise.reject({ message: 'random error' }));

      const response = await sendCallFlowsRequest(personalizeData, settingsObj, { timeout: 100 });
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(response).toEqual(null);
      expect(fetchSpy).toHaveBeenCalledWith('http://testurl/v1/personalize?siteId=site', {
        headers: {
          'Content-Type': 'application/json',
          'X-Library-Version': PACKAGE_VERSION,
          'x-sc-correlation-id': 'b10bb699bfb3419bb63f638c62ed1aa7',
          'x-sitecore-contextid': '123',
        },
        method: 'POST',
        body: JSON.stringify(personalizeData),
      });
    });
  });

  describe('opts object', () => {
    const personalizeData: EPCallFlowsBody = { ...personalizeDataOriginal, email: 'test' };
    const expectedUrl = 'http://testurl/v1/personalize?siteId=site';
    const expectedOpts = {
      body: JSON.stringify({
        channel: 'WEB',
        clientKey: '',
        currencyCode: 'EUR',
        friendlyId: 'personalizeintegrationtest',
        guestRef: 'guestRef',
        language: 'EN',
        pointOfSale: '',
        // eslint-disable-next-line sort-keys
        email: 'test',
      }),
      headers: {
        /* eslint-disable @typescript-eslint/naming-convention */
        'Content-Type': 'application/json',
        'X-Library-Version': PACKAGE_VERSION,
        'x-sc-correlation-id': 'b10bb699bfb3419bb63f638c62ed1aa7',
        'x-sitecore-contextid': '123',
        /* eslint-enable @typescript-eslint/naming-convention */
      },
      method: 'POST',
    };

    it('should call fetchWithTimeout with user agent if provided', async () => {
      const fetchSpy = jest
        .spyOn(coreModule.NativeDataFetcher.prototype, 'fetch')
        .mockReturnValueOnce(Promise.reject({ message: 'random error' }));

      const response = await sendCallFlowsRequest(personalizeData, settingsObj, {
        timeout: 100,
        userAgent: 'test_ua',
      });
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      const expectedOptsWithUA = {
        ...expectedOpts,

        headers: { ...expectedOpts.headers, 'User-Agent': 'test_ua' },
      };

      expect(fetchSpy).toHaveBeenLastCalledWith(expectedUrl, expectedOptsWithUA);
      expect(response).toEqual(null);
    });

    it('should call fetchWithTimeout without user agent if not provided', async () => {
      const fetchSpy = jest
        .spyOn(coreModule.NativeDataFetcher.prototype, 'fetch')
        .mockReturnValueOnce(Promise.reject({ message: 'random error' }));

      const response = await sendCallFlowsRequest(personalizeData, settingsObj, { timeout: 100 });

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenLastCalledWith(expectedUrl, expectedOpts);
      expect(response).toEqual(null);
    });

    it('should call fetch without user agent if not provided', async () => {
      await sendCallFlowsRequest(personalizeData, settingsObj);

      expect(fetchSpy).toHaveBeenLastCalledWith(expectedUrl, expectedOpts);
    });

    it('should call fetch with user agent if provided', async () => {
      await sendCallFlowsRequest(personalizeData, settingsObj, { userAgent: 'test_ua' });

      const expectedOptsWithUA = {
        ...expectedOpts,

        headers: { ...expectedOpts.headers, 'User-Agent': 'test_ua' },
      };

      expect(fetchSpy).toHaveBeenLastCalledWith(expectedUrl, expectedOptsWithUA);
    });
  });
});
