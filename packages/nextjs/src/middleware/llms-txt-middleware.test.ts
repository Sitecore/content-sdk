import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { NextApiRequest, NextApiResponse } from 'next';
import { LlmsTxtMiddleware } from './llms-txt-middleware';
import { SitecoreClient } from '@sitecore-content-sdk/content/client';
import { SiteInfo } from '@sitecore-content-sdk/content/site';
import { constants } from '@sitecore-content-sdk/core';

const { ERROR_MESSAGES } = constants;

chai.use(sinonChai);

describe('LlmsTxtMiddleware', () => {
  const sandbox = sinon.createSandbox();
  let sitecoreClientStub: sinon.SinonStubbedInstance<SitecoreClient>;
  let middleware: LlmsTxtMiddleware;
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

    middleware = new LlmsTxtMiddleware(sitecoreClientStub as unknown as SitecoreClient, sites);
    (middleware as any).siteResolver = siteResolverStub;
    siteResolverStub.getByHost.callsFake((hostName) =>
      sites.find((site) => site.hostName === hostName)
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should set the content type header to text/markdown', async () => {
    sitecoreClientStub.getLlmsTxt.resolves('# llms.txt\n\n> Example site.');

    await middleware.getHandler()(req as NextApiRequest, res as NextApiResponse);

    expect(res.setHeader).to.have.been.calledWith('Content-Type', 'text/markdown; charset=utf-8');
  });

  it('should call getLlmsTxt with the correct siteName', async () => {
    sitecoreClientStub.getLlmsTxt.resolves('# llms.txt\n\n> Example site.');

    await middleware.getHandler()(req as NextApiRequest, res as NextApiResponse);

    expect(sitecoreClientStub.getLlmsTxt).to.have.been.calledWith('test-site');
  });

  it('should return 200 with llms.txt content', async () => {
    sitecoreClientStub.getLlmsTxt.resolves('# llms.txt\n\n> Example site.');

    await middleware.getHandler()(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).to.have.been.calledWith(200);
    expect(res.send).to.have.been.calledWith('# llms.txt\n\n> Example site.');
  });

  it('should return 404 if getLlmsTxt returns null', async () => {
    sitecoreClientStub.getLlmsTxt.resolves(undefined);

    await middleware.getHandler()(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).to.have.been.calledWith(404);
    expect(res.send).to.have.been.calledWith(
      '# llms.txt\n\n> No llms.txt content configured for this site.'
    );
  });

  it('should return 500 if getLlmsTxt throws an error', async () => {
    sitecoreClientStub.getLlmsTxt.rejects(new Error('Unexpected failure'));

    await middleware.getHandler()(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).to.have.been.calledWith(500);
    expect(res.send).to.have.been.calledWith(`Internal Server Error. ${ERROR_MESSAGES.CONTACT_SUPPORT}`);
  });

  it('should use "localhost" as fallback when host header is missing', async () => {
    req.headers = {}; // no host header

    sitecoreClientStub.getLlmsTxt.resolves('# llms.txt\n\n> Example site.');

    await middleware.getHandler()(req as NextApiRequest, res as NextApiResponse);

    expect(sitecoreClientStub.getLlmsTxt).to.have.been.calledWith('test-site-two');
    expect(res.status).to.have.been.calledWith(200);
    expect(res.send).to.have.been.calledWith('# llms.txt\n\n> Example site.');
  });

  it('should use x-forwarded-host header when present', async () => {
    req.headers = {
      'x-forwarded-host': 'proxy.forwarded.com',
      host: 'localhost:3000',
    };

    await middleware.getHandler()(req as NextApiRequest, res as NextApiResponse);

    expect(siteResolverStub.getByHost).to.have.been.calledWith('proxy.forwarded.com');
  });
});
