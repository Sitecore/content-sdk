/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable dot-notation */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, use } from 'chai';
import { NextApiResponse } from 'next';
import { STATIC_PROPS_ID, SERVER_PROPS_ID } from 'next/constants';
import {
  EDITING_ALLOWED_ORIGINS,
  QUERY_PARAM_EDITING_SECRET,
  EditingRenderQueryParams,
  DesignLibraryMode,
} from '@sitecore-content-sdk/core/editing';
import { EditingRenderMiddleware, EditingNextApiRequest } from './editing-render-middleware';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import {
  QUERY_PARAM_VERCEL_PROTECTION_BYPASS,
  QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE,
} from './constants';

use(sinonChai);

const mockNextJsPreviewCookies = [
  '__prerender_bypass=1122334455; Path=/; SameSite=Lax',
  '__next_preview_data=6677889900; Path=/; SameSite=Lax',
];

type Query = {
  [key: string]: string;
};

const allowedOrigin = 'https://allowed.com';

const mockRequest = ({
  query,
  method,
  headers,
}: {
  query?: Query | EditingRenderQueryParams;
  method?: string;
  headers?: { [key: string]: string };
}) => {
  return {
    method: method ?? 'GET',
    query: query ?? {},
    headers: {
      host: 'localhost:3000',
      origin: allowedOrigin,
      ...headers,
    },
  } as EditingNextApiRequest;
};

const mockResponse = () => {
  const res = {} as NextApiResponse;
  res.status = spy(() => {
    return res;
  });
  res.send = spy(() => {
    return res;
  });
  res.json = spy(() => {
    return res;
  });
  res.end = spy(() => {
    return res;
  });
  res.getHeader = spy((name: string) => {
    return name === 'Set-Cookie' ? mockNextJsPreviewCookies : undefined;
  });
  res.setHeader = spy();
  res.setPreviewData = spy(() => {
    return res;
  });
  return res;
};

