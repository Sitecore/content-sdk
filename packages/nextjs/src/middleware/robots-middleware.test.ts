import { expect } from 'chai';
import sinon from 'sinon';
import { NextApiRequest, NextApiResponse } from 'next';
import { RobotsMiddleware } from './robots-middleware';
import { SitecoreClient } from '@sitecore-content-sdk/core/client';
import { SiteInfo } from '@sitecore-content-sdk/core/site';

describe('RobotsMiddleware', () => {
  const sandbox = sinon.createSandbox();
  let sitecoreClientStub: sinon.SinonStubbedInstance<SitecoreClient>;
  let middleware: RobotsMiddleware;
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  const mockSiteInfo: SiteInfo = {
    name: 'test-site',
    hostName: 'example.com',
    language: 'en',
  };

  beforeEach(() => {
    sitecoreClientStub = sandbox.createStubInstance(SitecoreClient);

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

    middleware = new RobotsMiddleware(sitecoreClientStub as unknown as SitecoreClient);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should set the content type header to text/plain', async () => {
    sitecoreClientStub.resolveSite.returns(mockSiteInfo);
    sitecoreClientStub.getRobots.resolves('User-agent: *\nDisallow: /');

    await middleware.getHandler()(req as NextApiRequest, res as NextApiResponse);

    expect(res.setHeader).to.have.been.calledWith('Content-Type', 'text/plain');
  });

  it('should call resolveSite with hostname', async () => {
    sitecoreClientStub.resolveSite.returns(mockSiteInfo);
    sitecoreClientStub.getRobots.resolves('User-agent: *\nDisallow: /');

    await middleware.getHandler()(req as NextApiRequest, res as NextApiResponse);

    expect(sitecoreClientStub.resolveSite).to.have.been.calledWith('example.com');
  });

  it('should call getRobots with the correct siteName', async () => {
    sitecoreClientStub.resolveSite.returns(mockSiteInfo);
    sitecoreClientStub.getRobots.resolves('User-agent: *\nDisallow: /');

    await middleware.getHandler()(req as NextApiRequest, res as NextApiResponse);

    expect(sitecoreClientStub.getRobots).to.have.been.calledWith('test-site');
  });

  it('should return 200 with robots content', async () => {
    sitecoreClientStub.resolveSite.returns(mockSiteInfo);
    sitecoreClientStub.getRobots.resolves('User-agent: *\nDisallow: /');

    await middleware.getHandler()(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).to.have.been.calledWith(200);
    expect(res.send).to.have.been.calledWith('User-agent: *\nDisallow: /');
  });

  it('should return 404 if getRobots returns null', async () => {
    sitecoreClientStub.resolveSite.returns({
      name: 'test-site',
      hostName: 'example.com',
      language: 'en',
    });

    sitecoreClientStub.getRobots.resolves(undefined);

    await middleware.getHandler()(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).to.have.been.calledWith(404);
    expect(res.send).to.have.been.calledWith('User-agent: *\nDisallow: /');
  });

  it('should return 500 if getRobots throws an error', async () => {
    sitecoreClientStub.resolveSite.returns({
      name: 'test-site',
      hostName: 'example.com',
      language: 'en',
    });

    sitecoreClientStub.getRobots.rejects(new Error('Unexpected failure'));

    await middleware.getHandler()(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).to.have.been.calledWith(500);
    expect(res.send).to.have.been.calledWith('Internal Server Error');
  });

  it('should use "localhost" as fallback when host header is missing', async () => {
    req.headers = {}; // no host header
    sitecoreClientStub.resolveSite.returns({
      name: 'localhost-site',
      hostName: 'localhost',
      language: 'en',
    });

    sitecoreClientStub.getRobots.resolves('User-agent: *\nDisallow: /');

    await middleware.getHandler()(req as NextApiRequest, res as NextApiResponse);

    expect(sitecoreClientStub.resolveSite).to.have.been.calledWith('localhost');
    expect(res.status).to.have.been.calledWith(200);
    expect(res.send).to.have.been.calledWith('User-agent: *\nDisallow: /');
  });
});
