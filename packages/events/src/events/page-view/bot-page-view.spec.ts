import * as analyticsPluginsModule from '@sitecore-content-sdk/analytics-core/internal';
import * as coreModule from '@sitecore-content-sdk/core';
import * as eventsPluginModule from '../../initialization/plugin';
import { sendEvent } from '../send-event/sendEvent';
import { getBotCookie, isBot, isBrowserEnvironment } from './bot-detection';
import { botPageView } from './bot-page-view';
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
    isBrowserEnvironment: jest.fn().mockImplementation(original.isBrowserEnvironment),
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

describe('bot-page-view', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(getBotCookie).mockReturnValue(undefined);
    jest.mocked(isBot).mockReturnValue(false);
    jest
      .mocked(isBrowserEnvironment)
      .mockImplementation(
        (jest.requireActual('./bot-detection') as typeof import('./bot-detection')).isBrowserEnvironment
      );
    setupPluginMocks();
  });

  it('returns null in browser without calling analytics', async () => {
    const getCoreContextSpy = jest.spyOn(coreModule, 'getCoreContext');

    await expect(botPageView()).resolves.toBeNull();

    expect(getCoreContextSpy).not.toHaveBeenCalled();
    expect(eventsPluginModule.getEventsPlugin).not.toHaveBeenCalled();
    expect(analyticsPluginsModule.getAnalyticsPlugin).not.toHaveBeenCalled();
    expect(PageViewEvent).not.toHaveBeenCalled();
  });

  it('sends PageViewEvent with bot channel and random UUID', async () => {
    jest.mocked(isBrowserEnvironment).mockReturnValue(false);

    const uuid = '00000000-0000-4000-8000-000000000001';
    const randomUUIDMock = jest.fn(() => uuid);
    const randomUUIDDesc = Object.getOwnPropertyDescriptor(globalThis.crypto, 'randomUUID');
    Object.defineProperty(globalThis.crypto, 'randomUUID', {
      configurable: true,
      writable: true,
      value: randomUUIDMock,
    });

    try {
      mockAdapter.location.getSearchParams.mockReturnValue('?a=1');

      const response = await botPageView();

      expect(response).toBe('mockedResponse');
      expect(randomUUIDMock).toHaveBeenCalled();
      expect(PageViewEvent).toHaveBeenCalledWith({
        id: uuid,
        pageViewData: { channel: 'bot' },
        searchParams: '?a=1',
        sendEvent,
        config: { ...mockCoreContext.config, ...mockAnalyticsPlugin.options },
      });
      expect(eventsPluginModule.getEventsPlugin).toHaveBeenCalledTimes(1);
    } finally {
      if (randomUUIDDesc) {
        Object.defineProperty(globalThis.crypto, 'randomUUID', randomUUIDDesc);
      } else {
        Reflect.deleteProperty(globalThis.crypto, 'randomUUID');
      }
    }
  });
});
