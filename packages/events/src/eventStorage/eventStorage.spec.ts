/* eslint-disable  @typescript-eslint/no-explicit-any */
import * as core from '@sitecore-content-sdk/analytics-core/internal';
import { CustomEvent } from '../events/custom-event/custom-event';
import type { EventData } from '../events/custom-event/custom-event';
import { sendEvent } from '../events/send-event/sendEvent';
import * as eventQueue from './eventStorage';
import { jest, expect } from '@jest/globals';

jest.mock('../events/custom-event/custom-event');
jest.mock('@sitecore-content-sdk/analytics-core/internal');

describe('Event Storage', () => {
  const eventData: EventData = {
    channel: 'WEB',
    currency: 'EUR',
    language: 'EN',
    page: 'races',
    type: 'CUSTOM_TYPE',
  };

  const inferLanguageSpy = jest.spyOn(core, 'language');
  const inferPageSpy = jest.spyOn(core, 'pageName');
  const getEventQueueSpy = jest.spyOn(eventQueue.eventQueue as any, 'getEventQueue');

  const storageMock = {
    getItem: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn(),
  };

  const id = 'test_id';

  const settings = {
    contextId: '123',
    edgeUrl: '',
    siteName: 'site',
  };

  beforeEach(() => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ status: 'OK' } as core.EPResponse),
    });
    global.fetch = jest.fn().mockImplementationOnce(() => mockFetch) as any;

    jest.clearAllMocks();
  });

  // it('getEventQueue should return empty array when no event is added to the queue', () => {
  //   const arrMock = jest.spyOn(global.Array, 'isArray');

  //   const getSessionStorageSpy = jest.spyOn(eventQueue.eventQueue as any, 'getSessionStorage');
  //   getSessionStorageSpy.mockImplementation(() => storageMock);

  //   const queueEventPayload: eventQueue.QueueEventPayload = {
  //     eventData,
  //     id,
  //     settings,
  //   };

  //   eventQueue.eventQueue.enqueueEvent(queueEventPayload);

  //   expect(inferLanguageSpy).toHaveBeenCalledTimes(0);
  //   expect(inferPageSpy).toHaveBeenCalledTimes(0);
  //   expect(getEventQueueSpy).toHaveBeenCalledTimes(1);
  //   expect(arrMock).toHaveBeenCalledTimes(1);
  //   expect(storageMock.getItem).toHaveBeenCalledTimes(1);
  //   expect(getEventQueueSpy).toHaveReturnedWith(expect.arrayContaining([]));
  // });

  it('getEventQueue should return an empty array when getItem returns null', () => {
    const mockArray: eventQueue.QueueEventPayload[] = [];

    const queueEventPayload: eventQueue.QueueEventPayload = {
      eventData,
      id,
      settings,
    };

    const getSessionStorageSpy = jest.spyOn(eventQueue.eventQueue as any, 'getSessionStorage');
    getSessionStorageSpy.mockImplementation(() => storageMock);
    storageMock.getItem.mockReturnValueOnce(null);

    mockArray.push(queueEventPayload);

    eventQueue.eventQueue.enqueueEvent(queueEventPayload);

    expect(getEventQueueSpy).toHaveBeenCalledTimes(1);
    expect(getEventQueueSpy).toHaveReturnedWith(expect.arrayContaining([]));
    expect(storageMock.setItem).toHaveBeenCalledTimes(1);
    expect(storageMock.setItem).toHaveBeenCalledWith('EventQueue', JSON.stringify(mockArray));
  });

  it('getEventQueue should return an empty array when getItem returns a string thats not parsed as an Array', () => {
    const mockArray: eventQueue.QueueEventPayload[] = [];

    const queueEventPayload: eventQueue.QueueEventPayload = {
      eventData,
      id,
      settings,
    };
    queueEventPayload.eventData.language = undefined;
    queueEventPayload.eventData.page = undefined;

    const getSessionStorageSpy = jest.spyOn(eventQueue.eventQueue as any, 'getSessionStorage');
    getSessionStorageSpy.mockImplementation(() => storageMock);
    storageMock.getItem.mockReturnValueOnce('"dadada"');

    mockArray.push(queueEventPayload);

    eventQueue.eventQueue.enqueueEvent(queueEventPayload);

    expect(inferLanguageSpy).toHaveBeenCalledTimes(1);
    expect(inferPageSpy).toHaveBeenCalledTimes(1);
    expect(getEventQueueSpy).toHaveBeenCalledTimes(1);
    expect(getEventQueueSpy).toHaveReturnedWith(expect.arrayContaining([]));
    expect(storageMock.setItem).toHaveBeenCalledTimes(1);
    expect(storageMock.setItem).toHaveBeenCalledWith('EventQueue', JSON.stringify(mockArray));
  });

  it('getEventQueue should return an empty array when JSON.parse throws error', () => {
    const mockArray: eventQueue.QueueEventPayload[] = [];
    const queueEventPayload: eventQueue.QueueEventPayload = {
      eventData,
      id,
      settings,
    };

    const getSessionStorageSpy = jest.spyOn(eventQueue.eventQueue as any, 'getSessionStorage');
    getSessionStorageSpy.mockImplementation(() => storageMock);
    storageMock.getItem.mockReturnValueOnce('dadada');

    mockArray.push(queueEventPayload);
    eventQueue.eventQueue.enqueueEvent(queueEventPayload);

    expect(getEventQueueSpy).toHaveBeenCalledTimes(1);
    expect(getEventQueueSpy).toHaveReturnedWith(expect.arrayContaining([]));
    expect(storageMock.setItem).toHaveBeenCalledTimes(1);
    expect(storageMock.setItem).toHaveBeenCalledWith('EventQueue', JSON.stringify(mockArray));
  });

  it('enqueueEvent should update the storage value when no event is added yet', () => {
    const mockArray: eventQueue.QueueEventPayload[] = [];
    const queueEventPayload: eventQueue.QueueEventPayload = {
      eventData,
      id,
      settings,
    };

    const getSessionStorageSpy = jest.spyOn(eventQueue.eventQueue as any, 'getSessionStorage');
    getSessionStorageSpy.mockImplementation(() => storageMock);
    storageMock.getItem.mockReturnValueOnce('dadada');

    mockArray.push(queueEventPayload);
    eventQueue.eventQueue.enqueueEvent(queueEventPayload);

    expect(CustomEvent).toHaveBeenCalledTimes(1);
    expect(CustomEvent).toHaveBeenNthCalledWith(1, {
      eventData,
      id,
      sendEvent,
      settings,
    });
    expect(getEventQueueSpy).toHaveBeenCalledTimes(1);
    expect(getEventQueueSpy).toHaveReturnedWith(mockArray);
    expect(storageMock.setItem).toHaveBeenCalledTimes(1);
    expect(storageMock.setItem).toHaveBeenCalledWith('EventQueue', JSON.stringify(mockArray));
  });

  it('enqueueEvent should update the storage value when storage event in not empty', () => {
    const mockArray: eventQueue.QueueEventPayload[] = [];
    const queueEventPayload: eventQueue.QueueEventPayload = { eventData, id, settings };
    const queueEventPayloadTwo: eventQueue.QueueEventPayload = {
      eventData,
      id: 'testId2',
      settings,
    };
    const queueEventPayloadThree: eventQueue.QueueEventPayload = {
      eventData,
      id: 'testId3',
      settings,
    };

    const getSessionStorageSpy = jest.spyOn(eventQueue.eventQueue as any, 'getSessionStorage');
    getSessionStorageSpy.mockImplementation(() => storageMock);

    mockArray.push(queueEventPayloadTwo);
    mockArray.push(queueEventPayloadThree);

    storageMock.getItem.mockReturnValueOnce(JSON.stringify(mockArray));
    mockArray.push(queueEventPayload);
    eventQueue.eventQueue.enqueueEvent(queueEventPayload);

    expect(getEventQueueSpy).toHaveBeenCalledTimes(1);
    expect(getEventQueueSpy).toHaveReturnedWith(mockArray);
    expect(storageMock.setItem).toHaveBeenCalledTimes(1);
    expect(storageMock.setItem).toHaveBeenCalledWith('EventQueue', JSON.stringify(mockArray));
    expect(storageMock.getItem).toHaveBeenCalledTimes(1);
  });

  it('sendAllEvents should send all stored events to EP.', async () => {
    const mockArray: eventQueue.QueueEventPayload[] = [];
    const queueEventPayloadTwo: eventQueue.QueueEventPayload = {
      eventData,
      id: 'testId1',
      settings,
    };
    const queueEventPayloadThree: eventQueue.QueueEventPayload = {
      eventData,
      id: 'testId2',
      settings,
    };
    const queueEventPayloadFour: eventQueue.QueueEventPayload = {
      eventData,
      id: 'testId3',
      settings,
    };

    jest
      .spyOn(CustomEvent.prototype as any, 'send')
      .mockResolvedValue({ status: 'OK' } as core.EPResponse);

    mockArray.push(queueEventPayloadTwo);
    mockArray.push(queueEventPayloadThree);
    mockArray.push(queueEventPayloadFour);

    getEventQueueSpy.mockReturnValueOnce(mockArray);
    eventQueue.eventQueue.sendAllEvents();

    expect(getEventQueueSpy).toHaveBeenCalledTimes(1);
  });

  it('clearQueue should call the removeItem from interface', () => {
    eventQueue.eventQueue.clearQueue();

    expect(storageMock.removeItem).toHaveBeenCalledTimes(1);
    expect(storageMock.removeItem).toHaveBeenCalledWith('EventQueue');
  });

  it('sendAllEvents should send events in the queue and clear the queue', async () => {
    const mockArray: eventQueue.QueueEventPayload[] = [];
    const queueEventPayloadTwo: eventQueue.QueueEventPayload = {
      eventData,
      id: 'testId2',
      settings,
    };
    const queueEventPayloadThree: eventQueue.QueueEventPayload = {
      eventData,
      id: 'testId3',
      settings,
    };

    jest
      .spyOn(CustomEvent.prototype as any, 'send')
      .mockResolvedValue({ status: 'OK' } as core.EPResponse);

    mockArray.push(queueEventPayloadTwo);
    mockArray.push(queueEventPayloadThree);

    const getSessionStorageSpy = jest.spyOn(eventQueue.eventQueue as any, 'getSessionStorage');
    getSessionStorageSpy.mockImplementation(() => storageMock);

    storageMock.getItem.mockReturnValueOnce(JSON.stringify(mockArray));
    await eventQueue.eventQueue.sendAllEvents();

    expect(CustomEvent).toHaveBeenCalledTimes(2);

    expect(CustomEvent).toHaveBeenNthCalledWith(1, {
      eventData: {
        ...queueEventPayloadTwo.eventData,
      },
      id: queueEventPayloadTwo.id,
      sendEvent,
      settings: queueEventPayloadTwo.settings,
    });

    expect(CustomEvent).toHaveBeenNthCalledWith(2, {
      eventData: {
        ...queueEventPayloadThree.eventData,
      },
      id: queueEventPayloadThree.id,
      sendEvent,
      settings: queueEventPayloadThree.settings,
    });

    expect(storageMock.removeItem).toHaveBeenCalledTimes(1);
    expect(storageMock.removeItem).toHaveBeenCalledWith('EventQueue');
  });

  it('getSessionStorage should return the browser sessionStorage', () => {
    const getSessionStorageSpy = jest.spyOn(eventQueue.eventQueue as any, 'getSessionStorage');

    // Call the method without mocking to test real implementation
    getSessionStorageSpy.mockRestore();

    const result = (eventQueue.eventQueue as any).getSessionStorage();

    expect(result).toBe(sessionStorage);
  });
});
