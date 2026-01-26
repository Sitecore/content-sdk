/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { NextApiRequest, NextApiResponse } from 'next';
import { SitemapMiddleware } from './sitemap-middleware';
import { SitecoreClient } from '@sitecore-content-sdk/core/client';

chai.use(sinonChai);

describe('SitemapMiddleware', () => {
  const sandbox = sinon.createSandbox();
  let sitecoreClientStub: sinon.SinonStubbedInstance<SitecoreClient>;
  let middleware: SitemapMiddleware;
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;
  let siteResolverStub = {
    getByHost: sandbox.stub(),
    getByName: sandbox.stub(),
  };

  const sites = [
    { name: 'test-site', hostName: 'example.com', language: 'en' },
    { name: 'test-site-two', hostName: '*', language: 'da' },
  ];

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

    siteResolverStub = {
      getByHost: sandbox.stub(),
      getByName: sandbox.stub(),
    };

    middleware = new SitemapMiddleware(sitecoreClientStub as unknown as SitecoreClient, sites);
    (middleware as any).siteResolver = siteResolverStub;
    siteResolverStub.getByHost.callsFake((hostName) =>
      sites.find((site) => site.hostName === hostName)
    );
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
      const siteName = sites[0].name;
      const xmlContent = '<sitemapindex>...</sitemapindex>';

      sitecoreClientStub.getSiteMap.resolves(xmlContent);

      const handler = middleware.getHandler();
      await handler(req as NextApiRequest, res as NextApiResponse);

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
      const siteName = sites[0].name;
      const xmlContent = '<urlset>...</urlset>';

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
      const siteName = sites[0].name;
      const xmlContent = '<urlset>...</urlset>';

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
      const siteName = sites[0].name;
      const xmlContent = '<sitemapindex>...</sitemapindex>';

      sitecoreClientStub.getSiteMap.resolves(xmlContent);

      const handler = middleware.getHandler();
      await handler(reqWithoutProto as NextApiRequest, res as NextApiResponse);

      expect(sitecoreClientStub.getSiteMap.firstCall.args[0]).to.deep.include({
        reqHost: 'example.com',
        reqProtocol: 'https',
        siteName: siteName,
      });
    });

    it('should use x-forwarded-host header when present', async () => {
      req.headers = {
        'x-forwarded-host': 'example.com',
        host: 'localhost:3000',
      };

      await middleware.getHandler()(req as NextApiRequest, res as NextApiResponse);

      expect(siteResolverStub.getByHost).to.have.been.calledWith('example.com');
    });

    it('should use empty string when both x-forwarded-host and host headers are missing', async () => {
      req.headers = {};
      const xmlContent = '<sitemapindex>...</sitemapindex>';

      siteResolverStub.getByHost.withArgs('').returns(sites[1]);

      sitecoreClientStub.getSiteMap.resolves(xmlContent);

      await middleware.getHandler()(req as NextApiRequest, res as NextApiResponse);

      expect(sitecoreClientStub.getSiteMap.firstCall.args[0]).to.deep.include({
        reqHost: '',
        reqProtocol: 'https',
      });
    });

    it('should redirect to 404 when REDIRECT_404 error is thrown', async () => {
      const error = new Error('REDIRECT_404');

      sitecoreClientStub.getSiteMap.rejects(error);

      const handler = middleware.getHandler();
      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.redirect).to.have.been.calledWith('/404');
      expect(res.send).not.to.have.been.called;
    });

    it('should return 500 error when any other error occurs', async () => {
      const error = new Error('Unexpected error');

      sitecoreClientStub.getSiteMap.rejects(error);

      const handler = middleware.getHandler();
      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.status).to.have.been.calledWith(500);
      expect(res.send).to.have.been.calledWith('Internal Server Error');
      expect(res.redirect).not.to.have.been.called;
    });
  });
});
