import { expect } from 'chai';
import sinon from 'sinon';
import { initMiddleware, MiddlewareInitOptions } from './init-middleware';
import { resetInitState, isInitialized, getInitState } from '@sitecore-content-sdk/core';
import { SitecoreConfig } from '../config';

// Mock Next.js types
interface MockNextRequest {
  cookies: {
    get: (name: string) => { value: string } | undefined;
  };
  headers: {
    get: (name: string) => string | null;
  };
  nextUrl: {
    pathname: string;
    searchParams: URLSearchParams;
  };
}

interface MockNextResponse {
  cookies: {
    set: (name: string, value: string, options?: unknown) => void;
    delete: (name: string) => void;
  };
  headers: {
    set: (name: string, value: string) => void;
  };
}

describe('initMiddleware', () => {
  let mockConfig: SitecoreConfig;
  let mockRequest: MockNextRequest;
  let mockResponse: MockNextResponse;

  beforeEach(() => {
    resetInitState();

    mockConfig = {
      api: {
        edge: {
          contextId: 'test-context-id',
          clientContextId: 'test-client-id',
          edgeUrl: 'https://edge.example.com',
        },
        local: {
          apiKey: '',
          apiHost: '',
          path: '/sitecore/api/graph/edge',
        },
      },
      defaultSite: 'test-site',
      defaultLanguage: 'en',
      editingSecret: 'secret',
      retries: { count: 3, retryStrategy: {} },
      redirects: { enabled: true, locales: ['en'] },
      multisite: { enabled: true, useCookieResolution: () => false },
      personalize: {
        enabled: true,
        edgeTimeout: 400,
        cdpTimeout: 400,
        scope: '',
        channel: 'WEB',
        currency: 'USD',
      },
      layout: { formatLayoutQuery: null },
      dictionary: { caching: { enabled: true, timeout: 60 } },
      disableCodeGeneration: false,
      generateStaticPaths: true,
      sitecoreInternalEditingHostUrl: '',
    } as SitecoreConfig;

    mockRequest = {
      cookies: {
        get: sinon.stub().returns(undefined),
      },
      headers: {
        get: sinon.stub().returns(null),
      },
      nextUrl: {
        pathname: '/test/path',
        searchParams: new URLSearchParams('foo=bar'),
      },
    };

    mockResponse = {
      cookies: {
        set: sinon.stub(),
        delete: sinon.stub(),
      },
      headers: {
        set: sinon.stub(),
      },
    };
  });

  afterEach(() => {
    resetInitState();
    sinon.restore();
  });

  it('should initialize SDK with middleware environment', async () => {
    await initMiddleware({
      config: mockConfig,
      request: mockRequest as unknown as MiddlewareInitOptions['request'],
      response: mockResponse as unknown as MiddlewareInitOptions['response'],
    });

    expect(isInitialized()).to.be.true;
  });

  it('should provide getCookie from request', async () => {
    (mockRequest.cookies.get as sinon.SinonStub)
      .withArgs('test-cookie')
      .returns({ value: 'cookie-value' });

    let capturedEnv: unknown;

    await initMiddleware({
      config: mockConfig,
      request: mockRequest as unknown as MiddlewareInitOptions['request'],
      response: mockResponse as unknown as MiddlewareInitOptions['response'],
      plugins: [
        {
          name: 'test-plugin',
          init: (ctx) => {
            capturedEnv = ctx.environment;
          },
        },
      ],
    });

    const env = capturedEnv as { getCookie: (name: string) => string | undefined };
    expect(env.getCookie('test-cookie')).to.equal('cookie-value');
  });

  it('should provide setCookie to response', async () => {
    let capturedEnv: unknown;

    await initMiddleware({
      config: mockConfig,
      request: mockRequest as unknown as MiddlewareInitOptions['request'],
      response: mockResponse as unknown as MiddlewareInitOptions['response'],
      plugins: [
        {
          name: 'test-plugin',
          init: (ctx) => {
            capturedEnv = ctx.environment;
          },
        },
      ],
    });

    const env = capturedEnv as {
      setCookie: (name: string, value: string, options?: unknown) => void;
    };
    env.setCookie('new-cookie', 'new-value', { path: '/' });

    expect(
      (mockResponse.cookies.set as sinon.SinonStub).calledWith('new-cookie', 'new-value', {
        path: '/',
      })
    ).to.be.true;
  });

  it('should provide getHeader from request', async () => {
    (mockRequest.headers.get as sinon.SinonStub)
      .withArgs('x-custom-header')
      .returns('header-value');

    let capturedEnv: unknown;

    await initMiddleware({
      config: mockConfig,
      request: mockRequest as unknown as MiddlewareInitOptions['request'],
      response: mockResponse as unknown as MiddlewareInitOptions['response'],
      plugins: [
        {
          name: 'test-plugin',
          init: (ctx) => {
            capturedEnv = ctx.environment;
          },
        },
      ],
    });

    const env = capturedEnv as { getHeader: (name: string) => string | undefined };
    expect(env.getHeader('x-custom-header')).to.equal('header-value');
  });

  it('should provide getPathname from request', async () => {
    let capturedEnv: unknown;

    await initMiddleware({
      config: mockConfig,
      request: mockRequest as unknown as MiddlewareInitOptions['request'],
      response: mockResponse as unknown as MiddlewareInitOptions['response'],
      plugins: [
        {
          name: 'test-plugin',
          init: (ctx) => {
            capturedEnv = ctx.environment;
          },
        },
      ],
    });

    const env = capturedEnv as { getPathname: () => string };
    expect(env.getPathname()).to.equal('/test/path');
  });

  it('should allow custom environment handlers to override defaults', async () => {
    const customGetCookie = sinon.stub().returns('custom-value');

    let capturedEnv: unknown;

    await initMiddleware({
      config: mockConfig,
      request: mockRequest as unknown as MiddlewareInitOptions['request'],
      response: mockResponse as unknown as MiddlewareInitOptions['response'],
      environment: {
        getCookie: customGetCookie,
      },
      plugins: [
        {
          name: 'test-plugin',
          init: (ctx) => {
            capturedEnv = ctx.environment;
          },
        },
      ],
    });

    const env = capturedEnv as { getCookie: (name: string) => string | undefined };
    expect(env.getCookie('any-cookie')).to.equal('custom-value');
    expect(customGetCookie.calledWith('any-cookie')).to.be.true;
  });

  it('should store environment in init state', async () => {
    await initMiddleware({
      config: mockConfig,
      request: mockRequest as unknown as MiddlewareInitOptions['request'],
      response: mockResponse as unknown as MiddlewareInitOptions['response'],
    });

    const state = getInitState();
    expect(state.environment).to.exist;
    expect(state.environment.getCookie).to.be.a('function');
    expect(state.environment.setCookie).to.be.a('function');
    expect(state.environment.getHeader).to.be.a('function');
    expect(state.environment.getPathname).to.be.a('function');
  });
});

