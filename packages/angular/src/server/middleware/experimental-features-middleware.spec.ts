/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createExperimentalFeaturesMiddleware } from './experimental-features-middleware';
import type { ExpressRequest, ExpressResponse } from './models';

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
  const features = [
    {
      idName: 'feature-one',
      displayName: 'Feature One',
      envVarName: 'CSDK_EXPERIMENTAL_FEATURE_ONE',
      description: 'First experimental feature',
    },
  ];

  beforeEach(() => {
    next.mockClear();
    delete process.env.SITECORE_EDITING_SECRET;
    delete process.env.CSDK_EXPERIMENTAL_FEATURE_ONE;
    delete process.env.CSDK_EXPERIMENTAL_DUMMY_FEATURE;
    delete process.env.CSDK_EXPERIMENTAL_DUMMY_FEATURE_TWO;
  });

  afterEach(() => {
    delete process.env.SITECORE_EDITING_SECRET;
    delete process.env.CSDK_EXPERIMENTAL_FEATURE_ONE;
    delete process.env.CSDK_EXPERIMENTAL_DUMMY_FEATURE;
    delete process.env.CSDK_EXPERIMENTAL_DUMMY_FEATURE_TWO;
  });

  it('passes through when path does not match', async () => {
    const middleware = createExperimentalFeaturesMiddleware({ features });
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
    const middleware = createExperimentalFeaturesMiddleware({
      features,
      editingSecret: 's',
    });
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
    const middleware = createExperimentalFeaturesMiddleware({
      features,
      editingSecret: 's',
    });
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

  it('returns feature statuses for valid request', async () => {
    process.env.JSS_ALLOWED_ORIGINS = 'https://allowed.com';
    process.env.CSDK_EXPERIMENTAL_FEATURE_ONE = 'true';
    const middleware = createExperimentalFeaturesMiddleware({
      features,
      editingSecret: 's',
    });
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
          ...features[0],
          enabled: true,
        },
      ],
    });
  });

  it('returns default shared catalog when features are not provided', async () => {
    process.env.JSS_ALLOWED_ORIGINS = 'https://allowed.com';
    process.env.CSDK_EXPERIMENTAL_DUMMY_FEATURE = '1';
    const middleware = createExperimentalFeaturesMiddleware({
      editingSecret: 's',
    });
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
          idName: 'dummy-feature',
          displayName: 'Dummy Feature',
          envVarName: 'CSDK_EXPERIMENTAL_DUMMY_FEATURE',
          description: 'Sample experimental feature used to verify the visibility API.',
          enabled: true,
        },
        {
          idName: 'dummy-feature-two',
          displayName: 'Dummy Feature Two',
          envVarName: 'CSDK_EXPERIMENTAL_DUMMY_FEATURE_TWO',
          description: 'Second sample experimental feature for API testing.',
          enabled: false,
        },
      ],
    });
  });
});
