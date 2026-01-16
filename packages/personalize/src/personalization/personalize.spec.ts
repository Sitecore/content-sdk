import * as coreBrowserModule from '@sitecore-content-sdk/analytics-core/browser';
import * as coreInternalModule from '@sitecore-content-sdk/analytics-core/internal';
import * as utilsModule from '@sitecore-content-sdk/analytics-core/utils';
import * as initializerModule from '../initializer/browser/initializer';
import { personalize } from './personalize';
import { Personalizer } from './personalizer';
import { expect } from '@jest/globals';

jest.mock('./personalizer');

jest.mock('@sitecore-content-sdk/analytics-core/internal', () => {
  const originalModule: object = jest.requireActual(
    '@sitecore-content-sdk/analytics-core/internal'
  );

  return {
    __esModule: true,
    ...originalModule,
    getCloudSDKSettingsBrowser: jest.fn(),
  };
});

jest.mock('@sitecore-content-sdk/analytics-core/browser', () => {
  const originalModule: object = jest.requireActual('@sitecore-content-sdk/analytics-core/browser');

  return {
    __esModule: true,
    ...originalModule,
    getBrowserId: jest.fn(),
  };
});

jest.mock('@sitecore-content-sdk/analytics-core/utils', () => {
  const originalModule: object = jest.requireActual('@sitecore-content-sdk/analytics-core/utils');

  return {
    __esModule: true,
    ...originalModule,
  };
});
describe('personalize', () => {
  describe('new init', () => {
    const browserId = 'browser_id_value';
    const guestId = 'guest_id_value';
    const personalizeData = {
      channel: 'WEB',
      currency: 'EUR',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN',
      page: 'races',
      pointOfSale: 'spinair.com',
    };

    const settings = {
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

    const personalizeSettings = {
      initState: true,
      settings: {
        cookieSettings: { name: { guestId: '123456' } },
        enablePersonalizeCookie: false,
      },
    };

    let windowSpy: jest.Spied<typeof globalThis.Window>;

    const mockFetch = () => Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' }) });
    global.fetch = jest.fn().mockImplementation(mockFetch);
    jest.spyOn(coreBrowserModule, 'getBrowserId').mockReturnValue(browserId);
    jest.spyOn(utilsModule, 'getCookieValueClientSide').mockReturnValue(guestId);

    beforeEach(() => {
      jest.clearAllMocks();
      windowSpy = jest.spyOn(globalThis, 'window', 'get');
    });
    it('should return an object with available functionality', async () => {
      jest
        .spyOn(coreInternalModule, 'getEnabledPackageBrowser')
        .mockReturnValue(personalizeSettings as any);
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();

      const getInteractiveExperienceDataSpy = jest.spyOn(
        Personalizer.prototype,
        'getInteractiveExperienceData'
      );
      const getSettingsSpy = jest
        .spyOn(coreInternalModule, 'getCloudSDKSettingsBrowser')
        .mockReturnValue(settings);

      expect(typeof personalize).toBe('function');

      getSettingsSpy.mockReturnValue(settings);

      await personalize(personalizeData);

      expect(getSettingsSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(Personalizer).toHaveBeenCalledTimes(1);
      expect(utilsModule.getCookieValueClientSide).toHaveBeenCalledWith(
        personalizeSettings.settings.cookieSettings.name.guestId
      );
    });

    it('should throw error if settings have not been configured properly', async () => {
      jest
        .spyOn(coreInternalModule, 'getEnabledPackageBrowser')
        .mockReturnValue({ initState: true } as any);
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();

      const getSettingsSpy = jest.spyOn(coreInternalModule, 'getCloudSDKSettingsBrowser');

      getSettingsSpy.mockImplementation(() => {
        throw new Error(`Test error`);
      });

      await expect(async () => await personalize(personalizeData)).rejects.toThrow(`Test error`);
    });

    it('should call getInteractiveExperience with timeout in opts object', async () => {
      jest
        .spyOn(coreInternalModule, 'getEnabledPackageBrowser')
        .mockReturnValue(personalizeSettings as any);
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
      const getInteractiveExperienceDataSpy = jest.spyOn(
        Personalizer.prototype,
        'getInteractiveExperienceData'
      );

      expect(typeof personalize).toBe('function');

      const getSettingsSpy = jest
        .spyOn(coreInternalModule, 'getCloudSDKSettingsBrowser')
        .mockReturnValue(settings);

      await personalize(personalizeData, { timeout: 100 });

      const expectedOpts = { timeout: 100 };
      const expectedData = personalizeData;
      const expectedSettings = settings;

      expect(getSettingsSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
        expectedData,
        expectedSettings,
        window.location.search,
        expectedOpts
      );
    });

    it('should call getInteractiveExperience without opts object', async () => {
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
      const getInteractiveExperienceDataSpy = jest.spyOn(
        Personalizer.prototype,
        'getInteractiveExperienceData'
      );

      expect(typeof personalize).toBe('function');

      const getSettingsSpy = jest
        .spyOn(coreInternalModule, 'getCloudSDKSettingsBrowser')
        .mockReturnValue(settings);

      await personalize(personalizeData);

      const expectedOpts = { timeout: undefined };
      const expectedData = personalizeData;
      const expectedSettings = settings;

      expect(getSettingsSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
        expectedData,
        expectedSettings,
        window.location.search,
        expectedOpts
      );
    });

    it('should call getInteractiveExperience without search params', async () => {
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
      const getInteractiveExperienceDataSpy = jest.spyOn(
        Personalizer.prototype,
        'getInteractiveExperienceData'
      );

      const getSettingsSpy = jest
        .spyOn(coreInternalModule, 'getCloudSDKSettingsBrowser')
        .mockReturnValue(settings);

      windowSpy.mockImplementation(
        () =>
          ({
            location: {
              search: '?utm_campaign=campaign&utm_medium=email',
            },
          } as any)
      );

      await personalize(personalizeData);

      expect(getSettingsSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
        personalizeData,
        settings,
        '?utm_campaign=campaign&utm_medium=email',
        { timeout: undefined }
      );
    });
  });
});
