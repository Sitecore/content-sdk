/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createEditingRenderMiddleware,
  type ExpressEditingRequest,
} from './editing-render-middleware';
import type { ExpressRequest, ExpressResponse } from './models';
import { EDITING_PARAMS_HEADER } from '../../editing/constants';

function createMockRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
    send: vi.fn(),
    setHeader: vi.fn(),
  } as unknown as ExpressResponse & {
    status: ReturnType<typeof vi.fn>;
    json: ReturnType<typeof vi.fn>;
    send: ReturnType<typeof vi.fn>;
    setHeader: ReturnType<typeof vi.fn>;
  };
}

function baseQuery(overrides: Record<string, string> = {}): Record<string, string> {
  return {
    secret: 's',
    sc_site: 'demo',
    sc_itemid: '11111111-1111-1111-1111-111111111111',
    sc_lang: 'en',
    route: '/about',
    mode: 'edit',
    ...overrides,
  };
}

function baseHeaders(): Record<string, string> {
  return { origin: 'https://pages.sitecorecloud.io' };
}

describe('createEditingRenderMiddleware', () => {
  const next = vi.fn();

  beforeEach(() => {
    next.mockClear();
    delete process.env.SITECORE_EDITING_SECRET;
  });

  afterEach(() => {
    delete process.env.SITECORE_EDITING_SECRET;
  });

  it('passes through when path does not match', async () => {
    const middleware = createEditingRenderMiddleware({ editingSecret: 's' });
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/elsewhere',
      url: '/api/elsewhere',
      body: undefined,
      query: {},
    };
    const res = createMockRes();
    await middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('rejects 401 when origin is not allowed', async () => {
    const middleware = createEditingRenderMiddleware({ editingSecret: 's' });
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/editing/render',
      url: '/api/editing/render',
      body: undefined,
      query: baseQuery(),
      headers: { origin: 'https://evil.example' },
    };
    const res = createMockRes();
    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('responds 204 on OPTIONS preflight', async () => {
    const middleware = createEditingRenderMiddleware({ editingSecret: 's' });
    const req: ExpressRequest = {
      method: 'OPTIONS',
      path: '/api/editing/render',
      url: '/api/editing/render',
      body: undefined,
      query: baseQuery(),
      headers: baseHeaders(),
    };
    const res = createMockRes();
    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledWith(null);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects 401 when secret is invalid', async () => {
    const middleware = createEditingRenderMiddleware({ editingSecret: 'good' });
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/editing/render',
      url: '/api/editing/render',
      body: undefined,
      query: baseQuery({ secret: 'bad' }),
      headers: baseHeaders(),
    };
    const res = createMockRes();
    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects 405 on non-GET methods', async () => {
    const middleware = createEditingRenderMiddleware({ editingSecret: 's' });
    const req: ExpressRequest = {
      method: 'POST',
      path: '/api/editing/render',
      url: '/api/editing/render',
      body: undefined,
      query: baseQuery(),
      headers: baseHeaders(),
    };
    const res = createMockRes();
    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'GET');
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects 400 when required params are missing', async () => {
    const middleware = createEditingRenderMiddleware({ editingSecret: 's' });
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/editing/render',
      url: '/api/editing/render',
      body: undefined,
      query: { secret: 's', mode: 'edit' },
      headers: baseHeaders(),
    };
    const res = createMockRes();
    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('rewrites req.url, attaches scEditing, sets header + CSP, and calls next', async () => {
    const middleware = createEditingRenderMiddleware({ editingSecret: 's' });
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/editing/render',
      url: '/api/editing/render?secret=s&route=/about',
      body: undefined,
      query: baseQuery({ sc_variant: 'v1,v2', sc_version: '3', sc_layoutKind: 'final' }),
      headers: baseHeaders(),
    };
    const res = createMockRes();
    await middleware(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Security-Policy',
      expect.stringContaining('frame-ancestors')
    );
    const editingReq = req as ExpressEditingRequest;
    expect(editingReq.url).toBe('/en/about');
    // @angular/ssr builds its Request from `originalUrl ?? url`, so this must be rewritten too
    // or the SSR engine renders the pre-rewrite /api/editing/render URL.
    expect(editingReq.originalUrl).toBe('/en/about');
    expect(editingReq.method).toBe('GET');
    expect(editingReq.scEditing).toEqual({
      site: 'demo',
      itemId: '11111111-1111-1111-1111-111111111111',
      language: 'en',
      mode: 'edit',
      variantIds: ['v1', 'v2'],
      version: '3',
      layoutKind: 'final',
    });
    expect(editingReq.headers![EDITING_PARAMS_HEADER]).toBeTypeOf('string');
    expect(JSON.parse(editingReq.headers![EDITING_PARAMS_HEADER] as string).variantIds).toEqual([
      'v1',
      'v2',
    ]);
    expect(next).toHaveBeenCalled();
  });

  it('applies resolvePageUrl override', async () => {
    const middleware = createEditingRenderMiddleware({
      editingSecret: 's',
      resolvePageUrl: (itemPath) => `/en${itemPath}`,
    });
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/editing/render',
      url: '/api/editing/render',
      body: undefined,
      query: baseQuery(),
      headers: baseHeaders(),
    };
    const res = createMockRes();
    await middleware(req, res, next);
    expect(req.url).toBe('/en/about');
    expect(next).toHaveBeenCalled();
  });

  it('applies resolvePageUrl override with language', async () => {
    const middleware = createEditingRenderMiddleware({
      editingSecret: 's',
      resolvePageUrl: (itemPath, previewData) => `/${previewData.language}${itemPath}`,
    });
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/editing/render',
      url: '/api/editing/render',
      body: undefined,
      query: baseQuery(),
      headers: baseHeaders(),
    };
    const res = createMockRes();
    await middleware(req, res, next);
    expect(req.url).toBe('/en/about');
    expect(next).toHaveBeenCalled();
  });

  it('should rewrite URL to route with language', async () => {
    const middleware = createEditingRenderMiddleware({ editingSecret: 's' });
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/editing/render',
      url: '/api/editing/render',
      body: undefined,
      query: baseQuery(),
      headers: baseHeaders(),
    };
    const res = createMockRes();
    await middleware(req, res, next);
    expect(req.url).toBe('/en/about');
    expect(next).toHaveBeenCalled();
  });

  it('encodes the rewritten route', async () => {
    const middleware = createEditingRenderMiddleware({ editingSecret: 's' });
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/editing/render',
      url: '/api/editing/render',
      body: undefined,
      query: baseQuery({ route: '/styleguide/section 2' }),
      headers: baseHeaders(),
    };
    const res = createMockRes();
    await middleware(req, res, next);
    expect(req.url).toBe('/en/styleguide/section%202');
  });

  it('falls back to SITECORE_EDITING_SECRET env when option omitted', async () => {
    process.env.SITECORE_EDITING_SECRET = 'env-s';
    const middleware = createEditingRenderMiddleware();
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/editing/render',
      url: '/api/editing/render',
      body: undefined,
      query: baseQuery({ secret: 'env-s' }),
      headers: baseHeaders(),
    };
    const res = createMockRes();
    await middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
