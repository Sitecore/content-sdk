import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
const proxyquireNoCallThru = proxyquire.noCallThru();

describe('createRevalidateRouteHandler', () => {
  const sandbox = sinon.createSandbox();

  let revalidateTagStub: sinon.SinonStub;
  let nextResponseJsonStub: sinon.SinonStub;
  let module: any;

  const createReq = (params: {
    headers?: Record<string, string>;
    body?: unknown;
    jsonThrows?: boolean;
  }) => {
    const { headers = {}, body = {}, jsonThrows = false } = params;
    return {
      headers: new Headers(headers),
      json: async () => {
        if (jsonThrows) throw new Error('bad-json');
        return body;
      },
    } as any;
  };

  beforeEach(() => {
    revalidateTagStub = sandbox.stub();
    nextResponseJsonStub = sandbox.stub().callsFake((body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      body,
    }));

    module = proxyquireNoCallThru('./revalidate-route-handler', {
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

  it('should return 500 when secret is not configured', async () => {
    const handler = module.createRevalidateRouteHandler();
    const res = await handler.POST(createReq({}));

    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ error: 'SITECORE_REVALIDATE_SECRET is not configured.' });
  });

  it('should return 401 when secret is invalid', async () => {
    process.env.SITECORE_REVALIDATE_SECRET = 'expected';
    const handler = module.createRevalidateRouteHandler();
    const res = await handler.POST(
      createReq({
        headers: { 'x-revalidate-secret': 'invalid' },
      })
    );

    expect(res.status).to.equal(401);
    expect(res.body).to.deep.equal({ error: 'Unauthorized.' });
  });

  it('should return 400 when request body is invalid JSON', async () => {
    process.env.SITECORE_REVALIDATE_SECRET = 'expected';
    const handler = module.createRevalidateRouteHandler();
    const res = await handler.POST(
      createReq({
        headers: { 'x-revalidate-secret': 'expected' },
        jsonThrows: true,
      })
    );

    expect(res.status).to.equal(400);
    expect(res.body).to.deep.equal({ error: 'Request body must be valid JSON.' });
  });

  it('should return 400 when no tags are provided', async () => {
    process.env.SITECORE_REVALIDATE_SECRET = 'expected';
    const handler = module.createRevalidateRouteHandler();
    const res = await handler.POST(
      createReq({
        headers: { 'x-revalidate-secret': 'expected' },
        body: {},
      })
    );

    expect(res.status).to.equal(400);
    expect(res.body).to.deep.equal({
      error: 'Provide a non-empty `tag` or `tags` in the request body.',
    });
  });

  it('should revalidate a single tag and return 200', async () => {
    process.env.SITECORE_REVALIDATE_SECRET = 'expected';
    const handler = module.createRevalidateRouteHandler();
    const res = await handler.POST(
      createReq({
        headers: { 'x-revalidate-secret': 'expected' },
        body: { tag: 'sc:route:site:en:_' },
      })
    );

    expect(revalidateTagStub.calledOnceWithExactly('sc:route:site:en:_', 'max')).to.equal(true);
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({
      revalidated: true,
      tags: ['sc:route:site:en:_'],
    });
  });

  it('should dedupe tags and trim whitespace', async () => {
    process.env.SITECORE_REVALIDATE_SECRET = 'expected';
    const handler = module.createRevalidateRouteHandler();
    const res = await handler.POST(
      createReq({
        headers: { 'x-revalidate-secret': 'expected' },
        body: {
          tags: ['  sc:dict:site:en  ', 'sc:dict:site:en', 'sc:route:site:en:_'],
        },
      })
    );

    expect(revalidateTagStub.callCount).to.equal(2);
    expect(revalidateTagStub.firstCall.args).to.deep.equal(['sc:dict:site:en', 'max']);
    expect(revalidateTagStub.secondCall.args).to.deep.equal(['sc:route:site:en:_', 'max']);
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({
      revalidated: true,
      tags: ['sc:dict:site:en', 'sc:route:site:en:_'],
    });
  });
});
