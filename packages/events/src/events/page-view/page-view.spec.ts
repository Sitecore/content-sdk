import * as coreInit from '@sitecore-content-sdk/core';
import { pageView } from './page-view';
import type { PageViewData } from './page-view-event';
import { PageViewEvent } from './page-view-event';

// Mock the core init system
jest.mock('@sitecore-content-sdk/core', () => ({
  isInitialized: jest.fn(),
  getInitState: jest.fn(),
  getPlugin: jest.fn(),
  isPluginEnabled: jest.fn(),
  triggerDeferredInit: jest.fn(),
  getGroupSettings: jest.fn(),
}));

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

describe('pageView', () => {
  const mockGetCookie = jest.fn();
  const mockInitState = {
    config: {
      sitecoreContextId: 'test-context-id',
      sitecoreEdgeUrl: 'https://edge.example.com',
    },
    environment: {
      getCookie: mockGetCookie,
    },
  };
  const mockTrackingGroupSettings = {
    browserIdCookieName: 'bid_test',
    browserIdCookieMaxAge: 31536000,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { search: '?test=value' },
      writable: true,
    });
  });

  describe('with new init system', () => {
    it('should send a PageViewEvent with data when initialized', async () => {
      const browserId = 'test_browser_id';
      const pageViewData: PageViewData = {
        channel: 'WEB',
        currency: 'EUR',
        language: 'EN',
        page: 'races',
      };
      const extensionData = { extKey: 'extValue' };

      // Setup mocks
      (coreInit.isInitialized as jest.Mock).mockReturnValue(true);
      (coreInit.isPluginEnabled as jest.Mock).mockReturnValue(true);
      (coreInit.triggerDeferredInit as jest.Mock).mockResolvedValue(undefined);
      (coreInit.getInitState as jest.Mock).mockReturnValue(mockInitState);
      (coreInit.getGroupSettings as jest.Mock).mockReturnValue(mockTrackingGroupSettings);
      mockGetCookie.mockReturnValue(browserId);

      const response = await pageView({ ...pageViewData, extensionData });

      expect(coreInit.isInitialized).toHaveBeenCalled();
      expect(coreInit.isPluginEnabled).toHaveBeenCalledWith('@sitecore-content-sdk/events');
      expect(coreInit.triggerDeferredInit).toHaveBeenCalledWith('@sitecore-content-sdk/events');
      expect(coreInit.getInitState).toHaveBeenCalled();
      expect(coreInit.getGroupSettings).toHaveBeenCalledWith('tracking');
      expect(mockGetCookie).toHaveBeenCalledWith('bid_test');
      expect(PageViewEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          id: browserId,
          pageViewData: { ...pageViewData, extensionData },
          searchParams: '?test=value',
        })
      );
      expect(response).toBe('mockedResponse');
    });

    it('should return null when plugin is disabled (e.g., cookie consent not given)', async () => {
      const pageViewData: PageViewData = {
        channel: 'WEB',
        currency: 'EUR',
        language: 'EN',
        page: 'races',
      };

      // Setup mocks - SDK initialized but plugin disabled
      (coreInit.isInitialized as jest.Mock).mockReturnValue(true);
      (coreInit.isPluginEnabled as jest.Mock).mockReturnValue(false);

      const response = await pageView(pageViewData);

      expect(coreInit.isInitialized).toHaveBeenCalled();
      expect(coreInit.isPluginEnabled).toHaveBeenCalledWith('@sitecore-content-sdk/events');
      // Should NOT call triggerDeferredInit when disabled
      expect(coreInit.triggerDeferredInit).not.toHaveBeenCalled();
      // Should NOT call getInitState, getGroupSettings, or send event
      expect(coreInit.getInitState).not.toHaveBeenCalled();
      expect(coreInit.getGroupSettings).not.toHaveBeenCalled();
      expect(PageViewEvent).not.toHaveBeenCalled();
      expect(response).toBeNull();
    });

    it('should throw error if SDK is not initialized', async () => {
      const pageViewData: PageViewData = {
        channel: 'WEB',
        currency: 'EUR',
        language: 'EN',
        page: 'races',
      };

      (coreInit.isInitialized as jest.Mock).mockReturnValue(false);

      await expect(pageView(pageViewData)).rejects.toThrow(
        '[@sitecore-content-sdk/events] SDK not initialized'
      );
    });

    it('should throw error if events plugin is not properly initialized', async () => {
      const pageViewData: PageViewData = {
        channel: 'WEB',
        currency: 'EUR',
        language: 'EN',
        page: 'races',
      };

      (coreInit.isInitialized as jest.Mock).mockReturnValue(true);
      (coreInit.isPluginEnabled as jest.Mock).mockReturnValue(true);
      (coreInit.triggerDeferredInit as jest.Mock).mockResolvedValue(undefined);
      (coreInit.getInitState as jest.Mock).mockReturnValue(mockInitState);
      (coreInit.getGroupSettings as jest.Mock).mockReturnValue({}); // Missing browserIdCookieName

      await expect(pageView(pageViewData)).rejects.toThrow(
        '[@sitecore-content-sdk/events] Tracking group not properly initialized'
      );
    });

    it('should work without pageViewData parameter', async () => {
      const browserId = 'test_browser_id';

      (coreInit.isInitialized as jest.Mock).mockReturnValue(true);
      (coreInit.isPluginEnabled as jest.Mock).mockReturnValue(true);
      (coreInit.triggerDeferredInit as jest.Mock).mockResolvedValue(undefined);
      (coreInit.getInitState as jest.Mock).mockReturnValue(mockInitState);
      (coreInit.getGroupSettings as jest.Mock).mockReturnValue(mockTrackingGroupSettings);
      mockGetCookie.mockReturnValue(browserId);

      const response = await pageView();

      expect(PageViewEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          id: browserId,
          pageViewData: undefined,
        })
      );
      expect(response).toBe('mockedResponse');
    });

    it('should use default edge URL when not specified in config', async () => {
      const browserId = 'test_browser_id';
      const configWithoutEdgeUrl = {
        config: {
          sitecoreContextId: 'test-context-id',
          // No sitecoreEdgeUrl
        },
        environment: {
          getCookie: mockGetCookie,
        },
      };

      (coreInit.isInitialized as jest.Mock).mockReturnValue(true);
      (coreInit.isPluginEnabled as jest.Mock).mockReturnValue(true);
      (coreInit.triggerDeferredInit as jest.Mock).mockResolvedValue(undefined);
      (coreInit.getInitState as jest.Mock).mockReturnValue(configWithoutEdgeUrl);
      (coreInit.getGroupSettings as jest.Mock).mockReturnValue(mockTrackingGroupSettings);
      mockGetCookie.mockReturnValue(browserId);

      const response = await pageView();

      expect(PageViewEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          settings: expect.objectContaining({
            sitecoreEdgeUrl: 'https://edge-platform.sitecorecloud.io',
          }),
        })
      );
      expect(response).toBe('mockedResponse');
    });
  });
});
