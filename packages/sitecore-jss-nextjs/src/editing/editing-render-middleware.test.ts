/* eslint-disable dot-notation */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, use } from 'chai';
import { NextApiResponse } from 'next';
import {
  EDITING_ALLOWED_ORIGINS,
  QUERY_PARAM_EDITING_SECRET,
  EditingRenderQueryParams,
} from '@sitecore-jss/sitecore-jss/editing';
import { EditingRenderMiddleware, EditingNextApiRequest } from './editing-render-middleware';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';

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
  res.redirect = spy();
  return res;
};

describe('EditingRenderMiddleware', () => {
  const secret = 'secret1234';

  beforeEach(() => {
    process.env.JSS_EDITING_SECRET = secret;
    process.env.JSS_ALLOWED_ORIGINS = allowedOrigin;
    delete process.env.VERCEL;
  });

  after(() => {
    delete process.env.JSS_EDITING_SECRET;
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

    expect(res.status).to.have.been.calledOnceWith(204);
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

    await handler(req, res);

    expect(res.setPreviewData, 'set preview mode w/ data').to.have.been.calledWith({
      site: 'website',
      itemId: '{11111111-1111-1111-1111-111111111111}',
      language: 'en',
      variantIds: ['dev'],
      version: 'latest',
      pageState: 'edit',
      layoutKind: 'shared',
    });

    expect(res.redirect).to.have.been.calledOnce;
    expect(res.redirect).to.have.been.calledWith('/styleguide');
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

    await handler(req, res);

    expect(res.setPreviewData, 'set preview mode w/ data').to.have.been.calledWith({
      site: 'website',
      itemId: '{11111111-1111-1111-1111-111111111111}',
      language: 'en',
      variantIds: ['id-1', 'id-2', 'id-3'],
      version: undefined,
      pageState: 'edit',
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

    await handler(req, res);

    expect(res.setPreviewData, 'set preview mode w/ data').to.have.been.calledWith({
      site: 'website',
      itemId: '{11111111-1111-1111-1111-111111111111}',
      language: 'en',
      variantIds: ['_default'],
      version: undefined,
      pageState: 'edit',
      layoutKind: undefined,
    });

    expect(res.redirect).to.have.been.calledOnce;
    expect(res.redirect).to.have.been.calledWith('/styleguide');
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

    await handler(req, res);

    expect(res.setPreviewData, 'set preview mode w/ data').to.have.been.calledWith({
      site: 'website',
      itemId: '{11111111-1111-1111-1111-111111111111}',
      language: 'en',
      variantIds: ['dev'],
      version: 'latest',
      pageState: 'edit',
      layoutKind: 'shared',
    });

    expect(res.redirect).to.have.been.calledOnce;
    expect(res.redirect).to.have.been.calledWith('/custom/path/styleguide');
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
      html:
        '<html><body>Missing required query parameters: sc_itemid, sc_lang, route, mode</body></html>',
    });
  });

  it('should modify the Set-Cookie header', async () => {
    const req = mockRequest({ query });
    const res = mockResponse();

    const middleware = new EditingRenderMiddleware();
    const handler = middleware.getHandler();

    await handler(req, res);

    expect(res.setHeader).to.have.been.calledWith('Set-Cookie', [
      '__prerender_bypass=1122334455; Path=/; SameSite=None; Secure',
      '__next_preview_data=6677889900; Path=/; SameSite=None; Secure',
    ]);
  });

  it('should set allowed origins when multiple allowed origins are provided in env variable', async () => {
    process.env.JSS_ALLOWED_ORIGINS = 'https://allowed.com,https://anotherallowed.com';
    const req = mockRequest({ query });
    const res = mockResponse();

    const middleware = new EditingRenderMiddleware();
    const handler = middleware.getHandler();

    await handler(req, res);

    expect(res.setHeader).to.have.been.calledWith(
      'Content-Security-Policy',
      `frame-ancestors 'self' https://allowed.com https://anotherallowed.com ${EDITING_ALLOWED_ORIGINS.join(
        ' '
      )}`
    );
  });

  describe('Component Library handling', () => {
    const query = {
      mode: 'library',
      sc_itemid: '{11111111-1111-1111-1111-111111111111}',
      sc_lang: 'en',
      sc_site: 'website',
      sc_variant: 'dev',
      sc_version: 'latest',
      secret: secret,
      sc_renderingId: '123',
      sc_datasourceId: '456',
      sc_uid: '789',
    };

    it('should handle request with mode=library', async () => {
      const req = mockRequest({ query });
      const res = mockResponse();

      const middleware = new EditingRenderMiddleware();
      const handler = middleware.getHandler();

      await handler(req, res);

      expect(res.setPreviewData, 'set preview mode w/ data').to.have.been.calledWith({
        itemId: query.sc_itemid,
        componentUid: query.sc_uid,
        renderingId: query.sc_renderingId,
        language: query.sc_lang,
        site: query.sc_site,
        pageState: 'normal',
        mode: 'library',
        dataSourceId: query.sc_datasourceId,
        variant: query.sc_variant,
        version: query.sc_version,
      });

      expect(res.redirect).to.have.been.calledOnce;
      expect(res.redirect).to.have.been.calledWith('/component-library/render');
      expect(res.setHeader).to.have.been.calledWith(
        'Content-Security-Policy',
        `frame-ancestors 'self' https://allowed.com ${EDITING_ALLOWED_ORIGINS.join(' ')}`
      );
    });

    it('should always use component library path for redirect', async () => {
      const notQuiteRightQuery = {
        ...query,
        route: '/Styleguide',
      };
      const req = mockRequest({ query: notQuiteRightQuery });
      const res = mockResponse();

      const middleware = new EditingRenderMiddleware();
      const handler = middleware.getHandler();

      await handler(req, res);

      expect(res.redirect).to.have.been.calledOnce;
      expect(res.redirect).to.have.been.calledWith('/component-library/render');
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
        html:
          '<html><body>Missing required query parameters: sc_itemid, sc_lang, route, mode</body></html>',
      });
    });
  });
});
