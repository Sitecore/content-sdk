import chai from 'chai';
import chaiString from 'chai-string';
import sinonChai from 'sinon-chai';
import sinon, { spy } from 'sinon';
import nextjs, { NextRequest, NextResponse } from 'next/server';
import debug from '../debug';
import { LocaleProxy } from './locale-proxy';
import { REWRITE_HEADER_NAME, LOCALE_HEADER_NAME } from './proxy';
import type { SuccessfulLocaleProxyExecution } from './locale-proxy';
import { isSuccessfulProxyExecution } from './utils';

chai.use(sinonChai);
const expect = chai.use(chaiString).expect;

const defaultConfig = {
  sites: [],
  enabled: true,
  useCookieResolution: () => false,
  defaultHostname: '',
};

const createProxy = (input: { [key: string]: any } = {}) => {
  const props = { ...defaultConfig, ...input.config };

  const proxy = new LocaleProxy({
    ...props,
  });

  return { proxy };
};

const createRequest = (props: any = {}) => {
  const req = {
    ...props,
    nextUrl: {
      pathname: '/styleguide',
      clone() {
        return Object.assign({}, req.nextUrl);
      },
      searchParams: {
        get(key) {
          return req.nextUrl.searchParams[key];
        },
        ...props.searchParams,
      },
      ...props.nextUrl,
    },
    headers: {
      get(key: string) {
        const headers = {
          host: 'foo.net',
          ...props.headerValues,
        };
        return headers[key];
      },
      ...props.headers,
    },
    cookies: {
      get(cookieName: string) {
        const cookies = { ...props.cookieValues };
        return { value: cookies[cookieName] };
      },
      ...props?.cookies,
      ...props.cookieValues,
    },
  } as NextRequest;

  return req;
};

const createResponse = (props: any = {}) => {
  const res = {
    cookies: {
      set(key, value, attributes) {
        res.cookies[key] = { value, ...attributes };
      },
    },
    headers: {},
    ...props,
  } as NextResponse;

  Object.defineProperties(res.headers, {
    set: {
      value: (key, value) => {
        res.headers[key] = value;
      },
      enumerable: false,
    },
    get: {
      value: (key) => res.headers[key],
    },
    forEach: {
      value: (cb) => {
        Object.keys(res.headers).forEach((key) => cb(res.headers[key], key, res.headers));
      },
      enumerable: false,
    },
  });

  return res;
};

