/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { NextRequest } from 'next/server';
import proxyquire from 'proxyquire';
import { SitecoreClient } from '@sitecore-content-sdk/core/client';

chai.use(sinonChai);

describe('createSitemapRouteHandler', () => {
  const sandbox = sinon.createSandbox();
  let sitecoreClientStub: sinon.SinonStubbedInstance<SitecoreClient>;
  let sitemapRouteHandlerModule: any;
  let unstableCacheStub: sinon.SinonStub;
  let handler: any;
  let req: Partial<NextRequest>;

  let OriginalResponse: typeof Response;

  const sites = [
    { name: 'test-site', hostName: 'example.com', language: 'en' },
    { name: 'test-site-two', hostName: '*', language: 'da' },
  ];

  beforeEach(() => {
    sitecoreClientStub = sandbox.createStubInstance(SitecoreClient);
    unstableCacheStub = sandbox.stub().callsFake((fn) => fn);

    sitemapRouteHandlerModule = proxyquire('./sitemap-route-handler', {
      'next/cache': { unstable_cache: unstableCacheStub },
    });

    OriginalResponse = (globalThis as any).Response;

    (globalThis as any).Response = sinon.stub().callsFake((body, options) => {
      return {
        headers: options?.headers,
        status: options?.status,
        body,
      };
    });

    req = {
      headers: new Headers({
        host: 'example.com',
        'x-forwarded-proto': 'https',
      }),
      nextUrl: {
        pathname: '/sitemap.xml',
      } as any,
    } as NextRequest;

    handler = sitemapRouteHandlerModule.createSitemapRouteHandler({
      client: sitecoreClientStub as unknown as SitecoreClient,
      sites,
    });
  });

  afterEach(() => {
    sandbox.restore();
    sinon.restore();
    (globalThis as any).Response = OriginalResponse;
  });

  describe('handler', () => {
    it('should process sitemap request without id parameter', async () => {
      const siteName = sites[0].name;
      const xmlContent = '<sitemapindex>...</sitemapindex>';

      sitecoreClientStub.getSiteMap.resolves(xmlContent);

      const res = await handler.GET(req);

      expect(sitecoreClientStub.getSiteMap.calledOnce).to.be.true;
      expect(sitecoreClientStub.getSiteMap.firstCall.args[0]).to.deep.include({
        reqHost: 'example.com',
        reqProtocol: 'https',
        id: '',
        siteName: siteName,
      });

      expect(res.headers).to.deep.equal({
        'Content-Type': 'text/xml;charset=utf-8',
      });
      expect(res.body).to.equal(xmlContent);
    });

    it('should handle sitemap request with specific id parameter', async () => {
      const sitemapId = '1';
      req.nextUrl!.pathname = `/sitemap-${sitemapId}.xml`;
      const siteName = sites[0].name;
      const xmlContent = '<urlset>...</urlset>';

      sitecoreClientStub.getSiteMap.resolves(xmlContent);

      const res = await handler.GET(req);

      expect(sitecoreClientStub.getSiteMap.firstCall.args[0]).to.deep.include({
        reqHost: 'example.com',
        reqProtocol: 'https',
        id: sitemapId,
        siteName: siteName,
      });
      expect(res.body).to.equal(xmlContent);
    });

    it('should default to https protocol when x-forwarded-proto header is missing', async () => {
      const reqWithoutProto = {
        ...req,
        headers: new Headers({
          host: 'example.com',
        }),
      };
      const siteName = sites[0].name;
      const xmlContent = '<sitemapindex>...</sitemapindex>';

      sitecoreClientStub.getSiteMap.resolves(xmlContent);

      const res = await handler.GET(reqWithoutProto);

      expect(sitecoreClientStub.getSiteMap.firstCall.args[0]).to.deep.include({
        reqHost: 'example.com',
        reqProtocol: 'https',
        siteName: siteName,
      });
      expect(res.body).to.equal(xmlContent);
    });

    it('should cache the response for default revalidate time', async () => {
      const xmlContent = '<sitemapindex>...</sitemapindex>';

      sitecoreClientStub.getSiteMap.resolves(xmlContent);

      await handler.GET(req);

      expect(unstableCacheStub.callCount).to.equal(1);
      expect(unstableCacheStub.args[0][2].revalidate).to.equal(60);
    });

    it('should cache the response for custom revalidate time', async () => {
      unstableCacheStub.resetHistory();

      const handler = sitemapRouteHandlerModule.createSitemapRouteHandler({
        client: sitecoreClientStub,
        sites,
        revalidate: 10,
      });

      await handler.GET(req);

      expect(unstableCacheStub.callCount).to.equal(1);
      expect(unstableCacheStub.args[0][2].revalidate).to.equal(10);
    });

    it('should redirect to 404 when REDIRECT_404 error is thrown', async () => {
      const error = new Error('REDIRECT_404');

      sitecoreClientStub.getSiteMap.rejects(error);

      const res = await handler.GET(req);

      expect(res.status).to.equal(404);
      expect(res.body).to.equal('Not Found');
    });

    it('should return 500 error when any other error occurs', async () => {
      const error = new Error('Unexpected error');

      sitecoreClientStub.getSiteMap.rejects(error);

      const res = await handler.GET(req);

      expect(res.status).to.equal(500);
      expect(res.body).to.equal('Internal Server Error');
    });
  });
});
