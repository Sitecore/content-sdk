import * as core from '@sitecore-content-sdk/__core__/internal';
import * as utilsModule from '@sitecore-content-sdk/utils';
import { ErrorMessages } from '../../consts';
import * as initializerModule from '../../initializer/browser/initializer';
import * as sendEventModule from '../send-event/sendEvent';
import { identity } from './identity';
import { IdentityEvent } from './identity-event';

jest.mock('@sitecore-content-sdk/__core__/internal', () => {
  const originalModule = jest.requireActual('@sitecore-content-sdk/__core__/internal');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});
jest.mock('../../initializer/browser/initializer', () => {
  const originalModule = jest.requireActual('../../initializer/browser/initializer');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    awaitInit: jest.fn(),
  };
});
jest.mock('@sitecore-content-sdk/__core__/browser', () => {
  const originalModule = jest.requireActual('@sitecore-content-sdk/__core__/browser');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    getCloudSDKSettings: jest.fn(),
  };
});

jest.mock('./identity-event', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    IdentityEvent: jest.fn().mockImplementation(() => {
      return {
        send: jest.fn(() => Promise.resolve('mockedResponse')),
      };
    }),
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
jest.mock('@sitecore-content-sdk/__core__/internal', () => {
  const originalModule = jest.requireActual('@sitecore-content-sdk/__core__/internal');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

const id = 'test_id';
const identityData = {
  channel: 'WEB',
  currency: 'EUR',
  identifiers: [
    {
      expiryDate: undefined,
      id,
      provider: 'email',
    },
  ],
  language: 'EN',
  page: 'identity',
};

const extensionData = { extKey: 'extValue' };

describe('identity', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send an IdentityEvent to the server', async () => {
    jest
      .spyOn(core, 'getEnabledPackageBrowser')
      .mockReturnValue({ initState: Promise.resolve() } as any);
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValue();
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

    const response = await identity({ ...identityData, extensionData });

    expect(IdentityEvent).toHaveBeenCalledWith({
      id,
      identityData: { ...identityData, extensionData },
      sendEvent: sendEventModule.sendEvent,
      settings: expect.objectContaining({}),
    });
    expect(response).toBe('mockedResponse');
    expect(getCookieValueClientSideSpy).toHaveBeenCalledTimes(1);
    expect(getSettingsSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw error if settings have not been configured properly', async () => {
    const getSettingsSpy = jest.spyOn(core, 'getCloudSDKSettingsBrowser');
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();

    getSettingsSpy.mockImplementation(() => {
      throw new Error(ErrorMessages.IE_0014);
    });
    await expect(async () => await identity({ ...identityData, extensionData })).rejects.toThrow(
      ErrorMessages.IE_0014
    );
  });
});
