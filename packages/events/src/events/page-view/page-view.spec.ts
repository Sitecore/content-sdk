import * as analyticsPluginsModule from '@sitecore-content-sdk/analytics-core/internal';
import * as coreModule from '@sitecore-content-sdk/core';
import * as eventsPluginModule from '../../initialization/plugin';
import { sendEvent } from '../send-event/sendEvent';
import { getBotCookie, isBot } from './bot-detection';
import { pageView } from './page-view';
import type { PageViewData } from './page-view-event';
import { PageViewEvent } from './page-view-event';
import { jest, expect, describe, it, beforeEach } from '@jest/globals';

jest.mock('@sitecore-content-sdk/analytics-core/internal');
jest.mock('@sitecore-content-sdk/core');
jest.mock('../../initialization/plugin');
jest.mock('./bot-detection', () => {
  const original = jest.requireActual('./bot-detection') as typeof import('./bot-detection');
  return {
    ...original,
    getBotCookie: jest.fn(),
    isBot: jest.fn(),
  };
});
jest.mock('./page-view-event', () => {
  return {
    PageViewEvent: jest.fn().mockImplementation(() => {
      return {
        send: jest.fn(() => Promise.resolve('mockedResponse')),
      };
    }),
  };
});

describe('page-view', () => {
  const mockAdapter = {
    getClientId: jest.fn(),
    location: {
      getSearchParams: jest.fn(),
    },
  };

  const mockAnalyticsPlugin = {
    options: {
      cookies: {
        domain: 'cDomain',
        expiryDays: 730,
        name: { clientId: 'cid_name' },
        path: '/',
      },
    },
    adapter: mockAdapter,
  };

  const mockCoreContext = {
    config: {
      contextId: '123',
      edgeUrl: 'https://edge.test.com',
      siteName: '456',
    },
    readyPromise: Promise.resolve(),
  };

  const setupPluginMocks = () => {
    jest.spyOn(coreModule, 'getCoreContext').mockReturnValue(mockCoreContext as any);
    jest
      .spyOn(analyticsPluginsModule, 'getAnalyticsPlugin')
      .mockReturnValue(mockAnalyticsPlugin as any);
    jest.spyOn(eventsPluginModule, 'getEventsPlugin').mockReturnValue({} as any);
  };

  describe('pageView', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.mocked(getBotCookie).mockReturnValue(undefined);
      jest.mocked(isBot).mockReturnValue(false);
      setupPluginMocks();
    });

    it('should send a PageViewEvent with data', async () => {
      const id = 'test_id';
      const extensionData = { extKey: 'extValue' };
      const pageViewData: PageViewData = {
        channel: 'WEB',
        currency: 'EUR',
        language: 'EN',
        page: 'races',
      };

      mockAdapter.getClientId.mockReturnValue(id);
      mockAdapter.location.getSearchParams.mockReturnValue('?test=value');

      const response = await pageView({ ...pageViewData, extensionData });

      expect(PageViewEvent).toHaveBeenCalledWith({
        id,
        pageViewData: { ...pageViewData, extensionData },
        searchParams: '?test=value',
        sendEvent,
        config: { ...mockCoreContext.config, ...mockAnalyticsPlugin.options },
      });
      expect(response).toBe('mockedResponse');
    });

    it('should use empty string for id when getClientId returns null', async () => {
      const pageViewData: PageViewData = {
        channel: 'WEB',
        currency: 'EUR',
        language: 'EN',
        page: 'races',
      };

      mockAdapter.getClientId.mockReturnValue(null);
      mockAdapter.location.getSearchParams.mockReturnValue('');

      await pageView(pageViewData);

      expect(PageViewEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '',
        })
      );
    });

    it('should wait for core settings ready promise', async () => {
      let resolveReady: () => void;
      const readyPromise = new Promise<void>((resolve) => {
        resolveReady = resolve;
      });

      jest.spyOn(coreModule, 'getCoreContext').mockReturnValue({
        ...mockCoreContext,
        readyPromise,
      } as any);

      mockAdapter.getClientId.mockReturnValue('test_id');
      mockAdapter.location.getSearchParams.mockReturnValue('');

      const pageViewPromise = pageView({ channel: 'WEB' });

      expect(PageViewEvent).not.toHaveBeenCalled();

      resolveReady!();
      await pageViewPromise;

      expect(PageViewEvent).toHaveBeenCalledTimes(1);
    });

    it('should call getEventsPlugin to ensure plugin is initialized', async () => {
      mockAdapter.getClientId.mockReturnValue('test_id');
      mockAdapter.location.getSearchParams.mockReturnValue('');

      await pageView({ channel: 'WEB' });

      expect(eventsPluginModule.getEventsPlugin).toHaveBeenCalledTimes(1);
    });

    it('should pass searchParams from adapter.location.getSearchParams', async () => {
      mockAdapter.getClientId.mockReturnValue('test_id');
      mockAdapter.location.getSearchParams.mockReturnValue('?utm_source=google&utm_medium=cpc');

      await pageView({ channel: 'WEB' });

      expect(PageViewEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          searchParams: '?utm_source=google&utm_medium=cpc',
        })
      );
    });

    it('should return null and skip analytics when bot cookie is present', async () => {
      jest.mocked(getBotCookie).mockReturnValue('1');

      const result = await pageView({ channel: 'WEB' });

      expect(result).toBeNull();
      expect(getBotCookie).toHaveBeenCalled();
      expect(isBot).not.toHaveBeenCalled();
      expect(PageViewEvent).not.toHaveBeenCalled();
      expect(eventsPluginModule.getEventsPlugin).not.toHaveBeenCalled();
    });

    it('should return null when isBot is true and there is no bot cookie', async () => {
      jest.mocked(getBotCookie).mockReturnValue(undefined);
      jest.mocked(isBot).mockReturnValue(true);

      const result = await pageView({ channel: 'WEB' });

      expect(result).toBeNull();
      expect(getBotCookie).toHaveBeenCalled();
      expect(isBot).toHaveBeenCalledWith(navigator.userAgent);
      expect(PageViewEvent).not.toHaveBeenCalled();
      expect(eventsPluginModule.getEventsPlugin).not.toHaveBeenCalled();
    });
  });
});
