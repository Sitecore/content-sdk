import * as core from '@sitecore-content-sdk/analytics-core/internal';
import type { Settings } from '@sitecore-content-sdk/analytics-core/internal';
import * as utils from '@sitecore-content-sdk/utils';
import { ErrorMessages } from '../../consts';
import { MAX_EXT_ATTRIBUTES } from '../consts';
import * as sendEventModule from '../send-event/sendEvent';
import { CustomEvent } from './custom-event';
import type { EventData } from './custom-event';

jest.mock('@sitecore-content-sdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-content-sdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});
jest.mock('@sitecore-content-sdk/analytics-core/internal', () => {
  const originalModule = jest.requireActual('@sitecore-content-sdk/analytics-core/internal');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('CustomEvent', () => {
  const id = 'test_id';
  const languageSpy = jest.spyOn(core, 'language').mockImplementation(() => 'EN');
  const pageNameSpy = jest.spyOn(core, 'pageName').mockImplementation(() => 'races');
  jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2024-01-01T00:00:00.000Z');

  beforeEach(() => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ status: 'OK' }),
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    jest.clearAllMocks();
  });

  describe('constructor', () => {
    let eventData: EventData;
    const settings: Settings = {
      cookieSettings: {
        domain: 'cDomain',
        expiryDays: 730,
        name: { browserId: 'bid_name' },
        path: '/',
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: '',
    };

    beforeEach(() => {
      eventData = {
        channel: 'WEB',
        currency: 'EUR',
        language: 'EN',
        page: 'races',
        type: 'CUSTOM_TYPE',
      };
    });
    it('should not call flatten object method when no extension data is passed', () => {
      const flattenObjectSpy = jest.spyOn(utils, 'flattenObject');
      Object.defineProperty(window, 'location', { value: { search: '' }, writable: true });
      new CustomEvent({ eventData, id, sendEvent: sendEventModule.sendEvent, settings }).send();

      expect(flattenObjectSpy).toHaveBeenCalledTimes(0);
    });
    it('should send a custom event without ext attribute if extensionData is an empty object', () => {
      const sendEventSpy = jest.spyOn(sendEventModule, 'sendEvent');
      const extensionData = {};
      new CustomEvent({
        eventData: { ...eventData, extensionData },
        id,
        sendEvent: sendEventModule.sendEvent,
        settings,
      }).send();

      expect(sendEventSpy).toHaveBeenCalledWith(
        expect.not.objectContaining({ ext: {} }),
        expect.objectContaining(settings)
      );
    });

    it('should send a custom event with flattened ext attributes', () => {
      const sendEventSpy = jest.spyOn(sendEventModule, 'sendEvent');
      const extensionData = { test: { a: { b: 'b' }, c: 11 }, testz: 22, za: undefined };
      new CustomEvent({
        eventData: { ...eventData, extensionData },
        id,
        sendEvent: sendEventModule.sendEvent,
        settings,
      }).send();

      const expectedExt = {
        ext: {
          test_a_b: 'b',
          test_c: 11,
          testz: 22,
        },
      };

      expect(sendEventSpy).toHaveBeenCalledWith(
        expect.objectContaining(expectedExt),
        expect.objectContaining(settings)
      );
    });

    it('should throw an error when more than 50 ext attributes are passed', () => {
      const extensionData: { [key: string]: string } = {};
      for (let i = 0; i < 51; i++) extensionData[`key${i}`] = `value${i}`;

      expect(() => {
        new CustomEvent({
          eventData: { ...eventData, extensionData },
          id,
          sendEvent: sendEventModule.sendEvent,
          settings,
        });
      }).toThrow(ErrorMessages.IV_0005);
    });

    it('should not throw an error when no more than 50 ext attributes are passed', () => {
      const extensionData: { [key: string]: string } = {};
      for (let i = 0; i < MAX_EXT_ATTRIBUTES; i++) extensionData[`key${i}`] = `value${i}`;

      expect(() => {
        new CustomEvent({
          eventData: { ...eventData, extensionData },
          id,
          sendEvent: sendEventModule.sendEvent,
          settings,
        });
      }).not.toThrow(ErrorMessages.IV_0005);
    });
  });

  describe('send', () => {
    const settings: core.Settings = {
      cookieSettings: {
        domain: 'cDomain',
        expiryDays: 730,
        name: { browserId: 'bid_name' },
        path: '/',
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: '',
    };

    it('should send the event with top level attributes', async () => {
      const sendEventSpy = jest.spyOn(sendEventModule, 'sendEvent');
      const eventData = {
        channel: 'WEB',
        currency: 'EUR',
        language: 'EN',
        page: 'races',
        testAttr1: 'test',
        testAttr2: true,
        testAttr3: 22,
        type: 'CUSTOM_TYPE',
      };

      const expectedExt = {
        testAttr1: 'test',
        testAttr2: true,
        testAttr3: 22,
      };

      new CustomEvent({ eventData, id, sendEvent: sendEventModule.sendEvent, settings }).send();

      expect(sendEventSpy).toHaveBeenCalledWith(
        expect.objectContaining(expectedExt),
        expect.objectContaining(settings)
      );
    });

    it('should not call flatten object method when no extension data is passed', async () => {
      const eventData = {
        channel: 'WEB',
        currency: 'EUR',
        type: 'CUSTOM_TYPE',
      };

      const flattenObjectSpy = jest.spyOn(utils, 'flattenObject');

      new CustomEvent({ eventData, id, sendEvent: sendEventModule.sendEvent, settings }).send();

      expect(flattenObjectSpy).toHaveBeenCalledTimes(0);
      expect(languageSpy).toHaveBeenCalledTimes(1);
      expect(pageNameSpy).toHaveBeenCalledTimes(1);
    });

    it('should send the event without the ext object', async () => {
      const sendEventSpy = jest.spyOn(sendEventModule, 'sendEvent');

      const eventData = {
        channel: 'WEB',
        currency: 'EUR',
        language: 'EN',
        page: 'races',
        type: 'CUSTOM_TYPE',
      };

      const expectedData = {
        browser_id: id,
        channel: 'WEB',
        client_key: '',
        currency: 'EUR',
        language: 'EN',
        page: 'races',
        pos: '',
        requested_at: '2024-01-01T00:00:00.000Z',
        type: 'CUSTOM_TYPE',
      };

      new CustomEvent({ eventData, id, sendEvent: sendEventModule.sendEvent, settings }).send();

      expect(sendEventSpy).toHaveBeenCalledWith(expectedData, settings);
      expect(languageSpy).toHaveBeenCalledTimes(0);
      expect(pageNameSpy).toHaveBeenCalledTimes(0);
    });

    it('should send the event without infer', async () => {
      const sendEventSpy = jest.spyOn(sendEventModule, 'sendEvent');

      const eventData = {
        channel: 'WEB',
        currency: 'EUR',
        type: 'CUSTOM_TYPE',
      };

      const expectedData = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        browser_id: id,
        channel: 'WEB',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_key: '',
        currency: 'EUR',
        language: 'EN',
        page: 'races',
        pos: '',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        requested_at: '2024-01-01T00:00:00.000Z',
        type: 'CUSTOM_TYPE',
      };

      new CustomEvent({ eventData, id, sendEvent: sendEventModule.sendEvent, settings }).send();

      expect(sendEventSpy).toHaveBeenCalledWith(expectedData, settings);
      expect(languageSpy).toHaveBeenCalledTimes(1);
      expect(pageNameSpy).toHaveBeenCalledTimes(1);
    });

    it('should send the event without channel and currency info', async () => {
      const sendEventSpy = jest.spyOn(sendEventModule, 'sendEvent');

      const eventData = {
        type: 'CUSTOM_TYPE',
      };

      const expectedData = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        browser_id: id,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_key: '',
        language: 'EN',
        page: 'races',
        pos: '',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        requested_at: '2024-01-01T00:00:00.000Z',
        type: 'CUSTOM_TYPE',
      };

      new CustomEvent({ eventData, id, sendEvent: sendEventModule.sendEvent, settings }).send();

      expect(sendEventSpy).toHaveBeenCalledWith(expectedData, settings);
      expect(languageSpy).toHaveBeenCalledTimes(1);
      expect(pageNameSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe('search data', () => {
    it('should include sc_search if searchData is provided', async () => {
      const settings: Settings = {
        cookieSettings: {
          domain: 'cDomain',
          expiryDays: 730,
          name: { browserId: 'bid_name' },
          path: '/',
        },
        siteName: '456',
        sitecoreEdgeContextId: '123',
        sitecoreEdgeUrl: '',
      };
      const sendEventSpy = jest.spyOn(sendEventModule, 'sendEvent');

      const eventData = {
        channel: 'WEB',
        currency: 'EUR',
        language: 'EN',
        page: 'races',
        searchData: { test: 1234 },
        type: 'CUSTOM_TYPE',
      };

      const expectedData = {
        browser_id: id,
        channel: 'WEB',
        client_key: '',
        currency: 'EUR',
        language: 'EN',
        page: 'races',
        pos: '',
        requested_at: '2024-01-01T00:00:00.000Z',
        sc_search: {
          data: {
            test: 1234,
          },
          metadata: {
            ut_api_version: '1.0',
          },
        },
        type: 'CUSTOM_TYPE',
      };

      new CustomEvent({ eventData, id, sendEvent: sendEventModule.sendEvent, settings }).send();

      expect(sendEventSpy).toHaveBeenCalledWith(expectedData, settings);
    });
  });
});
