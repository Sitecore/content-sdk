import * as analyticsPluginsModule from '@sitecore-content-sdk/analytics-core/internal';
import * as coreModule from '@sitecore-content-sdk/core';
import * as eventsPluginModule from '../../initialization/plugin';
import { sendEvent } from '../send-event/sendEvent';
import { CustomEvent } from './custom-event';
import type { EventData } from './custom-event';
import { event } from './event';
import { jest, expect } from '@jest/globals';

jest.mock('@sitecore-content-sdk/analytics-core/internal');
jest.mock('@sitecore-content-sdk/core');
jest.mock('../../initialization/plugin');
jest.mock('./custom-event');

describe('event', () => {
  const mockAdapter = {
    getClientId: jest.fn(),
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

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(coreModule, 'getCoreContext').mockReturnValue(mockCoreContext as any);
    jest
      .spyOn(analyticsPluginsModule, 'getAnalyticsPlugin')
      .mockReturnValue(mockAnalyticsPlugin as any);
    jest.spyOn(eventsPluginModule, 'getEventsPlugin').mockReturnValue({} as any);
  });

  it('should send a custom event to the server', async () => {
    const id = 'test_id';
    const eventData: EventData = {
      channel: 'WEB',
      currency: 'EUR',
      extensionData: {
        extKey: 'extValue',
      },
      language: 'EN',
      page: 'races',
      type: 'CUSTOM_TYPE',
    };

    mockAdapter.getClientId.mockReturnValue(id);

    await event(eventData);

    expect(CustomEvent).toHaveBeenCalledWith({
      eventData,
      id,
      sendEvent,
      config: { ...mockCoreContext.config, ...mockAnalyticsPlugin.options },
    });
    expect(CustomEvent).toHaveBeenCalledTimes(1);
  });

  it('should use empty string for id when getClientId returns null', async () => {
    const eventData: EventData = {
      channel: 'WEB',
      currency: 'EUR',
      type: 'CUSTOM_TYPE',
    };

    mockAdapter.getClientId.mockReturnValue(null);

    await event(eventData);

    expect(CustomEvent).toHaveBeenCalledWith({
      eventData,
      id: '',
      sendEvent,
      config: { ...mockCoreContext.config, ...mockAnalyticsPlugin.options },
    });
  });

  it('should wait for core context ready promise', async () => {
    let resolveReady: () => void;
    const readyPromise = new Promise<void>((resolve) => {
      resolveReady = resolve;
    });

    jest.spyOn(coreModule, 'getCoreContext').mockReturnValue({
      ...mockCoreContext,
      readyPromise,
    } as any);

    mockAdapter.getClientId.mockReturnValue('test_id');

    const eventPromise = event({ type: 'TEST' });

    expect(CustomEvent).not.toHaveBeenCalled();

    resolveReady!();
    await eventPromise;

    expect(CustomEvent).toHaveBeenCalledTimes(1);
  });

  it('should call getEventsPlugin to ensure plugin is initialized', async () => {
    mockAdapter.getClientId.mockReturnValue('test_id');

    await event({ type: 'TEST' });

    expect(eventsPluginModule.getEventsPlugin).toHaveBeenCalledTimes(1);
  });
});
