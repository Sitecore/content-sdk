import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { LoaderFn } from '../loaders/models';
import { NotFoundNavigationError, LoaderHttpError } from '../loaders/models';
import { createLoaderDataServiceMiddleware } from './loader-data-service-middleware';
import { LOADER_DATA_ENDPOINT } from './constants';
import { EXTRACT_REQUEST_CONTEXT_TOKEN } from './models';
import type { LoaderRegistry } from './models';

function createMockRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };
}

function createMockNext() {
  return vi.fn();
}

describe('createLoaderDataServiceMiddleware', () => {
  const endpoint = LOADER_DATA_ENDPOINT;

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        { provide: EXTRACT_REQUEST_CONTEXT_TOKEN, useValue: () => ({}) },
      ],
    });
  });

  function createMiddleware(opts: {
    loaders: LoaderRegistry;
    endpoint?: string;
  }) {
    const extractReq = TestBed.inject(EXTRACT_REQUEST_CONTEXT_TOKEN);
    return createLoaderDataServiceMiddleware({
      ...opts,
      endpoint: opts.endpoint ?? endpoint,
      extractRequestContext: extractReq,
    });
  }

  it('should handle POST request', async () => {
    const mockLoader = vi.fn().mockResolvedValue({ title: 'Home' }) as LoaderFn;
    const middleware = createMiddleware({
      loaders: { page: mockLoader },
      endpoint,
    });
    const req = {
      method: 'POST',
      path: endpoint,
      body: { loaderId: 'page', url: '/', params: {}, query: {} },
      query: {},
    };
    const res = createMockRes();
    const next = createMockNext();

    await middleware(req as any, res as any, next);

    expect(next).not.toHaveBeenCalled();
    expect(mockLoader).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/',
        params: {},
        query: {},
        requestContext: expect.any(Object),
      })
    );
    expect(res.json).toHaveBeenCalledWith({
      kind: 'data',
      data: { title: 'Home' },
    });
  });

  it('should handle GET request', async () => {
    const mockLoader = vi.fn().mockResolvedValue({ id: '1' }) as LoaderFn;
    const middleware = createMiddleware({
      loaders: { page: mockLoader },
      endpoint,
    });
    const req = {
      method: 'GET',
      path: endpoint,
      body: undefined,
      query: { loaderId: 'page', url: '/about', q: 'search' },
    };
    const res = createMockRes();
    const next = createMockNext();

    await middleware(req as any, res as any, next);

    expect(next).not.toHaveBeenCalled();
    expect(mockLoader).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/about',
        params: {},
        query: { q: 'search' },
      })
    );
    expect(res.json).toHaveBeenCalledWith({
      kind: 'data',
      data: { id: '1' },
    });
  });

  it('should reject other request types', async () => {
    const mockLoader = vi.fn() as LoaderFn;
    const middleware = createMiddleware({
      loaders: { page: mockLoader },
      endpoint,
    });
    const req = {
      method: 'PUT',
      path: endpoint,
      body: {},
      query: {},
    };
    const res = createMockRes();
    const next = createMockNext();

    await middleware(req as any, res as any, next);

    expect(next).not.toHaveBeenCalled();
    expect(mockLoader).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({
      kind: 'error',
      status: 405,
      message: 'Method not allowed',
    });
  });

  it('should handle redirect data', async () => {
    const mockLoader = vi.fn().mockResolvedValue({
      loaderRedirectTarget: '/other-page',
      status: 302,
    }) as LoaderFn;
    const middleware = createMiddleware({
      loaders: { page: mockLoader },
      endpoint,
    });
    const req = {
      method: 'POST',
      path: endpoint,
      body: { loaderId: 'page', url: '/redirect-me', params: {}, query: {} },
      query: {},
    };
    const res = createMockRes();
    const next = createMockNext();

    await middleware(req as any, res as any, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      kind: 'redirect',
      redirect: {
        loaderRedirectTarget: '/other-page',
        status: 302,
      },
    });
  });

  it('should handle basic data', async () => {
    const mockLoader = vi.fn().mockResolvedValue({ items: [1, 2, 3] }) as LoaderFn;
    const middleware = createMiddleware({
      loaders: { page: mockLoader },
      endpoint,
    });
    const req = {
      method: 'POST',
      path: endpoint,
      body: { loaderId: 'page', url: '/list', params: {}, query: {} },
      query: {},
    };
    const res = createMockRes();
    const next = createMockNext();

    await middleware(req as any, res as any, next);

    expect(res.json).toHaveBeenCalledWith({
      kind: 'data',
      data: { items: [1, 2, 3] },
    });
  });

  it('should handle loader error', async () => {
    const mockLoader = vi
      .fn()
      .mockRejectedValue(new LoaderHttpError(503, 'Service unavailable')) as LoaderFn;
    const middleware = createMiddleware({
      loaders: { page: mockLoader },
      endpoint,
    });
    const req = {
      method: 'POST',
      path: endpoint,
      body: { loaderId: 'page', url: '/', params: {}, query: {} },
      query: {},
    };
    const res = createMockRes();
    const next = createMockNext();

    await middleware(req as any, res as any, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      kind: 'error',
      status: 503,
      message: 'Service unavailable',
    });
  });

  it('should handle loader not found error', async () => {
    const mockLoader = vi.fn().mockRejectedValue(new NotFoundNavigationError()) as LoaderFn;
    const middleware = createMiddleware({
      loaders: { page: mockLoader },
      endpoint,
    });
    const req = {
      method: 'POST',
      path: endpoint,
      body: { loaderId: 'page', url: '/missing', params: {}, query: {} },
      query: {},
    };
    const res = createMockRes();
    const next = createMockNext();

    await middleware(req as any, res as any, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      kind: 'notFound',
      status: 404,
    });
  });

  it('should return notFound when loader id is not in registry', async () => {
    const middleware = createMiddleware({
      loaders: { page: vi.fn() as LoaderFn },
      endpoint,
    });
    const req = {
      method: 'POST',
      path: endpoint,
      body: { loaderId: 'unknownLoader', url: '/', params: {}, query: {} },
      query: {},
    };
    const res = createMockRes();
    const next = createMockNext();

    await middleware(req as any, res as any, next);

    expect(res.json).toHaveBeenCalledWith({
      kind: 'notFound',
      status: 404,
    });
  });

  it('should call next when path does not match endpoint', async () => {
    const middleware = createMiddleware({
      loaders: { page: vi.fn() as LoaderFn },
      endpoint,
    });
    const req = {
      method: 'POST',
      path: '/other-path',
      body: {},
      query: {},
    };
    const res = createMockRes();
    const next = createMockNext();

    await middleware(req as any, res as any, next);

    expect(next).toHaveBeenCalledWith();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return 400 when POST body missing loaderId', async () => {
    const middleware = createMiddleware({
      loaders: { page: vi.fn() as LoaderFn },
      endpoint,
    });
    const req = {
      method: 'POST',
      path: endpoint,
      body: { url: '/', params: {}, query: {} },
      query: {},
    };
    const res = createMockRes();
    const next = createMockNext();

    await middleware(req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      kind: 'error',
      status: 400,
      message: 'Missing loaderId',
    });
  });
});
