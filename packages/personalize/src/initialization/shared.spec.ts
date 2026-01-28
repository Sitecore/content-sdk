import { getPersonalizePlugin } from './shared';
import { PERSONALIZE_PLUGIN_NAME } from './const';
import * as coreModule from '@sitecore-content-sdk/core';
import { jest, expect } from '@jest/globals';

jest.mock('@sitecore-content-sdk/core', () => ({
  getCoreSettings: jest.fn(),
}));

describe('shared', () => {
  const mockCoreSettings = {
    plugins: new Map(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (coreModule.getCoreSettings as jest.Mock).mockReturnValue(mockCoreSettings);
    mockCoreSettings.plugins.clear();
  });

  describe('getPersonalizePlugin', () => {
    it('should return the personalize plugin from core settings', () => {
      const mockPlugin = {
        name: PERSONALIZE_PLUGIN_NAME,
        init: jest.fn(),
        dependencies: [],
        settings: {},
        environment: {},
      };
      mockCoreSettings.plugins.set(PERSONALIZE_PLUGIN_NAME, mockPlugin);

      const result = getPersonalizePlugin();

      expect(result).toBe(mockPlugin);
    });

    it('should throw an error when personalize plugin is not registered', () => {
      mockCoreSettings.plugins.clear();

      expect(() => getPersonalizePlugin()).toThrow('Personalize plugin is not registered');
    });
  });
});