describe('LocaleProxy', () => {
  const debugSpy = spy(debug, 'locale');
  const validateDebugLog = (message, ...params) => {
    expect(debugSpy.args.find((log) => log[0] === message)).to.deep.equal([message, ...params]);
  };

  beforeEach(() => {
    debugSpy.resetHistory();
  });

  it('should expose proxy name', () => {
    const { proxy } = createProxy();
    expect(proxy.name).to.equal('LocaleProxy');
  });

  describe('disabled / skip', () => {
    const res = createResponse();

    const test = async (pathname: string, proxy) => {
      const req = createRequest({
        nextUrl: {
          pathname,
        },
      });

      const finalRes = await proxy.handle(req, res);

      validateDebugLog('locale proxy start: %o', {
        pathname,
        locale: 'en',
      });

      const message = 'skipped (locale proxy is disabled)';
      validateDebugLog(message);

      expect(finalRes).to.deep.equal(res);

      debugSpy.resetHistory();
    };

    it('default', async () => {
      const { proxy } = createProxy({ config: { locales: ['en'] } });

      await test('/src/image.png', proxy);
      await test('/api/layout/render', proxy);
      await test('/sitecore/render', proxy);
      await test('/_next/webpack', proxy);
    });

    it('should apply both default and custom rules when custom disabled function provided', async () => {
      const skip = (req: NextRequest) => req.nextUrl.pathname === '/crazypath/luna';

      const { proxy } = createProxy({
        config: { ...defaultConfig, skip, locales: ['en'] },
      });

      await test('/src/image.png', proxy);
      await test('/api/layout/render', proxy);
      await test('/sitecore/render', proxy);
      await test('/_next/webpack', proxy);
      await test('/crazypath/luna', proxy);
    });
  });

  describe('request passed', () => {
    let nextRewriteStub = sinon.stub();

    afterEach(() => {
      nextRewriteStub.restore();
    });

    it('should set locale header if locale in path', async () => {
      const { proxy } = createProxy({
        config: { ...defaultConfig, locales: ['en', 'de-DE'] },
      });

      const req = createRequest({
        nextUrl: {
          pathname: '/de-DE/about',
        },
      });

      const res = createResponse();

      nextRewriteStub = sinon.stub(nextjs.NextResponse, 'rewrite').returns(res);

      const finalRes = await proxy.handle(req, res);

      validateDebugLog('locale proxy start: %o', {
        pathname: '/de-DE/about',
        locale: 'de-DE',
      });

      validateDebugLog('locale proxy end, no rewrite: %o', {
        pathname: '/de-DE/about',
        locale: 'de-DE',
      });

      expect(finalRes.headers.get(LOCALE_HEADER_NAME)).to.equal('de-DE');
    });

    it('should rewrite path and set locale header with default locale if locale not in path', async () => {
      const { proxy } = createProxy({
        config: { ...defaultConfig, locales: ['en', 'de-DE'] },
      });

      const req = createRequest({
        nextUrl: {
          pathname: '/about',
        },
      });

      const res = createResponse();

      nextRewriteStub = sinon.stub(nextjs.NextResponse, 'rewrite').returns(res);

      const finalRes = await proxy.handle(req, res);

      validateDebugLog('locale proxy start: %o', {
        pathname: '/about',
        locale: 'en',
      });

      validateDebugLog('locale proxy end, with rewrite: %o', {
        pathname: '/about',
        locale: 'en',
        rewritePath: '/en/about',
      });

      expect(finalRes.headers.get(LOCALE_HEADER_NAME)).to.equal('en');
      expect(finalRes.headers.get(REWRITE_HEADER_NAME)).to.equal('/en/about');
    });

    it('should rewrite path and set locale header with default locale setting if locale not in path', async () => {
      const { proxy } = createProxy({
        config: { ...defaultConfig, defaultLanguage: 'de-DE', locales: ['en', 'de-DE'] },
      });

      const req = createRequest({
        nextUrl: {
          pathname: '/about',
        },
      });

      const res = createResponse();

      nextRewriteStub = sinon.stub(nextjs.NextResponse, 'rewrite').returns(res);

      const finalRes = await proxy.handle(req, res);

      validateDebugLog('locale proxy start: %o', {
        pathname: '/about',
        locale: 'de-DE',
      });

      validateDebugLog('locale proxy end, with rewrite: %o', {
        pathname: '/about',
        locale: 'de-DE',
        rewritePath: '/de-DE/about',
      });

      expect(finalRes.headers.get(LOCALE_HEADER_NAME)).to.equal('de-DE');
      expect(finalRes.headers.get(REWRITE_HEADER_NAME)).to.equal('/de-DE/about');
    });
  });

  describe('execution context', () => {
    let nextRewriteStub = sinon.stub();

    afterEach(() => {
      nextRewriteStub.restore();
    });

    it('should record successful execution with rewrite in context', async () => {
      const { proxy } = createProxy({
        config: { ...defaultConfig, locales: ['en', 'de-DE'] },
      });

      const req = createRequest({
        nextUrl: {
          pathname: '/about',
        },
      });
      const res = createResponse();
      const context = new Map();

      nextRewriteStub = sinon.stub(nextjs.NextResponse, 'rewrite').returns(res);

      await proxy.handle(req, res, context);

      const info = context.get('LocaleProxy');
      expect(isSuccessfulProxyExecution<SuccessfulLocaleProxyExecution>(info)).to.equal(true);
      expect(info).to.deep.equal({
        executedSuccessfully: true,
        error: null,
        rewrote: true,
        locale: 'en',
      });
    });

    it('should record successful execution without rewrite in context', async () => {
      const { proxy } = createProxy({
        config: { ...defaultConfig, locales: ['en', 'de-DE'] },
      });

      const req = createRequest({
        nextUrl: {
          pathname: '/de-DE/about',
        },
      });
      const res = createResponse();
      const context = new Map();

      await proxy.handle(req, res, context);

      const info = context.get('LocaleProxy');
      expect(isSuccessfulProxyExecution<SuccessfulLocaleProxyExecution>(info)).to.equal(true);
      expect(info).to.deep.equal({
        executedSuccessfully: true,
        error: null,
        rewrote: false,
        locale: 'de-DE',
      });
    });

    it('should record failed execution in context when context is provided', async () => {
      const { proxy } = createProxy({
        config: { ...defaultConfig, locales: ['en'] },
      });
      const error = new Error('rewrite failed');
      const context = new Map();
      const errorSpy = spy(console, 'log');

      sinon.stub(proxy as LocaleProxy & { rewrite: () => never }, 'rewrite').throws(error);

      const req = createRequest({
        nextUrl: {
          pathname: '/about',
        },
      });
      const res = createResponse();

      const finalRes = await proxy.handle(req, res, context);

      expect(context.get('LocaleProxy')).to.deep.equal({
        executedSuccessfully: false,
        error,
      });
      expect(finalRes).to.equal(res);

      errorSpy.restore();
    });

    it('should return response when execution fails and context is not provided', async () => {
      const { proxy } = createProxy({
        config: { ...defaultConfig, locales: ['en'] },
      });
      const error = new Error('rewrite failed without context');
      const errorSpy = spy(console, 'log');

      sinon.stub(proxy as LocaleProxy & { rewrite: () => never }, 'rewrite').throws(error);

      const req = createRequest({
        nextUrl: {
          pathname: '/about',
        },
      });
      const res = createResponse();

      const finalRes = await proxy.handle(req, res);

      expect(finalRes).to.equal(res);

      errorSpy.restore();
    });
  });
});
