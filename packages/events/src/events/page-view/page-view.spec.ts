import * as core from '@sitecore-content-sdk/analytics-core/internal';
import * as utilsModule from '@sitecore-content-sdk/analytics-core/utils';
import { ErrorMessages } from '../../consts';
import * as initializerModule from '../../initializer/browser/initializer';
import { sendEvent } from '../send-event/sendEvent';
import { pageView } from './page-view';
import type { PageViewData } from './page-view-event';
import { PageViewEvent } from './page-view-event';

jest.mock('@sitecore-content-sdk/analytics-core/internal', () => {
  const originalModule = jest.requireActual('@sitecore-content-sdk/analytics-core/internal');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});
jest.mock('@sitecore-content-sdk/analytics-core/browser', () => {
  const originalModule = jest.requireActual('@sitecore-content-sdk/analytics-core/browser');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    getCloudSDKSettings: jest.fn(),
  };
});
jest.mock('@sitecore-content-sdk/analytics-core/utils', () => {
  const originalModule = jest.requireActual('@sitecore-content-sdk/analytics-core/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
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
jest.mock('@sitecore-content-sdk/analytics-core/utils', () => {
  const originalModule = jest.requireActual('@sitecore-content-sdk/analytics-core/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('pageView', () => {
  describe('new init', () => {
    it('should send a PageViewEvent with data', async () => {
      const id = 'test_id';
      const extensionData = { extKey: 'extValue' };
      const pageViewData: PageViewData = {
        channel: 'WEB',
        currency: 'EUR',
        language: 'EN',
        page: 'races',
      };
      jest.spyOn(core, 'getEnabledPackageBrowser').mockReturnValue({ initState: true } as any);
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
      const getCookieValueClientSideSpy = jest
        .spyOn(utilsModule, 'getCookieValueClientSide')
        .mockReturnValueOnce(id);
      const getSettingsSpy = jest.spyOn(core, 'getCloudSDKSettingsBrowser').mockReturnValue({
        cookieSettings: {
          domain: 'cDomain',
          expiryDays: 730,
          name: { browserId: 'bid_name' },
          path: '/',
        },
        siteName: '456',
        sitecoreEdgeContextId: '123',
        sitecoreEdgeUrl: '',
      });

      const response = await pageView({ ...pageViewData, extensionData });

      expect(PageViewEvent).toHaveBeenCalledWith({
        id,
        pageViewData: { ...pageViewData, extensionData },
        searchParams: window.location.search,
        sendEvent,
        settings: expect.objectContaining({}),
      });
      expect(response).toBe('mockedResponse');
      expect(getCookieValueClientSideSpy).toHaveBeenCalledTimes(1);
      expect(getSettingsSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw error if settings have not been configured properly', async () => {
      const extensionData = { extKey: 'extValue' };
      const pageViewData: PageViewData = {
        channel: 'WEB',
        currency: 'EUR',
        language: 'EN',
        page: 'races',
      };

      const getSettingsSpy = jest.spyOn(core, 'getCloudSDKSettingsBrowser');
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();

      getSettingsSpy.mockImplementation(() => {
        throw new Error(ErrorMessages.IE_0014);
      });

      await expect(async () => await pageView({ ...pageViewData, extensionData })).rejects.toThrow(
        ErrorMessages.IE_0014
      );
    });
  });
});
