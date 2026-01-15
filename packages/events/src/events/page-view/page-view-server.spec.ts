import * as coreInternalModule from '@sitecore-content-sdk/analytics-core/internal';
import { ErrorMessages } from '../../consts';
import { sendEvent } from '../send-event/sendEvent';
import type { PageViewData } from './page-view-event';
import { PageViewEvent } from './page-view-event';
import { pageViewServer } from './page-view-server';

jest.mock('@sitecore-content-sdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-content-sdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});
jest.mock('@sitecore-content-sdk/analytics-core/internal', () => {
  const originalModule = jest.requireActual('@sitecore-content-sdk/analytics-core/internal');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    getCloudSDKSettingsServer: jest.fn(),
    getEnabledPackageServer: jest.fn(),
  };
});

jest.mock('./page-view-event', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    PageViewEvent: jest.fn().mockImplementation(() => {
      return {
        send: jest.fn(() => Promise.resolve('mockedResponse')),
      };
    }),
  };
});

jest.mock('@sitecore-content-sdk/analytics-core/server', () => {
  const originalModule = jest.requireActual('@sitecore-content-sdk/analytics-core/server');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('pageViewServer', () => {
  const extensionData = { extKey: 'extValue' };

  let pageViewData: PageViewData;

  const req = {
    cookies: {
      get() {
        return 'test';
      },
      set: () => undefined,
    },
    headers: {
      get: () => '',
      host: '',
    },
    ip: undefined,
    url: '',
  };

  afterEach(() => {
    pageViewData = {
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'races',
    };
  });

  describe('new init', () => {
    const newSettings = {
      cookieSettings: {
        domain: 'cDomain',
        expiryDays: 730,
        name: { browserId: 'bid_name' },
        path: '/',
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: '',
    };

    const getCookieValueFromRequestSpy = jest
      .spyOn(coreInternalModule, 'getCookieValueFromRequest')
      .mockReturnValueOnce('1234');
    jest.spyOn(coreInternalModule, 'getCloudSDKSettingsServer').mockReturnValue(newSettings);

    beforeEach(() => {
      (coreInternalModule as any).builderInstanceServer = {};
      jest.clearAllMocks();
    });

    it('should send a PageViewEvent to the server', async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce({} as any);

      const response = await pageViewServer(req, { ...pageViewData, extensionData });

      expect(getCookieValueFromRequestSpy).toHaveBeenCalled();
      expect(PageViewEvent).toHaveBeenCalledWith({
        id: '1234',
        pageViewData: { ...pageViewData, extensionData },
        searchParams: '',
        sendEvent,
        settings: newSettings,
      });
      expect(response).toBe('mockedResponse');
    });

    it('should throw error new init used but events not initialized', async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce(undefined);
      jest.spyOn(coreInternalModule, 'getCloudSDKSettingsServer').mockReturnValueOnce({
        cookieSettings: { name: { browserId: 'test' } },
      } as any);

      await expect(async () => await pageViewServer(req)).rejects.toThrow(ErrorMessages.IE_0015);
      expect(PageViewEvent).not.toHaveBeenCalled();
    });
  });
});
