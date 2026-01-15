import * as core from '@sitecore-content-sdk/analytics-core/internal';
import type { EPResponse, Settings } from '@sitecore-content-sdk/analytics-core/internal';
import * as utils from '@sitecore-content-sdk/analytics-core/utils';
import { ErrorMessages } from '../../consts';
import { MAX_EXT_ATTRIBUTES } from '../consts';
import * as sendEventModule from '../send-event/sendEvent';
import type { PageViewData } from './page-view-event';
import { PageViewEvent } from './page-view-event';
import { jest, expect } from '@jest/globals';

jest.mock('@sitecore-content-sdk/analytics-core/utils', () => {
  const originalModule = jest.requireActual('@sitecore-content-sdk/analytics-core/utils') as object;

  return {
    __esModule: true,
    ...originalModule,
  };
});
jest.mock('@sitecore-content-sdk/analytics-core/internal', () => {
  const originalModule = jest.requireActual(
    '@sitecore-content-sdk/analytics-core/internal'
  ) as object;

  return {
    __esModule: true,
    ...originalModule,
    debug: jest.fn(() => jest.fn()),
  };
});

describe('PageViewEvent', () => {
  const sendEventSpy = jest.spyOn(sendEventModule, 'sendEvent');
  const id = 'test_id';

  let expectedBasicAttributes = {};
  let pageViewData: PageViewData;
  let settings: Settings;

  // eslint-disable-next-line jsdoc/require-jsdoc
  function callPageViewEvent(
    pageViewData: any,
    id: any,
    settings: any,
    extensionData?: any,
    searchParams?: any
  ) {
    new PageViewEvent({
      id,
      pageViewData: { ...(pageViewData as object), extensionData },
      searchParams: searchParams ?? window.location.search,
      sendEvent: sendEventModule.sendEvent,
      settings,
    }).send();
  }

  beforeEach(() => {
    expectedBasicAttributes = {
      browser_id: id,
      channel: 'WEB',
      client_key: '',
      currency: 'EUR',
      language: 'EN',
      page: 'races',
      pos: '',
      requested_at: '2024-01-01T00:00:00.000Z',
    };

    pageViewData = {
      channel: 'WEB',
      currency: 'EUR',
      includeUTMParameters: true,
      language: 'EN',
      page: 'races',
    };

    settings = {
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
    jest.spyOn(core, 'language').mockImplementation(() => 'EN');
    jest.spyOn(core, 'pageName').mockImplementation(() => 'races');
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2024-01-01T00:00:00.000Z');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isFirstPageView', () => {
    it('should exist and should have value of true as default value', () => {
      expect(PageViewEvent.isFirstPageView).not.toBeUndefined();
      expect(PageViewEvent.isFirstPageView).toBe(true);
    });

    it('should change state to false when the event is sent', async () => {
      global.window ??= Object.create(window);
      const mockFetch = Promise.resolve({
        json: () => Promise.resolve({ status: 'OK' } as EPResponse),
      });
      global.fetch = jest.fn().mockImplementation(() => mockFetch) as any;

      const event = new PageViewEvent({
        id,
        pageViewData,
        searchParams: '',
        sendEvent: sendEventModule.sendEvent,
        settings,
      });

      expect(PageViewEvent.isFirstPageView).toBe(true);
      await event.send();
      expect(PageViewEvent.isFirstPageView).toBe(false);
    });
  });

  describe('check getPageVariantId function', () => {
    const getPageVariantIdSpy = jest.spyOn(PageViewEvent.prototype as any, 'getPageVariantId');
    let pageViewData: PageViewData = {
      channel: 'WEB',
      currency: 'EUR',
      includeUTMParameters: true,
      language: 'EN',
      page: 'races',
    };

    beforeEach(() => {
      const mockFetch = Promise.resolve({
        json: () => Promise.resolve({ status: 'OK' } as EPResponse),
      });
      global.fetch = jest.fn().mockImplementation(() => mockFetch) as any;

      pageViewData = {
        channel: 'WEB',
        currency: 'EUR',
        includeUTMParameters: true,
        language: 'EN',
        page: 'races',
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return the variantid if exists in the url of the window and not present in the event data', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          search: '?variantid=test_pageVariantId',
        },
        writable: true,
      });

      callPageViewEvent(pageViewData, id, settings);

      expect(getPageVariantIdSpy).toHaveReturnedWith('test_pageVariantId');
    });

    it(`should return the variantid if exists in the search params
     that is passed from the server and not present in the event data`, async () => {
      callPageViewEvent(pageViewData, id, settings, undefined, '?variantid=test_pageVariantId');
      expect(getPageVariantIdSpy).toHaveReturnedWith('test_pageVariantId');
    });
    it(`should return the variantid if passed as extension data and not
     present in neither the searchParams from the server nor in the event data`, async () => {
      Object.defineProperty(window, 'location', {
        value: {
          search: '',
        },
        writable: true,
      });
      pageViewData.pageVariantId = undefined;
      const extensionData = { pageVariantId: 'extVid' };

      callPageViewEvent(
        pageViewData,
        id,
        settings,
        extensionData,
        '?testVariantid=test_pageVariantId'
      );

      expect(getPageVariantIdSpy).toHaveReturnedWith('extVid');
    });

    it(`should return the variantid if passed as extension data and not
     present in neither the url nor in the event data`, async () => {
      Object.defineProperty(window, 'location', {
        value: {
          search: '',
        },
        writable: true,
      });

      pageViewData.pageVariantId = undefined;
      const extensionData = { pageVariantId: 'extVid' };

      callPageViewEvent(pageViewData, id, settings, extensionData);

      expect(getPageVariantIdSpy).toHaveReturnedWith('extVid');
    });
    it('should return null if the variantid does not exist in the search params property and event data', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          search: '',
        },
        writable: true,
      });

      callPageViewEvent(pageViewData, id, settings);

      expect(getPageVariantIdSpy).toHaveReturnedWith(null);
    });
    it('should not call flatten object method when no extension data is passed', async () => {
      const flattenObjectSpy = jest.spyOn(utils, 'flattenObject');
      Object.defineProperty(window, 'location', {
        value: {
          search: '',
        },
        writable: true,
      });

      callPageViewEvent(pageViewData, id, settings);

      expect(flattenObjectSpy).toHaveBeenCalledTimes(0);
    });
    it('should prioritize pageVariantId value from event data over extension data when provided in both', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          search: '',
        },
        writable: true,
      });
      const extensionData = { pageVariantId: 'extension_data_vid' };

      pageViewData.pageVariantId = 'vid';

      callPageViewEvent(pageViewData, id, settings, extensionData);

      const expectedAttributes = {
        ...expectedBasicAttributes,
        ext: { pageVariantId: 'vid' },
        type: 'VIEW',
      };

      expect(sendEventSpy).toHaveBeenCalledWith(expectedAttributes as any, settings);
    });
    it('should send an event with fetch without the pageVariantId', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          search: '',
        },
        writable: true,
      });

      callPageViewEvent(pageViewData, id, settings);

      const expectedAttributes = {
        ...expectedBasicAttributes,
        type: 'VIEW',
      };

      expect(sendEventSpy).toHaveBeenCalledWith(expectedAttributes as any, settings);
    });
  });

  it('should send a view event with an ext property containing extension data when passed', () => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ status: 'OK' } as EPResponse),
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch) as any;

    const extensionData = { test: { a: { b: 'b' }, c: 11 }, testz: 22 };

    callPageViewEvent(pageViewData, id, settings, extensionData);

    const expectedAttributes = {
      ...expectedBasicAttributes,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ext: { test_a_b: 'b', test_c: 11, testz: 22 },
      type: 'VIEW',
    };

    expect(sendEventSpy).toHaveBeenCalledWith(expectedAttributes as any, settings);
  });

  describe('Should throw error', () => {
    it('should throw an error when more than 50 ext attributes are passed', () => {
      const extensionData: { [key: string]: string } = {};
      for (let i = 0; i < 51; i++) extensionData[`key${i}`] = `value${i}`;

      expect(() => {
        callPageViewEvent(pageViewData, id, settings, extensionData);
      }).toThrow(ErrorMessages.IV_0005);
    });

    it('should not throw an error when no more than 50 ext attributes are passed', () => {
      const extensionData: { [key: string]: string } = {};
      for (let i = 0; i < MAX_EXT_ATTRIBUTES; i++) extensionData[`key${i}`] = `value${i}`;

      expect(() => {
        callPageViewEvent(pageViewData, id, settings, extensionData);
      }).not.toThrow(ErrorMessages.IV_0005);
    });
  });

  describe('getReferrer', () => {
    const getReferrerSpy = jest.spyOn(PageViewEvent.prototype as any, 'getReferrer');

    beforeEach(() => {
      jest.clearAllMocks();
      PageViewEvent.isFirstPageView = true;
    });
    afterEach(() => {
      jest.clearAllMocks();
      PageViewEvent.isFirstPageView = true;
    });

    it('getReferrer should return null if isFirstPageView is false ', async () => {
      PageViewEvent.isFirstPageView = false;
      callPageViewEvent(pageViewData, id, settings);

      expect(window).toBeDefined();
      expect(getReferrerSpy).toHaveBeenCalledTimes(1);
      expect(PageViewEvent.isFirstPageView).toBeFalsy();
    });
    it('getReferrer should return null if isFirstPageView is true and document referrer is empty string ', async () => {
      expect(PageViewEvent.isFirstPageView).toBeTruthy();
      callPageViewEvent(pageViewData, id, settings);

      expect(document.referrer).toBe('');
      expect(window).toBeDefined();
      expect(getReferrerSpy).toHaveBeenCalledTimes(1);
      expect(getReferrerSpy).toHaveReturnedWith(null);
    });

    it('getReferrer should return url if hostName is different from referrer', async () => {
      Object.defineProperty(document, 'referrer', {
        value: 'http://test.com/extra_path?search=test',
        writable: true,
      });
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'dddtest.com',
        },
        writable: true,
      });

      expect(PageViewEvent.isFirstPageView).toBeTruthy();
      callPageViewEvent(pageViewData, id, settings);

      const expectedAttributes = {
        ...expectedBasicAttributes,
        type: 'VIEW',
        referrer: 'http://test.com/extra_path?search=test',
      };

      expect(getReferrerSpy).toHaveBeenCalledTimes(1);
      expect(getReferrerSpy).toHaveReturnedWith('http://test.com/extra_path?search=test');
      expect(sendEventSpy).toHaveBeenCalledWith(expectedAttributes as any, settings);
    });

    it('should return null if host name is the same', async () => {
      Object.defineProperty(document, 'referrer', {
        value: 'http://test.com/extra_path?search=test',
        writable: true,
      });
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'test.com',
        },
        writable: true,
      });
      PageViewEvent.isFirstPageView = true;
      callPageViewEvent(pageViewData, id, settings, undefined);
      expect(getReferrerSpy).toHaveBeenCalledTimes(1);
      expect(getReferrerSpy).toHaveReturnedWith(null);
    });

    it(`getReferrer should be null if windows does not exists and referrer
     is not provided by the developer (Server Side Test)`, async () => {
      Object.defineProperty(global, 'window', {
        get: jest.fn().mockReturnValueOnce(undefined),
        // writable: true,
      });

      PageViewEvent.isFirstPageView = true;

      callPageViewEvent(pageViewData, id, settings, undefined, '');

      const expectedAttributes = {
        ...expectedBasicAttributes,
        type: 'VIEW',
      };

      expect(global.window).toBeUndefined();
      expect(window).toBeUndefined();
      expect(getReferrerSpy).toHaveBeenCalledTimes(1);
      expect(getReferrerSpy).toHaveReturnedWith(null);
      expect(sendEventSpy).toHaveBeenCalledWith(expectedAttributes as any, settings);
    });

    it('getReferrer should be retrieved if provided pageViewData and window is undefined', async () => {
      Object.defineProperty(global, 'window', {
        get: jest.fn().mockReturnValueOnce(undefined),
        // writable: true,
      });
      PageViewEvent.isFirstPageView = true;
      pageViewData.referrer = 'campaign';

      callPageViewEvent(pageViewData, id, settings, undefined, '');

      expect(window).toBeUndefined();
      expect(getReferrerSpy).toHaveBeenCalledTimes(1);
      expect(getReferrerSpy).toHaveReturnedWith('campaign');
    });
  });

  describe('check getUTMParameters function', () => {
    let windowSpy: any;
    let documentSpy: any;

    const getUTMParametersSpy = jest.spyOn(PageViewEvent.prototype as any, 'getUTMParameters');

    beforeEach(() => {
      jest.clearAllMocks();

      windowSpy = jest.spyOn(globalThis, 'window', 'get');
      documentSpy = jest.spyOn(globalThis, 'document', 'get');

      PageViewEvent.isFirstPageView = true;
      pageViewData.includeUTMParameters = undefined;

      const mockFetch = Promise.resolve({
        json: () => Promise.resolve({ status: 'OK' } as EPResponse),
      });
      global.fetch = jest.fn().mockImplementation(() => mockFetch) as any;
    });

    afterEach(() => {
      jest.clearAllMocks();
      PageViewEvent.isFirstPageView = true;
    });

    it('should not call getUTMParameters if includeUTMParameters is false', async () => {
      windowSpy.mockImplementation(() => ({
        location: {
          search: '',
        },
      }));

      pageViewData.includeUTMParameters = false;

      callPageViewEvent(pageViewData, id, settings);

      expect(getUTMParametersSpy).toHaveBeenCalledTimes(0);
    });

    it('should call getUTMParameters if includeUTMParameters is true', async () => {
      windowSpy.mockImplementation(() => ({
        location: {
          search: '',
        },
      }));

      pageViewData.includeUTMParameters = true;

      callPageViewEvent(pageViewData, id, settings);

      expect(getUTMParametersSpy).toHaveBeenCalledTimes(1);
    });

    it('should call getUTMParameters if PageViewData is empty', async () => {
      windowSpy.mockImplementation(() => ({
        location: {
          search: '',
        },
      }));

      callPageViewEvent(undefined, id, settings);

      expect(getUTMParametersSpy).toHaveBeenCalledTimes(1);
    });

    it('should return {} if urlSearchParams is empty', () => {
      windowSpy.mockImplementation(() => ({
        location: {
          search: '',
        },
      }));

      callPageViewEvent(pageViewData, id, settings);

      expect(getUTMParametersSpy).toHaveLastReturnedWith({});
    });

    it("should return an empty object if urlSearchParams doesn't contain utm_ params", () => {
      windowSpy.mockImplementation(() => ({
        location: {
          search: '?banana=banana',
        },
      }));

      callPageViewEvent(pageViewData, id, settings);

      expect(getUTMParametersSpy).toHaveReturnedWith({});
    });

    it('should return an object with utm_ params when urlSearchParams contains utm_params', () => {
      windowSpy.mockImplementation(() => ({
        location: {
          search: '?utm_campaign=campaign&utm_medium=email',
        },
      }));

      callPageViewEvent(pageViewData, id, settings);

      // eslint-disable-next-line @typescript-eslint/naming-convention
      expect(getUTMParametersSpy).toHaveReturnedWith({
        utm_campaign: 'campaign',
        utm_medium: 'email',
      });
    });

    it('should send event without utm_ params if the returned object is empty {}', () => {
      documentSpy.mockImplementation(() => ({
        referrer: undefined,
      }));

      jest.spyOn(PageViewEvent.prototype as any, 'getUTMParameters').mockReturnValueOnce({});

      callPageViewEvent(pageViewData, id, settings);
      const expectedAttributes = {
        ...expectedBasicAttributes,
        type: 'VIEW',
      };

      expect(sendEventSpy).toHaveBeenCalledWith(expectedAttributes as any, settings);
    });

    it('should send an event with utm_ params if the returned object is not empty', () => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      getUTMParametersSpy.mockReturnValueOnce({ utm_test: 'test' });
      callPageViewEvent(pageViewData, id, settings);
      const expectedAttributes = {
        ...expectedBasicAttributes,
        type: 'VIEW',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        utm_test: 'test',
      };
      expect(sendEventSpy).toHaveBeenCalledWith(expectedAttributes as any, settings);
    });
  });

  describe('send event with specific params', () => {
    let pageViewData: PageViewData = {
      includeUTMParameters: false,
      language: 'EN',
      page: 'races',
    };

    let expectedData: any = {
      browser_id: id,
      client_key: '',
      language: 'EN',
      page: 'races',
      pos: '',
      requested_at: '2024-01-01T00:00:00.000Z',
      type: 'VIEW',
    };

    it(`should send an event without 'channel' and currency 'params'`, async () => {
      callPageViewEvent(pageViewData, id, settings);

      expect(sendEventSpy).toHaveBeenCalledWith(expectedData as any, settings);
    });

    it(`should send an event with 'channel' and currency 'params'`, async () => {
      pageViewData = { ...pageViewData, channel: 'WEB', currency: 'EUR' };
      expectedData = { ...expectedData, channel: 'WEB', currency: 'EUR' };

      callPageViewEvent(pageViewData, id, settings);

      expect(sendEventSpy).toHaveBeenCalledWith(expectedData as any, settings);
    });
  });

  describe('send event with search data', () => {
    it(`should send an event with 'sc_search' payload if searchData is provided`, async () => {
      const pageViewData: PageViewData = {
        includeUTMParameters: false,
        language: 'EN',
        page: 'races',
        searchData: {
          action: 'view',
          name: 'home',
        },
      };

      const expectedData = {
        browser_id: id,
        client_key: '',
        language: 'EN',
        page: 'races',
        pos: '',
        requested_at: '2024-01-01T00:00:00.000Z',
        sc_search: {
          data: {
            action: 'view',
            name: 'home',
          },
          metadata: {
            ut_api_version: '1.0',
          },
        },
        type: 'VIEW',
      };

      callPageViewEvent(pageViewData, id, settings);

      expect(sendEventSpy).toHaveBeenCalledWith(expectedData as any, settings);
    });
  });

  describe('send event with no params', () => {
    const expectedData = {
      browser_id: id,
      channel: undefined,
      client_key: '',
      currency: undefined,
      ext: {
        pageVariantId: undefined,
      },
      language: 'EN',
      page: 'races',
      pos: '',
      requested_at: '2024-01-01T00:00:00.000Z',
      type: 'VIEW',
    };

    it(`should send an event without params`, async () => {
      new PageViewEvent({
        id,
        pageViewData: undefined,
        searchParams: '',
        sendEvent: sendEventModule.sendEvent,
        settings,
      }).send();
      expect(sendEventSpy).toHaveBeenCalledWith(expectedData as any, settings);
    });
  });
});
