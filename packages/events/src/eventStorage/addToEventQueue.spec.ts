import * as analyticsPluginsModule from '@sitecore-content-sdk/analytics-core/internal';
import * as coreModule from '@sitecore-content-sdk/core';
import type { EventData } from '../events/custom-event/custom-event';
import * as eventsPluginModule from '../initialization/plugin';
import { addToEventQueue } from './addToEventQueue';
import * as eventStorageModule from './eventStorage';
import { jest, expect } from '@jest/globals';

jest.mock('@sitecore-content-sdk/analytics-core/internal');
jest.mock('@sitecore-content-sdk/core');
jest.mock('../initialization/plugin');

const eventData: EventData = {
  channel: 'WEB',
  currency: 'EUR',
  language: 'EN',
  page: 'races',
  type: 'TEST_TYPE',
};

describe('addToEventQueue', () => {
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
      siteName: '456',
    },
    environment: mockEnvironment,
  };

  const mockCoreSettings = {
    settings: {
      contextId: '123',
      sitecoreEdgeUrl: 'https://edge.test.com',
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

  it('should add an event to the queue with the correct payload', async () => {
    mockEnvironment.getClientId.mockReturnValue('test_id');

    const enqueueEventSpy = jest
      .spyOn(eventStorageModule.eventQueue, 'enqueueEvent')
      .mockImplementation(() => {});

    await addToEventQueue(eventData);

    expect(enqueueEventSpy).toHaveBeenCalledTimes(1);
    expect(enqueueEventSpy).toHaveBeenCalledWith({
      eventData,
      id: 'test_id',
      settings: { ...mockCoreSettings.settings, ...mockAnalyticsPlugin.settings },
    } as any);
  });

  it('should use empty string for id when getClientId returns null', async () => {
    mockEnvironment.getClientId.mockReturnValue(null);

    const enqueueEventSpy = jest
      .spyOn(eventStorageModule.eventQueue, 'enqueueEvent')
      .mockImplementation(() => {});

    await addToEventQueue(eventData);

    expect(enqueueEventSpy).toHaveBeenCalledTimes(1);
    expect(enqueueEventSpy).toHaveBeenCalledWith({
      eventData,
      id: '',
      settings: { ...mockCoreSettings.settings, ...mockAnalyticsPlugin.settings },
    } as any);
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

    const enqueueEventSpy = jest
      .spyOn(eventStorageModule.eventQueue, 'enqueueEvent')
      .mockImplementation(() => {});

    const addPromise = addToEventQueue(eventData);

    // Should not have been called yet
    expect(enqueueEventSpy).not.toHaveBeenCalled();

    // Resolve the ready promise
    resolveReady!();
    await addPromise;

    expect(enqueueEventSpy).toHaveBeenCalledTimes(1);
  });

  it('should call getEventsPlugin to ensure plugin is initialized', async () => {
    mockEnvironment.getClientId.mockReturnValue('test_id');
    jest.spyOn(eventStorageModule.eventQueue, 'enqueueEvent').mockImplementation(() => {});

    await addToEventQueue(eventData);

    expect(eventsPluginModule.getEventsPlugin).toHaveBeenCalledTimes(1);
  });
});
