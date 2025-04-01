import { expect } from 'chai';
import sinon from 'sinon';
import { NextApiRequest, NextApiResponse } from 'next';
import { SitemapMiddleware } from './sitemap-middleware';
import { SitecoreClient } from '@sitecore-content-sdk/core/client';

describe('SitemapMiddleware', () => {
  const sandbox = sinon.createSandbox();
  let sitecoreClientStub: sinon.SinonStubbedInstance<SitecoreClient>;
  let middleware: SitemapMiddleware;
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    sitecoreClientStub = sandbox.createStubInstance(SitecoreClient);

    res = {
      setHeader: sandbox.stub(),
      send: sandbox.stub(),
      redirect: sandbox.stub().returnsThis(),
      status: sandbox.stub().returnsThis(),
    };

    req = {
      query: {},
      headers: {
        host: 'example.com',
        'x-forwarded-proto': 'https',
      },
    };

    middleware = new SitemapMiddleware((sitecoreClientStub as unknown) as SitecoreClient);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getHandler', () => {
    it('should return a handler function', () => {
      const handler = middleware.getHandler();
      expect(handler).to.be.a('function');
    });
  });

  describe('handler', () => {
    it('should process sitemap request without id parameter', async () => {
      const siteName = 'test-site';
      const xmlContent = '<sitemapindex>...</sitemapindex>';

      sitecoreClientStub.resolveSite.returns({
        name: siteName,
        hostName: 'example.com',
        language: 'en',
      });
      sitecoreClientStub.getSiteMap.resolves(xmlContent);

      const handler = middleware.getHandler();
      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(sitecoreClientStub.resolveSite.calledWith('example.com')).to.be.true;
      expect(sitecoreClientStub.getSiteMap.calledOnce).to.be.true;
      expect(sitecoreClientStub.getSiteMap.firstCall.args[0]).to.deep.include({
        reqHost: 'example.com',
        reqProtocol: 'https',
        id: undefined,
        siteName: siteName,
      });

      expect(res.setHeader).to.have.been.calledWith('Content-Type', 'text/xml;charset=utf-8');
      expect(res.send).to.have.been.calledWith(xmlContent);
    });

    it('should handle sitemap request with specific id parameter', async () => {
      const sitemapId = '1';
      req.query = { id: sitemapId };
      const siteName = 'test-site';
      const xmlContent = '<urlset>...</urlset>';

      sitecoreClientStub.resolveSite.returns({
        name: siteName,
        hostName: 'example.com',
        language: 'en',
      });
      sitecoreClientStub.getSiteMap.resolves(xmlContent);

      const handler = middleware.getHandler();
      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(sitecoreClientStub.getSiteMap.firstCall.args[0]).to.deep.include({
        reqHost: 'example.com',
        reqProtocol: 'https',
        id: sitemapId,
        siteName: siteName,
      });
      expect(res.send).to.have.been.calledWith(xmlContent);
    });

    it('should handle array of id parameters by using the first value', async () => {
      const sitemapIds = ['1', '2', '3'];
      req.query = { id: sitemapIds };
      const siteName = 'test-site';
      const xmlContent = '<urlset>...</urlset>';

      sitecoreClientStub.resolveSite.returns({
        name: siteName,
        hostName: 'example.com',
        language: 'en',
      });
      sitecoreClientStub.getSiteMap.resolves(xmlContent);

      const handler = middleware.getHandler();
      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(sitecoreClientStub.getSiteMap.firstCall.args[0]).to.deep.include({
        id: sitemapIds[0],
        siteName: siteName,
      });
    });

    it('should default to https protocol when x-forwarded-proto header is missing', async () => {
      const reqWithoutProto = { ...req, headers: { host: 'example.com' } };
      const siteName = 'test-site';
      const xmlContent = '<sitemapindex>...</sitemapindex>';

      sitecoreClientStub.resolveSite.returns({
        name: siteName,
        hostName: 'example.com',
        language: 'en',
      });
      sitecoreClientStub.getSiteMap.resolves(xmlContent);

      const handler = middleware.getHandler();
      await handler(reqWithoutProto as NextApiRequest, res as NextApiResponse);

      expect(sitecoreClientStub.getSiteMap.firstCall.args[0]).to.deep.include({
        reqHost: 'example.com',
        reqProtocol: 'https',
        siteName: siteName,
      });
    });

    it('should redirect to 404 when REDIRECT_404 error is thrown', async () => {
      const error = new Error('REDIRECT_404');
      sitecoreClientStub.resolveSite.returns({
        name: 'test-site',
        hostName: 'example.com',
        language: 'en',
      });
      sitecoreClientStub.getSiteMap.rejects(error);

      const handler = middleware.getHandler();
      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.redirect).to.have.been.calledWith('/404');
      expect(res.send).not.to.have.been.called;
    });

    it('should return 500 error when any other error occurs', async () => {
      const error = new Error('Unexpected error');
      sitecoreClientStub.resolveSite.returns({
        name: 'test-site',
        hostName: 'example.com',
        language: 'en',
      });
      sitecoreClientStub.getSiteMap.rejects(error);

      const handler = middleware.getHandler();
      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.status).to.have.been.calledWith(500);
      expect(res.send).to.have.been.calledWith('Internal Server Error');
      expect(res.redirect).not.to.have.been.called;
    });
  });
});
