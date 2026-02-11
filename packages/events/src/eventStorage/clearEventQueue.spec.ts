import * as coreModule from '@sitecore-content-sdk/core';
import * as eventsPluginModule from '../initialization/plugin';
import { clearEventQueue } from './clearEventQueue';
import * as eventStorageModule from './eventStorage';
import { jest, expect } from '@jest/globals';

jest.mock('@sitecore-content-sdk/core');
jest.mock('../initialization/plugin');

describe('clearEventQueue', () => {
  const mockCoreContext = {
    settings: {
      contextId: '123',
      edgeUrl: 'https://edge.test.com',
    },
    readyPromise: Promise.resolve(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(coreModule, 'getCoreContext').mockReturnValue(mockCoreContext as any);
    jest.spyOn(eventsPluginModule, 'getEventsPlugin').mockReturnValue({} as any);
  });

  it('should clear the queue', async () => {
    const clearQueueSpy = jest
      .spyOn(eventStorageModule.eventQueue, 'clearQueue')
      .mockImplementation(() => {});

    await clearEventQueue();

    expect(clearQueueSpy).toHaveBeenCalledTimes(1);
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

    const clearQueueSpy = jest
      .spyOn(eventStorageModule.eventQueue, 'clearQueue')
      .mockImplementation(() => {});

    const clearPromise = clearEventQueue();

    // Should not have been called yet
    expect(clearQueueSpy).not.toHaveBeenCalled();

    // Resolve the ready promise
    resolveReady!();
    await clearPromise;

    expect(clearQueueSpy).toHaveBeenCalledTimes(1);
  });

  it('should call getEventsPlugin to ensure plugin is initialized', async () => {
    jest.spyOn(eventStorageModule.eventQueue, 'clearQueue').mockImplementation(() => {});

    await clearEventQueue();

    expect(eventsPluginModule.getEventsPlugin).toHaveBeenCalledTimes(1);
  });
});
