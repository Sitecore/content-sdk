import * as coreInternalModule from '@sitecore-content-sdk/analytics-core/internal';
import type { MiddlewareRequest } from '@sitecore-content-sdk/analytics-core/utils';
import { ErrorMessages } from '../consts';
import type { PersonalizeData } from './personalizer';
import { Personalizer } from './personalizer';
import { personalizeServer } from './personalizeServer';

jest.mock('./personalizer');

jest.mock('@sitecore-content-sdk/analytics-core/internal', () => {
  const originalModule = jest.requireActual('@sitecore-content-sdk/analytics-core/internal');

  return {
    __esModule: true,
    ...originalModule,
    getCloudSDKSettingsServer: jest.fn(),
    getEnabledPackageServer: jest.fn(),
  };
});

jest.mock('@sitecore-content-sdk/analytics-core/server', () => {
  const originalModule = jest.requireActual('@sitecore-content-sdk/analytics-core/server');

  return {
    __esModule: true,
    ...originalModule,
  };
});

describe('personalizeServer', () => {
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

    jest.spyOn(coreInternalModule, 'getCloudSDKSettingsServer').mockReturnValue(newSettings);
    const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' }) });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);
    const getInteractiveExperienceDataSpy = jest.spyOn(
      Personalizer.prototype,
      'getInteractiveExperienceData'
    );

    const originalReq = {
      cookies: {
        get() {
          return 'test';
        },
        set: () => undefined,
      },
      headers: {
        get: () => '',
      },
      url: '',
    };
    const personalizeData: PersonalizeData = {
      channel: 'WEB',
      currency: 'EUR',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN',
    };

    let req: MiddlewareRequest;

    beforeEach(() => {
      req = { ...originalReq };
      (coreInternalModule as any).builderInstanceServer = {};
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return an object with available functionality', async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValue({
        exec: jest.fn(),
        settings: {
          cookieSettings: {
            name: { guestId: '1234567' },
          },
        },
      } as any);
      req.headers.get = () => null;
      const getCookieValueFromRequestSpy = jest.spyOn(
        coreInternalModule,
        'getCookieValueFromRequest'
      );

      expect(typeof personalizeServer).toBe('function');

      await personalizeServer(req, personalizeData);

      expect(getCookieValueFromRequestSpy).toHaveBeenCalledTimes(2);
      expect(getCookieValueFromRequestSpy).toHaveBeenNthCalledWith(
        1,
        req,
        newSettings.cookieSettings.name.browserId
      );
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
        personalizeData,
        newSettings,
        '',
        {
          timeout: undefined,
          userAgent: null,
        }
      );
    });

    it('should include the user agent header and timeout in the opts object', async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValue({
        exec: jest.fn(),
        settings: {
          cookieSettings: {
            name: { guestId: '1234567' },
          },
        },
      } as any);
      const httpReq = {
        headers: {
          'user-agent': 'test_ua',
        },
      };

      await personalizeServer(httpReq, personalizeData);

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
        personalizeData,
        newSettings,
        '',
        {
          userAgent: 'test_ua',
        }
      );
    });

    it('should include the user agent header if in middleware request', async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValue({
        exec: jest.fn(),
        settings: {
          cookieSettings: {
            name: { guestId: '1234567' },
          },
        },
      } as any);
      const getMock = jest.fn().mockReturnValue('test_ua');
      req.headers.get = getMock;

      await personalizeServer(req, personalizeData, { timeout: 100 });

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
        personalizeData,
        newSettings,
        '',
        {
          timeout: 100,
          userAgent: 'test_ua',
        }
      );
      expect(getMock).toHaveBeenCalledWith('user-agent');
    });

    it('should throw error if settings have not been configured properly', async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValue({
        exec: jest.fn(),
        settings: {
          cookieSettings: {
            name: { guestId: '1234567' },
          },
        },
      } as any);
      jest.spyOn(coreInternalModule, 'getCloudSDKSettingsServer').mockImplementationOnce(() => {
        throw new Error(`Test error`);
      });

      await expect(async () => await personalizeServer(req, personalizeData)).rejects.toThrow(
        `Test error`
      );
    });

    it('should throw error new init used but personalize not initialized', async () => {
      jest
        .spyOn(coreInternalModule, 'getEnabledPackageServer')
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce(undefined);

      await expect(async () => await personalizeServer(req, personalizeData)).rejects.toThrow(
        ErrorMessages.IE_0017
      );

      expect(Personalizer).not.toHaveBeenCalled();
    });
  });
});
