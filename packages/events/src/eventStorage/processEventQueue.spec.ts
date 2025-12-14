import type * as core from '@sitecore-content-sdk/__core__/internal';
import * as initializerModule from '../initializer/browser/initializer';
import * as eventQueue from './eventStorage';
import { processEventQueue } from './processEventQueue';

jest.mock('../events/custom-event/custom-event');
jest.mock('@sitecore-content-sdk/__core__/internal', () => {
  const originalModule = jest.requireActual('@sitecore-content-sdk/__core__/internal');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('processEventQueue', () => {
  const mockFetch = Promise.resolve({
    json: () => Promise.resolve({ ref: 'ref' } as core.EPResponse),
  });
  global.fetch = jest.fn().mockImplementation(() => mockFetch);

  const sendAllEventsSpy = jest.spyOn(eventQueue.eventQueue, 'sendAllEvents');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not send any event if queue is empty', async () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();

    await processEventQueue();

    expect(sendAllEventsSpy).toHaveBeenCalledTimes(1);
  });

  it('should send all events that are in the queue', async () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();

    await processEventQueue();

    expect(sendAllEventsSpy).toHaveBeenCalledTimes(1);
  });
});
