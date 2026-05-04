import { TextEncoder as NodeTextEncoder } from 'util';
import { webcrypto as nodeWebCrypto } from 'crypto';
import * as analyticsPluginsModule from '@sitecore-content-sdk/analytics-core/internal';
import * as coreModule from '@sitecore-content-sdk/core';
import * as eventsPluginModule from '../../initialization/plugin';
import { sendEvent } from '../send-event/sendEvent';
import { botPageView } from './bot-page-view';
import { PageViewEvent } from './page-view-event';
import { jest, expect, describe, it, beforeEach, beforeAll } from '@jest/globals';

beforeAll(() => {
  (globalThis as unknown as { TextEncoder: typeof NodeTextEncoder }).TextEncoder = NodeTextEncoder;
  Object.defineProperty(globalThis, 'crypto', {
    configurable: true,
    value: nodeWebCrypto,
  });
});

jest.mock('@sitecore-content-sdk/analytics-core/internal');
jest.mock('@sitecore-content-sdk/core');
jest.mock('../../initialization/plugin');
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
  const page = '/';
  const language = 'en';

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
    setupPluginMocks();
  });

  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

  const getPageViewEventCallArgs = (callIndex: number) =>
    (PageViewEvent as unknown as jest.Mock).mock.calls[callIndex][0] as { id: string };

  it('sends PageViewEvent with bot channel and an id derived from userAgent', async () => {
    mockAdapter.location.getSearchParams.mockReturnValue('?a=1');

    const response = await botPageView({ page, language, userAgent: 'Googlebot/2.1' });

    expect(response).toBe('mockedResponse');
    expect(PageViewEvent).toHaveBeenCalledTimes(1);

    const args = getPageViewEventCallArgs(0);

    expect(args.id).toMatch(UUID_REGEX);
    expect(args).toMatchObject({
      pageViewData: {
        channel: 'bot',
        page,
        language,
        extensionData: {
          sourceUserAgent: 'Googlebot/2.1',
        },
      },
      searchParams: '?a=1',
      sendEvent,
      config: { ...mockCoreContext.config, ...mockAnalyticsPlugin.options },
    });
    expect(eventsPluginModule.getEventsPlugin).toHaveBeenCalledTimes(1);
  });

  it('produces the same id for the same userAgent across invocations', async () => {
    mockAdapter.location.getSearchParams.mockReturnValue('?a=1');

    await botPageView({ page, language, userAgent: 'Googlebot/2.1' });
    await botPageView({ page, language, userAgent: 'Googlebot/2.1' });

    expect(PageViewEvent).toHaveBeenCalledTimes(2);
    expect(getPageViewEventCallArgs(0).id).toBe(getPageViewEventCallArgs(1).id);
  });

  it('produces different ids for different userAgents', async () => {
    mockAdapter.location.getSearchParams.mockReturnValue('?a=1');

    await botPageView({ page, language, userAgent: 'Googlebot/2.1' });
    await botPageView({ page, language, userAgent: 'Bingbot/2.0' });

    expect(PageViewEvent).toHaveBeenCalledTimes(2);
    expect(getPageViewEventCallArgs(0).id).not.toBe(getPageViewEventCallArgs(1).id);
  });
});
