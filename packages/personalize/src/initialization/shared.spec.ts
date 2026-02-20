import { getPersonalizePlugin } from './shared';
import { PERSONALIZE_PLUGIN_NAME } from './const';
import * as coreModule from '@sitecore-content-sdk/core';
import { jest, expect } from '@jest/globals';

jest.mock('@sitecore-content-sdk/core', () => {
  const originalModule = jest.requireActual<typeof coreModule>('@sitecore-content-sdk/core');

  return {
    ...originalModule,
    getCoreContext: jest.fn(),
    debugModule: jest.fn(() => jest.fn()),
    debugNamespace: 'content-sdk',
  };
});

describe('shared', () => {
  const mockCoreContext = {
    plugins: new Map(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (coreModule.getCoreContext as jest.Mock).mockReturnValue(mockCoreContext);
    mockCoreContext.plugins.clear();
  });

  describe('getPersonalizePlugin', () => {
    it('should return the personalize plugin from core settings', () => {
      const mockPlugin = {
        name: PERSONALIZE_PLUGIN_NAME,
        init: jest.fn(),
        dependencies: [],
        settings: {},
        adapter: {},
      };
      mockCoreContext.plugins.set(PERSONALIZE_PLUGIN_NAME, mockPlugin);

      const result = getPersonalizePlugin();

      expect(result).toBe(mockPlugin);
    });

    it('should throw an error when personalize plugin is not registered', () => {
      mockCoreContext.plugins.clear();

      expect(() => getPersonalizePlugin()).toThrow(
        '[IE-004] Plugin not registered. You must first add "PersonalizePlugin" to the "initContentSdk()" "plugins" array.'
      );
    });
  });
});
