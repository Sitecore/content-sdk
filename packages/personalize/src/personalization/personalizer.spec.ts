import * as analyticsCore from '@sitecore-content-sdk/analytics-core/internal';
import * as coreModule from '@sitecore-content-sdk/core';
import { PACKAGE_VERSION } from '../consts';
import type { PersonalizeData, PersonalizeIdentifierInput } from './personalizer';
import { Personalizer } from './personalizer';
import * as CallFlowsRequest from './send-call-flows-request';
import { jest, expect } from '@jest/globals';

const { ERROR_MESSAGES } = coreModule.constants;

const UTILS_ERROR_MESSAGES = coreModule.constants.ERROR_MESSAGES;
const SITECORE_EDGE_URL = coreModule.constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT;

jest.mock('@sitecore-content-sdk/analytics-core/internal', () => ({
  __esModule: true,
  API_VERSION: 'v1.2',
  generateCorrelationId: () => 'b10bb699bfb3419bb63f638c62ed1aa7',
  language: jest.fn(),
}));

jest.mock('../debug', () => {
  const originalModule: object = jest.requireActual('../debug');

  return {
    __esModule: true,
    ...originalModule,
    debug: {
      personalize: jest.fn(),
    },
  };
});

describe('Test Personalizer Class', () => {
  const { window } = global;
  let settingsMock: { contextId: string; edgeUrl: string; siteName: string };
  let personalizeInputMock: PersonalizeData;
  const clientId = 'clientId';
  const profileId = 'profileId';

  beforeEach(() => {
    jest.spyOn(analyticsCore as any, 'language').mockImplementation(() => 'EN');
    personalizeInputMock = {
      channel: 'WEB',
      currency: 'EUR',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN',
    };

    settingsMock = {
      siteName: '456',
      contextId: '123',
      edgeUrl: SITECORE_EDGE_URL,
    };

    global.window ??= Object.create(window);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Test Personalizer validation ', () => {
    // eslint-disable-next-line jsdoc/require-jsdoc
    function callValidation(personalizeInputMock: PersonalizeData, errorMessage: string) {
      const action = async () => {
        await new Personalizer(clientId, profileId).getInteractiveExperienceData(
          personalizeInputMock,
          settingsMock,
          ''
        );
      };
      expect(() => action()).rejects.toThrow(errorMessage);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    }
    const validateSpy = jest.spyOn(Personalizer.prototype as any, 'validate');
    const sanitizeInputSpy = jest.spyOn(Personalizer.prototype as any, 'sanitizeInput');

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should not throw error when friendlyId are provided', async () => {
      await new Personalizer(clientId, profileId).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        ''
      );
      expect(validateSpy).toHaveBeenCalledTimes(1);
      expect(() => validateSpy).not.toThrow(ERROR_MESSAGES.MV_004);
      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw error when friendlyId is undefined ', async () => {
      const mockData = undefined;
      personalizeInputMock.friendlyId = mockData as unknown as string;
      callValidation(personalizeInputMock, ERROR_MESSAGES.MV_004);
    });

    it('should throw error when friendlyId is empty space string', async () => {
      personalizeInputMock.friendlyId = ' ';
      callValidation(personalizeInputMock, ERROR_MESSAGES.MV_004);
    });

    it('should throw error when friendlyId is empty string', async () => {
      personalizeInputMock.friendlyId = '';
      callValidation(personalizeInputMock, ERROR_MESSAGES.MV_004);
    });
  });

  describe('Test Personalizer getInteractiveExperienceData method and private calls', () => {
    const getInteractiveExperienceDataSpy = jest.spyOn(
      Personalizer.prototype,
      'getInteractiveExperienceData'
    );
    const sanitizeInputSpy = jest.spyOn(Personalizer.prototype as any, 'sanitizeInput');
    const mapPersonalizeInputToEPDataSpy = jest.spyOn(
      Personalizer.prototype as any,
      'mapPersonalizeInputToEPData'
    );
    const sendCallFlowsRequestSpy = jest.spyOn(CallFlowsRequest, 'sendCallFlowsRequest');

    beforeEach(() => {
      jest.spyOn(coreModule.NativeDataFetcher.prototype, 'fetch').mockResolvedValue({
        data: { status: 'OK' },
      } as coreModule.NativeDataFetcherResponse<unknown>);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it(`should return undefined language if language methods in not on window 
    or window.document.documentElement.lang.length is less than 2`, () => {
      personalizeInputMock.language = undefined;
      new Personalizer(clientId, profileId).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        ''
      );
      expect(mapPersonalizeInputToEPDataSpy).toHaveBeenCalledTimes(1);
      expect(analyticsCore.language).toHaveBeenCalledTimes(1);
      expect(mapPersonalizeInputToEPDataSpy).toHaveReturnedWith({
        browserId: 'clientId',
        channel: 'WEB',
        clientKey: '',
        currencyCode: 'EUR',
        email: undefined,
        friendlyId: 'personalizeintegrationtest',
        guestRef: 'profileId',
        identifiers: undefined,
        language: 'EN',
        params: undefined,
        pointOfSale: '',
      });
    });

    it('should return infer language if infer is provided and no page is provided ', () => {
      personalizeInputMock.language = undefined;
      new Personalizer(clientId, profileId).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        ''
      );
      expect(mapPersonalizeInputToEPDataSpy).toHaveBeenCalledTimes(1);
      expect(analyticsCore.language).toHaveBeenCalledTimes(1);
      expect(mapPersonalizeInputToEPDataSpy).toHaveReturnedWith({
        browserId: 'clientId',
        channel: 'WEB',
        clientKey: '',
        currencyCode: 'EUR',
        email: undefined,
        friendlyId: 'personalizeintegrationtest',
        guestRef: 'profileId',
        identifiers: undefined,
        language: 'EN',
        params: undefined,
        pointOfSale: '',
      });
    });
    it('should call all the respective functions and attributes when infer is not provided', () => {
      jest.spyOn(analyticsCore as any, 'language').mockImplementation(() => undefined);

      personalizeInputMock.language = undefined;
      personalizeInputMock.email = 'test';
      personalizeInputMock.identifier = {
        id: '1',
        provider: 'email',
      };
      personalizeInputMock.params = {
        customNumber: 123,
        customString: 'example value',
      };

      new Personalizer(clientId, profileId).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        ''
      );

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
        {
          channel: 'WEB',
          currency: 'EUR',
          email: 'test',
          friendlyId: 'personalizeintegrationtest',
          identifier: {
            id: '1',
            provider: 'email',
          },
          language: undefined,
          params: {
            customNumber: 123,
            customString: 'example value',
          },
        },
        {
          siteName: '456',
          contextId: '123',
          edgeUrl: 'https://edge-platform.sitecorecloud.io',
        },
        ''
      );

      expect(analyticsCore.language).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);

      expect(mapPersonalizeInputToEPDataSpy).toHaveBeenCalledTimes(1);
      expect(mapPersonalizeInputToEPDataSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(mapPersonalizeInputToEPDataSpy).toHaveReturnedWith({
        channel: 'WEB',
        clientKey: '',
        currencyCode: 'EUR',
        email: 'test',
        friendlyId: 'personalizeintegrationtest',
        guestRef: 'profileId',
        identifiers: { id: '1', provider: 'email' },
        language: undefined,
        params: { customNumber: 123, customString: 'example value' },
        pointOfSale: '',
      });

      expect(sendCallFlowsRequestSpy).toHaveBeenCalledTimes(1);
      expect(sendCallFlowsRequestSpy).toHaveBeenCalledWith(
        {
          channel: 'WEB',
          clientKey: '',
          currencyCode: 'EUR',
          email: 'test',
          friendlyId: 'personalizeintegrationtest',
          guestRef: 'profileId',
          identifiers: {
            id: '1',
            provider: 'email',
          },
          language: undefined,
          params: {
            customNumber: 123,
            customString: 'example value',
          },
          pointOfSale: '',
        },
        {
          siteName: '456',
          contextId: '123',
          edgeUrl: SITECORE_EDGE_URL,
        },
        undefined
      );
    });
  });

  describe('Test sanitizeInput', () => {
    const sanitizeInputSpy = jest.spyOn(Personalizer.prototype as any, 'sanitizeInput');
    let expected: PersonalizeData;
    beforeEach(() => {
      jest.spyOn(coreModule.NativeDataFetcher.prototype, 'fetch').mockResolvedValue({
        data: { status: 'OK' },
      } as coreModule.NativeDataFetcherResponse<unknown>);

      expected = {
        channel: 'WEB',
        currency: 'EUR',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN',
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return an object containing the pageVariantIds', () => {
      const interactiveExperienceDataMock = {
        channel: 'WEB',
        currency: 'EUR',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN',
        pageVariantIds: ['test'],
      };

      personalizeInputMock.pageVariantIds = ['test'];

      settingsMock = {
        siteName: '456',
        contextId: '123',
        edgeUrl: SITECORE_EDGE_URL,
      };

      new Personalizer(clientId, profileId).getInteractiveExperienceData(
        interactiveExperienceDataMock,
        settingsMock,
        ''
      );

      const expectedResult = {
        channel: 'WEB',
        currency: 'EUR',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN',
        pageVariantIds: ['test'],
      };

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(sanitizeInputSpy).toHaveReturnedWith(expectedResult);
    });

    it('should return an object not containing the pageVariantIds if empty array is passed', () => {
      const interactiveExperienceDataMock = {
        channel: 'WEB',
        currency: 'EUR',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN',
        pageVariantIds: [],
      };

      personalizeInputMock.pageVariantIds = [];

      settingsMock = {
        siteName: '456',
        contextId: '123',
        edgeUrl: SITECORE_EDGE_URL,
      };

      new Personalizer(clientId, profileId).getInteractiveExperienceData(
        interactiveExperienceDataMock,
        settingsMock,
        ''
      );

      const expectedResult = {
        channel: 'WEB',
        currency: 'EUR',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN',
      };

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(sanitizeInputSpy).toHaveReturnedWith(expectedResult);
    });

    it('should return an object from the sanitizeInput method that uses the pointOfSale from the settings', () => {
      const interactiveExperienceDataMock = {
        channel: 'WEB',
        currency: 'EUR',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN',
      };

      settingsMock = {
        siteName: '456',
        contextId: '123',
        edgeUrl: SITECORE_EDGE_URL,
      };

      new Personalizer(clientId, profileId).getInteractiveExperienceData(
        interactiveExperienceDataMock,
        settingsMock,
        ''
      );

      const expectedResult = {
        channel: 'WEB',
        currency: 'EUR',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN',
      };

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(sanitizeInputSpy).toHaveReturnedWith(expectedResult);
    });
    it('Test return object of the sanitizeInput method without email and identifier ', () => {
      new Personalizer(clientId, profileId).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        ''
      );

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(sanitizeInputSpy).toHaveReturnedWith(expected);
    });

    it('Test return object of the sanitizeInput method with empty space email ', () => {
      personalizeInputMock.email = ' ';
      personalizeInputMock.identifier = {
        id: '1',
        provider: 'email',
      };

      new Personalizer(clientId, profileId).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        ''
      );

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expected.identifier = {
        id: '1',
        provider: 'email',
      };
      expect(sanitizeInputSpy).toHaveReturnedWith(expected);
    });
    it('Test return object of the sanitizeInput method with empty space email and empty space id ', () => {
      personalizeInputMock.email = ' ';
      personalizeInputMock.identifier = {
        id: ' ',
        provider: 'email',
      };

      new Personalizer(clientId, profileId).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        ''
      );

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(sanitizeInputSpy).toHaveReturnedWith(expected);
    });

    it('Test return object of the sanitizeInput method without identifier object ', () => {
      personalizeInputMock.email = 'test';
      const mockIdentifier = {} as PersonalizeIdentifierInput;
      personalizeInputMock.identifier = mockIdentifier;

      new Personalizer(clientId, profileId).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        ''
      );

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expected.email = 'test';
      expect(sanitizeInputSpy).toHaveReturnedWith(expected);
    });

    // Test params
    it('Test return object of the sanitizeInput method with params object and flatten method ', () => {
      personalizeInputMock.params = {
        customNumber: 123,
        customString: 'example value',
        customValue: { value: 123 },
      };

      new Personalizer(clientId, profileId).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        ''
      );

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expected.params = {
        customNumber: 123,
        customString: 'example value',
        customValue: { value: 123 },
      };
      expect(sanitizeInputSpy).toHaveReturnedWith(expected);
    });

    it('Test return object of the sanitizeInput method with params object as empty object', () => {
      personalizeInputMock.params = {};

      new Personalizer(clientId, profileId).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        ''
      );

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(sanitizeInputSpy).toHaveReturnedWith(expected);
    });

    it('should return an object with geo in params if provided', () => {
      personalizeInputMock.geo = {
        city: 'T1',
        country: 'T2',
        region: 'T3',
      };
      const expectedSanitized = {
        ...expected,
        params: {
          geo: {
            city: 'T1',
            country: 'T2',
            region: 'T3',
          },
        },
      };

      new Personalizer(clientId, profileId).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        ''
      );

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(sanitizeInputSpy).toHaveReturnedWith(expectedSanitized);
    });

    it('should return an object with partial geo in params if provided', () => {
      personalizeInputMock.geo = {
        city: 'T1',
      };
      const expectedSanitized = {
        ...expected,
        params: {
          geo: {
            city: 'T1',
          },
        },
      };

      new Personalizer(clientId, profileId).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        ''
      );

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(sanitizeInputSpy).toHaveReturnedWith(expectedSanitized);
    });

    it('should return an object without params if empty geo is provided', () => {
      personalizeInputMock.geo = {};

      new Personalizer(clientId, profileId).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        ''
      );

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(sanitizeInputSpy).toHaveReturnedWith(expected);
    });
  });

  describe('Test mapPersonalizeInputToEpData functionality and APICall', () => {
    const mapPersonalizeInputToEPDataSpy = jest.spyOn(
      Personalizer.prototype as any,
      'mapPersonalizeInputToEPData'
    );
    const sendCallFlowsRequestSpy = jest.spyOn(CallFlowsRequest, 'sendCallFlowsRequest');

    // map
    beforeEach(() => {
      jest.spyOn(coreModule.NativeDataFetcher.prototype, 'fetch').mockResolvedValue({
        data: { status: 'OK' },
      } as coreModule.NativeDataFetcherResponse<unknown>);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should map the pageVariantIds to variants', () => {
      personalizeInputMock.pageVariantIds = ['test'];
      new Personalizer(clientId, profileId).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        ''
      );
      expect(mapPersonalizeInputToEPDataSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(mapPersonalizeInputToEPDataSpy).toHaveReturnedWith({
        browserId: 'clientId',
        channel: 'WEB',
        clientKey: '',
        currencyCode: 'EUR',
        email: undefined,
        friendlyId: 'personalizeintegrationtest',
        guestRef: 'profileId',
        identifiers: undefined,
        language: 'EN',
        params: undefined,
        pointOfSale: '',
        variants: ['test'],
      });
      expect(sendCallFlowsRequestSpy).toHaveBeenCalledWith(
        {
          browserId: 'clientId',
          channel: 'WEB',
          clientKey: '',
          currencyCode: 'EUR',
          email: undefined,
          friendlyId: 'personalizeintegrationtest',
          guestRef: 'profileId',
          identifiers: undefined,
          language: 'EN',
          params: undefined,
          pointOfSale: '',
          variants: ['test'],
        },
        {
          siteName: '456',
          contextId: '123',
          edgeUrl: SITECORE_EDGE_URL,
        },
        undefined
      );
    });

    it('Test return object of the map method without email and identifier ', () => {
      personalizeInputMock.email = undefined;
      personalizeInputMock.identifier = undefined;
      new Personalizer(clientId, profileId).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        ''
      );
      expect(mapPersonalizeInputToEPDataSpy).toHaveBeenCalledTimes(1);
      expect(analyticsCore.language).toHaveBeenCalledTimes(0);

      expect(mapPersonalizeInputToEPDataSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(mapPersonalizeInputToEPDataSpy).toHaveReturnedWith({
        browserId: 'clientId',
        channel: 'WEB',
        clientKey: '',
        currencyCode: 'EUR',
        email: undefined,
        friendlyId: 'personalizeintegrationtest',
        guestRef: 'profileId',
        identifiers: undefined,
        language: 'EN',
        params: undefined,
        pointOfSale: '',
      });
      expect(sendCallFlowsRequestSpy).toHaveBeenCalledTimes(1);
      expect(sendCallFlowsRequestSpy).toHaveBeenCalledWith(
        {
          browserId: 'clientId',
          channel: 'WEB',
          clientKey: '',
          currencyCode: 'EUR',
          email: undefined,
          friendlyId: 'personalizeintegrationtest',
          guestRef: 'profileId',
          identifiers: undefined,
          language: 'EN',
          params: undefined,
          pointOfSale: '',
        },
        {
          siteName: '456',
          contextId: '123',
          edgeUrl: SITECORE_EDGE_URL,
        },
        undefined
      );
    });

    it('Test return object of the map method without email and identifier but with params ', () => {
      personalizeInputMock.params = {
        customNumber: 123,
        customString: 'example value',
        customValue: { value: 123 },
      };
      personalizeInputMock.email = undefined;
      personalizeInputMock.identifier = undefined;
      new Personalizer(clientId, profileId).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        ''
      );
      expect(mapPersonalizeInputToEPDataSpy).toHaveBeenCalledTimes(1);
      expect(analyticsCore.language).toHaveBeenCalledTimes(0);

      expect(mapPersonalizeInputToEPDataSpy).toHaveBeenCalledWith({
        channel: 'WEB',
        currency: 'EUR',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN',
        params: {
          customNumber: 123,
          customString: 'example value',
          customValue: { value: 123 },
        },
      });

      expect(mapPersonalizeInputToEPDataSpy).toHaveReturnedWith({
        browserId: 'clientId',
        channel: 'WEB',
        clientKey: '',
        currencyCode: 'EUR',
        email: undefined,
        friendlyId: 'personalizeintegrationtest',
        guestRef: 'profileId',
        identifiers: undefined,
        language: 'EN',
        params: { customNumber: 123, customString: 'example value', customValue: { value: 123 } },
        pointOfSale: '',
      });
      expect(sendCallFlowsRequestSpy).toHaveBeenCalledTimes(1);
      expect(sendCallFlowsRequestSpy).toHaveBeenCalledWith(
        {
          browserId: 'clientId',
          channel: 'WEB',
          clientKey: '',
          currencyCode: 'EUR',
          email: undefined,
          friendlyId: 'personalizeintegrationtest',
          guestRef: 'profileId',
          identifiers: undefined,
          language: 'EN',
          params: {
            customNumber: 123,
            customString: 'example value',
            customValue: { value: 123 },
          },
          pointOfSale: '',
        },
        {
          siteName: '456',
          contextId: '123',
          edgeUrl: SITECORE_EDGE_URL,
        },
        undefined
      );
    });

    it('Test return object of the map method without email ', () => {
      personalizeInputMock.identifier = {
        id: '1',
        provider: 'email',
      };
      new Personalizer(clientId, profileId).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        ''
      );

      expect(mapPersonalizeInputToEPDataSpy).toHaveBeenCalledTimes(1);
      expect(mapPersonalizeInputToEPDataSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(mapPersonalizeInputToEPDataSpy).toHaveReturnedWith({
        channel: 'WEB',
        clientKey: '',
        currencyCode: 'EUR',
        email: undefined,
        friendlyId: 'personalizeintegrationtest',
        guestRef: 'profileId',
        identifiers: { id: '1', provider: 'email' },
        language: 'EN',
        params: undefined,
        pointOfSale: '',
      });

      expect(sendCallFlowsRequestSpy).toHaveBeenCalledTimes(1);
      expect(sendCallFlowsRequestSpy).toHaveBeenCalledWith(
        {
          channel: 'WEB',
          clientKey: '',
          currencyCode: 'EUR',
          email: undefined,
          friendlyId: 'personalizeintegrationtest',
          guestRef: 'profileId',
          identifiers: {
            id: '1',
            provider: 'email',
          },
          language: 'EN',

          params: undefined,
          pointOfSale: '',
        },
        {
          siteName: '456',
          contextId: '123',
          edgeUrl: SITECORE_EDGE_URL,
        },
        undefined
      );
    });
  });

  describe('timeout', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return the response', async () => {
      let currentTime = 1609459200000;
      jest.spyOn(Date, 'now').mockImplementation(() => {
        const returnTime = currentTime;
        currentTime += 1000;
        return returnTime;
      });

      const expectedResponse = { test: '420' };

      const fetchSpy = jest
        .spyOn(coreModule.NativeDataFetcher.prototype, 'fetch')
        .mockResolvedValue({
          data: expectedResponse,
        } as coreModule.NativeDataFetcherResponse<unknown>);

      const response = await new Personalizer(clientId, profileId).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        window.location.search,
        {
          timeout: 100,
        }
      );

      expect(fetchSpy).toHaveBeenCalledWith(
        // eslint-disable-next-line max-len
        `${SITECORE_EDGE_URL}/v1/personalize?siteId=${settingsMock.siteName}`,
        {
          // eslint-disable-next-line max-len
          body: '{"channel":"WEB","clientKey":"","currencyCode":"EUR","friendlyId":"personalizeintegrationtest","guestRef":"profileId","language":"EN","pointOfSale":"","browserId":"clientId"}',
          /* eslint-disable @typescript-eslint/naming-convention */
          headers: {
            'Content-Type': 'application/json',
            'X-Library-Version': PACKAGE_VERSION,
            'x-sc-correlation-id': 'b10bb699bfb3419bb63f638c62ed1aa7',
            'x-sitecore-contextid': '123',
          },
          /* eslint-enable @typescript-eslint/naming-convention */
          method: 'POST',
        }
      );

      expect(response).toBe(expectedResponse);
    });

    it('should throw error if a negative number is used for timeout value', async () => {
      jest.spyOn(coreModule.NativeDataFetcher.prototype, 'fetch').mockImplementationOnce(() => {
        return Promise.reject(new Error(UTILS_ERROR_MESSAGES.IV_002));
      });

      expect(async () => {
        await new Personalizer(clientId, profileId).getInteractiveExperienceData(
          personalizeInputMock,
          settingsMock,
          window.location.search,
          {
            timeout: -10,
          }
        );
      }).rejects.toThrow(UTILS_ERROR_MESSAGES.IV_002);
    });

    it('should throw error if a float number is used for timeout value', async () => {
      jest.spyOn(coreModule.NativeDataFetcher.prototype, 'fetch').mockImplementationOnce(() => {
        return Promise.reject(new Error(UTILS_ERROR_MESSAGES.IV_002));
      });

      expect(async () => {
        await new Personalizer(clientId, profileId).getInteractiveExperienceData(
          personalizeInputMock,
          settingsMock,
          window.location.search,
          {
            timeout: 420.69,
          }
        );
      }).rejects.toThrow(UTILS_ERROR_MESSAGES.IV_002);
    });

    it('should throw immediately a predifined error if timeout is 0', async () => {
      class FetchError extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'AbortError';
        }
      }
      jest
        .spyOn(coreModule.NativeDataFetcher.prototype, 'fetch')
        .mockRejectedValue(new FetchError('Failed to fetch'));

      try {
        await new Personalizer(clientId, profileId).getInteractiveExperienceData(
          personalizeInputMock,
          settingsMock,
          window.location.search,
          { timeout: 0 }
        );
      } catch (error) {
        expect((error as FetchError).message).toBe(UTILS_ERROR_MESSAGES.IE_003);
      }
    });

    it('should throw a predifined error if the request was aborted', async () => {
      expect.assertions(1);
      class FetchError extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'AbortError';
        }
      }

      jest.spyOn(coreModule.NativeDataFetcher.prototype, 'fetch').mockImplementationOnce(() => {
        return Promise.reject(new FetchError(UTILS_ERROR_MESSAGES.IE_003));
      });

      await new Personalizer(clientId, profileId)
        .getInteractiveExperienceData(personalizeInputMock, settingsMock, window.location.search, {
          timeout: 100,
        })
        .catch((err) => {
          expect(err.message).toEqual(UTILS_ERROR_MESSAGES.IE_003);
        });
    });

    it('should return null if an unhandled error occurs with RandomError name', async () => {
      class FetchError extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'RandomError';
        }
      }

      jest.spyOn(coreModule.NativeDataFetcher.prototype, 'fetch').mockImplementationOnce(() => {
        return Promise.reject(new FetchError('Failed to fetch'));
      });

      const response = await new Personalizer(clientId, profileId).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        window.location.search,
        {
          timeout: 100,
        }
      );

      expect(response).toBeNull();
    });

    it('should return null if an unhandled error occurs with empty name', async () => {
      class FetchError extends Error {
        constructor(message: string) {
          super(message);
          this.name = '';
        }
      }

      jest.spyOn(coreModule.NativeDataFetcher.prototype, 'fetch').mockImplementationOnce(() => {
        return Promise.reject(new FetchError('Failed to fetch'));
      });

      const response = await new Personalizer(clientId, profileId).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        window.location.search,
        {
          timeout: 100,
        }
      );

      expect(response).toBeNull();
    });

    it('should return null if an unhandled error occurs', async () => {
      global.fetch = jest
        .fn<() => Promise<any>>()
        .mockImplementation(() => Promise.resolve('bad object'));

      const abortSpy = jest.spyOn(AbortController.prototype, 'abort');

      const response = await new Personalizer(clientId, profileId).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        window.location.search,
        {
          timeout: 100,
        }
      );

      expect(response).toBeNull();

      expect(abortSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('Opts object', () => {
    it('should call sendCallFlowsRequest with the opts from the params', () => {
      const sanitizeInputSpy = jest.spyOn(Personalizer.prototype as any, 'sanitizeInput');
      const mapPersonalizeInputToEPDataSpy = jest.spyOn(
        Personalizer.prototype as any,
        'mapPersonalizeInputToEPData'
      );
      const sendCallFlowsRequestSpy = jest.spyOn(CallFlowsRequest, 'sendCallFlowsRequest');
      const settings = {} as { contextId: string; edgeUrl: string; siteName: string };
      const data = {} as PersonalizeData;
      const opts = { timeout: 100, userAgent: 'test_ua' };
      const validateSpy = jest.spyOn(Personalizer.prototype as any, 'validate');
      validateSpy.mockImplementationOnce(() => {
        return;
      });

      sanitizeInputSpy.mockReturnValueOnce({});
      mapPersonalizeInputToEPDataSpy.mockReturnValueOnce({});

      new Personalizer(clientId, profileId).getInteractiveExperienceData(
        data,
        settings,
        window.location.search,
        opts
      );

      expect(sendCallFlowsRequestSpy).toHaveBeenCalledWith(
        { browserId: 'clientId' },
        settings,
        opts
      );
    });
  });

  describe('check extractUrlParamsWithPrefix method and UTM params object sent to callflows requests', () => {
    it('should call extractUrlParamsWithPrefix and return a specific object', () => {
      const extractUrlParamsWithPrefixSpy = jest.spyOn(
        Personalizer.prototype as any,
        'extractUrlParamsWithPrefix'
      );
      const urlParams = '?utm_campaign=campaign&utm_medium=email';
      const opts = { timeout: 100, userAgent: 'test_ua' };

      new Personalizer(clientId, profileId).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        urlParams,
        opts
      );

      expect(extractUrlParamsWithPrefixSpy).toHaveBeenCalledTimes(1);
      expect(extractUrlParamsWithPrefixSpy).toHaveReturnedWith({
        campaign: 'campaign',
        medium: 'email',
      });
    });

    it(`should call extractUrlParamsWithPrefix when at least one url param contains the 'utm_' prefix`, () => {
      const extractUrlParamsWithPrefixSpy = jest.spyOn(
        Personalizer.prototype as any,
        'extractUrlParamsWithPrefix'
      );
      const urlParams = '?utm56_campaign=campaign&utm7_medium=email&utm_campaign=campaign';
      const opts = { timeout: 100, userAgent: 'test_ua' };

      new Personalizer(clientId, profileId).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        urlParams,
        opts
      );
      expect(extractUrlParamsWithPrefixSpy).toHaveBeenCalledTimes(1);
      expect(extractUrlParamsWithPrefixSpy).toHaveReturnedWith({
        campaign: 'campaign',
      });
    });

    it(`should not call extractUrlParamsWithPrefix when url params does not contain the 'utm_' prefix`, () => {
      const extractUrlParamsWithPrefixSpy = jest.spyOn(
        Personalizer.prototype as any,
        'extractUrlParamsWithPrefix'
      );
      const urlParams = '?utm56_campaign=campaign&utm7_medium=email';
      const opts = { timeout: 100, userAgent: 'test_ua' };

      new Personalizer(clientId, profileId).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        urlParams,
        opts
      );
      expect(extractUrlParamsWithPrefixSpy).toHaveBeenCalledTimes(0);
    });

    it('should call sendCallFlowsRequest with UTM params extracted from the url', () => {
      const sendCallFlowsRequestSpy = jest.spyOn(CallFlowsRequest, 'sendCallFlowsRequest');
      const urlParams = '?utm_campaign=campaign&utm_medium=email';
      const opts = { timeout: 100, userAgent: 'test_ua' };

      new Personalizer(clientId, profileId).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        urlParams,
        opts
      );

      expect(sendCallFlowsRequestSpy).toHaveBeenCalledWith(
        {
          browserId: 'clientId',
          channel: 'WEB',
          clientKey: '',
          currencyCode: 'EUR',
          email: undefined,
          friendlyId: 'personalizeintegrationtest',
          guestRef: 'profileId',
          identifiers: undefined,
          language: 'EN',
          params: {
            utm: {
              campaign: 'campaign',
              medium: 'email',
            },
          },
          pointOfSale: '',
        },
        settingsMock,
        opts
      );
    });

    it(`should call sendCallFlowsRequest with UTM params passed manually
     (UTM params exists both in url and data sent manually by the developer)`, () => {
      const sendCallFlowsRequestSpy = jest.spyOn(CallFlowsRequest, 'sendCallFlowsRequest');
      const urlParams = '?utm_campaign=campaign&utm_medium=email';
      const opts = { timeout: 100, userAgent: 'test_ua' };
      const inputMockWithUTMParams = {
        ...personalizeInputMock,
        ...{
          params: {
            utm: {
              content: 'content',
              source: 'source',
            },
          },
        },
      };

      new Personalizer(clientId, profileId).getInteractiveExperienceData(
        inputMockWithUTMParams,
        settingsMock,
        urlParams,
        opts
      );

      expect(sendCallFlowsRequestSpy).toHaveBeenCalledWith(
        {
          browserId: 'clientId',
          channel: 'WEB',
          clientKey: '',
          currencyCode: 'EUR',
          email: undefined,
          friendlyId: 'personalizeintegrationtest',
          guestRef: 'profileId',
          identifiers: undefined,
          language: 'EN',
          params: {
            utm: {
              content: 'content',
              source: 'source',
            },
          },
          pointOfSale: '',
        },
        settingsMock,
        opts
      );
    });
  });
});
