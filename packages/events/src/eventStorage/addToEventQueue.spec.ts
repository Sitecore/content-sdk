import * as core from '@sitecore-content-sdk/analytics-core/internal';
import * as utilsModule from '@sitecore-content-sdk/analytics-core/utils';
import type { EventData } from '../events/custom-event/custom-event';
import * as initializerModule from '../initializer/browser/initializer';
import { addToEventQueue } from './addToEventQueue';
import * as eventQueue from './eventStorage';

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
    getCookieValueClientSide: jest.fn(),
  };
});

const eventData: EventData = {
  channel: 'WEB',
  currency: 'EUR',
  language: 'EN',
  page: 'races',
  type: 'TEST_TYPE',
};

describe('addToEventQueue', () => {
  describe('new init', () => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ ref: 'ref' } as core.EPResponse),
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should add an event to the queue with the correct payload', async () => {
      jest.spyOn(core, 'getEnabledPackageBrowser').mockReturnValue({ initState: true } as any);
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
      const getCookieValueClientSideSpy = jest
        .spyOn(utilsModule, 'getCookieValueClientSide')
        .mockReturnValueOnce('test_id');
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

      const enqueueEventSpy = jest.spyOn(eventQueue.eventQueue, 'enqueueEvent');

      await addToEventQueue(eventData);

      expect(enqueueEventSpy).toHaveBeenCalledTimes(1);
      expect(getCookieValueClientSideSpy).toHaveBeenCalledTimes(1);
      expect(getSettingsSpy).toHaveBeenCalledTimes(1);
    });
  });
});
