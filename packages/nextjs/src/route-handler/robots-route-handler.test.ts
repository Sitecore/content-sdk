import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { NextRequest } from 'next/server';
import proxyquire from 'proxyquire';
import { SitecoreClient } from '@sitecore-content-sdk/core/client';
import { SiteInfo } from '@sitecore-content-sdk/core/site';

chai.use(sinonChai);

describe('createRobotsRouteHandler', () => {
  const sandbox = sinon.createSandbox();
  let sitecoreClientStub: sinon.SinonStubbedInstance<SitecoreClient>;
  let robotsRouteHandlerModule: any;
  let unstableCacheStub: sinon.SinonStub;
  let handler: any;
  let req: Partial<NextRequest>;
  const mockSiteInfo: SiteInfo = {
    name: 'test-site',
    hostName: 'example.com',
    language: 'en',
  };

  let OriginalResponse: typeof Response;

  const sites = [mockSiteInfo, { name: 'test-site-two', hostName: 'localhost', language: 'da' }];

  beforeEach(() => {
    sitecoreClientStub = sandbox.createStubInstance(SitecoreClient);
    unstableCacheStub = sandbox.stub().callsFake((fn) => fn);
    robotsRouteHandlerModule = proxyquire('./robots-route-handler', {
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

    handler = robotsRouteHandlerModule.createRobotsRouteHandler({
      client: sitecoreClientStub,
      sites,
    });

    req = {
      headers: new Headers({
        host: 'example.com',
      }),
    };
  });

  afterEach(() => {
    sandbox.restore();
    sinon.restore();
    (globalThis as any).Response = OriginalResponse;
  });

  it('should set the content type header to text/plain', async () => {
    sitecoreClientStub.getRobots.resolves('User-agent: *\nDisallow: /');

    const res = await handler.GET(req as NextRequest);

    expect(res.headers['Content-Type']).to.equal('text/plain');
  });

  it('should call getRobots with the correct siteName', async () => {
    sitecoreClientStub.getRobots.resolves('User-agent: *\nDisallow: /');

    await handler.GET(req as NextRequest);

    expect(sitecoreClientStub.getRobots).to.have.been.calledWith('test-site');
  });

  it('should return 200 with robots content', async () => {
    sitecoreClientStub.getRobots.resolves('User-agent: *\nDisallow: /');

    const res = await handler.GET(req as NextRequest);

    expect(res.status).to.equal(200);
    expect(res.body).to.equal('User-agent: *\nDisallow: /');
  });

  it('should return 404 if getRobots returns null', async () => {
    sitecoreClientStub.getRobots.resolves(undefined);

    const res = await handler.GET(req as NextRequest);

    expect(res.status).to.equal(404);
    expect(res.body).to.equal('User-agent: *\nDisallow: /');
  });

  it('should return 500 if getRobots throws an error', async () => {
    sitecoreClientStub.getRobots.rejects(new Error('Unexpected failure'));

    const res = await handler.GET(req as NextRequest);

    expect(res.status).to.equal(500);
    expect(res.body).to.equal('Internal Server Error');
  });

  it('should use "localhost" as fallback when host header is missing', async () => {
    const req = { headers: new Headers() };

    sitecoreClientStub.getRobots.resolves('User-agent: *\nDisallow: /');

    const res = await handler.GET(req as NextRequest);

    expect(sitecoreClientStub.getRobots).to.have.been.calledWith('test-site-two');
    expect(res.status).to.equal(200);
    expect(res.body).to.equal('User-agent: *\nDisallow: /');
  });

  it('should cache the response for default revalidate time', async () => {
    sitecoreClientStub.getRobots.resolves('User-agent: *\nDisallow: /');

    const res = await handler.GET(req as NextRequest);

    expect(unstableCacheStub.callCount).to.equal(1);
    expect(unstableCacheStub.args[0][2].revalidate).to.equal(60);

    expect(res.status).to.equal(200);
    expect(res.body).to.equal('User-agent: *\nDisallow: /');
  });

  it('should cache the response for custom revalidate time', async () => {
    unstableCacheStub.resetHistory();

    const handler = robotsRouteHandlerModule.createRobotsRouteHandler({
      client: sitecoreClientStub,
      sites,
      revalidate: 10,
    });

    sitecoreClientStub.getRobots.resolves('User-agent: *\nDisallow: /');

    const res = await handler.GET(req as NextRequest);

    expect(unstableCacheStub.callCount).to.equal(1);
    expect(unstableCacheStub.args[0][2].revalidate).to.equal(10);

    expect(res.status).to.equal(200);
    expect(res.body).to.equal('User-agent: *\nDisallow: /');
  });
});
