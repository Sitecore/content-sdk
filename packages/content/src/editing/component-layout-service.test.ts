/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-expressions */
import { expect, use } from 'chai';
import spies from 'chai-spies';
import nock from 'nock';
import { NativeDataFetcherConfig, constants } from '@sitecore-content-sdk/core';
import { ComponentLayoutRequestParams, ComponentLayoutService } from './component-layout-service';
import { LayoutServiceData } from '../layout/models';
import { DesignLibraryMode } from './models';

const { SITECORE_EDGE_PLATFORM_URL_DEFAULT, ERROR_MESSAGES } = constants;

use(spies);

describe('ComponentLayoutService', () => {
  const defaultTestInput: ComponentLayoutRequestParams = {
    itemId: '123',
    componentUid: '456',
    siteName: 'supersite',
  };

  const contextId = 'test-context-id';

  const defaultTestData = {
    sitecore: {
      context: {},
      route: {
        name: 'xxx',
        placeholders: {
          'editing-componentmode-placeholder': [],
        },
      },
    },
  };

  afterEach(() => {
    nock.cleanAll();
  });

  it('should fetch component data', () => {
    nock(SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
      reqheaders: {
        'x-sitecore-contextid': contextId,
        'content-type': 'application/json',
        sc_editmode: 'false',
      },
    })
      .get('/layout/component?item=123&uid=456&sc_site=supersite&sc_lang=en')
      .reply(200, () => defaultTestData);

    const service = new ComponentLayoutService({
      contextId,
    });

    return service
      .fetchComponentData(defaultTestInput)
      .then((layoutServiceData: LayoutServiceData & NativeDataFetcherConfig) => {
        expect(layoutServiceData).to.deep.equal(defaultTestData);
      });
  });

  it('should fetch component data in metadata mode', () => {
    nock(SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
      reqheaders: {
        'x-sitecore-contextid': contextId,
        'content-type': 'application/json',
        sc_editmode: 'true',
      },
    })
      .get('/layout/component?item=123&uid=456&sc_site=supersite&sc_lang=en')
      .reply(200, () => defaultTestData);

    const service = new ComponentLayoutService({
      contextId,
    });

    return service
      .fetchComponentData({ ...defaultTestInput, mode: DesignLibraryMode.Metadata })
      .then((layoutServiceData: LayoutServiceData & NativeDataFetcherConfig) => {
        expect(layoutServiceData).to.deep.equal(defaultTestData);
      });
  });

  it('should fetch component data when optional params provided', () => {
    const testInput: ComponentLayoutRequestParams = {
      ...defaultTestInput,
      dataSourceId: '789',
      renderingId: '000',
      version: '1',
      language: 'en',
    };

    const testExpectedData = {
      sitecore: {
        context: {},
        route: {
          name: 'xxx',
          placeholders: {
            'editing-componentmode-placeholder': [
              {
                uid: '456',
                componentName: 'RichText',
                dataSource: '789',
                params: {
                  GridParameters: 'col-12',
                  FieldNames: 'Default',
                  Styles: '',
                  RenderingIdentifier: '',
                  DynamicPlaceholderId: '3',
                },
              },
            ],
          },
        },
      },
    };

    nock(SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
      reqheaders: {
        'x-sitecore-contextid': contextId,
        'content-type': 'application/json',
        sc_editmode: 'false',
      },
    })
      .get(
        '/layout/component?item=123&uid=456&dataSourceId=789&renderingItemId=000&version=1&sc_site=supersite&sc_lang=en'
      )
      .reply(200, () => testExpectedData);

    const service = new ComponentLayoutService({
      contextId,
    });

    return service
      .fetchComponentData(testInput)
      .then((layoutServiceData: LayoutServiceData & NativeDataFetcherConfig) => {
        expect(layoutServiceData).to.deep.equal(testExpectedData);
      });
  });

  it('should fetch component data with custom fetch options', () => {
    nock(SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
      reqheaders: {
        my_header: 'my_value',
        sc_editMode: 'false',
        'x-sitecore-contextid': contextId,
      },
    })
      .get('/layout/component?item=123&uid=456&sc_site=supersite&sc_lang=en')
      .reply(200, () => defaultTestData);

    const service = new ComponentLayoutService({
      contextId,
    });

    return service
      .fetchComponentData(defaultTestInput, {
        headers: {
          my_header: 'my_value',
        },
      })
      .then((layoutServiceData: LayoutServiceData & NativeDataFetcherConfig) => {
        expect(layoutServiceData).to.deep.equal(defaultTestData);
      });
  });

  it('should fetch component data from a custom edge endpoint', () => {
    const customEdgeUrl = 'https://custom-edge-url.com';

    const service = new ComponentLayoutService({
      contextId,
      edgeUrl: customEdgeUrl,
    });

    nock(customEdgeUrl, {
      reqheaders: {
        'x-sitecore-contextid': contextId,
        sc_editMode: 'false',
      },
    })
      .get('/layout/component?item=123&uid=456&sc_site=supersite&sc_lang=en')
      .reply(200, () => defaultTestData);

    return service
      .fetchComponentData(defaultTestInput)
      .then((layoutServiceData: LayoutServiceData & NativeDataFetcherConfig) => {
        expect(layoutServiceData).to.deep.equal(defaultTestData);
      });
  });

  it('should catch 404 when request layout data', () => {
    nock(SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
      reqheaders: {
        'x-sitecore-contextid': contextId,
        sc_editMode: 'false',
      },
    })
      .get('/layout/component?item=123&uid=456&sc_site=supersite&sc_lang=en')
      .reply(404, () => ({
        data: {
          sitecore: { context: { pageEditing: false, language: 'en' }, route: null },
        },
      }));

    const service = new ComponentLayoutService({
      contextId,
    });

    return service
      .fetchComponentData(defaultTestInput)
      .then((layoutServiceData: LayoutServiceData) => {
        expect(layoutServiceData).to.deep.equal({
          data: {
            sitecore: {
              context: {
                pageEditing: false,
                language: 'en',
              },
              route: null,
            },
          },
        });
      });
  });

  it('should allow non 404 errors through', () => {
    nock(SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
      reqheaders: {
        'x-sitecore-contextid': contextId,
        sc_editMode: 'false',
      },
    })
      .get('/layout/component?item=123&uid=456&sc_site=supersite&sc_lang=en')
      .reply(401, { message: 'whoops' });

    const service = new ComponentLayoutService({
      contextId,
    });

    return service.fetchComponentData(defaultTestInput).catch((error) => {
      expect(error.response.status).to.equal(401);
      expect(error.response.data.message).to.equal('whoops');
    });
  });

  it('should throw error when contextId is not provided', () => {
    const service = new ComponentLayoutService({
      contextId: '',
    });

    expect(() => service.fetchComponentData(defaultTestInput)).to.throw(ERROR_MESSAGES.MV_001);
  });

  it('should throw error when both contextId and clientContextId are missing', () => {
    const service = new ComponentLayoutService({} as any);

    expect(() => service.fetchComponentData(defaultTestInput)).to.throw(ERROR_MESSAGES.MV_001);
  });

  describe('getComponentFetchParams', () => {
    it('should return params', () => {
      const service = new ComponentLayoutService({
        contextId,
      });
      const testParams = {
        itemId: '123',
        componentUid: '456',
        dataSourceId: '789',
        renderingId: '000',
        version: '1',
        siteName: 'notsupersite',
        language: 'en',
      };

      const expectedResult = {
        item: testParams.itemId,
        uid: testParams.componentUid,
        dataSourceId: testParams.dataSourceId,
        renderingItemId: testParams.renderingId,
        version: testParams.version,
        sc_site: testParams.siteName,
        sc_lang: testParams.language,
      };

      // eslint-disable-next-line dot-notation
      expect(service['getComponentFetchParams'](testParams)).to.deep.equal(expectedResult);
    });

    it('should return params with no undefined params', () => {
      const service = new ComponentLayoutService({
        contextId,
      });

      const testParams = {
        itemId: '123',
        componentUid: '456',
        dataSourceId: undefined,
        renderingId: '000',
        version: undefined,
        siteName: 'supersite',
        language: 'en',
      };

      const expectedResult = {
        item: testParams.itemId,
        uid: testParams.componentUid,
        renderingItemId: testParams.renderingId,
        sc_lang: testParams.language,
        sc_site: testParams.siteName,
      };

      // eslint-disable-next-line dot-notation
      expect(service['getComponentFetchParams'](testParams)).to.deep.equal(expectedResult);
    });
  });
});
