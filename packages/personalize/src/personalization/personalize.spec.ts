import * as analyticsPluginsModule from '@sitecore-content-sdk/analytics-core/internal';
import * as coreModule from '@sitecore-content-sdk/core';
import * as personalizePluginModule from '../initialization/shared';
import { personalize } from './personalize';
import { Personalizer } from './personalizer';
import { jest, expect } from '@jest/globals';

jest.mock('./personalizer');
jest.mock('@sitecore-content-sdk/analytics-core/internal', () => ({
  getAnalyticsPlugin: jest.fn(),
}));
jest.mock('@sitecore-content-sdk/core', () => ({
  getCoreSettings: jest.fn(),
  debugModule: jest.fn(() => jest.fn()),
  debugNamespace: 'sitecore-content-sdk',
}));
jest.mock('../initialization/shared', () => ({
  getPersonalizePlugin: jest.fn(),
}));

describe('personalize', () => {
  describe('new init', () => {
    const clientId = 'client_id_value';
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
      siteName: '456',
      contextId: '123',
      edgeUrl: '',
    };

    const mockEnvironment = {
      getClientId: jest.fn().mockReturnValue(clientId),
      location: {
        getSearchParams: jest.fn().mockReturnValue(''),
      },
    };

    const mockPersonalizeEnvironment = {
      getGuestId: jest.fn().mockReturnValue(guestId),
      getUserAgent: jest.fn().mockReturnValue('test-user-agent'),
    };

    const mockCoreSettings = {
      settings,
      readyPromise: Promise.resolve(),
    };

    beforeEach(() => {
      jest.clearAllMocks();

      (coreModule.getCoreSettings as jest.Mock).mockReturnValue(mockCoreSettings);
      (analyticsPluginsModule.getAnalyticsPlugin as jest.Mock).mockReturnValue({
        environment: mockEnvironment,
      });
      (personalizePluginModule.getPersonalizePlugin as jest.Mock).mockReturnValue({
        environment: mockPersonalizeEnvironment,
      });
    });

    it('should return an object with available functionality', async () => {
      const getInteractiveExperienceDataSpy = jest.spyOn(
        Personalizer.prototype,
        'getInteractiveExperienceData'
      );

      expect(typeof personalize).toBe('function');

      await personalize(personalizeData);

      expect(coreModule.getCoreSettings).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(Personalizer).toHaveBeenCalledTimes(1);
      expect(Personalizer).toHaveBeenCalledWith(clientId, guestId);
    });

    it('should throw error if settings have not been configured properly', async () => {
      (coreModule.getCoreSettings as jest.Mock).mockImplementation(() => {
        throw new Error('Test error');
      });

      await expect(async () => await personalize(personalizeData)).rejects.toThrow('Test error');
    });

    it('should call getInteractiveExperience with timeout in opts object', async () => {
      const getInteractiveExperienceDataSpy = jest.spyOn(
        Personalizer.prototype,
        'getInteractiveExperienceData'
      );

      expect(typeof personalize).toBe('function');

      await personalize(personalizeData, { timeout: 100 });

      const expectedOpts = { timeout: 100, userAgent: 'test-user-agent' };
      const expectedData = personalizeData;
      const expectedSettings = settings;

      expect(coreModule.getCoreSettings).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
        expectedData,
        expectedSettings,
        '',
        expectedOpts
      );
    });

    it('should call getInteractiveExperience without opts object', async () => {
      const getInteractiveExperienceDataSpy = jest.spyOn(
        Personalizer.prototype,
        'getInteractiveExperienceData'
      );

      expect(typeof personalize).toBe('function');

      await personalize(personalizeData);

      const expectedOpts = { timeout: undefined, userAgent: 'test-user-agent' };
      const expectedData = personalizeData;
      const expectedSettings = settings;

      expect(coreModule.getCoreSettings).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
        expectedData,
        expectedSettings,
        '',
        expectedOpts
      );
    });

    it('should call getInteractiveExperience with search params', async () => {
      const searchParams = '?utm_campaign=campaign&utm_medium=email';
      mockEnvironment.location.getSearchParams.mockReturnValue(searchParams);

      const getInteractiveExperienceDataSpy = jest.spyOn(
        Personalizer.prototype,
        'getInteractiveExperienceData'
      );

      await personalize(personalizeData);

      expect(coreModule.getCoreSettings).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
        personalizeData,
        settings,
        searchParams,
        { timeout: undefined, userAgent: 'test-user-agent' }
      );
    });

    it('should use empty string for clientId when getClientId returns null', async () => {
      mockEnvironment.getClientId.mockReturnValue(null);

      await personalize(personalizeData);

      expect(Personalizer).toHaveBeenCalledWith('', guestId);
    });

    it('should use empty string for guestId when getGuestId returns null', async () => {
      mockEnvironment.getClientId.mockReturnValue(clientId);
      mockPersonalizeEnvironment.getGuestId.mockReturnValue(null);

      await personalize(personalizeData);

      expect(Personalizer).toHaveBeenCalledWith(clientId, '');
    });

    it('should handle undefined getUserAgent method', async () => {
      const mockPersonalizeEnvironmentWithoutUserAgent = {
        getGuestId: jest.fn().mockReturnValue(guestId),
      };

      (personalizePluginModule.getPersonalizePlugin as jest.Mock).mockReturnValue({
        environment: mockPersonalizeEnvironmentWithoutUserAgent,
      });
      mockEnvironment.location.getSearchParams.mockReturnValue('');

      const getInteractiveExperienceDataSpy = jest.spyOn(
        Personalizer.prototype,
        'getInteractiveExperienceData'
      );

      await personalize(personalizeData);

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(personalizeData, settings, '', {
        timeout: undefined,
        userAgent: undefined,
      });
    });

    it('should wait for core settings ready promise', async () => {
      let resolveReady: () => void;
      const readyPromise = new Promise<void>((resolve) => {
        resolveReady = resolve;
      });

      (coreModule.getCoreSettings as jest.Mock).mockReturnValue({
        ...mockCoreSettings,
        readyPromise,
      });

      const getInteractiveExperienceDataSpy = jest.spyOn(
        Personalizer.prototype,
        'getInteractiveExperienceData'
      );

      const personalizePromise = personalize(personalizeData);

      // Should not have been called yet
      expect(getInteractiveExperienceDataSpy).not.toHaveBeenCalled();

      // Resolve the ready promise
      resolveReady!();
      await personalizePromise;

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
    });
  });
});
