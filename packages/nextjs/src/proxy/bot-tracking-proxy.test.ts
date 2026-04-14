/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-expressions */
/* eslint-disable dot-notation */
import chai, { use } from 'chai';
import chaiString from 'chai-string';
import sinonChai from 'sinon-chai';
import sinon, { spy } from 'sinon';
import { NextRequest, NextResponse } from 'next/server';
import proxyquire from 'proxyquire';
import debug from '../debug';

use(sinonChai);
const expect = chai.use(chaiString).expect;

const BOT_COOKIE = 'sc_bot';

const initContentSdkStub = sinon.stub().resolves();
const isBotStub = sinon.stub();
const botPageViewStub = sinon.stub().resolves();
const eventsPluginStub = sinon.stub().returns({});

const { BotTrackingProxy } = proxyquire('./bot-tracking-proxy', {
  '@sitecore-content-sdk/core': {
    initContentSdk: initContentSdkStub,
  },
  '@sitecore-content-sdk/events': {
    eventsPlugin: eventsPluginStub,
    botPageView: botPageViewStub,
  },
  '@sitecore-content-sdk/events/internal': {
    BOT_DETECTION_COOKIE: BOT_COOKIE,
    isBot: isBotStub,
  },
});

const hostname = 'foo.net';

const defaultConfig = {
  contextId: 'ctx-id',
  clientContextId: 'client-ctx',
  edgeUrl: 'https://edge.example',
  sites: [{ name: 'test-site', hostName: hostname, language: 'en' }],
};

const createRequest = (props: Record<string, unknown> = {}) => {
  const headerValues = (props.headerValues as Record<string, string>) || {};
  const req: Record<string, unknown> = {
    ...props,
    nextUrl: {
      pathname: '/styleguide',
      hostname: hostname,
      clone() {
        return Object.assign({}, req.nextUrl);
      },
      ...((props.nextUrl as object) || {}),
    },
    cookies: {
      get(cookieName: string) {
        const cookies = {
          ...((props.cookieValues as Record<string, string>) || {}),
        };
        return { value: cookies[cookieName] };
      },
      ...((props.cookies as object) || {}),
    },
    headers: {
      host: hostname,
      ...headerValues,
      get(key: string) {
        const h = req.headers as Record<string, string | undefined>;
        return h[key];
      },
    },
  };

  Object.defineProperties(req.headers, {
    set: {
      value: (key: string, value: string) => {
        (req.headers as Record<string, string>)[key] = value;
      },
      enumerable: false,
    },
    forEach: {
      value: (cb: (value: string, key: string, headers: object) => void) => {
        Object.keys(req.headers as object).forEach((key) => {
          if (key !== 'get' && key !== 'set' && key !== 'forEach') {
            cb((req.headers as Record<string, string>)[key], key, req.headers as object);
          }
        });
      },
      enumerable: false,
    },
  });

  return req as unknown as NextRequest;
};

const createResponse = (props: Record<string, unknown> = {}) => {
  const res: Record<string, unknown> = {
    cookies: {
      set(key: string, value: string, attributes?: Record<string, unknown>) {
        const jar = res.cookies as Record<string, unknown>;
        jar[key] = { value, ...attributes };
      },
      get(key: string) {
        const c = (res.cookies as Record<string, { value: string }>)[key] as
          | { value: string }
          | undefined;
        return c ? { value: c.value } : undefined;
      },
      ...((props.cookies as object) || {}),
    },
    headers: {
      ...((props.headers as object) || {}),
    },
    ...props,
  };

  Object.defineProperties(res.headers, {
    set: {
      value: (key: string, value: string) => {
        (res.headers as Record<string, string>)[key] = value;
      },
      enumerable: false,
    },
    get: {
      value: (key: string) => (res.headers as Record<string, string>)[key],
      enumerable: false,
    },
    forEach: {
      value: (cb: (value: string, key: string, headers: object) => void) => {
        Object.keys(res.headers as object).forEach((key) => {
          if (key !== 'get' && key !== 'set' && key !== 'forEach') {
            cb((res.headers as Record<string, string>)[key], key, res.headers as object);
          }
        });
      },
      enumerable: false,
    },
  });

  return res as unknown as NextResponse;
};

/**
 * Reads cookie entries stored by {@link createResponse} for assertions.
 * @param {import('next/server').NextResponse} res - Mock Next.js response
 * @returns Cookie name to attributes map from the mock `cookies.set` implementation
 */
function getCookieJar(
  res: NextResponse
): Record<string, { value: string; secure?: boolean; sameSite?: string; path?: string }> {
  return res.cookies as unknown as Record<
    string,
    { value: string; secure?: boolean; sameSite?: string; path?: string }
  >;
}

