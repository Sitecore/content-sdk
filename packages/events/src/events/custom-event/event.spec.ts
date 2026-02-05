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
  const mockEnvironment = {
    getClientId: jest.fn(),
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
    environment: mockEnvironment,
  };

  const mockCoreSettings = {
    settings: {
      contextId: '123',
      edgeUrl: 'https://edge.test.com',
      siteName: '456',
    },
    readyPromise: Promise.resolve(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(coreModule, 'getCoreSettings').mockReturnValue(mockCoreSettings as any);
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

    mockEnvironment.getClientId.mockReturnValue(id);

    await event(eventData);

    expect(CustomEvent).toHaveBeenCalledWith({
      eventData,
      id,
      sendEvent,
      settings: { ...mockCoreSettings.settings, ...mockAnalyticsPlugin.settings },
    });
    expect(CustomEvent).toHaveBeenCalledTimes(1);
  });

  it('should use empty string for id when getClientId returns null', async () => {
    const eventData: EventData = {
      channel: 'WEB',
      currency: 'EUR',
      type: 'CUSTOM_TYPE',
    };

    mockEnvironment.getClientId.mockReturnValue(null);

    await event(eventData);

    expect(CustomEvent).toHaveBeenCalledWith({
      eventData,
      id: '',
      sendEvent,
      settings: { ...mockCoreSettings.settings, ...mockAnalyticsPlugin.settings },
    });
  });

  it('should wait for core settings ready promise', async () => {
    let resolveReady: () => void;
    const readyPromise = new Promise<void>((resolve) => {
      resolveReady = resolve;
    });

    jest.spyOn(coreModule, 'getCoreSettings').mockReturnValue({
      ...mockCoreSettings,
      readyPromise,
    } as any);

    mockEnvironment.getClientId.mockReturnValue('test_id');

    const eventPromise = event({ type: 'TEST' });

    expect(CustomEvent).not.toHaveBeenCalled();

    resolveReady!();
    await eventPromise;

    expect(CustomEvent).toHaveBeenCalledTimes(1);
  });

  it('should call getEventsPlugin to ensure plugin is initialized', async () => {
    mockEnvironment.getClientId.mockReturnValue('test_id');

    await event({ type: 'TEST' });

    expect(eventsPluginModule.getEventsPlugin).toHaveBeenCalledTimes(1);
  });
});
