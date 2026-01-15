import * as coreInternalModule from '@sitecore-content-sdk/analytics-core/internal';
import { ErrorMessages } from '../../consts';
import { sendEvent } from '../send-event/sendEvent';
import { CustomEvent } from './custom-event';
import type { EventData } from './custom-event';
import { eventServer } from './eventServer';

jest.mock('./custom-event');

jest.mock('@sitecore-content-sdk/analytics-core/utils', () => {
  const originalModule = jest.requireActual('@sitecore-content-sdk/analytics-core/utils');

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
  };
});

jest.mock('@sitecore-content-sdk/analytics-core/server', () => {
  const originalModule = jest.requireActual('@sitecore-content-sdk/analytics-core/server');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    getCloudSDKSettings: jest.fn(),
    getEnabledPackage: jest.fn(),
  };
});

describe('eventServer', () => {
  let eventData: EventData;
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
    jest.clearAllMocks();
  });

  beforeEach(() => {
    eventData = {
      channel: 'WEB',
      currency: 'EUR',
      extensionData: {
        extKey: 'extValue',
      },
      language: 'EN',
      page: 'races',
      type: 'CUSTOM_TYPE',
    };
  });

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
  });
  it('should send a custom event to the server', async () => {
    jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce({} as any);

    await eventServer(req, eventData);

    expect(getCookieValueFromRequestSpy).toHaveBeenCalled();
    expect(CustomEvent).toHaveBeenCalledTimes(1);
    expect(CustomEvent).toHaveBeenCalledWith({
      eventData,
      id: '1234',
      sendEvent,
      settings: newSettings,
    });
  });

  it('should throw error if settings have not been configured properly', async () => {
    jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce({} as any);
    jest.spyOn(coreInternalModule, 'getCloudSDKSettingsServer').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    await expect(async () => await eventServer(req, eventData)).rejects.toThrow('Test error');
  });

  it('should throw error new init used but events not initialized', async () => {
    jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce(undefined);
    jest.spyOn(coreInternalModule, 'getCloudSDKSettingsServer').mockReturnValueOnce({
      cookieSettings: { name: { browserId: 'test' } },
    } as any);
    await expect(async () => await eventServer(req, eventData)).rejects.toThrow(
      ErrorMessages.IE_0015
    );

    expect(CustomEvent).not.toHaveBeenCalled();
  });
});
