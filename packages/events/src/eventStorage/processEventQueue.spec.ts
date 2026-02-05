import * as coreModule from '@sitecore-content-sdk/core';
import * as eventsPluginModule from '../initialization/plugin';
import * as eventStorageModule from './eventStorage';
import { processEventQueue } from './processEventQueue';
import { jest, expect } from '@jest/globals';

jest.mock('@sitecore-content-sdk/core');
jest.mock('../initialization/plugin');

describe('processEventQueue', () => {
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

  it('should call sendAllEvents on the event queue', async () => {
    const sendAllEventsSpy = jest
      .spyOn(eventStorageModule.eventQueue, 'sendAllEvents')
      .mockResolvedValue();

    await processEventQueue();

    expect(sendAllEventsSpy).toHaveBeenCalledTimes(1);
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

    const sendAllEventsSpy = jest
      .spyOn(eventStorageModule.eventQueue, 'sendAllEvents')
      .mockResolvedValue();

    const processPromise = processEventQueue();

    // Should not have been called yet
    expect(sendAllEventsSpy).not.toHaveBeenCalled();

    // Resolve the ready promise
    resolveReady!();
    await processPromise;

    expect(sendAllEventsSpy).toHaveBeenCalledTimes(1);
  });

  it('should call getEventsPlugin to ensure plugin is initialized', async () => {
    jest.spyOn(eventStorageModule.eventQueue, 'sendAllEvents').mockResolvedValue();

    await processEventQueue();

    expect(eventsPluginModule.getEventsPlugin).toHaveBeenCalledTimes(1);
  });
});
