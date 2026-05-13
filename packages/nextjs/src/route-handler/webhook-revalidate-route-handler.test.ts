import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
const proxyquireNoCallThru = proxyquire.noCallThru();

describe('createWebhookRevalidateRouteHandler', () => {
  const sandbox = sinon.createSandbox();
  let revalidateTagStub: sinon.SinonStub;
  let nextResponseJsonStub: sinon.SinonStub;
  let module: {
    createWebhookRevalidateRouteHandler: typeof import('./webhook-revalidate-route-handler').createWebhookRevalidateRouteHandler;
    createEdgeWebhookRevalidateRouteHandler: typeof import('./webhook-revalidate-route-handler').createEdgeWebhookRevalidateRouteHandler;
  };

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

    module = proxyquireNoCallThru('./webhook-revalidate-route-handler', {
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

  it('should return 400 when no tags resolve from body', async () => {
    process.env.SITECORE_REVALIDATE_SECRET = 's';
    const handler = module.createWebhookRevalidateRouteHandler();
    const res = await handler.POST(
      createReq({
        headers: { 'x-revalidate-secret': 's' },
        body: { updates: [{ identifier: '' }] },
      })
    );

    expect(res.status).to.equal(400);
    expect(revalidateTagStub.called).to.equal(false);
  });

  it('should revalidate tags from updates and echo invocation metadata', async () => {
    process.env.SITECORE_REVALIDATE_SECRET = 'expected';
    const handler = module.createWebhookRevalidateRouteHandler({ defaultLocale: 'en' });
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
    expect(revalidateTagStub.firstCall.args[0]).to.equal(
      'sc:item:71b0ba0716214254aee4429b1a970c8b:en:latest'
    );
    expect(res.body).to.deep.include({
      revalidated: true,
      invocation_id: 'inv-1',
      continues: true,
    });
  });

  it('should include dictionary tags from sites in webhook handler', async () => {
    process.env.SITECORE_REVALIDATE_SECRET = 'expected';
    const handler = module.createWebhookRevalidateRouteHandler({
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

  it('should expose deprecated createEdgeWebhookRevalidateRouteHandler alias', async () => {
    process.env.SITECORE_REVALIDATE_SECRET = 'expected';
    const handler = module.createEdgeWebhookRevalidateRouteHandler({ defaultLocale: 'en' });
    const res = await handler.POST(
      createReq({
        headers: { 'x-revalidate-secret': 'expected' },
        body: {
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
  });
});
