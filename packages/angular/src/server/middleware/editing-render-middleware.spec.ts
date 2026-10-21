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

  it('should pass through when path does not match', async () => {
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

  it('should reject 401 when origin is not allowed', async () => {
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

  it('should respond 204 on OPTIONS preflight', async () => {
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

  it('should reject 401 when secret is invalid', async () => {
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

  it('should reject 405 on non-GET methods', async () => {
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

  it('should reject 400 when required params are missing', async () => {
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

  it('should rewrite req.url, attach scEditing, set header + CSP, and call next', async () => {
    const middleware = createEditingRenderMiddleware({ editingSecret: 's' });
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/editing/render',
      url: '/api/editing/render?secret=s&route=/about',
      body: undefined,
      query: baseQuery({ sc_variant: 'v1', sc_version: '3', sc_layoutKind: 'final' }),
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
    expect(editingReq.method).toBe('GET');
    expect(editingReq.scEditing).toEqual({
      site: 'demo',
      itemId: '11111111-1111-1111-1111-111111111111',
      language: 'en',
      mode: 'edit',
      variantId: 'v1',
      version: '3',
      layoutKind: 'final',
    });
    expect(editingReq.headers![EDITING_PARAMS_HEADER]).toBeTypeOf('string');
    expect(JSON.parse(editingReq.headers![EDITING_PARAMS_HEADER] as string).variantId).toEqual(
      'v1'
    );
    expect(next).toHaveBeenCalled();
  });

  it('should apply resolvePageUrl override', async () => {
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

  it('should apply resolvePageUrl override with language', async () => {
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

  it('should encode the rewritten route', async () => {
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

  it('should fall back to SITECORE_EDITING_SECRET env when option omitted', async () => {
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

  it('should include previewTime in editing params when sc_previewTime is present in query params', async () => {
    const middleware = createEditingRenderMiddleware({ editingSecret: 's' });
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/editing/render',
      url: '/api/editing/render',
      body: undefined,
      query: baseQuery({ sc_previewTime: '2024-12-25T10:00:00Z' }),
      headers: baseHeaders(),
    };
    const res = createMockRes();
    await middleware(req, res, next);

    const editingReq = req as ExpressEditingRequest;
    expect(editingReq.scEditing).toHaveProperty('previewTime', '2024-12-25T10:00:00Z');
    // Verify previewTime is included in the EDITING_PARAMS_HEADER JSON, which flows to Edge GraphQL
    const editingParams = JSON.parse(editingReq.headers![EDITING_PARAMS_HEADER] as string);
    expect(editingParams).toHaveProperty('previewTime', '2024-12-25T10:00:00Z');
    expect(next).toHaveBeenCalled();
  });

  it('should not include previewTime in editing params when sc_previewTime is absent', async () => {
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

    const editingReq = req as ExpressEditingRequest;
    expect(editingReq.scEditing).not.toHaveProperty('previewTime');
    // Verify previewTime is absent from the EDITING_PARAMS_HEADER JSON
    const editingParams = JSON.parse(editingReq.headers![EDITING_PARAMS_HEADER] as string);
    expect(editingParams).not.toHaveProperty('previewTime');
    expect(next).toHaveBeenCalled();
  });

  // ─── Design Library ──────────────────────────────────────────────────────
  function dlQuery(overrides: Record<string, string> = {}): Record<string, string> {
    return {
      secret: 's',
      sc_site: 'demo',
      sc_itemid: '11111111-1111-1111-1111-111111111111',
      sc_lang: 'en',
      sc_uid: 'component-uid-1',
      mode: 'library',
      ...overrides,
    };
  }

  it('should build DesignLibraryRenderPreviewData from sc_uid for a library-mode request', async () => {
    const middleware = createEditingRenderMiddleware({ editingSecret: 's' });
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/editing/render',
      url: '/api/editing/render',
      body: undefined,
      query: dlQuery(),
      headers: baseHeaders(),
    };
    const res = createMockRes();
    await middleware(req, res, next);

    const editingReq = req as ExpressEditingRequest;
    expect(editingReq.scEditing).toEqual({
      site: 'demo',
      itemId: '11111111-1111-1111-1111-111111111111',
      componentUid: 'component-uid-1',
      language: 'en',
      mode: 'library',
    });
    // No `route` for Design Library: URL rewrites to the localized root.
    expect(editingReq.url).toBe('/en/');
    expect(next).toHaveBeenCalled();
  });

  it('should not require route for a Design Library request', async () => {
    const middleware = createEditingRenderMiddleware({ editingSecret: 's' });
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/editing/render',
      url: '/api/editing/render',
      body: undefined,
      // no `route`, no `sc_variant`
      query: dlQuery(),
      headers: baseHeaders(),
    };
    const res = createMockRes();
    await middleware(req, res, next);
    expect(res.status).not.toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalled();
  });

  it('should reject a Design Library request missing sc_uid with 400', async () => {
    const middleware = createEditingRenderMiddleware({ editingSecret: 's' });
    const { sc_uid, ...withoutUid } = dlQuery();
    void sc_uid;
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/editing/render',
      url: '/api/editing/render',
      body: undefined,
      query: withoutUid,
      headers: baseHeaders(),
    };
    const res = createMockRes();
    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('should include generation in preview data for library-metadata variant generation', async () => {
    const middleware = createEditingRenderMiddleware({ editingSecret: 's' });
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/editing/render',
      url: '/api/editing/render',
      body: undefined,
      query: dlQuery({
        mode: 'library-metadata',
        generation: 'variant',
        sc_renderingId: 'rendering-1',
        dataSourceId: 'ds-1',
        sc_version: '2',
      }),
      headers: baseHeaders(),
    };
    const res = createMockRes();
    await middleware(req, res, next);

    const editingReq = req as ExpressEditingRequest;
    expect(editingReq.scEditing).toEqual({
      site: 'demo',
      itemId: '11111111-1111-1111-1111-111111111111',
      componentUid: 'component-uid-1',
      language: 'en',
      mode: 'library-metadata',
      renderingId: 'rendering-1',
      dataSourceId: 'ds-1',
      version: '2',
      generation: 'variant',
    });
    const editingParams = JSON.parse(editingReq.headers![EDITING_PARAMS_HEADER] as string);
    expect(editingParams.generation).toBe('variant');
    expect(next).toHaveBeenCalled();
  });
});
