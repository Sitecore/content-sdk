/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Component } from '@angular/core';
import { EditMode } from '@sitecore-content-sdk/content/layout';
import { createEditingConfigMiddleware } from './editing-config-middleware';
import type { ExpressRequest, ExpressResponse } from './models';
import type { ComponentMap } from '../../components/types';

@Component({ selector: 'test-a', template: '' })
class TestAComponent {}

@Component({ selector: 'test-b', template: '' })
class TestBComponent {}

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

describe('createEditingConfigMiddleware', () => {
  const components: ComponentMap = new Map([
    ['ComponentA', TestAComponent],
    ['ComponentB', TestBComponent],
  ]);
  const metadata = { packages: { '@sitecore-content-sdk/angular': '1.0.0' } };
  const next = vi.fn();

  beforeEach(() => {
    next.mockClear();
    delete process.env.SITECORE_EDITING_SECRET;
  });

  afterEach(() => {
    delete process.env.SITECORE_EDITING_SECRET;
  });

  it('passes through when path does not match', async () => {
    const middleware = createEditingConfigMiddleware({ components, metadata });
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/not-it',
      url: '/api/not-it',
      body: undefined,
      query: {},
    };
    const res = createMockRes();
    await middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('rejects 401 when origin is not allowed', async () => {
    const middleware = createEditingConfigMiddleware({
      components,
      metadata,
      editingSecret: 's',
    });
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/editing/config',
      url: '/api/editing/config?secret=s',
      body: undefined,
      query: { secret: 's' },
      headers: { origin: 'https://evil.example' },
    };
    const res = createMockRes();
    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid origin' });
  });

  it('rejects 401 when secret is invalid', async () => {
    const middleware = createEditingConfigMiddleware({
      components,
      metadata,
      editingSecret: 'correct',
    });
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/editing/config',
      url: '/api/editing/config?secret=wrong',
      body: undefined,
      query: { secret: 'wrong' },
      headers: { origin: 'https://pages.sitecorecloud.io' },
    };
    const res = createMockRes();
    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing or invalid editing secret' });
  });

  it('responds 204 on OPTIONS preflight', async () => {
    const middleware = createEditingConfigMiddleware({
      components,
      metadata,
      editingSecret: 's',
    });
    const req: ExpressRequest = {
      method: 'OPTIONS',
      path: '/api/editing/config',
      url: '/api/editing/config?secret=s',
      body: undefined,
      query: { secret: 's' },
      headers: { origin: 'https://pages.sitecorecloud.io' },
    };
    const res = createMockRes();
    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledWith(null);
  });

  it('responds 200 with components / packages / editMode for valid GET', async () => {
    const middleware = createEditingConfigMiddleware({
      components,
      metadata,
      editingSecret: 's',
    });
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/editing/config',
      url: '/api/editing/config?secret=s',
      body: undefined,
      query: { secret: 's' },
      headers: { origin: 'https://pages.sitecorecloud.io' },
    };
    const res = createMockRes();
    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      components: ['ComponentA', 'ComponentB'],
      packages: expect.objectContaining({ ...metadata.packages }),
      editMode: EditMode.Metadata,
    });
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', expect.any(String));
  });

  it('falls back to SITECORE_EDITING_SECRET env when option omitted', async () => {
    process.env.SITECORE_EDITING_SECRET = 'env-secret';
    const middleware = createEditingConfigMiddleware({ components, metadata });
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/editing/config',
      url: '/api/editing/config?secret=env-secret',
      body: undefined,
      query: { secret: 'env-secret' },
      headers: { origin: 'https://pages.sitecorecloud.io' },
    };
    const res = createMockRes();
    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('responds with empty packages when neither metadata nor metadataImport is provided', async () => {
    const middleware = createEditingConfigMiddleware({
      components,
      editingSecret: 's',
    });
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/editing/config',
      url: '/api/editing/config?secret=s',
      body: undefined,
      query: { secret: 's' },
      headers: { origin: 'https://pages.sitecorecloud.io' },
    };
    const res = createMockRes();
    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      components: ['ComponentA', 'ComponentB'],
      packages: {},
      editMode: EditMode.Metadata,
    });
  });

  it('loads packages from metadataImport when inline metadata is omitted', async () => {
    const middleware = createEditingConfigMiddleware({
      components,
      editingSecret: 's',
      metadataImport: async () => ({
        packages: { '@sitecore-content-sdk/angular': '2.0.0' },
      }),
    });
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/editing/config',
      url: '/api/editing/config?secret=s',
      body: undefined,
      query: { secret: 's' },
      headers: { origin: 'https://pages.sitecorecloud.io' },
    };
    const res = createMockRes();
    await middleware(req, res, next);
    expect(res.json).toHaveBeenCalledWith({
      components: ['ComponentA', 'ComponentB'],
      packages: { '@sitecore-content-sdk/angular': '2.0.0' },
      editMode: EditMode.Metadata,
    });
  });

  it('falls back to empty packages when metadataImport fails', async () => {
    const middleware = createEditingConfigMiddleware({
      components,
      editingSecret: 's',
      metadataImport: async () => {
        throw new Error('ENOENT');
      },
    });
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/editing/config',
      url: '/api/editing/config?secret=s',
      body: undefined,
      query: { secret: 's' },
      headers: { origin: 'https://pages.sitecorecloud.io' },
    };
    const res = createMockRes();
    await middleware(req, res, next);
    expect(res.json).toHaveBeenCalledWith({
      components: ['ComponentA', 'ComponentB'],
      packages: {},
      editMode: EditMode.Metadata,
    });
  });
});
