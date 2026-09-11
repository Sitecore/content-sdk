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

  it('should revalidate without auth when secret is not configured', async () => {
    const handler = module.createSitecoreRevalidateRouteHandler({ defaultLocale: 'en' });
    const res = await handler.POST(
      createReq({
        body: { updates: [{ identifier: '71B0BA0716214254AEE4429B1A970C8B', entity_culture: 'en' }] },
      })
    );

    expect(res.status).to.equal(200);
    expect(revalidateTagStub.calledOnce).to.equal(true);
  });

  it('should treat whitespace-only env secret as unset and skip auth', async () => {
    process.env.SITECORE_REVALIDATE_SECRET = '   ';
    const handler = module.createSitecoreRevalidateRouteHandler({ defaultLocale: 'en' });
    const res = await handler.POST(
      createReq({
        body: { updates: [{ identifier: '71B0BA0716214254AEE4429B1A970C8B', entity_culture: 'en' }] },
      })
    );

    expect(res.status).to.equal(200);
    expect(revalidateTagStub.calledOnce).to.equal(true);
  });

  it('should return 401 when secret is configured but header is missing', async () => {
    process.env.SITECORE_REVALIDATE_SECRET = 'expected';
    const handler = module.createSitecoreRevalidateRouteHandler();
    const res = await handler.POST(
      createReq({
        body: { updates: [{ identifier: '71B0BA0716214254AEE4429B1A970C8B', entity_culture: 'en' }] },
      })
    );

    expect(res.status).to.equal(401);
    expect(revalidateTagStub.called).to.equal(false);
  });

  it('should return 401 when secret is configured but header does not match', async () => {
    process.env.SITECORE_REVALIDATE_SECRET = 'expected';
    const handler = module.createSitecoreRevalidateRouteHandler();
    const res = await handler.POST(
      createReq({
        headers: { 'x-revalidate-secret': 'wrong' },
        body: { updates: [{ identifier: '71B0BA0716214254AEE4429B1A970C8B', entity_culture: 'en' }] },
      })
    );

    expect(res.status).to.equal(401);
    expect(revalidateTagStub.called).to.equal(false);
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

  it('should not touch dictionary tags for a non-dictionary update, even when sites is configured', async () => {
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
    expect(revalidateTagStub.calledOnce).to.equal(true);
    expect(revalidateTagStub.firstCall.args[0]).to.equal(
      'sc:item:71b0ba0716214254aee4429b1a970c8b:en'
    );
  });

  it('should resolve a Dictionary entry update to that site\'s dictionary tag only', async () => {
    process.env.SITECORE_REVALIDATE_SECRET = 'expected';
    const handler = module.createSitecoreRevalidateRouteHandler({
      defaultLocale: 'en',
      sites: [
        { name: 'new-testing-site-mn', hostName: 'localhost', language: 'en' },
        { name: 'other-site', hostName: 'localhost', language: 'en' },
      ],
    });
    const res = await handler.POST(
      createReq({
        headers: { 'x-revalidate-secret': 'expected' },
        body: {
          updates: [
            {
              identifier: 'new-testing-site-mn-1a1905a154414da3883fd9ca7074b128-test 5555-en-gb',
              entity_definition: 'DictionaryEntry',
              operation: 'Update',
              entity_culture: 'en-GB',
            },
          ],
        },
      })
    );

    expect(res.status).to.equal(200);
    expect(revalidateTagStub.calledOnce).to.equal(true);
    expect(revalidateTagStub.firstCall.args[0]).to.equal('sc:dict:new-testing-site-mn:en-gb');
  });

  it('should skip a Dictionary entry update when no configured site matches the identifier', async () => {
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
              identifier: 'unknown-site-1a1905a154414da3883fd9ca7074b128-test 5555-en-gb',
              entity_definition: 'DictionaryEntry',
              entity_culture: 'en-GB',
            },
          ],
        },
      })
    );

    expect(res.status).to.equal(400);
    expect(revalidateTagStub.called).to.equal(false);
  });
});