describe('BotTrackingProxy', () => {
  const debugSpy = spy(debug, 'common');
  const validateDebugLog = (message: string, ...params: unknown[]) => {
    expect(debugSpy.args.find((log) => log[0] === message)).to.deep.equal([message, ...params]);
  };
  const validateEndDebugObject = (message: string, params: Record<string, unknown>) => {
    const logParams = debugSpy.args.find((log) => log[0] === message) as unknown[] | undefined;
    expect(logParams?.[1]).to.deep.equal(params);
  };

  beforeEach(() => {
    isBotStub.reset();
    botPageViewStub.reset();
    initContentSdkStub.reset();
    eventsPluginStub.resetHistory();
    debugSpy.resetHistory();
    initContentSdkStub.resolves();
    botPageViewStub.resolves();
  });

  after(() => {
    debugSpy.restore();
  });

  const createProxy = (config: Record<string, unknown> = {}) =>
    new BotTrackingProxy({
      ...defaultConfig,
      ...config,
    } as import('./bot-tracking-proxy').BotTrackingProxyConfig);

  it('skips in local environment when NODE_ENV is development', async () => {
    isBotStub.returns(true);

    const env = process.env as Record<string, string | undefined>;
    const originalEnv = env.NODE_ENV;
    env.NODE_ENV = 'development';

    try {
      const req = createRequest({
        headerValues: { 'user-agent': 'Googlebot' },
      });
      const res = createResponse();
      const proxy = createProxy();

      const finalRes = await proxy.handle(req, res);

      validateDebugLog('bot tracking proxy skipped (local environment)');
      expect(isBotStub).to.not.have.been.called;
      expect(initContentSdkStub).to.not.have.been.called;
      expect(finalRes).to.equal(res);
    } finally {
      env.NODE_ENV = originalEnv;
    }
  });

  describe('skips in local environment when host is loopback', () => {
    ['localhost', '127.0.0.1', '::1', '[::1]'].forEach((host) => {
      it(`skips in local environment when host is ${host}`, async () => {
        isBotStub.returns(true);

        const req = createRequest({
          headerValues: {
            host,
            'user-agent': 'Googlebot',
          },
        });
        const res = createResponse();
        const proxy = createProxy();

        const finalRes = await proxy.handle(req, res);

        validateDebugLog('bot tracking proxy skipped (local environment)');
        expect(isBotStub).to.not.have.been.called;
        expect(initContentSdkStub).to.not.have.been.called;
        expect(botPageViewStub).to.not.have.been.called;
        expect(finalRes).to.equal(res);
      });
    });
  });

  it('skips when skip returns true', async () => {
    isBotStub.returns(true);
    const req = createRequest({
      headerValues: { 'user-agent': 'Googlebot' },
    });
    const res = createResponse();
    const skip = sinon.stub().returns(true);
    const proxy = createProxy({ skip });

    const finalRes = await proxy.handle(req, res);

    validateDebugLog('bot tracking proxy skipped (disabled)');
    expect(skip).to.have.been.calledOnceWith(req, res);
    expect(isBotStub).to.not.have.been.called;
    expect(initContentSdkStub).to.not.have.been.called;
    expect(finalRes).to.equal(res);
  });

  it('runs when skip returns false', async () => {
    isBotStub.returns(true);
    const req = createRequest({
      headerValues: { 'user-agent': 'Googlebot' },
    });
    const res = createResponse();
    const skip = sinon.stub().returns(false);
    const proxy = createProxy({ skip });

    const finalRes = await proxy.handle(req, res);

    expect(skip).to.have.been.calledOnceWith(req, res);
    const stored = getCookieJar(res)[BOT_COOKIE];
    expect(stored.value).to.equal('1');
    expect(botPageViewStub).to.have.been.calledOnce;
    expect(finalRes).to.equal(res);
  });

  describe('preview', () => {
    it('skips when __prerender_bypass cookie is present', async () => {
      isBotStub.returns(true);
      const req = createRequest({
        headerValues: { 'user-agent': 'Googlebot' },
        cookieValues: { __prerender_bypass: '1' },
      });
      const res = createResponse();
      const proxy = createProxy();

      const finalRes = await proxy.handle(req, res);

      validateDebugLog('bot tracking proxy skipped (preview)');
      expect(isBotStub).to.not.have.been.called;
      expect(initContentSdkStub).to.not.have.been.called;
      expect(botPageViewStub).to.not.have.been.called;
      expect(getCookieJar(res)[BOT_COOKIE]).to.be.undefined;
      expect(finalRes).to.equal(res);
    });

    it('skips when __next_preview_data cookie is present', async () => {
      isBotStub.returns(true);
      const req = createRequest({
        headerValues: { 'user-agent': 'Googlebot' },
        cookieValues: { __next_preview_data: '1' },
      });
      const res = createResponse();
      const proxy = createProxy();

      const finalRes = await proxy.handle(req, res);

      validateDebugLog('bot tracking proxy skipped (preview)');
      expect(isBotStub).to.not.have.been.called;
      expect(initContentSdkStub).to.not.have.been.called;
      expect(botPageViewStub).to.not.have.been.called;
      expect(getCookieJar(res)[BOT_COOKIE]).to.be.undefined;
      expect(finalRes).to.equal(res);
    });
  });

  it('skips when request is not a bot', async () => {
    isBotStub.returns(false);
    const req = createRequest({
      headerValues: { 'user-agent': 'Mozilla/5.0' },
    });
    const res = createResponse();
    const proxy = createProxy();

    const finalRes = await proxy.handle(req, res);

    expect(isBotStub).to.have.been.calledWith('Mozilla/5.0');
    validateDebugLog('bot tracking proxy skipped (not a bot)');
    expect(initContentSdkStub).to.not.have.been.called;
    expect(botPageViewStub).to.not.have.been.called;
    expect(finalRes).to.equal(res);
    expect(getCookieJar(res)[BOT_COOKIE]).to.be.undefined;
  });

  it('skips when request is a prefetch', async () => {
    isBotStub.returns(true);
    const req = createRequest({
      headerValues: {
        'user-agent': 'Googlebot',
        purpose: 'prefetch',
      },
    });
    const res = createResponse();
    const proxy = createProxy();

    const finalRes = await proxy.handle(req, res);

    validateDebugLog('bot tracking proxy skipped (prefetch)');
    expect(initContentSdkStub).to.not.have.been.called;
    expect(botPageViewStub).to.not.have.been.called;
    expect(finalRes).to.equal(res);
  });

  it('should run in local environment when SITECORE_ENABLE_BOT_TRACKING is true', async () => {
    isBotStub.returns(true);
    const env = process.env as Record<string, string | undefined>;
    const originalEnv = env.SITECORE_ENABLE_BOT_TRACKING;
    env.SITECORE_ENABLE_BOT_TRACKING = 'true';
    env.NODE_ENV = 'development';

    try {
      const req = createRequest({
        headerValues: { 'user-agent': 'Googlebot' },
      });
      const res = createResponse();
      const proxy = createProxy();

      const finalRes = await proxy.handle(req, res);

      const stored = getCookieJar(res)[BOT_COOKIE];
      expect(stored.value).to.equal('1');
      expect(stored.secure).to.equal(true);
      expect(stored).to.include({ sameSite: 'lax', path: '/' });

      expect(initContentSdkStub).to.have.been.calledOnce;
      expect(initContentSdkStub.firstCall.args[0]).to.deep.include({
        config: {
          contextId: defaultConfig.contextId,
          edgeUrl: defaultConfig.edgeUrl,
          siteName: 'test-site',
        },
      });
      expect(botPageViewStub).to.have.been.calledOnce;
      validateEndDebugObject('bot tracking proxy end: %o', {
        pathname: '/styleguide',
        cookies: res.cookies,
      });
      expect(finalRes).to.equal(res);
    } finally {
      env.SITECORE_ENABLE_BOT_TRACKING = originalEnv;
      env.NODE_ENV = originalEnv;
    }
  });

  it('sets bot cookie and runs botPageView for a bot request', async () => {
    isBotStub.returns(true);
    const req = createRequest({
      headerValues: { 'user-agent': 'Googlebot' },
    });
    const res = createResponse();
    const proxy = createProxy();

    const finalRes = await proxy.handle(req, res);

    const stored = getCookieJar(res)[BOT_COOKIE];
    expect(stored.value).to.equal('1');
    expect(stored.secure).to.equal(true);
    expect(stored).to.include({ sameSite: 'lax', path: '/' });

    expect(initContentSdkStub).to.have.been.calledOnce;
    expect(initContentSdkStub.firstCall.args[0]).to.deep.include({
      config: {
        contextId: defaultConfig.contextId,
        edgeUrl: defaultConfig.edgeUrl,
        siteName: 'test-site',
      },
    });
    expect(botPageViewStub).to.have.been.calledOnce;
    validateEndDebugObject('bot tracking proxy end: %o', {
      pathname: '/styleguide',
      cookies: res.cookies,
    });
    expect(finalRes).to.equal(res);
  });

  it('delegates async work to fetchEvent.waitUntil when provided', async () => {
    isBotStub.returns(true);

    try {
      const req = createRequest({
        headerValues: { 'user-agent': 'Googlebot' },
      });
      const res = createResponse();
      const fetchEvent = { waitUntil: sinon.spy() };

      const proxy = createProxy({ fetchEvent });

      await proxy.handle(req, res);

      expect(fetchEvent.waitUntil).to.have.been.calledOnce;
      expect(initContentSdkStub).to.have.been.calledOnce;
      expect(botPageViewStub).to.have.been.calledOnce;
    } finally {
      initContentSdkStub.resolves();
    }
  });

  it('returns response and logs when botPageView rejects', async () => {
    isBotStub.returns(true);
    const err = new Error('edge failure');
    botPageViewStub.rejects(err);

    const req = createRequest({
      headerValues: { 'user-agent': 'Googlebot' },
    });
    const res = createResponse();
    const proxy = createProxy();

    const finalRes = await proxy.handle(req, res);

    expect(finalRes).to.equal(res);
    const errLog = debugSpy.args.find((log) => log[0] === 'bot tracking proxy error: %o');

    expect(errLog![1]).to.equal(err);
  });
});
