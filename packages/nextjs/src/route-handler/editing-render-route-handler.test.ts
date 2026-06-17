/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { NextRequest } from 'next/server';
import proxyquire from 'proxyquire';
import { SERVER_PROPS_ID } from 'next/constants';
import {
  EDITING_ALLOWED_ORIGINS,
  QUERY_PARAM_EDITING_SECRET,
  INVALID_SECRET_HTML_MESSAGE,
  DesignLibraryMode,
  PREVIEW_KEY,
} from '@sitecore-content-sdk/content/editing';
import {
  EDITING_PARAMS_HEADER,
  QUERY_PARAM_VERCEL_PROTECTION_BYPASS,
  QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE,
} from '../editing/constants';
import { SITE_KEY } from '@sitecore-content-sdk/content/site';

chai.use(sinonChai);

// Test globals are set up in beforeEach with proper stubs

describe('createEditingRenderRouteHandlers', () => {
  const sandbox = sinon.createSandbox();
  let editingRenderRouteHandlerModule: any;
  let getEditingSecretStub: sinon.SinonStub;
  let getEnforcedCorsHeadersStub: sinon.SinonStub;
  let draftModeStub: any;
  let getEditingRequestHtmlStub: sinon.SinonStub;
  let resolveServerUrlStub: sinon.SinonStub;
  let getQueryParamsForPropagationStub: sinon.SinonStub;
  let getHeadersForPropagationStub: sinon.SinonStub;
  let cleanupNextPreviewCookiesStub: sinon.SinonStub;
  let cookiesStub: any;
  let getRequiredQueryParamsStub: sinon.SinonStub;
  let getCSPHeaderStub: sinon.SinonStub;
  let getAllowedQueryParamsStub: sinon.SinonStub;
  let fetchStub: sinon.SinonStub;
  let handlers: any;
  let req: Partial<NextRequest>;
  let NativeDataFetcherStub: sinon.SinonStub;
  let mockFetchInstance: any;

  let OriginalResponse: typeof Response;
  let originalTestCookieStore: any;

  const allowedOrigin = 'https://allowed.com';
  const secret = 'secret1234';

  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE, PUT, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  const mockSearchParams = (params: { [key: string]: string }) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.set(key, value);
    });
    return searchParams;
  };

  before(() => {
    // Store original global cookie store state
    originalTestCookieStore = (global as any).__TEST_COOKIE_STORE__;
  });

  after(() => {
    // Restore original cookie store state (don't touch process.env.TEST as it's global)
    if (originalTestCookieStore !== undefined) {
      (global as any).__TEST_COOKIE_STORE__ = originalTestCookieStore;
    } else {
      delete (global as any).__TEST_COOKIE_STORE__;
    }
  });

  beforeEach(() => {
    getEditingSecretStub = sandbox.stub().returns(secret);
    getEnforcedCorsHeadersStub = sandbox.stub().returns(corsHeaders);
    draftModeStub = {
      enable: sandbox.stub().resolves(),
      disable: sandbox.stub().resolves(),
    };
    getEditingRequestHtmlStub = sandbox.stub().resolves('<div>some html</div>');
    resolveServerUrlStub = sandbox.stub().returns('http://localhost:3000');
    getQueryParamsForPropagationStub = sandbox.stub().returns([]);
    getHeadersForPropagationStub = sandbox.stub().returns({});
    cleanupNextPreviewCookiesStub = sandbox.stub().returns([]);

    // Mock cookies store
    cookiesStub = {
      set: sandbox.stub(),
      get: sandbox.stub().returns({ value: 'some-value' }),
      getAll: sandbox.stub().returns([
        { name: 'test', value: 'value' },
        { name: '__prerender_bypass', value: 'bypass-value' },
      ]),
    };

    getRequiredQueryParamsStub = sandbox.stub().returns(['sc_itemid', 'sc_lang', 'route', 'mode']);
    getCSPHeaderStub = sandbox
      .stub()
      .returns(`frame-ancestors 'self' ${allowedOrigin} ${EDITING_ALLOWED_ORIGINS.join(' ')}`);
    getAllowedQueryParamsStub = sandbox.stub().returns({
      missingAllowedParams: [],
      allowedQueryParams: {},
    });

    // Set the global variable BEFORE proxyquire loads the module
    (global as any).__TEST_COOKIE_STORE__ = cookiesStub;

    fetchStub = sandbox.stub();
    mockFetchInstance = {
      fetch: fetchStub,
    };
    // Create constructor stub that returns the mock instance
    NativeDataFetcherStub = sandbox.stub().returns(mockFetchInstance);

    editingRenderRouteHandlerModule = proxyquire('./editing-render-route-handler', {
      '../utils/utils': { getEditingSecret: getEditingSecretStub },
      '@sitecore-content-sdk/core/tools': { getEnforcedCorsHeaders: getEnforcedCorsHeadersStub },
      'next/headers': {
        draftMode: sandbox.stub().returns(draftModeStub),
        cookies: sandbox.stub(), // Won't be called in test environment
      },
      '../editing/utils': {
        getEditingRequestHtml: getEditingRequestHtmlStub,
        cleanupNextPreviewCookies: cleanupNextPreviewCookiesStub,
        getHeadersForPropagation: getHeadersForPropagationStub,
        getQueryParamsForPropagation: getQueryParamsForPropagationStub,
        getRequiredEditingParamsList: getRequiredQueryParamsStub,
        getCSPHeader: getCSPHeaderStub,
        resolveServerUrl: resolveServerUrlStub,
        getAllowedQueryParams: getAllowedQueryParamsStub,
        mapEditingParams: sandbox.stub().callsFake((query: any) => {
          const isDesignLibrary = Object.values(DesignLibraryMode).includes(query.mode);
          return {
            itemId: query.sc_itemid,
            language: query.sc_lang,
            site: query.sc_site,
            mode: query.mode,
            variantId: query.sc_variant,
            version: query.sc_version,
            layoutKind: query.sc_layoutKind,
            ...(!isDesignLibrary && query.sc_previewTime && { previewTime: query.sc_previewTime }),
          };
        }),
        PREVIEW_COOKIES: {
          PREVIEW_DATA: '__next_preview_data',
          PRERENDER_BYPASS: '__prerender_bypass',
        },
      },
      '@sitecore-content-sdk/core': {
        NativeDataFetcher: NativeDataFetcherStub,
      },
    });

    OriginalResponse = (globalThis as any).Response;
    (globalThis as any).Response = sinon.stub().callsFake((body, options) => ({
      headers: options?.headers,
      status: options?.status,
      body,
      json: () => JSON.parse(body || '{}'),
    }));

    (globalThis as any).Response.json = sinon.stub().callsFake((body, options) => ({
      headers: options?.headers,
      status: options?.status,
      body: JSON.stringify(body),
    }));

    (globalThis as any).Response.redirect = sinon.stub().callsFake((url) => ({
      status: 307,
      headers: { Location: url },
      body: null,
    }));

    handlers = editingRenderRouteHandlerModule.createEditingRenderRouteHandlers({});

    req = {
      method: 'GET',
      headers: new Headers({
        origin: allowedOrigin,
        host: 'localhost:3000',
      }),
      nextUrl: {
        searchParams: mockSearchParams({
          [QUERY_PARAM_EDITING_SECRET]: secret,
          mode: 'edit',
          route: '/styleguide',
          sc_itemid: '{11111111-1111-1111-1111-111111111111}',
          sc_lang: 'en',
          sc_site: 'website',
          sc_variant: 'dev',
          sc_version: 'latest',
          sc_layoutKind: 'shared',
        }),
      } as any,
    };
  });

  afterEach(() => {
    sandbox.restore();
    sinon.restore();
    (globalThis as any).Response = OriginalResponse;
    // Note: Global TEST environment variables are cleaned up in after() hook
  });

  describe('OPTIONS handler', () => {
    it('should return 401 for invalid origin', async () => {
      getEnforcedCorsHeadersStub.returns(null);

      const res = await handlers.OPTIONS(req as NextRequest);

      expect(res.status).to.equal(401);
      expect(res.body).to.include('not allowed');
    });

    it('should return 204 for valid preflight request', async () => {
      const res = await handlers.OPTIONS(req as NextRequest);

      expect(res.status).to.equal(204);
      expect(res.headers).to.deep.equal(corsHeaders);
      expect(res.body).to.equal(null);
    });

    it('should call getEnforcedCorsHeaders with correct parameters', async () => {
      await handlers.OPTIONS(req as NextRequest);

      expect(getEnforcedCorsHeadersStub).to.have.been.calledOnce;
      const args = getEnforcedCorsHeadersStub.firstCall.args[0];
      expect(args.requestMethod).to.equal('GET');
      expect(args.allowedOrigins).to.deep.equal(EDITING_ALLOWED_ORIGINS);
    });
  });

  describe('GET handler', () => {
    it('should return 401 for invalid origin', async () => {
      getEnforcedCorsHeadersStub.returns(null);

      const res = await handlers.GET(req as NextRequest);

      expect(res.status).to.equal(401);
      expect(res.body).to.include('not allowed');
    });

    it('should return 401 for invalid editing secret', async () => {
      req.nextUrl!.searchParams = mockSearchParams({
        [QUERY_PARAM_EDITING_SECRET]: 'wrong-secret',
        mode: 'edit',
        route: '/styleguide',
        sc_itemid: '{11111111-1111-1111-1111-111111111111}',
        sc_lang: 'en',
        sc_site: 'website',
      });

      const res = await handlers.GET(req as NextRequest);

      expect(res.status).to.equal(401);
      const responseBody = JSON.parse(res.body);
      expect(responseBody.html).to.equal(INVALID_SECRET_HTML_MESSAGE);
    });

    it('should return 401 for missing editing secret', async () => {
      req.nextUrl!.searchParams = mockSearchParams({
        mode: 'edit',
        route: '/styleguide',
        sc_itemid: '{11111111-1111-1111-1111-111111111111}',
        sc_lang: 'en',
        sc_site: 'website',
      });

      const res = await handlers.GET(req as NextRequest);

      expect(res.status).to.equal(401);
      const responseBody = JSON.parse(res.body);
      expect(responseBody.html).to.equal(INVALID_SECRET_HTML_MESSAGE);
    });

    it('should return 400 for missing required query parameters', async () => {
      req.nextUrl!.searchParams = mockSearchParams({
        [QUERY_PARAM_EDITING_SECRET]: secret,
        sc_site: 'website',
      });

      const res = await handlers.GET(req as NextRequest);

      expect(res.status).to.equal(400);
      const responseBody = JSON.parse(res.body);
      expect(responseBody.html).to.equal(
        '<html><body>Missing required query parameters: sc_itemid, sc_lang, route, mode</body></html>'
      );
    });

    it('should handle successful request', async () => {
      const mockHtml =
        '<html><head><title>Test Page</title></head><body><div>some html content</div></body></html>';
      getEditingRequestHtmlStub.resolves(mockHtml);

      const res = await handlers.GET(req as NextRequest);

      expect(res.status).to.equal(200);
      expect(res.body).to.equal(mockHtml);
      expect(res.headers['Content-Type']).to.equal('text/html; charset=utf-8');
      expect(res.headers['Content-Security-Policy']).to.include('frame-ancestors');
      expect(draftModeStub.enable).to.have.been.calledOnce;
      expect(draftModeStub.disable).to.have.been.calledOnce;

      // Verify the returned HTML content structure
      expect(res.body).to.include('<html>');
      expect(res.body).to.include('<head>');
      expect(res.body).to.include('<title>Test Page</title>');
      expect(res.body).to.include('<body>');
      expect(res.body).to.include('some html content');
    });

    it('should launch internal request and pass preview data as search params', async () => {
      const mockQuery = {
        [QUERY_PARAM_EDITING_SECRET]: secret,
        mode: 'edit',
        route: '/styleguide',
        sc_itemid: '{11111111-1111-1111-1111-111111111111}',
        sc_lang: 'en',
        sc_site: 'website',
        sc_variant: 'dev',
        sc_version: 'latest',
        sc_layoutKind: 'shared',
      };

      req.nextUrl!.searchParams = mockSearchParams(mockQuery);

      getQueryParamsForPropagationStub.returns({
        [QUERY_PARAM_VERCEL_PROTECTION_BYPASS]: 'bypass123',
      });

      getHeadersForPropagationStub.returns({
        authorization: 'Bearer token123',
        cookie: 'test=value',
      });

      // The mapEditingParams stub should be set up to return proper values in the beforeEach

      await handlers.GET(req as NextRequest);

      expect(getEditingRequestHtmlStub).to.have.been.calledOnce;

      // Verify URL parameter
      const [requestUrl, propagatedQsParams, propagatedHeaders, convertedCookies, dataFetcher] =
        getEditingRequestHtmlStub.firstCall.args;

      expect(requestUrl).to.be.instanceOf(URL);
      expect(requestUrl.pathname).to.equal('/styleguide');
      expect(requestUrl.origin).to.equal('http://localhost:3000');

      // Verify propagated query parameters
      expect(propagatedQsParams).to.deep.equal({
        [QUERY_PARAM_VERCEL_PROTECTION_BYPASS]: 'bypass123',
        itemId: mockQuery.sc_itemid,
        language: mockQuery.sc_lang,
        site: mockQuery.sc_site,
        mode: mockQuery.mode,
        variantId: mockQuery.sc_variant,
        version: mockQuery.sc_version,
        layoutKind: mockQuery.sc_layoutKind,
      });

      // Verify propagated headers (includes editing params header for preview)
      expect(propagatedHeaders).to.deep.equal({
        authorization: 'Bearer token123',
        cookie: 'test=value',
        [EDITING_PARAMS_HEADER]: JSON.stringify({
          itemId: mockQuery.sc_itemid,
          language: mockQuery.sc_lang,
          site: mockQuery.sc_site,
          mode: mockQuery.mode,
          variantId: mockQuery.sc_variant,
          version: mockQuery.sc_version,
          layoutKind: mockQuery.sc_layoutKind,
        }),
      });

      // Verify converted cookies from cookieStore.getAll()
      expect(convertedCookies).to.be.an('array');
      expect(convertedCookies).to.include('test=value');
      expect(convertedCookies).to.include('__prerender_bypass=bypass-value');

      // Verify data fetcher is passed
      expect(dataFetcher).to.exist;
    });

    it('should propagate correct query parameters for deployment protection', async () => {
      const protectionParams = {
        [QUERY_PARAM_VERCEL_PROTECTION_BYPASS]: 'bypass-token-123',
        [QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE]: 'true',
      };

      req.nextUrl!.searchParams = mockSearchParams({
        [QUERY_PARAM_EDITING_SECRET]: secret,
        mode: 'edit',
        route: '/protected-page',
        sc_itemid: '{22222222-2222-2222-2222-222222222222}',
        sc_lang: 'en',
        sc_site: 'website',
        ...protectionParams,
      });

      getQueryParamsForPropagationStub.returns(protectionParams);

      await handlers.GET(req as NextRequest);

      expect(getQueryParamsForPropagationStub).to.have.been.calledOnce;
      expect(getEditingRequestHtmlStub).to.have.been.calledOnce;

      const [, propagatedQsParams] = getEditingRequestHtmlStub.firstCall.args;
      expect(propagatedQsParams[QUERY_PARAM_VERCEL_PROTECTION_BYPASS]).to.equal(
        protectionParams[QUERY_PARAM_VERCEL_PROTECTION_BYPASS]
      );
      expect(propagatedQsParams[QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE]).to.equal(
        protectionParams[QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE]
      );
    });

    it('should propagate headers to internal request', async () => {
      const testHeaders = new Headers({
        origin: allowedOrigin,
        host: 'localhost:3000',
        authorization: 'Bearer jwt-token-456',
        cookie: 'session=abc123; user=johndoe',
        'x-custom-header': 'should-not-be-propagated',
      });

      req.headers = testHeaders;

      const expectedPropagatedHeaders = {
        authorization: 'Bearer jwt-token-456',
        cookie: 'session=abc123; user=johndoe',
      };

      getHeadersForPropagationStub.returns(expectedPropagatedHeaders);

      await handlers.GET(req as NextRequest);

      expect(getHeadersForPropagationStub).to.have.been.calledWith(testHeaders);
      expect(getEditingRequestHtmlStub).to.have.been.calledOnce;

      const [, , propagatedHeaders] = getEditingRequestHtmlStub.firstCall.args;
      expect(propagatedHeaders).to.deep.include(expectedPropagatedHeaders);
      expect(propagatedHeaders[EDITING_PARAMS_HEADER]).to.be.a('string');
    });

    it('should include previewTime in editing params when sc_previewTime is present in query params', async () => {
      req.nextUrl!.searchParams = mockSearchParams({
        [QUERY_PARAM_EDITING_SECRET]: secret,
        mode: 'edit',
        route: '/',
        sc_itemid: '{11111111-1111-1111-1111-111111111111}',
        sc_lang: 'en',
        sc_site: 'website',
        sc_previewTime: '2024-12-25T10:00:00Z',
      });

      await handlers.GET(req as NextRequest);

      expect(getEditingRequestHtmlStub).to.have.been.calledOnce;

      // Verify previewTime is included in the EDITING_PARAMS_HEADER JSON, which flows to Edge GraphQL via PreviewProxy
      const [, , propagatedHeaders] = getEditingRequestHtmlStub.firstCall.args;
      const editingParams = JSON.parse(propagatedHeaders[EDITING_PARAMS_HEADER]);
      expect(editingParams).to.have.property('previewTime', '2024-12-25T10:00:00Z');
    });

    it('should not include previewTime in editing params when sc_previewTime is absent (backward compatibility)', async () => {
      req.nextUrl!.searchParams = mockSearchParams({
        [QUERY_PARAM_EDITING_SECRET]: secret,
        mode: 'edit',
        route: '/',
        sc_itemid: '{11111111-1111-1111-1111-111111111111}',
        sc_lang: 'en',
        sc_site: 'website',
      });

      await handlers.GET(req as NextRequest);

      expect(getEditingRequestHtmlStub).to.have.been.calledOnce;

      // Verify previewTime is absent from the EDITING_PARAMS_HEADER JSON
      const [, , propagatedHeaders] = getEditingRequestHtmlStub.firstCall.args;
      const editingParams = JSON.parse(propagatedHeaders[EDITING_PARAMS_HEADER]);
      expect(editingParams).to.not.have.property('previewTime');
    });

    it('should pass cookies correctly for internal request', async () => {
      const mockCookies = [
        { name: 'sessionId', value: 'sess_123456' },
        { name: 'userId', value: 'user_789' },
        { name: 'theme', value: 'dark' },
      ];

      // Create a new mock cookie store for this test
      const testCookieStore = {
        set: sandbox.stub(),
        get: sandbox.stub().returns({ value: 'test-value' }),
        getAll: sandbox.stub().returns(mockCookies),
      };

      // Update the global test store for this test
      (global as any).__TEST_COOKIE_STORE__ = testCookieStore;

      await handlers.GET(req as NextRequest);

      expect(getEditingRequestHtmlStub).to.have.been.calledOnce;

      const [, , , convertedCookies] = getEditingRequestHtmlStub.firstCall.args;
      expect(convertedCookies).to.be.an('array');
      expect(convertedCookies).to.include('sessionId=sess_123456');
      expect(convertedCookies).to.include('userId=user_789');
      expect(convertedCookies).to.include('theme=dark');

      // Restore the original cookie store
      (global as any).__TEST_COOKIE_STORE__ = cookiesStub;
    });

    it('should construct request URL with route for internal request', async () => {
      const testRoute = '/products/category/item';

      req.nextUrl!.searchParams = mockSearchParams({
        [QUERY_PARAM_EDITING_SECRET]: secret,
        mode: 'edit',
        route: testRoute,
        sc_itemid: '{33333333-3333-3333-3333-333333333333}',
        sc_lang: 'fr',
        sc_site: 'international',
      });

      resolveServerUrlStub.returns('https://my-app.example.com:8080');

      await handlers.GET(req as NextRequest);

      expect(resolveServerUrlStub).to.have.been.calledWith(req);
      expect(getEditingRequestHtmlStub).to.have.been.calledOnce;

      const [requestUrl] = getEditingRequestHtmlStub.firstCall.args;
      expect(requestUrl.toString()).to.equal(
        'https://my-app.example.com:8080/products/category/item'
      );
      expect(requestUrl.protocol).to.equal('https:');
      expect(requestUrl.hostname).to.equal('my-app.example.com');
      expect(requestUrl.port).to.equal('8080');
      expect(requestUrl.pathname).to.equal(testRoute);
    });

    it('should use custom resolvePageUrl', async () => {
      const handlers = editingRenderRouteHandlerModule.createEditingRenderRouteHandlers({
        resolvePageUrl: (itemPath: string) => `/custom/path${itemPath}`,
      });

      await handlers.GET(req as NextRequest);

      expect(getEditingRequestHtmlStub).to.have.been.calledOnce;
      const requestUrlArg = getEditingRequestHtmlStub.firstCall.args[0];
      expect(requestUrlArg.pathname).to.equal('/custom/path/styleguide');
    });

    it('should handle request with special characters in route', async () => {
      req.nextUrl!.searchParams = mockSearchParams({
        [QUERY_PARAM_EDITING_SECRET]: secret,
        mode: 'edit',
        route: '/Åbout',
        sc_itemid: '{11111111-1111-1111-1111-111111111111}',
        sc_lang: 'en',
        sc_site: 'website',
        sc_variant: 'dev',
        sc_version: 'latest',
        sc_layoutKind: 'shared',
      });

      const res = await handlers.GET(req as NextRequest);

      expect(res.status).to.equal(200);
      expect(getEditingRequestHtmlStub).to.have.been.calledOnce;
      const requestUrlArg = getEditingRequestHtmlStub.firstCall.args[0];
      expect(requestUrlArg.pathname).to.equal('/%C3%85bout');
    });

    it('should set preview cookies for preview mode', async () => {
      req.nextUrl!.searchParams = mockSearchParams({
        [QUERY_PARAM_EDITING_SECRET]: secret,
        mode: 'preview',
        route: '/styleguide',
        sc_itemid: '{11111111-1111-1111-1111-111111111111}',
        sc_lang: 'en',
        sc_site: 'website',
        sc_variant: 'dev',
        sc_version: 'latest',
        sc_layoutKind: 'final',
      });

      // Mock that preview cookies are initially set but then filtered out
      cleanupNextPreviewCookiesStub.returns([]);

      const mockCookies = [
        { name: 'test', value: 'value' },
        { name: '__prerender_bypass', value: 'bypass-value' },
      ];
      // Update cookiesStub to return preview cookies when getAll() is called
      cookiesStub.getAll.callsFake(() => mockCookies);
      cookiesStub.set.callsFake((name: string, value: string) => {
        mockCookies.push({ name, value });
      });

      const res = await handlers.GET(req as NextRequest);

      // Verify response is successful
      expect(res.status).to.equal(200);
      expect(draftModeStub.enable).to.have.been.calledOnce;
      expect(draftModeStub.disable).to.have.been.calledOnce;

      // Check that cookieStore.set was called for preview cookies
      // Note: The actual calls depend on the implementation details
      expect(cookiesStub.set).to.have.been.called;
      expect(cleanupNextPreviewCookiesStub).to.have.been.calledOnce;
      // Preview cookies are filtered out before response, so Set-Cookie should be empty
      expect(res.headers['Set-Cookie']).to.equal('');

      // New assertions: Check that preview cookies are passed as part of convertedCookies
      expect(getEditingRequestHtmlStub).to.have.been.calledOnce;
      const [, , , convertedCookies] = getEditingRequestHtmlStub.firstCall.args;
      expect(convertedCookies).to.be.an('array');
      expect(convertedCookies).to.include(`${PREVIEW_KEY}=true`);
      expect(convertedCookies).to.include(`${SITE_KEY}=website`);
    });

    it('should propagate allowed query parameters', async () => {
      const protectedParams = {
        [QUERY_PARAM_VERCEL_PROTECTION_BYPASS]: 'bypass123',
        [QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE]: 'true',
        someOtherParam: 'shouldNotBeIncluded',
      };

      req.nextUrl!.searchParams = mockSearchParams({
        [QUERY_PARAM_EDITING_SECRET]: secret,
        mode: 'edit',
        route: '/styleguide',
        sc_itemid: '{11111111-1111-1111-1111-111111111111}',
        sc_lang: 'en',
        sc_site: 'website',
        ...protectedParams,
      });

      getQueryParamsForPropagationStub.returns([
        `${QUERY_PARAM_VERCEL_PROTECTION_BYPASS}=bypass123`,
        `${QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE}=true`,
      ]);

      await handlers.GET(req as NextRequest);

      expect(getQueryParamsForPropagationStub).to.have.been.calledOnce;
    });

    it('should propagate allowed headers', async () => {
      req.headers = new Headers({
        origin: allowedOrigin,
        host: 'localhost:3000',
        authorization: 'Bearer token',
        cookie: 'sc_another_cookie=12345',
        'other-header': 'shouldNotBeIncluded',
      });

      getHeadersForPropagationStub.returns({
        authorization: 'Bearer token',
        cookie: 'sc_another_cookie=12345',
      });

      await handlers.GET(req as NextRequest);

      expect(getHeadersForPropagationStub).to.have.been.calledOnce;
      expect(getEditingRequestHtmlStub).to.have.been.calledOnce;
    });

    it('should filter cookies before response', async () => {
      cleanupNextPreviewCookiesStub.returns(['filtered=cookie']);

      const res = await handlers.GET(req as NextRequest);

      expect(cleanupNextPreviewCookiesStub).to.have.been.calledOnce;
      expect(res.headers['Set-Cookie']).to.equal('filtered=cookie; SameSite=None; Secure');
    });

    it('should replace static props id in html', async () => {
      // The replacement happens inside getEditingRequestHtml, so we need to mock it with the replaced version
      getEditingRequestHtmlStub.resolves(`<div>some html ${SERVER_PROPS_ID}</div>`);

      const res = await handlers.GET(req as NextRequest);

      expect(res.body).to.equal(`<div>some html ${SERVER_PROPS_ID}</div>`);
    });

    it('should handle empty html response', async () => {
      // Empty html causes an error in getEditingRequestHtml which triggers the catch block
      getEditingRequestHtmlStub.rejects(new Error('Failed to render html'));

      const res = await handlers.GET(req as NextRequest);

      expect((globalThis as any).Response.redirect).to.have.been.calledWith('/styleguide');
      expect(res.status).to.equal(307);
    });

    it('should handle request failure with redirect fallback', async () => {
      getEditingRequestHtmlStub.rejects(new Error('Request failed'));

      const res = await handlers.GET(req as NextRequest);

      expect((globalThis as any).Response.redirect).to.have.been.calledWith('/styleguide');
      expect(res.status).to.equal(307);
    });

    it('should set Content-Security-Policy header', async () => {
      const res = await handlers.GET(req as NextRequest);

      expect(getCSPHeaderStub).to.have.been.calledOnce;
      expect(res.headers['Content-Security-Policy']).to.equal(
        `frame-ancestors 'self' ${allowedOrigin} ${EDITING_ALLOWED_ORIGINS.join(' ')}`
      );
    });

    describe('allowedQueryParams configuration', () => {
      it('should not include additional query params when allowedQueryParams is not configured', async () => {
        const handlers = editingRenderRouteHandlerModule.createEditingRenderRouteHandlers({});

        req.nextUrl!.searchParams = mockSearchParams({
          [QUERY_PARAM_EDITING_SECRET]: secret,
          mode: 'edit',
          route: '/styleguide',
          sc_itemid: '{11111111-1111-1111-1111-111111111111}',
          sc_lang: 'en',
          sc_site: 'website',
          customParam1: 'value1',
          customParam2: 'value2',
        });

        getAllowedQueryParamsStub.returns({
          missingAllowedParams: [],
          allowedQueryParams: {},
        });

        const res = await handlers.GET(req as NextRequest);

        expect(res.status).to.equal(200);
        expect(getAllowedQueryParamsStub).to.have.been.called;
      });

      it('should include allowed query params when configured as array (objects and strings)', async () => {
        const handlers = editingRenderRouteHandlerModule.createEditingRenderRouteHandlers({
          allowedQueryParams: [
            { name: 'customParam1' },
            { name: 'customParam2' },
            'stringParam',
            'missingStringParam',
          ],
        });

        req.nextUrl!.searchParams = mockSearchParams({
          [QUERY_PARAM_EDITING_SECRET]: secret,
          mode: 'edit',
          route: '/styleguide',
          sc_itemid: '{11111111-1111-1111-1111-111111111111}',
          sc_lang: 'en',
          sc_site: 'website',
          customParam1: 'value1',
          customParam2: 'value2',
          stringParam: 'string-value',
          notAllowed: 'shouldNotBeIncluded',
        });

        getAllowedQueryParamsStub.returns({
          missingAllowedParams: [],
          allowedQueryParams: {
            customParam1: 'value1',
            customParam2: 'value2',
            stringParam: 'string-value',
          },
        });

        const res = await handlers.GET(req as NextRequest);

        expect(res.status).to.equal(200);
        expect(getAllowedQueryParamsStub).to.have.been.calledWith(
          sinon.match.any,
          sinon.match.array
        );
      });

      it('should return 400 when required allowed query param is missing (mixed types)', async () => {
        const handlers = editingRenderRouteHandlerModule.createEditingRenderRouteHandlers({
          allowedQueryParams: [
            { name: 'customParam1', required: true },
            { name: 'customParam2', required: true },
            'stringParam',
          ],
        });

        req.nextUrl!.searchParams = mockSearchParams({
          [QUERY_PARAM_EDITING_SECRET]: secret,
          mode: 'edit',
          route: '/styleguide',
          sc_itemid: '{11111111-1111-1111-1111-111111111111}',
          sc_lang: 'en',
          sc_site: 'website',
          customParam1: 'value1',
          stringParam: 'value',
        });

        getAllowedQueryParamsStub.returns({
          missingAllowedParams: ['customParam2'],
          allowedQueryParams: {
            customParam1: 'value1',
            stringParam: 'value',
          },
        });

        const res = await handlers.GET(req as NextRequest);

        expect(res.status).to.equal(400);
        const responseBody = JSON.parse(res.body);
        expect(responseBody.html).to.equal(
          '<html><body>Missing required query parameters: customParam2</body></html>'
        );
      });

      it('should handle optional allowed query params correctly', async () => {
        const handlers = editingRenderRouteHandlerModule.createEditingRenderRouteHandlers({
          allowedQueryParams: [
            { name: 'requiredParam', required: true },
            { name: 'optionalParam', required: false },
          ],
        });

        req.nextUrl!.searchParams = mockSearchParams({
          [QUERY_PARAM_EDITING_SECRET]: secret,
          mode: 'edit',
          route: '/styleguide',
          sc_itemid: '{11111111-1111-1111-1111-111111111111}',
          sc_lang: 'en',
          sc_site: 'website',
          requiredParam: 'required-value',
        });

        getAllowedQueryParamsStub.returns({
          missingAllowedParams: [],
          allowedQueryParams: {
            requiredParam: 'required-value',
          },
        });

        const res = await handlers.GET(req as NextRequest);

        expect(res.status).to.equal(200);
      });

      it('should use resolver function returning strings and objects', async () => {
        const resolver = (queryParamKeys: string[]) => {
          const result: Array<string | { name: string; required?: boolean }> = [];
          queryParamKeys
            .filter((key) => key.startsWith('prefixed'))
            .forEach((key) => result.push(key));
          if (queryParamKeys.includes('requiredParam')) {
            result.push({ name: 'requiredParam', required: true });
          }
          return result;
        };

        const handlers = editingRenderRouteHandlerModule.createEditingRenderRouteHandlers({
          allowedQueryParams: resolver,
        });

        req.nextUrl!.searchParams = mockSearchParams({
          [QUERY_PARAM_EDITING_SECRET]: secret,
          mode: 'edit',
          route: '/styleguide',
          sc_itemid: '{11111111-1111-1111-1111-111111111111}',
          sc_lang: 'en',
          sc_site: 'website',
          prefixedParam1: 'value1',
          prefixedParam2: 'value2',
          requiredParam: 'required-value',
          otherParam: 'shouldNotBeIncluded',
        });

        getAllowedQueryParamsStub.returns({
          missingAllowedParams: [],
          allowedQueryParams: {
            prefixedParam1: 'value1',
            prefixedParam2: 'value2',
            requiredParam: 'required-value',
          },
        });

        const res = await handlers.GET(req as NextRequest);

        expect(res.status).to.equal(200);
        expect(getAllowedQueryParamsStub).to.have.been.calledWith(
          sinon.match.any,
          sinon.match.func
        );
      });

      it('should return 400 when resolver returns mixed types with missing required param', async () => {
        const resolver = () => {
          return [
            'stringParam',
            { name: 'presentParam', required: true },
            { name: 'missingRequiredParam', required: true },
          ];
        };

        const handlers = editingRenderRouteHandlerModule.createEditingRenderRouteHandlers({
          allowedQueryParams: resolver,
        });

        req.nextUrl!.searchParams = mockSearchParams({
          [QUERY_PARAM_EDITING_SECRET]: secret,
          mode: 'edit',
          route: '/styleguide',
          sc_itemid: '{11111111-1111-1111-1111-111111111111}',
          sc_lang: 'en',
          sc_site: 'website',
          presentParam: 'value1',
          stringParam: 'string-value',
        });

        getAllowedQueryParamsStub.returns({
          missingAllowedParams: ['missingRequiredParam'],
          allowedQueryParams: {
            presentParam: 'value1',
            stringParam: 'string-value',
          },
        });

        const res = await handlers.GET(req as NextRequest);

        expect(res.status).to.equal(400);
        const responseBody = JSON.parse(res.body);
        expect(responseBody.html).to.equal(
          '<html><body>Missing required query parameters: missingRequiredParam</body></html>'
        );
      });

      it('should handle resolver function returning empty array', async () => {
        const resolver = () => {
          return []; // No additional params allowed
        };

        const handlers = editingRenderRouteHandlerModule.createEditingRenderRouteHandlers({
          allowedQueryParams: resolver,
        });

        req.nextUrl!.searchParams = mockSearchParams({
          [QUERY_PARAM_EDITING_SECRET]: secret,
          mode: 'edit',
          route: '/styleguide',
          sc_itemid: '{11111111-1111-1111-1111-111111111111}',
          sc_lang: 'en',
          sc_site: 'website',
          customParam: 'value',
        });

        getAllowedQueryParamsStub.returns({
          missingAllowedParams: [],
          allowedQueryParams: {},
        });

        const res = await handlers.GET(req as NextRequest);

        expect(res.status).to.equal(200);
      });

      it('should combine missing required editing params and missing required allowed params in error message', async () => {
        const handlers = editingRenderRouteHandlerModule.createEditingRenderRouteHandlers({
          allowedQueryParams: [{ name: 'requiredAllowedParam', required: true }],
        });

        req.nextUrl!.searchParams = mockSearchParams({
          [QUERY_PARAM_EDITING_SECRET]: secret,
          sc_site: 'website',
          // missing: sc_itemid, sc_lang, route, mode
          // missing: requiredAllowedParam
        });

        getAllowedQueryParamsStub.returns({
          missingAllowedParams: ['requiredAllowedParam'],
          allowedQueryParams: {},
        });

        const res = await handlers.GET(req as NextRequest);

        expect(res.status).to.equal(400);
        const responseBody = JSON.parse(res.body);
        expect(responseBody.html).to.include('Missing required query parameters:');
        expect(responseBody.html).to.include('sc_itemid');
        expect(responseBody.html).to.include('sc_lang');
        expect(responseBody.html).to.include('route');
        expect(responseBody.html).to.include('mode');
        expect(responseBody.html).to.include('requiredAllowedParam');
      });

      it('should pass allowed query params to getEditingRequestHtml in propagatedQsParams', async () => {
        const handlers = editingRenderRouteHandlerModule.createEditingRenderRouteHandlers({
          allowedQueryParams: [{ name: 'customParam1' }, { name: 'customParam2' }],
        });

        req.nextUrl!.searchParams = mockSearchParams({
          [QUERY_PARAM_EDITING_SECRET]: secret,
          mode: 'edit',
          route: '/styleguide',
          sc_itemid: '{11111111-1111-1111-1111-111111111111}',
          sc_lang: 'en',
          sc_site: 'website',
          customParam1: 'value1',
          customParam2: 'value2',
        });

        getAllowedQueryParamsStub.returns({
          missingAllowedParams: [],
          allowedQueryParams: {
            customParam1: 'value1',
            customParam2: 'value2',
          },
        });

        await handlers.GET(req as NextRequest);

        expect(getEditingRequestHtmlStub).to.have.been.calledOnce;
        const [, propagatedQsParams] = getEditingRequestHtmlStub.firstCall.args;
        expect(propagatedQsParams).to.include({
          customParam1: 'value1',
          customParam2: 'value2',
        });
      });
    });
  });

  describe('POST handler', () => {
    let mockQuery: { [key: string]: string };

    beforeEach(() => {
      mockQuery = {
        [QUERY_PARAM_EDITING_SECRET]: secret,
        mode: 'edit',
        route: '/styleguide',
        sc_itemid: '{11111111-1111-1111-1111-111111111111}',
        sc_lang: 'en',
        sc_site: 'website',
        sc_variant: 'dev',
        sc_version: 'latest',
        sc_layoutKind: 'shared',
        sc_language: 'en',
      };

      req = {
        method: 'POST',
        headers: new Headers({
          origin: allowedOrigin,
          host: 'localhost:3000',
        }),
        nextUrl: {
          searchParams: mockSearchParams(mockQuery),
          host: '',
        } as any,
      };
    });

    it('should return 401 for invalid origin', async () => {
      getEnforcedCorsHeadersStub.returns(null);
      const res = await handlers.POST(req as NextRequest);

      expect(res.status).to.equal(401);
      expect(res.body).to.include('not allowed');
    });

    it('should return 401 when invalid origin and POST request is not same origin or localhost', async () => {
      getEnforcedCorsHeadersStub.returns(null);
      resolveServerUrlStub.returns('http://some-other-host:8080');
      const res = await handlers.POST(req as NextRequest);

      expect(res.status).to.equal(401);
      expect(res.body).to.include('not allowed');
    });

    it('should allow request when in xmc or local environment - request hostname is localhost', async () => {
      getEnforcedCorsHeadersStub.returns(null);
      const mockResponseHeaders = new Headers({
        'content-type': 'text/html',
        'Set-Cookie': 'session=abc123',
      });

      req.nextUrl!.hostname = 'localhost';

      fetchStub.resolves({
        status: 200,
        statusText: 'OK',
        headers: mockResponseHeaders,
        data: '<html>Server Action Response</html>',
      });

      const res = await handlers.POST(req);
      const text = await res.body;

      expect(res.status).to.equal(200);
      expect(text).to.equal('<html>Server Action Response</html>');
      expect(fetchStub.calledOnce).to.be.true;
    });

    it('should allow request when request host is the same as origin host', async () => {
      getEnforcedCorsHeadersStub.returns(null);
      const mockResponseHeaders = new Headers({
        'content-type': 'text/html',
        'Set-Cookie': 'session=abc123',
      });

      req.nextUrl!.host = 'some-url';

      req.headers = new Headers({
        origin: 'https://some-url',
      });

      fetchStub.resolves({
        status: 200,
        statusText: 'OK',
        headers: mockResponseHeaders,
        data: '<html>Server Action Response</html>',
      });

      const res = await handlers.POST(req);
      const text = await res.body;

      expect(res.status).to.equal(200);
      expect(text).to.equal('<html>Server Action Response</html>');
      expect(fetchStub.calledOnce).to.be.true;
    });

    it('should return 401 for invalid editing secret', async () => {
      req.nextUrl!.searchParams = mockSearchParams({
        [QUERY_PARAM_EDITING_SECRET]: 'wrong-secret',
        mode: 'edit',
        route: '/styleguide',
        sc_itemid: '{11111111-1111-1111-1111-111111111111}',
        sc_lang: 'en',
        sc_site: 'website',
      });

      const res = await handlers.POST(req as NextRequest);

      expect(res.status).to.equal(401);
      const responseBody = JSON.parse(res.body);
      expect(responseBody.html).to.equal(INVALID_SECRET_HTML_MESSAGE);
    });

    it('should return 401 for missing editing secret', async () => {
      req.nextUrl!.searchParams = mockSearchParams({
        mode: 'edit',
        route: '/styleguide',
        sc_itemid: '{11111111-1111-1111-1111-111111111111}',
        sc_lang: 'en',
        sc_site: 'website',
      });

      const res = await handlers.POST(req as NextRequest);

      expect(res.status).to.equal(401);
      const responseBody = JSON.parse(res.body);
      expect(responseBody.html).to.equal(INVALID_SECRET_HTML_MESSAGE);
    });

    it('should proxy POST request with correct headers and cookies', async () => {
      const mockResponseHeaders = new Headers({
        'content-type': 'text/html',
        'Set-Cookie': 'session=abc123',
      });

      fetchStub.resolves({
        status: 200,
        statusText: 'OK',
        headers: mockResponseHeaders,
        data: '<html>Server Action Response</html>',
      });

      const res = await handlers.POST(req);
      const text = await res.body;

      expect(res.status).to.equal(200);
      expect(text).to.equal('<html>Server Action Response</html>');
      expect(fetchStub.calledOnce).to.be.true;

      const fetchCall = fetchStub.getCall(0);
      const fetchHeaders = fetchCall.args[1].headers as Headers;
      expect(fetchHeaders.get('cookie')).to.include('__prerender_bypass=some-value');
    });

    it('should propagate editing preview data via EDITING_PARAMS_HEADER on forwarded POST', async () => {
      fetchStub.resolves({
        status: 200,
        statusText: 'OK',
        data: '<html>Server Action Response</html>',
      });

      await handlers.POST(req);

      expect(fetchStub.calledOnce).to.be.true;
      const fetchHeaders = fetchStub.getCall(0).args[1].headers as Headers;
      const packed = fetchHeaders.get(EDITING_PARAMS_HEADER);
      expect(packed).to.be.a('string');
      const parsed = JSON.parse(packed as string);
      expect(parsed).to.deep.equal({
        itemId: mockQuery.sc_itemid,
        language: mockQuery.sc_lang,
        site: mockQuery.sc_site,
        mode: mockQuery.mode,
        variantId: mockQuery.sc_variant,
        version: mockQuery.sc_version,
        layoutKind: mockQuery.sc_layoutKind,
      });
    });

    it('should proxy POST request with mapped querry string parameters and propagated vercel protection parameters', async () => {
      const protectionParams = {
        [QUERY_PARAM_VERCEL_PROTECTION_BYPASS]: 'bypass-token-123',
        [QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE]: 'true',
      };

      getQueryParamsForPropagationStub.returns(protectionParams);

      fetchStub.resolves({
        status: 200,
        statusText: 'OK',
        data: '<html>Server Action Response</html>',
      });

      const res = await handlers.POST(req);
      const text = await res.body;

      expect(res.status).to.equal(200);
      expect(text).to.equal('<html>Server Action Response</html>');
      expect(fetchStub.calledOnce).to.be.true;

      const fetchCall = fetchStub.getCall(0);

      const targetUrl = new URL(fetchCall.args[0]);
      expect(targetUrl.searchParams.get('itemId')).to.equal(mockQuery.sc_itemid);
      expect(targetUrl.searchParams.get('language')).to.equal(mockQuery.sc_language);
      expect(targetUrl.searchParams.get('site')).to.equal(mockQuery.sc_site);
      expect(targetUrl.searchParams.get('mode')).to.equal(mockQuery.mode);
      expect(targetUrl.searchParams.get('variantId')).to.equal(mockQuery.sc_variant);
      expect(targetUrl.searchParams.get('version')).to.equal(mockQuery.sc_version);
      expect(targetUrl.searchParams.get('layoutKind')).to.equal(mockQuery.sc_layoutKind);
      expect(targetUrl.searchParams.get(QUERY_PARAM_VERCEL_PROTECTION_BYPASS)).to.equal(
        'bypass-token-123'
      );
      expect(targetUrl.searchParams.get(QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE)).to.equal('true');
    });

    it('should filter out x-middleware and content-encoding headers', async () => {
      const mockResponseHeaders = new Headers({
        'content-type': 'text/html',
        'x-middleware-next': '1',
        'x-middleware-rewrite': '/foo',
        'content-encoding': 'gzip',
        'content-length': '1234',
        'Set-Cookie': 'foo=bar',
      });

      fetchStub.resolves({
        status: 200,
        statusText: 'OK',
        headers: mockResponseHeaders,
        text: sinon.stub().resolves('<html>Response</html>'),
      });

      const res = await handlers.POST(req);
      expect(res.headers.get('x-middleware-next')).to.be.null;
      expect(res.headers.get('x-middleware-rewrite')).to.be.null;
      expect(res.headers.get('content-encoding')).to.be.null;
      expect(res.headers.get('content-length')).to.be.null;
      expect(res.headers.get('content-type')).to.equal('text/html; charset=utf-8');
    });

    it('should add Content-Security-Policy and CORS headers to response', async () => {
      fetchStub.resolves({
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'text/html' }),
        text: sinon.stub().resolves('<html>Response</html>'),
      });

      const res = await handlers.POST(req);

      expect(res.headers.get('Content-Security-Policy')).to.not.be.null;
      expect(res.headers.get('Access-Control-Allow-Origin')).to.equal('https://allowed.com');
    });

    it('should clean up Next.js preview cookies from Set-Cookie header', async () => {
      const mockResponseHeaders = new Headers({
        'Set-Cookie': '__prerender_bypass=token; __next_preview_data=data; session=abc',
      });

      fetchStub.resolves({
        status: 200,
        statusText: 'OK',
        headers: mockResponseHeaders,
        text: sinon.stub().resolves('<html>Response</html>'),
      });

      const res = await handlers.POST(req);

      const setCookie = res.headers.get('Set-Cookie');
      expect(setCookie).to.not.include('__prerender_bypass');
      expect(setCookie).to.not.include('__next_preview_data');
    });

    describe('allowedQueryParams for POST', () => {
      it('should include allowed query params in propagated query params (objects and strings)', async () => {
        const handlers = editingRenderRouteHandlerModule.createEditingRenderRouteHandlers({
          allowedQueryParams: [{ name: 'customParam1' }, { name: 'customParam2' }, 'stringParam'],
        });

        req.nextUrl!.searchParams = mockSearchParams({
          ...mockQuery,
          customParam1: 'value1',
          customParam2: 'value2',
          stringParam: 'string-value',
          notAllowed: 'shouldNotBeIncluded',
        });

        getAllowedQueryParamsStub.returns({
          missingAllowedParams: [],
          allowedQueryParams: {
            customParam1: 'value1',
            customParam2: 'value2',
            stringParam: 'string-value',
          },
        });

        fetchStub.resolves({
          status: 200,
          statusText: 'OK',
          headers: new Headers({ 'content-type': 'text/html' }),
          data: '<html>Response</html>',
        });

        await handlers.POST(req);

        expect(getAllowedQueryParamsStub).to.have.been.called;
        expect(fetchStub).to.have.been.calledOnce;
        const targetUrl = fetchStub.firstCall.args[0];
        expect(targetUrl).to.include('customParam1=value1');
        expect(targetUrl).to.include('customParam2=value2');
        expect(targetUrl).to.include('stringParam=string-value');
      });

      it('should use resolver function returning strings and objects for POST handler', async () => {
        const resolver = (queryParamKeys: string[]) => {
          const result: Array<string | { name: string; required?: boolean }> = [];
          queryParamKeys
            .filter((key) => key.startsWith('prefixed'))
            .forEach((key) => result.push(key));
          if (queryParamKeys.includes('requiredParam')) {
            result.push({ name: 'requiredParam', required: true });
          }
          return result;
        };

        const handlers = editingRenderRouteHandlerModule.createEditingRenderRouteHandlers({
          allowedQueryParams: resolver,
        });

        req.nextUrl!.searchParams = mockSearchParams({
          ...mockQuery,
          prefixedParam1: 'value1',
          prefixedParam2: 'value2',
          requiredParam: 'required-value',
          otherParam: 'shouldNotBeIncluded',
        });

        getAllowedQueryParamsStub.returns({
          missingAllowedParams: [],
          allowedQueryParams: {
            prefixedParam1: 'value1',
            prefixedParam2: 'value2',
            requiredParam: 'required-value',
          },
        });

        fetchStub.resolves({
          status: 200,
          statusText: 'OK',
          headers: new Headers({ 'content-type': 'text/html' }),
          data: '<html>Response</html>',
        });

        await handlers.POST(req);

        expect(getAllowedQueryParamsStub).to.have.been.calledWith(
          sinon.match.any,
          sinon.match.func
        );
      });

      it('should handle empty allowedQueryParams from resolver in POST', async () => {
        const resolver = () => [];

        const handlers = editingRenderRouteHandlerModule.createEditingRenderRouteHandlers({
          allowedQueryParams: resolver,
        });

        req.nextUrl!.searchParams = mockSearchParams({
          ...mockQuery,
          customParam: 'value',
        });

        getAllowedQueryParamsStub.returns({
          missingAllowedParams: [],
          allowedQueryParams: {},
        });

        fetchStub.resolves({
          status: 200,
          statusText: 'OK',
          headers: new Headers({ 'content-type': 'text/html' }),
          data: '<html>Response</html>',
        });

        const res = await handlers.POST(req);

        expect(res.status).to.equal(200);
        expect(getAllowedQueryParamsStub).to.have.been.called;
      });
    });
  });

  describe('Design Library handling', () => {
    const designLibraryQuery = {
      [QUERY_PARAM_EDITING_SECRET]: secret,
      mode: DesignLibraryMode.Normal,
      sc_itemid: '{11111111-1111-1111-1111-111111111111}',
      sc_lang: 'en',
      sc_site: 'website',
      sc_variant: 'dev',
      sc_version: 'latest',
      sc_renderingId: '123',
      dataSourceId: '456',
      sc_uid: '789',
    };

    beforeEach(() => {
      getRequiredQueryParamsStub.returns(['sc_itemid', 'sc_lang', 'route', 'mode']);
    });

    it('should handle request with mode=library', async () => {
      const mockLibraryHtml =
        '<html><head><title>Design Library</title></head><body><div class="component-library">Library Content</div></body></html>';
      getEditingRequestHtmlStub.resolves(mockLibraryHtml);

      req.nextUrl!.searchParams = mockSearchParams({
        ...designLibraryQuery,
        route: '/components',
      });

      const res = await handlers.GET(req as NextRequest);

      expect(res.status).to.equal(200);
      expect(res.body).to.equal(mockLibraryHtml);
      expect(res.headers['Content-Type']).to.equal('text/html; charset=utf-8');
      expect(draftModeStub.enable).to.have.been.calledOnce;
      expect(draftModeStub.disable).to.have.been.calledOnce;

      // Verify library-specific content
      expect(res.body).to.include('Design Library');
      expect(res.body).to.include('component-library');
      expect(res.body).to.include('Library Content');
    });

    it('should handle request with mode=library-metadata', async () => {
      const mockMetadataHtml =
        '<html><head><title>Component Metadata</title></head><body><div class="metadata-view"><script type="application/json">{"componentId":"123","metadata":{}}</script></div></body></html>';
      getEditingRequestHtmlStub.resolves(mockMetadataHtml);

      req.nextUrl!.searchParams = mockSearchParams({
        ...designLibraryQuery,
        mode: DesignLibraryMode.Metadata,
        route: '/components',
      });

      const res = await handlers.GET(req as NextRequest);

      expect(res.status).to.equal(200);
      expect(res.body).to.equal(mockMetadataHtml);
      expect(res.headers['Content-Type']).to.equal('text/html; charset=utf-8');
      expect(draftModeStub.enable).to.have.been.calledOnce;
      expect(draftModeStub.disable).to.have.been.calledOnce;

      // Verify metadata-specific content
      expect(res.body).to.include('Component Metadata');
      expect(res.body).to.include('metadata-view');
      expect(res.body).to.include('application/json');
      expect(res.body).to.include('componentId');
    });

    it('should handle draft component request without sc_renderingId', async () => {
      getRequiredQueryParamsStub.returns(['sc_site', 'sc_itemid', 'sc_uid', 'sc_lang', 'mode']);

      // eslint-disable-next-line no-unused-vars
      const { sc_renderingId: _renderingId, ...draftLibraryQueryRest } = designLibraryQuery;

      req.nextUrl!.searchParams = mockSearchParams({
        ...draftLibraryQueryRest,
        route: '/components',
      });

      const res = await handlers.GET(req as NextRequest);

      expect(res.status).to.equal(200);
      expect(res.body).to.equal('<div>some html</div>');
    });

    it('should not include previewTime in editing params for design library requests', async () => {
      req.nextUrl!.searchParams = mockSearchParams({
        ...designLibraryQuery,
        route: '/components',
        sc_previewTime: '2024-12-25T10:00:00Z',
      });

      await handlers.GET(req as NextRequest);

      expect(getEditingRequestHtmlStub).to.have.been.calledOnce;

      // previewTime is not supported for Design Library (Design Studio) — only for Sitecore Pages
      const [, , propagatedHeaders] = getEditingRequestHtmlStub.firstCall.args;
      const editingParams = JSON.parse(propagatedHeaders[EDITING_PARAMS_HEADER]);
      expect(editingParams).to.not.have.property('previewTime');
    });
  });

  describe('Sitecore Preview handling', () => {
    const previewQuery = {
      [QUERY_PARAM_EDITING_SECRET]: secret,
      mode: 'preview',
      route: '/styleguide',
      sc_itemid: '{11111111-1111-1111-1111-111111111111}',
      sc_lang: 'en',
      sc_site: 'website',
      sc_variant: 'dev',
      sc_version: 'latest',
      sc_layoutKind: 'final',
    };

    it('should handle preview request', async () => {
      const mockPreviewHtml =
        '<html><head><title>Preview Mode</title><meta name="preview" content="true"></head><body><div class="preview-content">Preview page content</div></body></html>';
      getEditingRequestHtmlStub.resolves(mockPreviewHtml);

      req.nextUrl!.searchParams = mockSearchParams(previewQuery);

      // Mock that preview cookies are initially set but then filtered out
      cleanupNextPreviewCookiesStub.returns([]);

      const res = await handlers.GET(req as NextRequest);

      // Check that the request was handled successfully
      expect(res.status).to.equal(200);
      expect(res.body).to.equal(mockPreviewHtml);
      expect(res.headers['Content-Type']).to.equal('text/html; charset=utf-8');
      expect(draftModeStub.enable).to.have.been.calledOnce;
      expect(draftModeStub.disable).to.have.been.calledOnce;

      // Check that cookieStore operations were called
      expect(cookiesStub.set).to.have.been.called;
      expect(cleanupNextPreviewCookiesStub).to.have.been.calledOnce;
      // Preview cookies are filtered out before response
      expect(res.headers['Set-Cookie']).to.equal('');

      // Verify preview-specific content
      expect(res.body).to.include('Preview Mode');
      expect(res.body).to.include('name="preview"');
      expect(res.body).to.include('preview-content');
      expect(res.body).to.include('Preview page content');
    });
  });

  describe('internal server request host resolution', () => {
    it('should use host header for making internal request by default', async () => {
      req.headers = new Headers({
        origin: allowedOrigin,
        host: 'some-other-host:8080',
      });

      resolveServerUrlStub.returns('http://some-other-host:8080');

      await handlers.GET(req as NextRequest);

      expect(resolveServerUrlStub).to.have.been.calledWith(req);
      expect(getEditingRequestHtmlStub).to.have.been.calledOnce;
      const requestUrlArg = getEditingRequestHtmlStub.firstCall.args[0];
      expect(requestUrlArg.origin).to.equal('http://some-other-host:8080');
    });

    it('should use custom sitecoreInternalEditingHostUrl if provided', async () => {
      const customHost = 'http://custom-internal-host:9000';
      const handlers = editingRenderRouteHandlerModule.createEditingRenderRouteHandlers({
        sitecoreInternalEditingHostUrl: customHost,
      });

      resolveServerUrlStub.returns(customHost);

      await handlers.GET(req as NextRequest);

      expect(getEditingRequestHtmlStub).to.have.been.calledOnce;
      const requestUrlArg = getEditingRequestHtmlStub.firstCall.args[0];
      expect(requestUrlArg.origin).to.equal(customHost);
    });
  });

  describe('multiple variant handling', () => {
    it('should handle multiple variant ids', async () => {
      req.nextUrl!.searchParams = mockSearchParams({
        [QUERY_PARAM_EDITING_SECRET]: secret,
        mode: 'edit',
        route: '/styleguide',
        sc_itemid: '{11111111-1111-1111-1111-111111111111}',
        sc_lang: 'en',
        sc_site: 'website',
        sc_variant: 'id-1,id-2,id-3',
      });

      const res = await handlers.GET(req as NextRequest);

      expect(res.status).to.equal(200);
      expect(draftModeStub.enable).to.have.been.calledOnce;
      expect(draftModeStub.disable).to.have.been.calledOnce;
    });
  });

  describe('CORS handling', () => {
    it('should set correct CORS headers', async () => {
      const res = await handlers.GET(req as NextRequest);

      expect(res.headers).to.deep.include(corsHeaders);
    });

    it('should handle multiple allowed origins', async () => {
      process.env.JSS_ALLOWED_ORIGINS = 'https://allowed.com,https://anotherallowed.com';
      getCSPHeaderStub.returns(
        `frame-ancestors 'self' https://allowed.com https://anotherallowed.com ${EDITING_ALLOWED_ORIGINS.join(
          ' '
        )}`
      );

      const res = await handlers.GET(req as NextRequest);

      expect(getCSPHeaderStub).to.have.been.calledOnce;
      expect(res.headers['Content-Security-Policy']).to.include('https://anotherallowed.com');
    });
  });
});
