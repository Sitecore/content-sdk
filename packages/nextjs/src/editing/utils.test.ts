/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { NextApiRequest } from 'next';
import { NextRequest } from 'next/server';
import { STATIC_PROPS_ID, SERVER_PROPS_ID } from 'next/constants';
import {
  QUERY_PARAM_EDITING_SECRET,
  DesignLibraryMode,
  PREVIEW_KEY,
} from '@sitecore-content-sdk/content/editing';
import { DEFAULT_VARIANT } from '@sitecore-content-sdk/content/personalize';
import { SITE_KEY } from '@sitecore-content-sdk/content/site';
import { NativeDataFetcher } from '@sitecore-content-sdk/core';
import {
  getEditingSecretFromRequest,
  mapEditingParams,
  getAllowedQueryParams,
  cleanupNextPreviewCookies,
  getPreviewCookies,
  getRequiredEditingParamsList,
  getQueryParamsForPropagation,
  getHeadersForPropagation,
  getEditingRequestHtml,
  isDesignLibraryPreviewData,
  resolveServerUrl,
  getCSPHeader,
} from './utils';
import {
  QUERY_PARAM_VERCEL_PROTECTION_BYPASS,
  QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE,
} from './constants';

chai.use(sinonChai);

describe('editing/utils', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
    // Clean up environment variables
    delete process.env.SITECORE_INTERNAL_EDITING_HOST_URL;
    delete process.env.SITECORE;
    delete process.env.VERCEL;
    delete process.env.NETLIFY;
    delete process.env.JSS_ALLOWED_ORIGINS;
  });

  describe('getEditingSecretFromRequest', () => {
    it('should extract secret from pages router request query', () => {
      const req = {
        query: {
          [QUERY_PARAM_EDITING_SECRET]: 'test-secret-123',
          otherParam: 'value',
        },
      } as NextApiRequest;

      const secret = getEditingSecretFromRequest(req);
      expect(secret).to.equal('test-secret-123');
    });

    it('should extract secret from app router request URL', () => {
      const req = {
        url: `https://example.com/api/editing?${QUERY_PARAM_EDITING_SECRET}=app-router-secret&other=param`,
      } as NextRequest;

      const secret = getEditingSecretFromRequest(req);
      expect(secret).to.equal('app-router-secret');
    });

    it('should return undefined when no secret is present in pages router', () => {
      const req = {
        query: {
          otherParam: 'value',
        },
      } as NextApiRequest;

      const secret = getEditingSecretFromRequest(req);
      expect(secret).to.be.undefined;
    });

    it('should return undefined when no secret is present in app router', () => {
      const req = {
        url: 'https://example.com/api/editing?other=param',
      } as NextRequest;

      const secret = getEditingSecretFromRequest(req);
      expect(secret).to.be.null;
    });

    it('should return undefined when neither query nor url is available', () => {
      const req = {} as NextApiRequest;

      const secret = getEditingSecretFromRequest(req);
      expect(secret).to.be.undefined;
    });

    it('should handle array values in pages router query', () => {
      const req = {
        query: {
          [QUERY_PARAM_EDITING_SECRET]: ['first-secret', 'second-secret'],
        },
      } as NextApiRequest;

      const secret = getEditingSecretFromRequest(req);
      expect(secret).to.deep.equal(['first-secret', 'second-secret']);
    });
  });

  describe('mapEditingParams', () => {
    it('should return design library params when mode is design library', () => {
      const query = {
        mode: DesignLibraryMode.Normal,
        sc_itemid: 'item-123',
        sc_uid: 'component-uid',
        sc_renderingId: 'rendering-456',
        sc_lang: 'en',
        sc_site: 'test-site',
        dataSourceId: 'datasource-789',
        sc_version: '1',
        generation: 'variant',
      };

      const params = mapEditingParams(query);

      expect(params).to.deep.equal({
        itemId: 'item-123',
        componentUid: 'component-uid',
        renderingId: 'rendering-456',
        language: 'en',
        site: 'test-site',
        mode: DesignLibraryMode.Normal,
        dataSourceId: 'datasource-789',
        version: '1',
        generation: 'variant',
      });
    });

    it('should return design library params when mode is library metadata', () => {
      const query = {
        mode: DesignLibraryMode.Metadata,
        sc_itemid: 'item-123',
        sc_uid: 'component-uid',
        sc_renderingId: 'rendering-456',
        sc_lang: 'en',
        sc_site: 'test-site',
        dataSourceId: 'datasource-789',
        sc_version: '1',
        generation: 'variant',
      };

      const params = mapEditingParams(query);

      expect(params).to.deep.equal({
        itemId: 'item-123',
        componentUid: 'component-uid',
        renderingId: 'rendering-456',
        language: 'en',
        site: 'test-site',
        mode: DesignLibraryMode.Metadata,
        dataSourceId: 'datasource-789',
        version: '1',
        generation: 'variant',
      });
    });

    it('should return standard editing params when mode is not design library', () => {
      const query = {
        mode: 'edit',
        sc_site: 'test-site',
        sc_itemid: 'item-123',
        sc_lang: 'en',
        sc_variant: 'variant1,variant2',
        sc_version: '1',
        sc_layoutKind: 'mvc',
      };

      const params = mapEditingParams(query);

      expect(params).to.deep.equal({
        site: 'test-site',
        itemId: 'item-123',
        language: 'en',
        variantIds: 'variant1,variant2',
        version: '1',
        mode: 'edit',
        layoutKind: 'mvc',
      });
    });

    it('should use default variant when no variant is specified', () => {
      const query = {
        mode: 'edit',
        sc_site: 'test-site',
        sc_itemid: 'item-123',
        sc_lang: 'en',
      };

      const params = mapEditingParams(query);

      expect(params.variantIds).to.equal(DEFAULT_VARIANT);
    });

    it('should handle empty variant string', () => {
      const query = {
        mode: 'edit',
        sc_site: 'test-site',
        sc_itemid: 'item-123',
        sc_lang: 'en',
        sc_variant: '',
      };

      const params = mapEditingParams(query);

      expect(params.variantIds).to.equal(DEFAULT_VARIANT);
    });

    it('should handle undefined values gracefully', () => {
      const query = {
        mode: 'edit',
        sc_site: undefined,
        sc_itemid: undefined,
        sc_lang: undefined,
      };

      const params = mapEditingParams(query);

      expect(params).to.have.property('site', undefined);
      expect(params).to.have.property('itemId', undefined);
      expect(params).to.have.property('language', undefined);
    });
  });

  describe('getAllowedQueryParams', () => {
    it('should return empty results when allowedParams is undefined', () => {
      const queryParams = { param1: 'value1', param2: 'value2' };

      const result = getAllowedQueryParams(queryParams);

      expect(result).to.deep.equal({
        missingAllowedParams: [],
        allowedQueryParams: {},
      });
    });

    it('should return empty results when allowedParams is an empty array', () => {
      const queryParams = { param1: 'value1', param2: 'value2' };

      const result = getAllowedQueryParams(queryParams, []);

      expect(result).to.deep.equal({
        missingAllowedParams: [],
        allowedQueryParams: {},
      });
    });

    it('should extract allowed parameters when they exist in queryParams', () => {
      const queryParams = {
        param1: 'value1',
        param2: 'value2',
        param3: 'value3',
      };
      const allowedParams = [{ name: 'param1' }, { name: 'param3' }];

      const result = getAllowedQueryParams(queryParams, allowedParams);

      expect(result).to.deep.equal({
        missingAllowedParams: [],
        allowedQueryParams: {
          param1: 'value1',
          param3: 'value3',
        },
      });
    });

    it('should handle missing required parameters', () => {
      const queryParams = { param1: 'value1' };
      const allowedParams = [
        { name: 'param1', required: true },
        { name: 'param2', required: true },
        { name: 'param3', required: true },
      ];

      const result = getAllowedQueryParams(queryParams, allowedParams);

      expect(result).to.deep.equal({
        missingAllowedParams: ['param2', 'param3'],
        allowedQueryParams: {
          param1: 'value1',
        },
      });
    });

    it('should not include missing optional parameters in missingAllowedParams', () => {
      const queryParams = { param1: 'value1' };
      const allowedParams = [
        { name: 'param1' },
        { name: 'param2' },
        { name: 'param3', required: false },
      ];

      const result = getAllowedQueryParams(queryParams, allowedParams);

      expect(result).to.deep.equal({
        missingAllowedParams: [],
        allowedQueryParams: {
          param1: 'value1',
        },
      });
    });

    it('should handle mixed required and optional parameters', () => {
      const queryParams = {
        requiredParam1: 'value1',
        optionalParam1: 'value2',
      };
      const allowedParams = [
        { name: 'requiredParam1', required: true },
        { name: 'requiredParam2', required: true },
        { name: 'optionalParam1' },
        { name: 'optionalParam2' },
      ];

      const result = getAllowedQueryParams(queryParams, allowedParams);

      expect(result).to.deep.equal({
        missingAllowedParams: ['requiredParam2'],
        allowedQueryParams: {
          requiredParam1: 'value1',
          optionalParam1: 'value2',
        },
      });
    });

    it('should call resolver function with query parameter keys', () => {
      const queryParams = {
        param1: 'value1',
        param2: 'value2',
        param3: 'value3',
      };
      const resolver = sandbox
        .stub()
        .returns([{ name: 'param1', required: true }, { name: 'param2' }]);

      const result = getAllowedQueryParams(queryParams, resolver);

      expect(resolver).to.have.been.calledOnce;
      expect(resolver).to.have.been.calledWith(['param1', 'param2', 'param3']);
      expect(result).to.deep.equal({
        missingAllowedParams: [],
        allowedQueryParams: {
          param1: 'value1',
          param2: 'value2',
        },
      });
    });

    it('should handle resolver function returning empty array', () => {
      const queryParams = { param1: 'value1' };
      const resolver = sandbox.stub().returns([]);

      const result = getAllowedQueryParams(queryParams, resolver);

      expect(resolver).to.have.been.calledOnce;
      expect(result).to.deep.equal({
        missingAllowedParams: [],
        allowedQueryParams: {},
      });
    });

    it('should handle resolver function with missing required parameters', () => {
      const queryParams = { param1: 'value1' };
      const resolver = sandbox.stub().returns([
        { name: 'param1', required: true },
        { name: 'param2', required: true },
      ]);

      const result = getAllowedQueryParams(queryParams, resolver);

      expect(result).to.deep.equal({
        missingAllowedParams: ['param2'],
        allowedQueryParams: {
          param1: 'value1',
        },
      });
    });

    it('should handle undefined query parameter values correctly', () => {
      const queryParams = {
        param1: 'value1',
        param2: undefined,
        param3: 'value3',
      };
      const allowedParams = [
        { name: 'param1' },
        { name: 'param2', required: true },
        { name: 'param3' },
      ];

      const result = getAllowedQueryParams(queryParams, allowedParams);

      expect(result).to.deep.equal({
        missingAllowedParams: ['param2'],
        allowedQueryParams: {
          param1: 'value1',
          param3: 'value3',
        },
      });
    });

    it('should handle various data types in query parameter values', () => {
      const queryParams = {
        stringParam: 'string-value',
        numberParam: 123,
        booleanParam: true,
        arrayParam: ['val1', 'val2'],
        objectParam: { nested: 'value' },
      };
      const allowedParams = [
        { name: 'stringParam' },
        { name: 'numberParam' },
        { name: 'booleanParam' },
        { name: 'arrayParam' },
        { name: 'objectParam' },
      ];

      const result = getAllowedQueryParams(queryParams, allowedParams);

      expect(result).to.deep.equal({
        missingAllowedParams: [],
        allowedQueryParams: {
          stringParam: 'string-value',
          numberParam: 123,
          booleanParam: true,
          arrayParam: ['val1', 'val2'],
          objectParam: { nested: 'value' },
        },
      });
    });

    it('should handle empty queryParams object', () => {
      const queryParams = {};
      const allowedParams = [{ name: 'param1', required: true }, { name: 'param2' }];

      const result = getAllowedQueryParams(queryParams, allowedParams);

      expect(result).to.deep.equal({
        missingAllowedParams: ['param1'],
        allowedQueryParams: {},
      });
    });

    it('should handle null and false values as valid (not undefined)', () => {
      const queryParams = {
        nullParam: null,
        falseParam: false,
        zeroParam: 0,
        emptyStringParam: '',
      };
      const allowedParams = [
        { name: 'nullParam' },
        { name: 'falseParam' },
        { name: 'zeroParam' },
        { name: 'emptyStringParam' },
      ];

      const result = getAllowedQueryParams(queryParams, allowedParams);

      expect(result).to.deep.equal({
        missingAllowedParams: [],
        allowedQueryParams: {
          nullParam: null,
          falseParam: false,
          zeroParam: 0,
          emptyStringParam: '',
        },
      });
    });

    it('should handle array with string parameters (optional by default)', () => {
      const queryParams = {
        param1: 'value1',
        param2: 'value2',
        param3: 'value3',
      };
      const allowedParams = ['param1', 'param2', 'missingParam'];

      const result = getAllowedQueryParams(queryParams, allowedParams);

      expect(result).to.deep.equal({
        missingAllowedParams: [],
        allowedQueryParams: {
          param1: 'value1',
          param2: 'value2',
        },
      });
    });

    it('should handle mixed array with strings and objects', () => {
      const queryParams = {
        stringParam1: 'value1',
        stringParam2: 'value2',
        requiredParam: 'required-value',
        optionalParam: 'optional-value',
      };
      const allowedParams = [
        'stringParam1',
        'stringParam2',
        'missingStringParam',
        { name: 'requiredParam', required: true },
        { name: 'optionalParam', required: false },
        { name: 'missingRequiredParam', required: true },
      ];

      const result = getAllowedQueryParams(queryParams, allowedParams);

      expect(result).to.deep.equal({
        missingAllowedParams: ['missingRequiredParam'],
        allowedQueryParams: {
          stringParam1: 'value1',
          stringParam2: 'value2',
          requiredParam: 'required-value',
          optionalParam: 'optional-value',
        },
      });
    });

    it('should handle resolver function returning strings', () => {
      const queryParams = {
        prefixedParam1: 'value1',
        prefixedParam2: 'value2',
        otherParam: 'value3',
      };
      const resolver = sandbox.stub().returns(['prefixedParam1', 'prefixedParam2']);

      const result = getAllowedQueryParams(queryParams, resolver);

      expect(resolver).to.have.been.calledOnce;
      expect(result).to.deep.equal({
        missingAllowedParams: [],
        allowedQueryParams: {
          prefixedParam1: 'value1',
          prefixedParam2: 'value2',
        },
      });
    });

    it('should handle resolver function returning mixed strings and objects', () => {
      const queryParams = {
        stringParam1: 'value1',
        stringParam2: 'value2',
        requiredParam: 'required-value',
        optionalParam: 'optional-value',
      };
      const resolver = sandbox
        .stub()
        .returns([
          'stringParam1',
          'stringParam2',
          { name: 'requiredParam', required: true },
          { name: 'optionalParam', required: false },
          { name: 'missingRequiredParam', required: true },
        ]);

      const result = getAllowedQueryParams(queryParams, resolver);

      expect(resolver).to.have.been.calledOnce;
      expect(result).to.deep.equal({
        missingAllowedParams: ['missingRequiredParam'],
        allowedQueryParams: {
          stringParam1: 'value1',
          stringParam2: 'value2',
          requiredParam: 'required-value',
          optionalParam: 'optional-value',
        },
      });
    });
  });

  describe('cleanupNextPreviewCookies', () => {
    it('should return null when cookies is null', () => {
      const result = cleanupNextPreviewCookies(null);
      expect(result).to.be.null;
    });

    it('should return null when cookies is undefined', () => {
      const result = cleanupNextPreviewCookies(undefined as any);
      expect(result).to.be.null;
    });

    it('should filter out Next.js preview cookies from string', () => {
      const cookies =
        'normalCookie=value,__next_preview_data=preview123,__prerender_bypass=bypass456,anotherCookie=value2';

      const result = cleanupNextPreviewCookies(cookies);

      expect(result).to.deep.equal(['normalCookie=value', 'anotherCookie=value2']);
    });

    it('should filter out Next.js preview cookies from array', () => {
      const cookies = [
        'normalCookie=value',
        '__next_preview_data=preview123',
        '__prerender_bypass=bypass456',
        'anotherCookie=value2',
      ];

      const result = cleanupNextPreviewCookies(cookies);

      expect(result).to.deep.equal(['normalCookie=value', 'anotherCookie=value2']);
    });

    it('should return all cookies when no preview cookies are present', () => {
      const cookies = ['normalCookie=value', 'anotherCookie=value2'];

      const result = cleanupNextPreviewCookies(cookies);

      expect(result).to.deep.equal(cookies);
    });

    it('should handle empty string', () => {
      const result = cleanupNextPreviewCookies('');

      expect(result).to.be.null;
    });

    it('should handle empty array', () => {
      const result = cleanupNextPreviewCookies([]);

      expect(result).to.deep.equal([]);
    });

    it('should handle string with only preview cookies', () => {
      const cookies = '__next_preview_data=preview123,__prerender_bypass=bypass456';

      const result = cleanupNextPreviewCookies(cookies);

      expect(result).to.deep.equal([]);
    });
  });

  describe('getPreviewCookies', () => {
    it('should generate correct preview cookies for a site', () => {
      const siteName = 'test-site';

      const cookies = getPreviewCookies(siteName);

      expect(cookies).to.have.length(2);
      expect(cookies[0]).to.equal(`${SITE_KEY}=test-site; Path=/; HttpOnly; SameSite=None; Secure`);
      expect(cookies[1]).to.equal(`${PREVIEW_KEY}=true; Path=/; HttpOnly; SameSite=None; Secure`);
    });

    it('should handle empty site name', () => {
      const cookies = getPreviewCookies('');

      expect(cookies).to.have.length(2);
      expect(cookies[0]).to.equal(`${SITE_KEY}=; Path=/; HttpOnly; SameSite=None; Secure`);
      expect(cookies[1]).to.equal(`${PREVIEW_KEY}=true; Path=/; HttpOnly; SameSite=None; Secure`);
    });

    it('should handle site name with special characters', () => {
      const siteName = 'test-site-with_special.chars';

      const cookies = getPreviewCookies(siteName);

      expect(cookies[0]).to.equal(
        `${SITE_KEY}=test-site-with_special.chars; Path=/; HttpOnly; SameSite=None; Secure`
      );
    });
  });

  describe('getRequiredEditingParamsList', () => {
    it('should return component required params for design library mode', () => {
      const params = getRequiredEditingParamsList(DesignLibraryMode.Normal);

      expect(params).to.deep.equal(['sc_site', 'sc_itemid', 'sc_uid', 'sc_lang', 'mode']);
    });

    it('should return component required params for library metadata mode', () => {
      const params = getRequiredEditingParamsList(DesignLibraryMode.Metadata);

      expect(params).to.deep.equal(['sc_site', 'sc_itemid', 'sc_uid', 'sc_lang', 'mode']);
    });

    it('should return editing required params for edit mode', () => {
      const params = getRequiredEditingParamsList('edit');

      expect(params).to.deep.equal(['sc_site', 'sc_itemid', 'sc_lang', 'route', 'mode']);
    });

    it('should return editing required params for preview mode', () => {
      const params = getRequiredEditingParamsList('preview');

      expect(params).to.deep.equal(['sc_site', 'sc_itemid', 'sc_lang', 'route', 'mode']);
    });

    it('should return editing required params for undefined mode', () => {
      const params = getRequiredEditingParamsList(undefined as any);

      expect(params).to.deep.equal(['sc_site', 'sc_itemid', 'sc_lang', 'route', 'mode']);
    });
  });

  describe('getQueryParamsForPropagation', () => {
    it('should include Vercel protection bypass parameter when present', () => {
      const query = {
        [QUERY_PARAM_VERCEL_PROTECTION_BYPASS]: 'bypass-token',
        otherParam: 'ignored',
      };

      const result = getQueryParamsForPropagation(query);

      expect(result).to.deep.equal({
        [QUERY_PARAM_VERCEL_PROTECTION_BYPASS]: 'bypass-token',
      });
    });

    it('should include Vercel set bypass cookie parameter when present', () => {
      const query = {
        [QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE]: 'cookie-value',
        otherParam: 'ignored',
      };

      const result = getQueryParamsForPropagation(query);

      expect(result).to.deep.equal({
        [QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE]: 'cookie-value',
      });
    });

    it('should include both Vercel parameters when present', () => {
      const query = {
        [QUERY_PARAM_VERCEL_PROTECTION_BYPASS]: 'bypass-token',
        [QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE]: 'cookie-value',
        otherParam: 'ignored',
      };

      const result = getQueryParamsForPropagation(query);

      expect(result).to.deep.equal({
        [QUERY_PARAM_VERCEL_PROTECTION_BYPASS]: 'bypass-token',
        [QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE]: 'cookie-value',
      });
    });

    it('should return empty object when no relevant parameters are present', () => {
      const query = {
        otherParam: 'ignored',
        anotherParam: 'also ignored',
      };

      const result = getQueryParamsForPropagation(query);

      expect(result).to.deep.equal({});
    });

    it('should handle empty query object', () => {
      const result = getQueryParamsForPropagation({});

      expect(result).to.deep.equal({});
    });

    it('should handle array values by using first value', () => {
      const query = {
        [QUERY_PARAM_VERCEL_PROTECTION_BYPASS]: ['first', 'second'] as any,
      };

      const result = getQueryParamsForPropagation(query);

      expect(result).to.deep.equal({
        [QUERY_PARAM_VERCEL_PROTECTION_BYPASS]: ['first', 'second'],
      });
    });
  });

  describe('getHeadersForPropagation', () => {
    it('should filter and return approved headers from IncomingHttpHeaders', () => {
      const headers = {
        authorization: 'Bearer token123',
        cookie: 'session=abc123',
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0',
      };

      const result = getHeadersForPropagation(headers);

      expect(result).to.deep.equal({
        authorization: 'Bearer token123',
        cookie: 'session=abc123',
      });
    });

    it('should filter and return approved headers from Headers object', () => {
      const headers = new Headers();
      headers.set('authorization', 'Bearer token123');
      headers.set('cookie', 'session=abc123');
      headers.set('content-type', 'application/json');
      headers.set('user-agent', 'Mozilla/5.0');

      const result = getHeadersForPropagation(headers);

      expect(result).to.deep.equal({
        authorization: 'Bearer token123',
        cookie: 'session=abc123',
      });
    });

    it('should handle array values in IncomingHttpHeaders', () => {
      const headers = {
        authorization: ['Bearer token1', 'Bearer token2'],
        cookie: 'session=abc123',
      };

      const result = getHeadersForPropagation(headers);

      expect(result).to.deep.equal({
        authorization: 'Bearer token1, Bearer token2',
        cookie: 'session=abc123',
      });
    });

    it('should return empty object when no approved headers are present', () => {
      const headers = {
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0',
      };

      const result = getHeadersForPropagation(headers);

      expect(result).to.deep.equal({});
    });

    it('should handle empty headers object', () => {
      const result = getHeadersForPropagation({});

      expect(result).to.deep.equal({});
    });

    it('should ignore headers with undefined/null values', () => {
      const headers = {
        authorization: undefined,
        cookie: null,
      };

      const result = getHeadersForPropagation(headers as any);

      expect(result).to.deep.equal({});
    });

    it('should handle case sensitivity correctly', () => {
      const headers = {
        Authorization: 'Bearer token123',
        Cookie: 'session=abc123',
      };

      const result = getHeadersForPropagation(headers);

      // Should not match due to case sensitivity
      expect(result).to.deep.equal({});
    });
  });

  describe('getEditingRequestHtml', () => {
    let mockDataFetcher: sinon.SinonStubbedInstance<NativeDataFetcher>;
    let requestUrl: URL;

    beforeEach(() => {
      mockDataFetcher = sandbox.createStubInstance(NativeDataFetcher);
      requestUrl = new URL('https://example.com/page');
    });

    it('should successfully fetch and process HTML', async () => {
      const mockHtml = `<html><body><div phkey="test">Content</div><script id="${STATIC_PROPS_ID}">static</script></body></html>`;
      const expectedHtml = `<html><body><div key="test">Content</div><script id="${SERVER_PROPS_ID}">static</script></body></html>`;

      mockDataFetcher.get.resolves({
        data: mockHtml,
      } as any);

      const propagatedQsParams = { param1: 'value1' };
      const propagatedHeaders = { authorization: 'Bearer token' };
      const cookies = ['session=abc123', 'other=xyz789'];

      const result = await getEditingRequestHtml(
        requestUrl,
        propagatedQsParams,
        propagatedHeaders,
        cookies,
        mockDataFetcher as any
      );

      expect(result).to.equal(expectedHtml);
      expect(mockDataFetcher.get).to.have.been.calledOnce;

      // Verify URL was modified with query params and timestamp
      const calledUrl = mockDataFetcher.get.firstCall.args[0];
      expect(calledUrl).to.include('param1=value1');
      expect(calledUrl).to.include('timestamp=');

      // Verify headers were modified with cookies
      const calledOptions = mockDataFetcher.get.firstCall.args[1];
      expect(calledOptions.headers.cookie).to.equal('session=abc123;other=xyz789');
      expect(calledOptions.credentials).to.equal('include');
    });

    it('should append cookies to existing cookie header', async () => {
      const mockHtml = '<html><body>Content</body></html>';

      mockDataFetcher.get.resolves({
        data: mockHtml,
      } as any);

      const propagatedHeaders = {
        authorization: 'Bearer token',
        cookie: 'existing=cookie',
      };
      const cookies = ['session=abc123'];

      await getEditingRequestHtml(
        requestUrl,
        {},
        propagatedHeaders,
        cookies,
        mockDataFetcher as any
      );

      const calledOptions = mockDataFetcher.get.firstCall.args[1];
      expect(calledOptions.headers.cookie).to.equal('existing=cookie;session=abc123');
    });

    it('should handle 404 response without throwing', async () => {
      const mock404Response = {
        data: '<html><body>404 Not Found</body></html>',
      };

      const error = {
        response: {
          status: 404,
          ...mock404Response,
        },
      };

      mockDataFetcher.get.rejects(error);

      const result = await getEditingRequestHtml(requestUrl, {}, {}, [], mockDataFetcher as any);

      expect(result).to.equal('<html><body>404 Not Found</body></html>');
    });

    it('should throw error for non-404 fetch failures', async () => {
      const error = {
        response: {
          status: 503,
        },
      };

      mockDataFetcher.get.rejects(error);

      try {
        await getEditingRequestHtml(requestUrl, {}, {}, [], mockDataFetcher as any);
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });

    it('should throw error when HTML is empty', async () => {
      mockDataFetcher.get.resolves({
        data: '',
      } as any);

      try {
        await getEditingRequestHtml(requestUrl, {}, {}, [], mockDataFetcher as any);
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err.message).to.include('Failed to render html for');
      }
    });

    it('should throw error when HTML is null', async () => {
      mockDataFetcher.get.resolves({
        data: null,
      } as any);

      try {
        await getEditingRequestHtml(requestUrl, {}, {}, [], mockDataFetcher as any);
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err.message).to.include('Failed to render html for');
      }
    });

    it('should replace multiple phkey attributes', async () => {
      const mockHtml = '<div phkey="test1"><span phkey="test2">Content</span></div>';
      const expectedHtml = '<div key="test1"><span key="test2">Content</span></div>';

      mockDataFetcher.get.resolves({
        data: mockHtml,
      } as any);

      const result = await getEditingRequestHtml(requestUrl, {}, {}, [], mockDataFetcher as any);

      expect(result).to.equal(expectedHtml);
    });

    it('should add timestamp to URL', async () => {
      const mockHtml = '<html><body>Content</body></html>';
      mockDataFetcher.get.resolves({ data: mockHtml } as any);

      const beforeTime = Date.now();
      await getEditingRequestHtml(requestUrl, {}, {}, [], mockDataFetcher as any);
      const afterTime = Date.now();

      const calledUrl = mockDataFetcher.get.firstCall.args[0];
      const url = new URL(calledUrl);
      const timestamp = parseInt(url.searchParams.get('timestamp') || '0', 10);
      expect(timestamp).to.be.at.least(beforeTime);
      expect(timestamp).to.be.at.most(afterTime);
    });

    it('should handle 403 response without throwing', async () => {
      const mock403Response = {
        data: {
          html: '<html><body>403 Forbidden</body></html>',
        },
      };

      const error = {
        response: {
          status: 403,
          ...mock403Response,
        },
      };

      mockDataFetcher.get.rejects(error);

      const result = await getEditingRequestHtml(requestUrl, {}, {}, [], mockDataFetcher as any);

      expect(result).to.equal('<html><body>403 Forbidden</body></html>');
    });

    it('should handle 500 response without throwing', async () => {
      const mock500Response = {
        data: {
          html: '<html><body>500 Internal Server Error</body></html>',
        },
      };

      const error = {
        response: {
          status: 500,
          ...mock500Response,
        },
      };

      mockDataFetcher.get.rejects(error);

      const result = await getEditingRequestHtml(requestUrl, {}, {}, [], mockDataFetcher as any);

      expect(result).to.equal('<html><body>500 Internal Server Error</body></html>');
    });
  });

  describe('isDesignLibraryPreviewData', () => {
    it('should return true for valid design library preview data', () => {
      const data = {
        mode: DesignLibraryMode.Normal,
        otherProp: 'value',
      };

      const result = isDesignLibraryPreviewData(data);

      expect(result).to.be.true;
    });

    it('should return true for library metadata mode', () => {
      const data = {
        mode: DesignLibraryMode.Metadata,
        otherProp: 'value',
      };

      const result = isDesignLibraryPreviewData(data);

      expect(result).to.be.true;
    });

    it('should return false for non-design library mode', () => {
      const data = {
        mode: 'edit',
        otherProp: 'value',
      };

      const result = isDesignLibraryPreviewData(data);

      expect(result).to.be.false;
    });

    it('should return false for null data', () => {
      const result = isDesignLibraryPreviewData(null);

      expect(result).to.be.false;
    });

    it('should return false for undefined data', () => {
      const result = isDesignLibraryPreviewData(undefined);

      expect(result).to.be.false;
    });

    it('should return false for non-object data', () => {
      const result = isDesignLibraryPreviewData('string');

      expect(result).to.be.false;
    });

    it('should return false for object without mode property', () => {
      const data = {
        otherProp: 'value',
      };

      const result = isDesignLibraryPreviewData(data);

      expect(result).to.be.false;
    });

    it('should return false for empty object', () => {
      const result = isDesignLibraryPreviewData({});

      expect(result).to.be.false;
    });
  });

  describe('resolveServerUrl', () => {
    it('should return SITECORE_INTERNAL_EDITING_HOST_URL when set', () => {
      process.env.SITECORE_INTERNAL_EDITING_HOST_URL = 'https://custom-host.com';
      const req = {
        headers: { host: 'example.com' },
      } as NextApiRequest;

      const result = resolveServerUrl(req);

      expect(result).to.equal('https://custom-host.com');
    });

    it('should return localhost:3000 for XM Cloud deployments', () => {
      process.env.SITECORE = 'true';
      const req = {
        headers: { host: 'example.com' },
      } as NextApiRequest;

      const result = resolveServerUrl(req);

      expect(result).to.equal('http://localhost:3000');
    });

    it('should use https for Vercel deployment', () => {
      process.env.VERCEL = 'true';
      const req = {
        headers: { host: 'vercel-app.vercel.app' },
      } as NextApiRequest;

      const result = resolveServerUrl(req);

      expect(result).to.equal('https://vercel-app.vercel.app');
    });

    it('should use https for Netlify deployment', () => {
      process.env.NETLIFY = 'true';
      const req = {
        headers: { host: 'netlify-app.netlify.app' },
      } as NextApiRequest;

      const result = resolveServerUrl(req);

      expect(result).to.equal('https://netlify-app.netlify.app');
    });

    it('should use http for local development', () => {
      const req = {
        headers: { host: 'localhost:3000' },
      } as NextApiRequest;

      const result = resolveServerUrl(req);

      expect(result).to.equal('http://localhost:3000');
    });

    it('should handle NextRequest with Headers object', () => {
      const headers = new Headers();
      headers.set('host', 'example.com');

      const req = {
        headers,
      } as NextRequest;

      const result = resolveServerUrl(req);

      expect(result).to.equal('http://example.com');
    });

    it('should handle missing host header gracefully', () => {
      const req = {
        headers: {},
      } as NextApiRequest;

      const result = resolveServerUrl(req);

      expect(result).to.equal('http://undefined');
    });

    it('should prioritize SITECORE_INTERNAL_EDITING_HOST_URL over environment flags', () => {
      process.env.SITECORE_INTERNAL_EDITING_HOST_URL = 'https://priority-host.com';
      process.env.VERCEL = 'true';
      process.env.SITECORE = 'true';

      const req = {
        headers: { host: 'example.com' },
      } as NextApiRequest;

      const result = resolveServerUrl(req);

      expect(result).to.equal('https://priority-host.com');
    });

    it('should prioritize SITECORE over hosting platform flags', () => {
      process.env.SITECORE = 'true';
      process.env.VERCEL = 'true';
      process.env.NETLIFY = 'true';

      const req = {
        headers: { host: 'example.com' },
      } as NextApiRequest;

      const result = resolveServerUrl(req);

      expect(result).to.equal('http://localhost:3000');
    });

    it('should prioritize x-forwarded-host over host header (NextApiRequest)', () => {
      const req = {
        headers: {
          'x-forwarded-host': 'forwarded.com',
          host: 'localhost:3000',
        },
      } as NextApiRequest;

      const result = resolveServerUrl(req);

      expect(result).to.equal('http://forwarded.com');
    });

    it('should use x-forwarded-host header when present (NextRequest)', () => {
      const headers = new Headers();
      headers.set('x-forwarded-host', 'proxy.example.com');
      headers.set('host', 'internal-host.local');

      const req = {
        headers,
      } as NextRequest;

      const result = resolveServerUrl(req);

      expect(result).to.equal('http://proxy.example.com');
    });
  });

  describe('getCSPHeader', () => {
    beforeEach(() => {
      // Clean up any existing JSS_ALLOWED_ORIGINS
      delete process.env.JSS_ALLOWED_ORIGINS;
    });

    it('should return CSP header with default allowed origins', () => {
      const result = getCSPHeader();

      expect(result).to.include("frame-ancestors 'self'");
      expect(result).to.include('https://pages.sitecorecloud.io');
    });

    it('should include custom allowed origins from environment', () => {
      process.env.JSS_ALLOWED_ORIGINS = 'https://custom1.com,https://custom2.com';

      const result = getCSPHeader();

      expect(result).to.include("frame-ancestors 'self'");
      expect(result).to.include('https://custom1.com');
      expect(result).to.include('https://custom2.com');
      // Should also include default origins
      expect(result).to.include('https://pages.sitecorecloud.io');
    });

    it('should handle empty JSS_ALLOWED_ORIGINS', () => {
      process.env.JSS_ALLOWED_ORIGINS = '';

      const result = getCSPHeader();

      expect(result).to.include("frame-ancestors 'self'");
      expect(result).to.include('https://pages.sitecorecloud.io');
    });

    it('should handle JSS_ALLOWED_ORIGINS with spaces', () => {
      process.env.JSS_ALLOWED_ORIGINS = ' https://custom1.com , https://custom2.com ';

      const result = getCSPHeader();

      expect(result).to.include('https://custom1.com');
      expect(result).to.include('https://custom2.com');
    });

    it('should include origins from both env and defaults even if duplicated', () => {
      process.env.JSS_ALLOWED_ORIGINS = 'https://pages.sitecorecloud.io,https://custom.com';

      const result = getCSPHeader();

      // May have duplicate pages.sitecorecloud.io from both env and defaults
      const matches = (result.match(/https:\/\/pages\.sitecorecloud\.io/g) || []).length;
      expect(matches).to.be.at.least(1);
      expect(result).to.include('https://custom.com');
    });
  });
});
