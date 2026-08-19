/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createExperimentalFeaturesMiddleware } from './experimental-features-middleware';
import type { ExpressRequest, ExpressResponse } from './models';
import experimentalFeaturesCatalog from '../../experimental.json';

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

describe('createExperimentalFeaturesMiddleware', () => {
  const next = vi.fn();

  beforeEach(() => {
    next.mockClear();
    delete process.env.SITECORE_EDITING_SECRET;
    delete process.env.CSDK_EXPERIMENTAL_DUMMY_FEATURE;
    delete process.env.CSDK_EXPERIMENTAL_DUMMY_FEATURE_TWO;
  });

  afterEach(() => {
    delete process.env.SITECORE_EDITING_SECRET;
    delete process.env.CSDK_EXPERIMENTAL_DUMMY_FEATURE;
    delete process.env.CSDK_EXPERIMENTAL_DUMMY_FEATURE_TWO;
  });

  it('passes through when path does not match', async () => {
    const middleware = createExperimentalFeaturesMiddleware();
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
    process.env.SITECORE_EDITING_SECRET = 's';
    const middleware = createExperimentalFeaturesMiddleware();
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/editing/experimental',
      url: '/api/editing/experimental?secret=s',
      body: undefined,
      query: { secret: 's' },
      headers: { origin: 'https://evil.example' },
    };
    const res = createMockRes();
    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid origin' });
  });

  it('rejects 401 when secret is missing', async () => {
    process.env.JSS_ALLOWED_ORIGINS = 'https://allowed.com';
    process.env.SITECORE_EDITING_SECRET = 's';
    const middleware = createExperimentalFeaturesMiddleware();
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/editing/experimental',
      url: '/api/editing/experimental',
      body: undefined,
      query: {},
      headers: { origin: 'https://allowed.com' },
    };
    const res = createMockRes();
    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing or invalid editing secret' });
  });

  it('returns package catalog feature statuses for valid request', async () => {
    process.env.JSS_ALLOWED_ORIGINS = 'https://allowed.com';
    process.env.SITECORE_EDITING_SECRET = 's';
    process.env.CSDK_EXPERIMENTAL_DUMMY_FEATURE = 'true';
    const middleware = createExperimentalFeaturesMiddleware();
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/editing/experimental',
      url: '/api/editing/experimental?secret=s',
      body: undefined,
      query: { secret: 's' },
      headers: { origin: 'https://allowed.com' },
    };
    const res = createMockRes();
    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      features: [
        {
          ...experimentalFeaturesCatalog[0],
          enabled: true,
        },
        {
          ...experimentalFeaturesCatalog[1],
          enabled: false,
        },
      ],
    });
  });
});
