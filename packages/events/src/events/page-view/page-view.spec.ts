import * as analyticsPluginsModule from '@sitecore-content-sdk/analytics-core/internal';
import * as coreModule from '@sitecore-content-sdk/core';
import * as eventsPluginModule from '../../initialization/plugin';
import { sendEvent } from '../send-event/sendEvent';
import { pageView } from './page-view';
import type { PageViewData } from './page-view-event';
import { PageViewEvent } from './page-view-event';
import { jest, expect } from '@jest/globals';

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

describe('pageView', () => {
  const mockAdapter = {
    getClientId: jest.fn(),
    location: {
      getSearchParams: jest.fn(),
    },
  };

  const mockAnalyticsPlugin = {
    settings: {
      cookieSettings: {
        domain: 'cDomain',
        expiryDays: 730,
        name: { clientId: 'cid_name' },
        path: '/',
      },
    },
    adapter: mockAdapter,
  };

  const mockCoreContext = {
    settings: {
      contextId: '123',
      edgeUrl: 'https://edge.test.com',
      siteName: '456',
    },
    readyPromise: Promise.resolve(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(coreModule, 'getCoreContext').mockReturnValue(mockCoreContext as any);
    jest
      .spyOn(analyticsPluginsModule, 'getAnalyticsPlugin')
      .mockReturnValue(mockAnalyticsPlugin as any);
    jest.spyOn(eventsPluginModule, 'getEventsPlugin').mockReturnValue({} as any);
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
      settings: { ...mockCoreContext.settings, ...mockAnalyticsPlugin.settings },
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
});
