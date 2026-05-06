import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
const proxyquireNoCallThru = proxyquire.noCallThru();

describe('createEdgeWebhookRevalidateRouteHandler', () => {
  const sandbox = sinon.createSandbox();
  let revalidateTagStub: sinon.SinonStub;
  let nextResponseJsonStub: sinon.SinonStub;
  let module: { createEdgeWebhookRevalidateRouteHandler: typeof import('./edge-webhook-revalidate-route-handler').createEdgeWebhookRevalidateRouteHandler };

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

    module = proxyquireNoCallThru('./edge-webhook-revalidate-route-handler', {
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
    const handler = module.createEdgeWebhookRevalidateRouteHandler();
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
    const handler = module.createEdgeWebhookRevalidateRouteHandler({ defaultLocale: 'en' });
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

  it('should include additional tags configured in options', async () => {
    process.env.SITECORE_REVALIDATE_SECRET = 'expected';
    const handler = module.createEdgeWebhookRevalidateRouteHandler({
      defaultLocale: 'en',
      additionalTags: () => ['sc:dict:new-testing-site-mn:en'],
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
});
