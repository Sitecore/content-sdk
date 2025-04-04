﻿/* eslint-disable quotes */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, use } from 'chai';
import { NextApiRequest, NextApiResponse } from 'next';
import { QUERY_PARAM_EDITING_SECRET } from '@sitecore-content-sdk/core/editing';
import {
  QUERY_PARAM_VERCEL_PROTECTION_BYPASS,
  QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE,
} from './constants';
import { FEAASRenderMiddleware } from './feaas-render-middleware';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';

use(sinonChai);

type Query = {
  [key: string]: string;
};

const allowedOrigin = 'https://allowed.com';

const mockRequest = (query?: Query, method?: string, headers?: { [key: string]: string }) => {
  return {
    body: {},
    method: method ?? 'GET',
    query: query ?? {},
    headers: {
      host: 'localhost:3000',
      origin: allowedOrigin,
      ...headers,
    },
  } as NextApiRequest;
};

const mockResponse = () => {
  const res = {} as NextApiResponse;
  res.status = spy(() => {
    return res;
  });
  res.send = spy(() => {
    return res;
  });
  res.setPreviewData = spy(() => {
    return res;
  });
  res.setHeader = spy(() => {
    return res;
  });
  res.redirect = spy(() => {
    return res;
  });
  res.getHeader = spy(() => {
    return undefined;
  });

  return res;
};

