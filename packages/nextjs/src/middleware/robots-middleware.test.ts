import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { NextApiRequest, NextApiResponse } from 'next';
import { RobotsMiddleware } from './robots-middleware';
import { SitecoreClient } from '@sitecore-content-sdk/core/client';
import { SiteInfo } from '@sitecore-content-sdk/core/site';

chai.use(sinonChai);

describe('RobotsMiddleware', () => {
  const sandbox = sinon.createSandbox();
  let sitecoreClientStub: sinon.SinonStubbedInstance<SitecoreClient>;
  let middleware: RobotsMiddleware;
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;
  let siteResolverStub = {
    getByHost: sandbox.stub(),
    getByName: sandbox.stub(),
  };

  const mockSiteInfo: SiteInfo = {
    name: 'test-site',
    hostName: 'example.com',
    language: 'en',
  };

  const sites = [mockSiteInfo, { name: 'test-site-two', hostName: 'localhost', language: 'da' }];

  beforeEach(() => {
    sitecoreClientStub = sandbox.createStubInstance(SitecoreClient);
    siteResolverStub = {
      getByHost: sandbox.stub(),
      getByName: sandbox.stub(),
    };

    res = {
      setHeader: sandbox.stub(),
      send: sandbox.stub(),
      status: sandbox.stub().returnsThis(),
    };

    req = {
      headers: {
        host: 'example.com',
      },
    };

    middleware = new RobotsMiddleware((sitecoreClientStub as unknown) as SitecoreClient, sites);
    (middleware as any).siteResolver = siteResolverStub;
    siteResolverStub.getByHost.callsFake((hostName) =>
      sites.find((site) => site.hostName === hostName)
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should set the content type header to text/plain', async () => {
    sitecoreClientStub.getRobots.resolves('User-agent: *\nDisallow: /');

    await middleware.getHandler()(req as NextApiRequest, res as NextApiResponse);

    expect(res.setHeader).to.have.been.calledWith('Content-Type', 'text/plain');
  });

  it('should call getRobots with the correct siteName', async () => {
    sitecoreClientStub.getRobots.resolves('User-agent: *\nDisallow: /');

    await middleware.getHandler()(req as NextApiRequest, res as NextApiResponse);

    expect(sitecoreClientStub.getRobots).to.have.been.calledWith('test-site');
  });

  it('should return 200 with robots content', async () => {
    sitecoreClientStub.getRobots.resolves('User-agent: *\nDisallow: /');

    await middleware.getHandler()(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).to.have.been.calledWith(200);
    expect(res.send).to.have.been.calledWith('User-agent: *\nDisallow: /');
  });

  it('should return 404 if getRobots returns null', async () => {
    sitecoreClientStub.getRobots.resolves(undefined);

    await middleware.getHandler()(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).to.have.been.calledWith(404);
    expect(res.send).to.have.been.calledWith('User-agent: *\nDisallow: /');
  });

  it('should return 500 if getRobots throws an error', async () => {
    sitecoreClientStub.getRobots.rejects(new Error('Unexpected failure'));

    await middleware.getHandler()(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).to.have.been.calledWith(500);
    expect(res.send).to.have.been.calledWith('Internal Server Error');
  });

  it('should use "localhost" as fallback when host header is missing', async () => {
    req.headers = {}; // no host header

    sitecoreClientStub.getRobots.resolves('User-agent: *\nDisallow: /');

    await middleware.getHandler()(req as NextApiRequest, res as NextApiResponse);

    expect(sitecoreClientStub.getRobots).to.have.been.calledWith('test-site-two');
    expect(res.status).to.have.been.calledWith(200);
    expect(res.send).to.have.been.calledWith('User-agent: *\nDisallow: /');
  });
});
