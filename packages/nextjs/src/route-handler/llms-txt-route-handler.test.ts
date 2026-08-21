import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { NextRequest } from 'next/server';
import proxyquire from 'proxyquire';
import { SitecoreClient } from '@sitecore-content-sdk/content/client';
import { SiteInfo } from '@sitecore-content-sdk/content/site';

chai.use(sinonChai);

describe('createLlmsTxtRouteHandler', () => {
  const sandbox = sinon.createSandbox();
  let sitecoreClientStub: sinon.SinonStubbedInstance<SitecoreClient>;
  let llmsTxtRouteHandlerModule: any;
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
    llmsTxtRouteHandlerModule = proxyquire('./llms-txt-route-handler', {
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

    handler = llmsTxtRouteHandlerModule.createLlmsTxtRouteHandler({
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

  it('should set the content type header to text/markdown', async () => {
    sitecoreClientStub.getLlmsTxt.resolves('# llms.txt\n\n> Example site.');

    const res = await handler.GET(req as NextRequest);

    expect(res.headers['Content-Type']).to.equal('text/markdown; charset=utf-8');
  });

  it('should call getLlmsTxt with the correct siteName', async () => {
    sitecoreClientStub.getLlmsTxt.resolves('# llms.txt\n\n> Example site.');

    await handler.GET(req as NextRequest);

    expect(sitecoreClientStub.getLlmsTxt).to.have.been.calledWith({ siteName: 'test-site' });
  });

  it('should return 200 with llms.txt content', async () => {
    sitecoreClientStub.getLlmsTxt.resolves('# llms.txt\n\n> Example site.');

    const res = await handler.GET(req as NextRequest);

    expect(res.status).to.equal(200);
    expect(res.body).to.equal('# llms.txt\n\n> Example site.');
  });

  it('should return 404 if getLlmsTxt returns null', async () => {
    sitecoreClientStub.getLlmsTxt.resolves(undefined);

    const res = await handler.GET(req as NextRequest);

    expect(res.status).to.equal(404);
    expect(res.body).to.equal('# llms.txt\n\n> No llms.txt content configured for this site.');
  });

  it('should return 500 if getLlmsTxt throws an error', async () => {
    sitecoreClientStub.getLlmsTxt.rejects(new Error('Unexpected failure'));

    const res = await handler.GET(req as NextRequest);

    expect(res.status).to.equal(500);
    expect(res.body).to.equal('Internal Server Error');
  });

  it('should use "localhost" as fallback when host header is missing', async () => {
    const req = { headers: new Headers() };

    sitecoreClientStub.getLlmsTxt.resolves('# llms.txt\n\n> Example site.');

    const res = await handler.GET(req as NextRequest);

    expect(sitecoreClientStub.getLlmsTxt).to.have.been.calledWith({ siteName: 'test-site-two' });
    expect(res.status).to.equal(200);
    expect(res.body).to.equal('# llms.txt\n\n> Example site.');
  });

  it('should use x-forwarded-host header when present', async () => {
    const req = {
      headers: new Headers({
        'x-forwarded-host': 'example.com',
        host: 'localhost:3000',
      }),
    };

    sitecoreClientStub.getLlmsTxt.resolves('# llms.txt\n\n> Example site.');

    await handler.GET(req as NextRequest);

    expect(sitecoreClientStub.getLlmsTxt).to.have.been.calledWith({ siteName: 'test-site' });
  });

  it('should cache the response for default revalidate time', async () => {
    sitecoreClientStub.getLlmsTxt.resolves('# llms.txt\n\n> Example site.');

    const res = await handler.GET(req as NextRequest);

    expect(unstableCacheStub.callCount).to.equal(1);
    expect(unstableCacheStub.args[0][2].revalidate).to.equal(60);

    expect(res.status).to.equal(200);
    expect(res.body).to.equal('# llms.txt\n\n> Example site.');
  });

  it('should cache the response for custom revalidate time', async () => {
    unstableCacheStub.resetHistory();

    const handler = llmsTxtRouteHandlerModule.createLlmsTxtRouteHandler({
      client: sitecoreClientStub,
      sites,
      revalidate: 10,
    });

    sitecoreClientStub.getLlmsTxt.resolves('# llms.txt\n\n> Example site.');

    const res = await handler.GET(req as NextRequest);

    expect(unstableCacheStub.callCount).to.equal(1);
    expect(unstableCacheStub.args[0][2].revalidate).to.equal(10);

    expect(res.status).to.equal(200);
    expect(res.body).to.equal('# llms.txt\n\n> Example site.');
  });
});
