import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
const proxyquireNoCallThru = proxyquire.noCallThru();

describe('createSitecoreRevalidateRouteHandler', () => {
  const sandbox = sinon.createSandbox();
  let revalidateTagStub: sinon.SinonStub;
  let nextResponseJsonStub: sinon.SinonStub;
  let module: { createSitecoreRevalidateRouteHandler: typeof import('./sitecore-revalidate-route-handler').createSitecoreRevalidateRouteHandler };

  const createReq = (params: { headers?: Record<string, string>; body?: unknown }) => {
    const { headers = {}, body = {} } = params;
    return {
      headers: new Headers(headers),
      json: async () => body,
    } as any;
  };

  beforeEach(() => {
    revalidateTagStub = sandbox.stub();
    nextResponseJsonStub = sandbox.stub().callsFake((body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      body,
    }));

    module = proxyquireNoCallThru('./sitecore-revalidate-route-handler', {
      '../debug': {
        __esModule: true,
        default: {
          revalidate: () => undefined,
        },
      },
      'next/cache': { revalidateTag: revalidateTagStub },
      'next/server': { NextRequest: class {}, NextResponse: { json: nextResponseJsonStub } },
    });
  });

  afterEach(() => {
    sandbox.restore();
    delete process.env.SITECORE_REVALIDATE_SECRET;
  });

  it('should return 400 when body is not a JSON object', async () => {
    process.env.SITECORE_REVALIDATE_SECRET = 's';
    const handler = module.createSitecoreRevalidateRouteHandler();
    const res = await handler.POST(
      createReq({
        headers: { 'x-revalidate-secret': 's' },
        body: [],
      })
    );

    expect(res.status).to.equal(400);
    expect(revalidateTagStub.called).to.equal(false);
  });

  it('should pass sc:-prefixed tags through verbatim and echo invocation metadata', async () => {
    process.env.SITECORE_REVALIDATE_SECRET = 'expected';
    const handler = module.createSitecoreRevalidateRouteHandler();
    const res = await handler.POST(
      createReq({
        headers: { 'x-revalidate-secret': 'expected' },
        body: { tags: ['sc:route:site:en:_', 'sc:dict:site:en'] },
      })
    );

    expect(res.status).to.equal(200);
    expect(revalidateTagStub.callCount).to.equal(2);
    expect(res.body).to.deep.equal({
      revalidated: true,
      tags: ['sc:route:site:en:_', 'sc:dict:site:en'],
      invocation_id: null,
      continues: false,
    });
  });

  it('should map bare item id in tags via webhook resolution', async () => {
    process.env.SITECORE_REVALIDATE_SECRET = 'expected';
    const handler = module.createSitecoreRevalidateRouteHandler({ defaultLocale: 'en' });
    const res = await handler.POST(
      createReq({
        headers: { 'x-revalidate-secret': 'expected' },
        body: { tags: ['71B0BA0716214254AEE4429B1A970C8B'] },
      })
    );

    expect(res.status).to.equal(200);
    expect(revalidateTagStub.calledOnce).to.equal(true);
    expect(revalidateTagStub.firstCall.args[0]).to.equal(
      'sc:item:71b0ba0716214254aee4429b1a970c8b:en:latest'
    );
    expect(res.body).to.deep.include({ revalidated: true, continues: false });
  });

  it('should handle webhook updates and echo invocation metadata', async () => {
    process.env.SITECORE_REVALIDATE_SECRET = 'expected';
    const handler = module.createSitecoreRevalidateRouteHandler({ defaultLocale: 'en' });
    const res = await handler.POST(
      createReq({
        headers: { 'x-revalidate-secret': 'expected' },
        body: {
          invocation_id: 'inv-1',
          continues: true,
          updates: [
            {
              identifier: '71B0BA0716214254AEE4429B1A970C8B-media',
              entity_culture: 'en',
            },
          ],
        },
      })
    );

    expect(res.status).to.equal(200);
    expect(revalidateTagStub.calledOnce).to.equal(true);
    expect(res.body).to.deep.include({
      revalidated: true,
      invocation_id: 'inv-1',
      continues: true,
    });
  });

  it('should include dictionary tags from sites on every call when configured', async () => {
    process.env.SITECORE_REVALIDATE_SECRET = 'expected';
    const handler = module.createSitecoreRevalidateRouteHandler({
      defaultLocale: 'en',
      sites: [{ name: 'new-testing-site-mn', hostName: 'localhost', language: 'en' }],
    });
    const res = await handler.POST(
      createReq({
        headers: { 'x-revalidate-secret': 'expected' },
        body: {
          updates: [
            {
              identifier: '71B0BA0716214254AEE4429B1A970C8B',
              entity_culture: 'en',
            },
          ],
        },
      })
    );

    expect(res.status).to.equal(200);
    expect(revalidateTagStub.calledTwice).to.equal(true);
    expect(revalidateTagStub.firstCall.args[0]).to.equal(
      'sc:item:71b0ba0716214254aee4429b1a970c8b:en:latest'
    );
    expect(revalidateTagStub.secondCall.args[0]).to.equal('sc:dict:new-testing-site-mn:en');
  });

  it('should also append dictionary tags when only sc: tags are sent', async () => {
    process.env.SITECORE_REVALIDATE_SECRET = 'expected';
    const handler = module.createSitecoreRevalidateRouteHandler({
      defaultLocale: 'en',
      sites: [{ name: 'site-a', hostName: 'a.local', language: 'en' }],
    });
    const res = await handler.POST(
      createReq({
        headers: { 'x-revalidate-secret': 'expected' },
        body: { tags: ['sc:route:site-a:en:_'] },
      })
    );

    expect(res.status).to.equal(200);
    expect(revalidateTagStub.callCount).to.equal(2);
    expect(revalidateTagStub.firstCall.args[0]).to.equal('sc:route:site-a:en:_');
    expect(revalidateTagStub.secondCall.args[0]).to.equal('sc:dict:site-a:en');
  });
});
