import * as core from '@sitecore-content-sdk/analytics-core/internal';
import * as utilsModule from '@sitecore-content-sdk/analytics-core/utils';
import { ErrorMessages } from '../../consts';
import * as initializerModule from '../../initializer/browser/initializer';
import { sendEvent } from '../send-event/sendEvent';
import { CustomEvent } from './custom-event';
import type { EventData } from './custom-event';
import { event } from './event';

jest.mock('../../initializer/browser/initializer');
jest.mock('./custom-event');
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
jest.mock('@sitecore-content-sdk/analytics-core/internal', () => {
  const originalModule = jest.requireActual('@sitecore-content-sdk/analytics-core/internal');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('event', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send a custom event to the server', async () => {
    const id = 'test_id';
    const eventData = {
      channel: 'WEB',
      currency: 'EUR',
      extensionData: {
        extKey: 'extValue',
      },
      language: 'EN',
      page: 'races',
      type: 'CUSTOM_TYPE',
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

    await event(eventData);

    expect(CustomEvent).toHaveBeenCalledWith({
      eventData,
      id,
      sendEvent,
      settings: {
        cookieSettings: {
          domain: 'cDomain',
          expiryDays: 730,
          name: { browserId: 'bid_name' },
          path: '/',
        },
        siteName: '456',
        sitecoreEdgeContextId: '123',
        sitecoreEdgeUrl: '',
      },
    });

    expect(CustomEvent).toHaveBeenCalledTimes(1);
    expect(getCookieValueClientSideSpy).toHaveBeenCalledTimes(1);
    expect(getSettingsSpy).toHaveBeenCalledTimes(1);
  });
});
it('should throw error if settings have not been configured properly', async () => {
  jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
  const getSettingsSpy = jest.spyOn(core, 'getCloudSDKSettingsBrowser');
  getSettingsSpy.mockImplementation(() => {
    throw new Error(ErrorMessages.IE_0014);
  });
  const eventData: EventData = {
    channel: 'WEB',
    currency: 'EUR',
    type: 'CUSTOM_TYPE',
  };
  await expect(async () => await event(eventData)).rejects.toThrow(ErrorMessages.IE_0014);
});