describe('FEAASRenderMiddleware', () => {
  const secret = 'secret1234';

  beforeEach(() => {
    process.env.JSS_EDITING_SECRET = secret;
    process.env.JSS_ALLOWED_ORIGINS = allowedOrigin;
  });

  after(() => {
    delete process.env.JSS_EDITING_SECRET;
    delete process.env.JSS_ALLOWED_ORIGINS;
  });

  it('should handle request', async () => {
    const query = {} as Query;
    query[QUERY_PARAM_EDITING_SECRET] = secret;

    const req = mockRequest(query);
    const res = mockResponse();

    const middleware = new FEAASRenderMiddleware();
    const handler = middleware.getHandler();

    await handler(req, res);

    expect(res.setPreviewData, 'set preview mode w/ data').to.have.been.calledWith({});
    expect(res.redirect).to.have.been.calledOnce;
    expect(res.redirect).to.have.been.calledWith('/feaas/render');
  });

  it('should handle request when feaasSrc query parameter is present', async () => {
    const query = {
      feaasSrc: 'https://feaas.blob.core.windows.net/components/xxx/xyz/responsive/staged',
    } as Query;
    query[QUERY_PARAM_EDITING_SECRET] = secret;

    const req = mockRequest(query);
    const res = mockResponse();

    const middleware = new FEAASRenderMiddleware();
    const handler = middleware.getHandler();

    await handler(req, res);

    expect(res.setPreviewData, 'set preview mode w/ data').to.have.been.calledWith({});
    expect(res.redirect).to.have.been.calledOnce;
    expect(res.redirect).to.have.been.calledWith(
      '/feaas/render?feaasSrc=https%3A%2F%2Ffeaas.blob.core.windows.net%2Fcomponents%2Fxxx%2Fxyz%2Fresponsive%2Fstaged'
    );
  });

  it('should respond with 204 for preflight OPTIONS request', async () => {
    const query = {} as Query;
    query[QUERY_PARAM_EDITING_SECRET] = secret;

    const req = mockRequest(query, 'OPTIONS');
    const res = mockResponse();

    const middleware = new FEAASRenderMiddleware();
    const handler = middleware.getHandler();

    await handler(req, res);

    expect(res.setHeader.getCall(0).args).to.deep.equal([
      'Access-Control-Allow-Origin',
      allowedOrigin,
    ]);
    expect(res.setHeader.getCall(1).args).to.deep.equal([
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, DELETE, PUT, PATCH',
    ]);
    expect(res.setHeader.getCall(2).args).to.deep.equal([
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    ]);
    expect(res.status).to.have.been.calledOnceWith(204);
    expect(res.send).to.have.been.calledOnceWith(null);
  });

  it('should throw error', async () => {
    const query = {} as Query;
    query[QUERY_PARAM_EDITING_SECRET] = secret;

    const req = mockRequest(query);
    const res = mockResponse();

    res.setPreviewData = spy(() => {
      throw new Error('Test Error');
    });

    const middleware = new FEAASRenderMiddleware();
    const handler = middleware.getHandler();

    await handler(req, res);

    expect(res.setPreviewData, 'set preview mode w/ data').to.have.been.calledWith({});
    expect(res.status).to.have.been.calledOnce;
    expect(res.status).to.have.been.calledWith(500);
    expect(res.send).to.have.been.calledOnce;
    expect(res.send).to.have.been.calledWith('<html><body>Error: Test Error</body></html>');
  });

  it('should respondWith 405 for unsupported method', async () => {
    const req = mockRequest({}, 'POST');
    const res = mockResponse();

    const middleware = new FEAASRenderMiddleware();
    const handler = middleware.getHandler();

    await handler(req, res);

    expect(res.setHeader).to.have.been.calledWithExactly('Allow', 'GET, OPTIONS');
    expect(res.status).to.have.been.calledOnce;
    expect(res.status).to.have.been.calledWith(405);
    expect(res.send).to.have.been.calledOnce;
    expect(res.send).to.have.been.calledWith(
      "<html><body>Invalid request method 'POST'</body></html>"
    );
  });

  it('should stop request and return 401 when CORS match is not met', async () => {
    const req = mockRequest({}, 'POST', { origin: 'https://notallowed.com' });
    const res = mockResponse();
    const middleware = new FEAASRenderMiddleware();
    const handler = middleware.getHandler();

    await handler(req, res);

    expect(res.status).to.have.been.calledOnce;
    expect(res.status).to.have.been.calledWith(401);
    expect(res.send).to.have.been.calledOnce;
    expect(res.send).to.have.been.calledWith(
      '<html><body>Requests from origin https://notallowed.com are not allowed</body></html>'
    );
  });

  it('should respond with 401 for missing secret', async () => {
    const query = {} as Query;
    const req = mockRequest(query);
    const res = mockResponse();

    const middleware = new FEAASRenderMiddleware();
    const handler = middleware.getHandler();

    await handler(req, res);

    expect(res.status).to.have.been.calledOnce;
    expect(res.status).to.have.been.calledWith(401);
    expect(res.send).to.have.been.calledOnce;
    expect(res.send).to.have.been.calledWith('<html><body>Missing or invalid secret</body></html>');
  });

  it('should respond with 401 for invalid secret', async () => {
    const query = {} as Query;
    query[QUERY_PARAM_EDITING_SECRET] = 'nope';
    const req = mockRequest(query);
    const res = mockResponse();

    const middleware = new FEAASRenderMiddleware();
    const handler = middleware.getHandler();

    await handler(req, res);

    expect(res.status).to.have.been.calledOnce;
    expect(res.status).to.have.been.calledWith(401);
    expect(res.send).to.have.been.calledOnce;
    expect(res.send).to.have.been.calledWith('<html><body>Missing or invalid secret</body></html>');
  });

  it('should use custom pageUrl', async () => {
    const query = {} as Query;
    query[QUERY_PARAM_EDITING_SECRET] = secret;
    const req = mockRequest(query);
    const res = mockResponse();

    const pageUrl = '/some/path/feaas/render';

    const middleware = new FEAASRenderMiddleware({
      pageUrl,
    });
    const handler = middleware.getHandler();

    await handler(req, res);

    expect(res.redirect).to.have.been.calledOnce;
    expect(res.redirect).to.have.been.calledWith(pageUrl);
  });

  it('should pass along protection bypass query parameters', async () => {
    const query = {} as Query;
    const vercelBypassToken = 'token1234Vercel';
    const vercelBypassCookie = 'samesitenone';
    query[QUERY_PARAM_EDITING_SECRET] = secret;
    query[QUERY_PARAM_VERCEL_PROTECTION_BYPASS] = vercelBypassToken;
    query[QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE] = vercelBypassCookie;
    const previewData = {};

    const req = mockRequest(query);
    const res = mockResponse();

    const middleware = new FEAASRenderMiddleware();
    const handler = middleware.getHandler();

    await handler(req, res);

    expect(res.setPreviewData, 'set preview mode w/ data').to.have.been.calledWith(previewData);
    expect(res.redirect).to.have.been.calledOnce;
    expect(res.redirect).to.have.been.calledWith(
      `/feaas/render?${QUERY_PARAM_VERCEL_PROTECTION_BYPASS}=${vercelBypassToken}&${QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE}=${vercelBypassCookie}`
    );
  });
});
