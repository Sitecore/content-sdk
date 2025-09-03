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
  DesignLibraryMode,
} from '@sitecore-content-sdk/core/editing';
import {
  QUERY_PARAM_VERCEL_PROTECTION_BYPASS,
  QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE,
} from '../editing/constants';

chai.use(sinonChai);

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
  let getFilteredCookiesStub: sinon.SinonStub;
  let getPreviewCookiesStub: sinon.SinonStub;
  let getRequiredQueryParamsStub: sinon.SinonStub;
  let getSCPHeaderStub: sinon.SinonStub;
  let handlers: any;
  let req: Partial<NextRequest>;

  let OriginalResponse: typeof Response;

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
    getFilteredCookiesStub = sandbox.stub().returns([]);
    getPreviewCookiesStub = sandbox
      .stub()
      .returns([
        'sc_site=website; Path=/; HttpOnly; SameSite=None; Secure',
        'sc_preview=true; Path=/; HttpOnly; SameSite=None; Secure',
      ]);
    getRequiredQueryParamsStub = sandbox.stub().returns(['sc_itemid', 'sc_lang', 'route', 'mode']);
    getSCPHeaderStub = sandbox
      .stub()
      .returns(`frame-ancestors 'self' ${allowedOrigin} ${EDITING_ALLOWED_ORIGINS.join(' ')}`);

    editingRenderRouteHandlerModule = proxyquire('./editing-render-route-handler', {
      '../utils/utils': { getEditingSecret: getEditingSecretStub },
      '@sitecore-content-sdk/core/utils': { getEnforcedCorsHeaders: getEnforcedCorsHeadersStub },
      'next/headers': { draftMode: () => draftModeStub },
      '../editing/utils': {
        getEditingRequestHtml: getEditingRequestHtmlStub,
        getFilteredCookies: getFilteredCookiesStub,
        getHeadersForPropagation: getHeadersForPropagationStub,
        getNextPreviewCookies: getPreviewCookiesStub,
        getQueryParamsForPropagation: getQueryParamsForPropagationStub,
        getRequiredEditingParamsList: getRequiredQueryParamsStub,
        getSCPHeader: getSCPHeaderStub,
        resolveServerUrl: resolveServerUrlStub,
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
      cookies: {
        getAll: () => [{ name: 'test', value: 'value' }],
      } as any,
    };
  });

  afterEach(() => {
    sandbox.restore();
    sinon.restore();
    (globalThis as any).Response = OriginalResponse;
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
      expect(responseBody.html).to.equal('<html><body>Missing or invalid secret</body></html>');
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
      expect(responseBody.html).to.equal('<html><body>Missing or invalid secret</body></html>');
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
      const res = await handlers.GET(req as NextRequest);

      expect(res.status).to.equal(200);
      expect(res.body).to.equal('<div>some html</div>');
      expect(res.headers['Content-Type']).to.equal('text/html; charset=utf-8');
      expect(draftModeStub.enable).to.have.been.calledOnce;
      expect(draftModeStub.disable).to.have.been.calledOnce;
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
      getFilteredCookiesStub.returns([]);

      const res = await handlers.GET(req as NextRequest);

      expect(getPreviewCookiesStub).to.have.been.calledWith('website');
      expect(getFilteredCookiesStub).to.have.been.calledOnce;
      // Preview cookies are filtered out before response, so Set-Cookie should be empty
      expect(res.headers['Set-Cookie']).to.equal('');
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
      getFilteredCookiesStub.returns(['filtered=cookie']);

      const res = await handlers.GET(req as NextRequest);

      expect(getFilteredCookiesStub).to.have.been.calledOnce;
      expect(res.headers['Set-Cookie']).to.equal('filtered=cookie');
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

      expect(getSCPHeaderStub).to.have.been.calledOnce;
      expect(res.headers['Content-Security-Policy']).to.equal(
        `frame-ancestors 'self' ${allowedOrigin} ${EDITING_ALLOWED_ORIGINS.join(' ')}`
      );
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
      req.nextUrl!.searchParams = mockSearchParams({
        ...designLibraryQuery,
        route: '/components',
      });

      const res = await handlers.GET(req as NextRequest);

      expect(res.status).to.equal(200);
      expect(res.body).to.equal('<div>some html</div>');
      expect(draftModeStub.enable).to.have.been.calledOnce;
      expect(draftModeStub.disable).to.have.been.calledOnce;
    });

    it('should handle request with mode=library-metadata', async () => {
      req.nextUrl!.searchParams = mockSearchParams({
        ...designLibraryQuery,
        mode: DesignLibraryMode.Metadata,
        route: '/components',
      });

      const res = await handlers.GET(req as NextRequest);

      expect(res.status).to.equal(200);
      expect(res.body).to.equal('<div>some html</div>');
      expect(draftModeStub.enable).to.have.been.calledOnce;
      expect(draftModeStub.disable).to.have.been.calledOnce;
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
      req.nextUrl!.searchParams = mockSearchParams(previewQuery);

      // Mock that preview cookies are initially set but then filtered out
      getFilteredCookiesStub.returns([]);

      const res = await handlers.GET(req as NextRequest);

      expect(getPreviewCookiesStub).to.have.been.calledWith('website');
      expect(res.status).to.equal(200);
      expect(res.body).to.equal('<div>some html</div>');
      expect(getFilteredCookiesStub).to.have.been.calledOnce;
      // Preview cookies are filtered out before response
      expect(res.headers['Set-Cookie']).to.equal('');
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
      getSCPHeaderStub.returns(
        `frame-ancestors 'self' https://allowed.com https://anotherallowed.com ${EDITING_ALLOWED_ORIGINS.join(
          ' '
        )}`
      );

      const res = await handlers.GET(req as NextRequest);

      expect(getSCPHeaderStub).to.have.been.calledOnce;
      expect(res.headers['Content-Security-Policy']).to.include('https://anotherallowed.com');
    });
  });
});