describe('EditingRenderMiddleware', () => {
  const secret = 'secret1234';

  beforeEach(() => {
    process.env.SITECORE_EDITING_SECRET = secret;
    process.env.JSS_ALLOWED_ORIGINS = allowedOrigin;
    delete process.env.VERCEL;
  });

  after(() => {
    delete process.env.SITECORE_EDITING_SECRET;
    delete process.env.VERCEL;
    delete process.env.JSS_ALLOWED_ORIGINS;
  });

  it('should respond with 405 for unsupported method', async () => {
    const query = {} as Query;
    query[QUERY_PARAM_EDITING_SECRET] = secret;
    const req = mockRequest({
      query,
      method: 'PUT',
    });
    const res = mockResponse();

    const middleware = new EditingRenderMiddleware();
    const handler = middleware.getHandler();

    await handler(req, res);

    expect(res.setHeader).to.have.been.calledWithExactly('Allow', 'GET');
    expect(res.status).to.have.been.calledOnce;
    expect(res.status).to.have.been.calledWith(405);
    expect(res.json).to.have.been.calledOnce;
  });

  it('should respond with 204 for OPTIONS method', async () => {
    const query = {} as Query;
    query[QUERY_PARAM_EDITING_SECRET] = secret;
    const req = mockRequest({
      query,
      method: 'OPTIONS',
    });
    const res = mockResponse();

    const middleware = new EditingRenderMiddleware();
    const handler = middleware.getHandler();

    await handler(req, res);

    const setHeaders = res.setHeader.getCalls().map((call) => call.args);

    expect(res.status).to.have.been.calledOnceWith(204);
    expect(setHeaders).to.deep.include(['Access-Control-Allow-Origin', allowedOrigin]);
    expect(setHeaders).to.deep.include([
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, DELETE, PUT, PATCH',
    ]);
    expect(setHeaders).to.deep.include([
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    ]);
    expect(res.send).to.have.been.calledOnceWith(null);
  });

  it('should respond with 401 for invalid secret', async () => {
    const query = {} as Query;
    query[QUERY_PARAM_EDITING_SECRET] = 'nope';
    const req = mockRequest({
      query,
    });
    const res = mockResponse();

    const middleware = new EditingRenderMiddleware();
    const handler = middleware.getHandler();

    await handler(req, res);

    expect(res.status).to.have.been.calledOnce;
    expect(res.status).to.have.been.calledWith(401);
    expect(res.json).to.have.been.calledOnce;
  });

  it('should stop request and return 401 when CORS match is not met', async () => {
    const req = mockRequest({
      headers: { origin: 'https://notallowed.com' },
    });
    const res = mockResponse();
    const middleware = new EditingRenderMiddleware();
    const handler = middleware.getHandler();

    await handler(req, res);

    expect(res.status).to.have.been.calledOnce;
    expect(res.status).to.have.been.calledWith(401);
    expect(res.json).to.have.been.calledOnce;
    expect(res.json).to.have.been.calledWith({
      html: '<html><body>Requests from origin https://notallowed.com not allowed</body></html>',
    });
  });

  it('should respond with 401 for missing secret', async () => {
    const query = {} as Query;
    const req = mockRequest({ query });
    const res = mockResponse();

    const middleware = new EditingRenderMiddleware();
    const handler = middleware.getHandler();

    await handler(req, res);

    expect(res.status).to.have.been.calledOnce;
    expect(res.status).to.have.been.calledWith(401);
    expect(res.json).to.have.been.calledOnce;
  });

  const query = {
    mode: 'edit',
    route: '/styleguide',
    sc_itemid: '{11111111-1111-1111-1111-111111111111}',
    sc_lang: 'en',
    sc_site: 'website',
    sc_variant: 'dev',
    sc_version: 'latest',
    secret: secret,
    sc_layoutKind: 'shared',
  } as EditingRenderQueryParams;

  it('should handle request', async () => {
    const req = mockRequest({ query });
    const res = mockResponse();

    const middleware = new EditingRenderMiddleware();
    const handler = middleware.getHandler();

    sinon
      .stub(middleware['dataFetcher'], 'get')
      .resolves({ status: 200, statusText: 'success', data: '<div>some html</div>' });

    await handler(req, res);

    expect(res.setPreviewData, 'set preview mode w/ data').to.have.been.calledWith({
      site: 'website',
      itemId: '{11111111-1111-1111-1111-111111111111}',
      language: 'en',
      variantIds: ['dev'],
      version: 'latest',
      mode: 'edit',
      layoutKind: 'shared',
    });

    expect(res.send).to.have.been.calledOnce;
    expect(res.send).to.have.been.calledWith('<div>some html</div>');
    expect(res.setHeader).to.have.been.calledWith(
      'Content-Security-Policy',
      `frame-ancestors 'self' https://allowed.com ${EDITING_ALLOWED_ORIGINS.join(' ')}`
    );
  });

  it('should pass multiple variant ids into setPreviewData when sc_variantId parameter has many values', async () => {
    const query = {
      mode: 'edit',
      route: '/styleguide',
      sc_itemid: '{11111111-1111-1111-1111-111111111111}',
      sc_lang: 'en',
      sc_site: 'website',
      secret: secret,
      sc_variant: 'id-1,id-2,id-3',
    } as EditingRenderQueryParams;

    const req = mockRequest({ query });
    const res = mockResponse();

    const middleware = new EditingRenderMiddleware();
    const handler = middleware.getHandler();

    sinon
      .stub(middleware['dataFetcher'], 'get')
      .resolves({ status: 200, statusText: 'success', data: '<div>some html</div>' });

    await handler(req, res);

    expect(res.setPreviewData, 'set preview mode w/ data').to.have.been.calledWith({
      site: 'website',
      itemId: '{11111111-1111-1111-1111-111111111111}',
      language: 'en',
      variantIds: ['id-1', 'id-2', 'id-3'],
      version: undefined,
      mode: 'edit',
      layoutKind: undefined,
    });
  });

  it('should handle request with missing optional parameters', async () => {
    const queryWithoutOptionalParams = {
      mode: 'edit',
      route: '/styleguide',
      sc_itemid: '{11111111-1111-1111-1111-111111111111}',
      sc_lang: 'en',
      sc_site: 'website',
      secret: secret,
    } as EditingRenderQueryParams;
    const req = mockRequest({ query: queryWithoutOptionalParams });
    const res = mockResponse();

    const middleware = new EditingRenderMiddleware();
    const handler = middleware.getHandler();

    sinon
      .stub(middleware['dataFetcher'], 'get')
      .resolves({ status: 200, statusText: 'success', data: '<div>some html</div>' });

    await handler(req, res);

    expect(res.setPreviewData, 'set preview mode w/ data').to.have.been.calledWith({
      site: 'website',
      itemId: '{11111111-1111-1111-1111-111111111111}',
      language: 'en',
      variantIds: ['_default'],
      version: undefined,
      mode: 'edit',
      layoutKind: undefined,
    });

    expect(res.status).to.be.calledOnceWith(200);
    expect(res.send).to.have.been.calledOnce;
    expect(res.send).to.have.been.calledWith('<div>some html</div>');
    expect(res.setHeader).to.have.been.calledWith(
      'Content-Security-Policy',
      `frame-ancestors 'self' https://allowed.com ${EDITING_ALLOWED_ORIGINS.join(' ')}`
    );
  });

  it('should use custom resolvePageUrl', async () => {
    const req = mockRequest({ query });
    const res = mockResponse();

    const middleware = new EditingRenderMiddleware({
      resolvePageUrl: (itemPath) => {
        return `/custom/path${itemPath}`;
      },
    });

    const handler = middleware.getHandler();

    sinon
      .stub(middleware['dataFetcher'], 'get')
      .resolves({ status: 200, statusText: 'success', data: '<div>some html</div>' });

    await handler(req, res);

    expect(res.setPreviewData, 'set preview mode w/ data').to.have.been.calledWith({
      site: 'website',
      itemId: '{11111111-1111-1111-1111-111111111111}',
      language: 'en',
      variantIds: ['dev'],
      version: 'latest',
      mode: 'edit',
      layoutKind: 'shared',
    });

    expect(res.status).to.be.calledOnceWith(200);
    expect(res.send).to.have.been.calledOnce;
    expect(res.send).to.have.been.calledWith('<div>some html</div>');
  });

  it('should handle request with special characters in route', async () => {
    const query = {
      mode: 'edit',
      route: '/Åbout',
      sc_itemid: '{11111111-1111-1111-1111-111111111111}',
      sc_lang: 'en',
      sc_site: 'website',
      sc_variant: 'dev',
      sc_version: 'latest',
      secret: secret,
      sc_layoutKind: 'shared',
    } as EditingRenderQueryParams;

    const req = mockRequest({ query });
    const res = mockResponse();

    const middleware = new EditingRenderMiddleware();
    const handler = middleware.getHandler();

    sinon
      .stub(middleware['dataFetcher'], 'get')
      .resolves({ status: 200, statusText: 'success', data: '<div>some html</div>' });

    await handler(req, res);

    expect(res.setPreviewData, 'set preview mode w/ data').to.have.been.calledWith({
      site: 'website',
      itemId: '{11111111-1111-1111-1111-111111111111}',
      language: 'en',
      variantIds: ['dev'],
      version: 'latest',
      mode: 'edit',
      layoutKind: 'shared',
    });

    expect(res.status).to.be.calledOnceWith(200);
    expect(res.send).to.have.been.calledOnceWith('<div>some html</div>');
    expect(res.setHeader).to.have.been.calledWith(
      'Content-Security-Policy',
      `frame-ancestors 'self' https://allowed.com ${EDITING_ALLOWED_ORIGINS.join(' ')}`
    );
  });

  it('should response with 400 for missing query params', async () => {
    const req = mockRequest({ query: { sc_site: 'website', secret } });
    const res = mockResponse();

    const middleware = new EditingRenderMiddleware();
    const handler = middleware.getHandler();

    await handler(req, res);

    expect(res.status).to.have.been.calledOnce;
    expect(res.status).to.have.been.calledWith(400);
    expect(res.json).to.have.been.calledOnce;
    expect(res.json).to.have.been.calledWith({
      html: '<html><body>Missing required query parameters: sc_itemid, sc_lang, route, mode</body></html>',
    });
  });

  it('should set allowed origins when multiple allowed origins are provided in env variable', async () => {
    process.env.JSS_ALLOWED_ORIGINS = 'https://allowed.com,https://anotherallowed.com';
    const req = mockRequest({ query });
    const res = mockResponse();

    const middleware = new EditingRenderMiddleware();
    const handler = middleware.getHandler();

    sinon
      .stub(middleware['dataFetcher'], 'get')
      .resolves({ status: 200, statusText: 'success', data: '<div>some html</div>' });

    await handler(req, res);

    expect(res.setHeader).to.have.been.calledWith(
      'Content-Security-Policy',
      `frame-ancestors 'self' https://allowed.com https://anotherallowed.com ${EDITING_ALLOWED_ORIGINS.join(
        ' '
      )}`
    );
  });

  it('should issue internal request propagating allowed query parameters', async () => {
    const protectedQuery = {} as Query;
    protectedQuery[QUERY_PARAM_VERCEL_PROTECTION_BYPASS] = 'bypass123';
    protectedQuery[QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE] = 'true';
    protectedQuery['someOtherParam'] = 'shouldNotBeIncluded';
    const req = mockRequest({ query: { ...query, ...protectedQuery } });
    const res = mockResponse();

    const middleware = new EditingRenderMiddleware();

    const handler = middleware.getHandler();

    const fetcherGetStub = sinon
      .stub(middleware['dataFetcher'], 'get')
      .resolves({ status: 200, statusText: 'success', data: '<div>some html</div>' });

    await handler(req, res);

    const fetchRequestUrl = fetcherGetStub.getCall(0).args[0];
    expect(fetchRequestUrl.includes(`${QUERY_PARAM_VERCEL_PROTECTION_BYPASS}=bypass123`)).to.be
      .true;
    expect(fetchRequestUrl.includes(`${QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE}=true`)).to.be.true;
    expect(fetchRequestUrl.includes('someOtherParam=shouldNotBeIncluded')).to.be.false;
  });

  it('should issue intrnal request propagating allowed headers', async () => {
    const req = mockRequest({
      query,
      headers: {
        authorization: 'yes',
        cookie: 'sc_another_cookie=12345',
        otherHeader: 'shouldNotBeIncluded',
      },
    });

    const res = mockResponse();

    const middleware = new EditingRenderMiddleware();
    const handler = middleware.getHandler();

    const fetcherGetStub = sinon
      .stub(middleware['dataFetcher'], 'get')
      .resolves({ status: 200, statusText: 'success', data: '<div>some html</div>' });

    await handler(req, res);

    const fetchRequestHeaders = fetcherGetStub.getCall(0).args[1]?.headers;

    expect(fetchRequestHeaders).to.not.be.undefined;
    expect(fetchRequestHeaders).to.have.property(
      'cookie',
      'sc_another_cookie=12345;__prerender_bypass=1122334455; Path=/; SameSite=Lax;__next_preview_data=6677889900; Path=/; SameSite=Lax'
    );
    expect(fetchRequestHeaders).to.have.property('authorization', 'yes');
    expect(fetchRequestHeaders).to.not.have.property('otherHeader');
  });

  it('should return 200 if internal request successful', async () => {
    const req = mockRequest({ query });
    const res = mockResponse();

    const middleware = new EditingRenderMiddleware();
    const handler = middleware.getHandler();

    sinon
      .stub(middleware['dataFetcher'], 'get')
      .resolves({ status: 200, statusText: 'success', data: '<div>some html</div>' });

    await handler(req, res);

    expect(res.status).to.be.calledOnceWith(200);
  });

  it('should remove nextjs preview cookies before responding to browser', async () => {
    const req = mockRequest({ query });
    const res = mockResponse();

    const middleware = new EditingRenderMiddleware();
    const handler = middleware.getHandler();

    sinon
      .stub(middleware['dataFetcher'], 'get')
      .resolves({ status: 200, statusText: 'success', data: '<div>some html</div>' });

    await handler(req, res);

    expect(res.setHeader).to.have.been.calledWith('Set-Cookie', []);
    expect(res.status).to.be.calledOnceWith(200);
  });

  it('should replace static props id in html before responding to browser', async () => {
    const req = mockRequest({ query });
    const res = mockResponse();

    const middleware = new EditingRenderMiddleware();
    const handler = middleware.getHandler();

    sinon.stub(middleware['dataFetcher'], 'get').resolves({
      status: 200,
      statusText: 'success',
      data: `<div>some html ${STATIC_PROPS_ID}</div>`,
    });

    await handler(req, res);

    expect(res.status).to.be.calledOnceWith(200);
    expect(res.send).to.be.calledOnceWith(`<div>some html ${SERVER_PROPS_ID}</div>`);
  });

  it('should respondWith 500 if rendered html empty', async () => {
    const req = mockRequest({ query });
    const res = mockResponse();

    const middleware = new EditingRenderMiddleware();
    const handler = middleware.getHandler();

    sinon
      .stub(middleware['dataFetcher'], 'get')
      .resolves({ status: 200, statusText: 'success', data: '' });

    await handler(req, res);

    expect(res.status).to.have.been.calledOnce;
    expect(res.status).to.have.been.calledWith(500);
    expect(res.send).to.have.been.calledOnce;
  });

  it('should respondWith 500 if internal request fails', async () => {
    const req = mockRequest({ query });
    const res = mockResponse();

    const middleware = new EditingRenderMiddleware();
    const handler = middleware.getHandler();

    sinon.stub(middleware['dataFetcher'], 'get').throws(new Error('Request failed'));

    await handler(req, res);

    expect(res.status).to.have.been.calledOnce;
    expect(res.status).to.have.been.calledWith(500);
    expect(res.send).to.have.been.calledOnce;
  });

  describe('Design Library handling', () => {
    const query = {
      mode: DesignLibraryMode.Normal,
      sc_itemid: '{11111111-1111-1111-1111-111111111111}',
      sc_lang: 'en',
      sc_site: 'website',
      sc_variant: 'dev',
      sc_version: 'latest',
      secret: secret,
      sc_renderingId: '123',
      dataSourceId: '456',
      sc_uid: '789',
    };

    it('should handle request with mode=library', async () => {
      const req = mockRequest({ query });
      const res = mockResponse();

      const middleware = new EditingRenderMiddleware();
      const handler = middleware.getHandler();

      sinon
        .stub(middleware['dataFetcher'], 'get')
        .resolves({ status: 200, statusText: 'success', data: '<div>some html</div>' });

      await handler(req, res);

      expect(res.setPreviewData, 'set preview mode w/ data').to.have.been.calledWithMatch({
        itemId: query.sc_itemid,
        componentUid: query.sc_uid,
        renderingId: query.sc_renderingId,
        language: query.sc_lang,
        site: query.sc_site,
        mode: DesignLibraryMode.Normal,
        dataSourceId: query.dataSourceId,
        version: query.sc_version,
      });

      expect(res.status).to.be.calledOnceWith(200);
      expect(res.send).to.have.been.calledOnceWith('<div>some html</div>');
      expect(res.setHeader).to.have.been.calledWith(
        'Content-Security-Policy',
        `frame-ancestors 'self' https://allowed.com ${EDITING_ALLOWED_ORIGINS.join(' ')}`
      );
    });

    it('should handle request with mode=library-metadata', async () => {
      const req = mockRequest({ query: { ...query, mode: DesignLibraryMode.Metadata } });
      const res = mockResponse();

      const middleware = new EditingRenderMiddleware();
      const handler = middleware.getHandler();

      sinon
        .stub(middleware['dataFetcher'], 'get')
        .resolves({ status: 200, statusText: 'success', data: '<div>some html</div>' });

      await handler(req, res);

      expect(res.setPreviewData, 'set preview mode w/ data').to.have.been.calledWithMatch({
        itemId: query.sc_itemid,
        componentUid: query.sc_uid,
        renderingId: query.sc_renderingId,
        language: query.sc_lang,
        site: query.sc_site,
        mode: DesignLibraryMode.Metadata,
        dataSourceId: query.dataSourceId,
        version: query.sc_version,
      });

      expect(res.status).to.be.calledOnceWith(200);
      expect(res.send).to.have.been.calledOnceWith('<div>some html</div>');
      expect(res.setHeader).to.have.been.calledWith(
        'Content-Security-Policy',
        `frame-ancestors 'self' https://allowed.com ${EDITING_ALLOWED_ORIGINS.join(' ')}`
      );
    });

    it('should response with 400 for missing query params', async () => {
      const req = mockRequest({
        query: { sc_site: 'website', secret },
      });
      const res = mockResponse();

      const middleware = new EditingRenderMiddleware();
      const handler = middleware.getHandler();

      await handler(req, res);

      expect(res.status).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledOnce;
      expect(res.json).to.have.been.calledWith({
        html: '<html><body>Missing required query parameters: sc_itemid, sc_lang, route, mode</body></html>',
      });
    });
  });

  describe('Sitecore Preview handling', () => {
    const query = {
      mode: 'preview',
      route: '/styleguide',
      sc_itemid: '{11111111-1111-1111-1111-111111111111}',
      sc_lang: 'en',
      sc_site: 'website',
      sc_variant: 'dev',
      sc_version: 'latest',
      secret: secret,
      sc_layoutKind: 'final',
    } as EditingRenderQueryParams;

    it('should handle request', async () => {
      const req = mockRequest({ query });
      const res = mockResponse();

      const middleware = new EditingRenderMiddleware();
      const handler = middleware.getHandler();

      sinon
        .stub(middleware['dataFetcher'], 'get')
        .resolves({ status: 200, statusText: 'success', data: '<div>some html</div>' });

      await handler(req, res);

      expect(res.setPreviewData, 'set preview mode w/ data').to.have.been.calledWith({
        site: 'website',
        itemId: '{11111111-1111-1111-1111-111111111111}',
        language: 'en',
        variantIds: ['dev'],
        version: 'latest',
        mode: 'preview',
        layoutKind: 'final',
      });

      expect(res.setHeader).to.have.been.calledWith('Access-Control-Allow-Origin', allowedOrigin);
      expect(res.setHeader).to.have.been.calledWith(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, DELETE, PUT, PATCH'
      );
      expect(res.setHeader).to.have.been.calledWith('Set-Cookie', [
        '__prerender_bypass=1122334455; Path=/; SameSite=Lax',
        '__next_preview_data=6677889900; Path=/; SameSite=Lax',
        'sc_site=website; Path=/; HttpOnly; SameSite=None; Secure',
        'sc_preview=true; Path=/; HttpOnly; SameSite=None; Secure',
      ]);

      expect(res.status).to.be.calledOnceWith(200);
      expect(res.send).to.have.been.calledOnceWith('<div>some html</div>');
      expect(res.setHeader).to.have.been.calledWith(
        'Content-Security-Policy',
        `frame-ancestors 'self' https://allowed.com ${EDITING_ALLOWED_ORIGINS.join(' ')}`
      );
    });
  });

  describe('internal server request host resolution', () => {
    it('should use host header for making the internal request if config setting or env is not provided and we are not in XMC env', async () => {
      const req = mockRequest({ query });
      const reqHost = 'some-other-host';
      req.headers['host'] = reqHost;
      const res = mockResponse();

      const middleware = new EditingRenderMiddleware();

      const handler = middleware.getHandler();

      const fetcherGetStub = sinon
        .stub(middleware['dataFetcher'], 'get')
        .resolves({ status: 200, statusText: 'success', data: '<div>some html</div>' });

      await handler(req, res);

      const fetchRequestUrl = fetcherGetStub.getCall(0).args[0];
      expect(fetchRequestUrl.includes(reqHost)).to.be.true;
    });

    it('should use http://localhost:3000 for making the internal request if config setting or env is not provided and we are in XMC', async () => {
      process.env.SITECORE = 'yes';
      const req = mockRequest({ query });
      const expectedHost = 'http://localhost:3000';
      const reqHost = 'some-other-host';
      req.headers['host'] = reqHost;
      const res = mockResponse();

      const middleware = new EditingRenderMiddleware();

      const handler = middleware.getHandler();

      const fetcherGetStub = sinon
        .stub(middleware['dataFetcher'], 'get')
        .resolves({ status: 200, statusText: 'success', data: '<div>some html</div>' });

      await handler(req, res);

      const fetchRequestUrl = fetcherGetStub.getCall(0).args[0];
      expect(fetchRequestUrl.includes(expectedHost)).to.be.true;
      delete process.env.SITECORE;
    });

    it('should use internal editing url from env variable if provided', async () => {
      const reqHostEnv = 'http://custom-internal-host-env';
      process.env.SITECORE_INTERNAL_EDITING_HOST_URL = reqHostEnv;

      const req = mockRequest({ query });
      const res = mockResponse();

      const middleware = new EditingRenderMiddleware();

      const handler = middleware.getHandler();

      const fetcherGetStub = sinon
        .stub(middleware['dataFetcher'], 'get')
        .resolves({ status: 200, statusText: 'success', data: '<div>some html</div>' });

      await handler(req, res);

      const fetchRequestUrl = fetcherGetStub.getCall(0).args[0];
      expect(fetchRequestUrl.includes(reqHostEnv)).to.be.true;
      delete process.env.SITECORE_INTERNAL_EDITING_HOST_URL;
    });

    it('should use internal editing url from config if provided', async () => {
      const reqHostConfig = 'http://custom-internal-host-config';
      const reqHostEnv = 'http://custom-internal-host-env';
      process.env.SITECORE_INTERNAL_EDITING_HOST_URL = reqHostEnv;

      const req = mockRequest({ query });
      const res = mockResponse();

      const middleware = new EditingRenderMiddleware({
        sitecoreInternalEditingHostUrl: reqHostConfig,
      });

      const handler = middleware.getHandler();

      const fetcherGetStub = sinon
        .stub(middleware['dataFetcher'], 'get')
        .resolves({ status: 200, statusText: 'success', data: '<div>some html</div>' });

      await handler(req, res);

      const fetchRequestUrl = fetcherGetStub.getCall(0).args[0];
      expect(fetchRequestUrl.includes(reqHostConfig)).to.be.true;
      delete process.env.SITECORE_INTERNAL_EDITING_HOST_URL;
    });
  });
});
