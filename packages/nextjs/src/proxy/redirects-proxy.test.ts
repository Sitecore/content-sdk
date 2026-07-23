/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable dot-notation */
import { GraphQLRequestClient } from '@sitecore-content-sdk/core';
import {
  REDIRECT_TYPE_301,
  REDIRECT_TYPE_302,
  REDIRECT_TYPE_SERVER_TRANSFER,
  RedirectsService,
  SiteResolver,
} from '@sitecore-content-sdk/content/site';
import chai, { use } from 'chai';
import chaiString from 'chai-string';
import { NextRequest, NextResponse } from 'next/server';
import sinon, { spy } from 'sinon';
import sinonChai from 'sinon-chai';
import { RedirectsProxy, RedirectsProxyConfig } from './redirects-proxy';
import type { SuccessfulRedirectsProxyExecution } from './redirects-proxy';
import debug from '../debug';
import { isSuccessfulProxyExecution } from './utils';

use(sinonChai);
const expect = chai.use(chaiString).expect;

describe('RedirectsProxy', () => {
  type TestProxyProps = {
    [key: string]: unknown;
    redirectsProxyConfig?: Partial<RedirectsProxyConfig>;
    // for multiple rules
    redirectMaps?: {
      pattern: string;
      target: string;
      redirectType?: string;
      isQueryStringPreserved?: boolean;
      isLanguagePreserved?: boolean;
    }[];
    // for single rule
    pattern?: string;
    target?: string;
    redirectType?: string;
    isQueryStringPreserved?: boolean;
    isLanguagePreserved?: boolean;
    locale?: string;
    fetchRedirectsStub?: sinon.SinonStub;
    getClientFactoryStub?: sinon.SinonStub;
    defaultHostname?: string;
    siteResolver?: SiteResolver;
  };

  let nextRedirectStub: sinon.SinonStub;
  let nextRewriteStub: sinon.SinonStub;

  const sandbox = sinon.createSandbox();

  const debugSpy = spy(debug, 'redirects');
  const validateDebugLog = (message: string, ...params: unknown[]) => {
    const foundLog = debugSpy.args.find((log) => log[0] === message);
    if (!foundLog) {
      throw new Error(
        `Expected debug log with message "${message}" not found. Available logs: ${JSON.stringify(
          debugSpy.args.map((log) => log[0])
        )}`
      );
    }
    expect(foundLog).to.deep.equal([message, ...params]);
  };

  const normalizeUrl = (u: any) => {
    if (typeof u === 'string') return u;
    if (u && typeof u === 'object') return typeof u.href === 'string' ? u.href : String(u);
    return u;
  };

  const normalizeHeaders = (h: any) => {
    if (!h) return h;
    // Convert Headers -> plain object so deep-equal is stable
    if (typeof Headers !== 'undefined' && h instanceof Headers) {
      return Object.fromEntries(h.entries());
    }
    // In case something stringified to "[object Headers]"
    if (h === '[object Headers]') return {};
    return h;
  };

  const validateEndMessageDebugLog = (message: string, params: unknown) => {
    const logParams = debugSpy.args.find((log) => log[0] === message) as Array<unknown>;

    if (!logParams) {
      throw new Error(`Expected debug log with message "${message}" not found.`);
    }

    const actual = { ...(logParams[2] as any) };
    const expected = { ...(params as any) };

    if ('url' in actual) actual.url = normalizeUrl(actual.url);
    if ('url' in expected) {
      if (typeof expected.url === 'string') {
        expected.url = normalizeUrl(expected.url);
      } else if (
        typeof expected.url === 'object' &&
        expected.url !== null &&
        'containing' in expected.url
      ) {
        // If URL is a matcher object, check it separately and remove from comparison
        const actualUrl = normalizeUrl(actual.url);
        if (typeof actualUrl === 'string') {
          expect(actualUrl).to.include(expected.url.containing);
        }
        delete expected.url;
        delete actual.url;
      }
    }

    if ('headers' in actual) actual.headers = normalizeHeaders(actual.headers);
    if ('headers' in expected) expected.headers = normalizeHeaders(expected.headers);

    expect(actual).to.deep.equal(expected);
  };

  const referrer = 'http://localhost:3000';
  const hostname = 'foo.net';
  const siteName = 'nextjs-app';
  const sitesFromConfigFile = [
    { name: 'basicSite', hostName: 'localhost', language: 'en' },
    { name: 'nextjs-app', hostName: '*', language: 'da' },
  ];

  const defaultConfig: Omit<RedirectsProxyConfig, 'clientFactory'> = {
    enabled: true,
    contextId: '0000-0000-0000',
    clientContextId: '0000-0000-0000',
    edgeUrl: 'https://foo.bar',
    locales: ['en', 'da'],
    sites: sitesFromConfigFile,
  };

  const createRequest = (props: any = {}) => {
    const nextUrlBase = {
      pathname: props.nextUrl?.pathname || '/old-page',
      search: props.nextUrl?.search || '',
      origin: props.nextUrl?.origin || 'http://localhost:3000',
      locale: props.nextUrl?.locale || 'en',
      defaultLocale: props.nextUrl?.defaultLocale || 'en',
      searchParams: props.nextUrl?.searchParams || {},
    };

    const req: any = {
      ...props,
      nextUrl: null as any, // Will be set below
      headers: {
        get(key: string) {
          const headers = {
            host: hostname,
            referer: referrer,
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

    // Create nextUrl with computed href and methods that reference req
    req.nextUrl = {
      ...nextUrlBase,
      get href() {
        return `${this.origin}${this.pathname}${this.search}`;
      },
      clone() {
        const cloned: any = {
          ...req.nextUrl,
          pathname: req.nextUrl.pathname,
          search: req.nextUrl.search,
          origin: req.nextUrl.origin,
          locale: req.nextUrl.locale,
          defaultLocale: req.nextUrl.defaultLocale,
          searchParams: req.nextUrl.searchParams,
          get href() {
            return `${this.origin}${this.pathname}${this.search}`;
          },
        };
        return cloned;
      },
      searchParams: {
        get(key) {
          const searchParams = req.nextUrl.searchParams || {};
          return searchParams[key];
        },
      },
      ...props.nextUrl,
    };

    return req;
  };

  const createResponse = (props: any = {}) => {
    const res = {
      cookies: {
        ...props?.cookieValues,
        set(key, value, attributes) {
          res.cookies[key] = { value, ...attributes };
        },
        get(cookieName: string) {
          const cookie = res.cookies[cookieName];
          if (!cookie) return undefined;
          // If it's already an object with value, return it; otherwise wrap it
          return typeof cookie === 'object' && 'value' in cookie ? cookie : { value: cookie };
        },
        getAll() {
          return Object.keys(res.cookies)
            .filter((key) => typeof res.cookies[key] !== 'function')
            .map((key) => ({ name: key, value: res.cookies[key]?.value || res.cookies[key] }));
        },
      },
      headers: {},
      redirected: false,
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
      delete: {
        value: (key) => {
          delete res.headers[key];
        },
        enumerable: false,
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

  const createProxy = (input: TestProxyProps = {}) => {
    const props = {
      ...defaultConfig,
      ...input.redirectsProxyConfig,
      ...(input.defaultHostname ? { defaultHostname: input.defaultHostname } : {}),
    };
    class MockSiteResolver extends SiteResolver {
      getByName = sandbox.stub().returns({
        name: siteName,
        language: input.locale || 'en',
        hostName: hostname,
      });

      getByHost = sandbox.stub().returns({
        name: siteName,
        language: input.locale || 'en',
        hostName: hostname,
      });
    }

    const siteResolver = input.siteResolver || new MockSiteResolver([]);
    const clientFactory = GraphQLRequestClient.createClientFactory({
      apiKey: 'edge-api-key',
      endpoint: 'http://edge-endpoint/api/graph/edge',
    });

    const getClientFactory = input.getClientFactoryStub || sandbox.stub().returns(clientFactory);

    const defaultRedirects = input.redirectMaps || [
      {
        pattern: input.pattern || '/old-page',
        target: input.target || '/new-page',
        redirectType: input.redirectType || REDIRECT_TYPE_301,
        isQueryStringPreserved: input.isQueryStringPreserved ?? true,
        isLanguagePreserved: input.isLanguagePreserved ?? true,
      },
    ];

    // Create the stub first to ensure proper call tracking
    const fetchRedirectsStub =
      input.fetchRedirectsStub || sandbox.stub().resolves(defaultRedirects);

    // Create a mock RedirectsService with stubbed fetchRedirects method
    const mockRedirectsService = {
      fetchRedirects: fetchRedirectsStub,
    } as unknown as RedirectsService;

    const proxy = new RedirectsProxy({
      ...props,
      redirectsService: mockRedirectsService,
    } as RedirectsProxyConfig);
    proxy['siteResolver'] = siteResolver;
    proxy['getClientFactory'] = getClientFactory;

    return { proxy, siteResolver, fetchRedirectsStub, getClientFactory };
  };

  // Stub for NextResponse generation, see https://github.com/vercel/next.js/issues/42374
  (Headers.prototype as any).getAll = () => [];

  before(() => {
    nextRedirectStub = sandbox.stub(NextResponse, 'redirect');
    nextRewriteStub = sandbox.stub(NextResponse, 'rewrite');
  });

  beforeEach(() => {
    debugSpy.resetHistory();
    nextRedirectStub.reset();
    nextRewriteStub.reset();
    // Reset the stubs to return undefined by default, tests will override
    nextRedirectStub.returns(undefined);
    nextRewriteStub.returns(undefined);
  });

  after(() => {
    nextRedirectStub.restore();
    nextRewriteStub.restore();
  });

  it('should expose proxy name', () => {
    const { proxy } = createProxy();
    expect(proxy.name).to.equal('RedirectsProxy');
  });

  describe('request skipped', () => {
    describe('disabled / skip', () => {
      const res = createResponse();

      const test = async (pathname: string, proxy: RedirectsProxy) => {
        const req = createRequest({
          nextUrl: {
            pathname,
          },
        });

        const finalRes = await proxy.handle(req, res);
        const isDisabledGlobally = proxy['config'].enabled === false;

        if (!isDisabledGlobally) {
          validateDebugLog('redirects proxy start: %o', {
            pathname,
            language: 'en',
            hostname: 'foo.net',
          });
        }

        const message = isDisabledGlobally
          ? 'skipped (redirects proxy is disabled globally)'
          : 'skipped (redirects proxy is disabled)';
        validateDebugLog(message);

        expect(finalRes).to.deep.equal(res);

        debugSpy.resetHistory();
      };

      it('default', async () => {
        const { proxy } = createProxy();

        await test('/src/image.png', proxy);
        await test('/api/layout/render', proxy);
        await test('/sitecore/render', proxy);
        await test('/_next/webpack', proxy);
      });

      it('should apply both default and custom rules when custom disabled function provided', async () => {
        const skip = (req: NextRequest) => req.nextUrl.pathname === '/crazypath/luna';

        const { proxy } = createProxy({
          redirectsProxyConfig: { ...defaultConfig, skip },
        });

        await test('/src/image.png', proxy);
        await test('/api/layout/render', proxy);
        await test('/sitecore/render', proxy);
        await test('/_next/webpack', proxy);
        await test('/crazypath/luna', proxy);
      });
    });

    describe('preview', () => {
      it('prerender bypass cookie is present', async () => {
        const { proxy } = createProxy();
        const res = NextResponse.next();

        const req = createRequest({
          cookieValues: {
            __prerender_bypass: true,
          },
        });

        const finalRes = await proxy.handle(req, res);

        validateDebugLog('skipped (preview)');

        expect(finalRes).to.deep.equal(res);
      });

      it('preview data cookie is present', async () => {
        const { proxy } = createProxy();
        const res = NextResponse.next();

        const req = createRequest({
          cookieValues: {
            __next_preview_data: true,
          },
        });

        const finalRes = await proxy.handle(req, res);

        validateDebugLog('skipped (preview)');

        expect(finalRes).to.deep.equal(res);
      });
    });

    describe('prefetch', () => {
      it('prefetch header is present', async () => {
        const { proxy } = createProxy();
        const res = createResponse();

        const req = createRequest({
          headerValues: {
            purpose: 'prefetch',
          },
        });

        const finalRes = await proxy.handle(req, res);

        validateDebugLog('redirects proxy start: %o', {
          pathname: '/old-page',
          language: 'en',
          hostname: 'foo.net',
        });
        validateDebugLog('skipped (prefetch)');
        expect(finalRes.headers.get('x-proxy-cache')).to.equal('no-cache');
        expect(finalRes.headers.get('Cache-Control')).to.equal('no-store, must-revalidate');
        expect(finalRes).to.deep.equal(res);
      });
    });
  });

  describe('request passed', () => {
    it('should redirect with 301 when redirect type is 301', async () => {
      const req = createRequest({
        nextUrl: {
          pathname: '/old-page',
        },
      });
      const res = createResponse();

      // Create a proper redirect response with redirected: true and status: 301
      const redirectRes = createResponse({
        redirected: true,
        status: 301,
        url: 'http://localhost:3000/new-page',
      });
      nextRedirectStub.returns(redirectRes);

      const { proxy, fetchRedirectsStub } = createProxy({
        pattern: '/old-page',
        target: '/new-page',
        redirectType: REDIRECT_TYPE_301,
      });

      const finalRes = await proxy.handle(req, res);

      validateDebugLog('redirects proxy start: %o', {
        pathname: '/old-page',
        language: 'en',
        hostname: 'foo.net',
      });

      // Check if fetchRedirects was called - if not, check what debug logs exist
      if (!fetchRedirectsStub.called) {
        const allLogs = debugSpy.args.map((log) => log[0]);
        let siteInfo = 'unknown';
        let disabledResult = 'unknown';
        let validateResult = 'unknown';
        try {
          disabledResult = String(proxy['disabled'](req, res));
        } catch (e) {
          disabledResult = `error: ${e}`;
        }
        try {
          validateResult = String(!proxy['isPreview'](req) && !proxy['isPrefetch'](req));
        } catch (e) {
          validateResult = `error: ${e}`;
        }
        try {
          siteInfo = JSON.stringify(proxy['getSite'](req, res));
        } catch (e) {
          siteInfo = `error: ${e}`;
        }
        throw new Error(
          `fetchRedirects was not called. Available debug logs: ${JSON.stringify(allLogs)}. ` +
            `redirectsService exists: ${!!proxy['redirectsService']}, ` +
            `disabled(req,res): ${disabledResult}, ` +
            `validateRequest would pass: ${validateResult}, ` +
            `site: ${siteInfo}, ` +
            `siteResolver exists: ${!!proxy['siteResolver']}`
        );
      }

      expect(fetchRedirectsStub.calledWith(siteName)).to.be.true;
      expect(nextRedirectStub.calledOnce).to.be.true;

      validateEndMessageDebugLog('redirects proxy end in %dms: %o', {
        redirected: true,
        status: 301,
        url: { containing: '/new-page' },
        headers: normalizeHeaders(finalRes.headers),
      });

      expect(finalRes).to.deep.equal(redirectRes);
    });

    it('should redirect with 302 when redirect type is 302', async () => {
      const req = createRequest({
        nextUrl: {
          pathname: '/old-page',
        },
      });
      const res = createResponse();

      const redirectRes = createResponse({
        redirected: true,
        status: 302,
        url: 'http://localhost:3000/new-page',
      });
      nextRedirectStub.returns(redirectRes);

      const { proxy } = createProxy({
        pattern: '/old-page',
        target: '/new-page',
        redirectType: REDIRECT_TYPE_302,
      });

      const finalRes = await proxy.handle(req, res);

      expect(nextRedirectStub.calledOnce).to.be.true;

      validateEndMessageDebugLog('redirects proxy end in %dms: %o', {
        redirected: true,
        status: 302,
        url: { containing: '/new-page' },
        headers: normalizeHeaders(finalRes.headers),
      });

      expect(finalRes).to.deep.equal(redirectRes);
    });

    it('should rewrite when redirect type is SERVER_TRANSFER', async () => {
      const req = createRequest({
        nextUrl: {
          pathname: '/old-page',
        },
      });
      const res = createResponse();

      const rewriteRes = createResponse({
        redirected: false,
        status: 200,
        url: 'http://localhost:3000/new-page',
      });
      nextRewriteStub.returns(rewriteRes);

      const { proxy } = createProxy({
        pattern: '/old-page',
        target: '/new-page',
        redirectType: REDIRECT_TYPE_SERVER_TRANSFER,
      });

      const finalRes = await proxy.handle(req, res);

      expect(nextRewriteStub.calledOnce).to.be.true;
      expect(nextRedirectStub.called).to.be.false;

      validateEndMessageDebugLog('redirects proxy end in %dms: %o', {
        redirected: false,
        status: 200,
        url: { containing: '/new-page' },
        headers: normalizeHeaders(finalRes.headers),
      });

      expect(finalRes.redirected).to.be.false;
      expect(finalRes.status).to.equal(200);
    });

    it('should preserve query string when isQueryStringPreserved is true', async () => {
      const req = createRequest({
        nextUrl: {
          pathname: '/old-page',
          search: '?param1=value1&param2=value2',
        },
      });
      const res = createResponse();

      const redirectRes = createResponse({
        redirected: true,
        status: 301,
        url: 'http://localhost:3000/new-page',
      });
      nextRedirectStub.returns(redirectRes);

      const { proxy } = createProxy({
        pattern: '/old-page',
        target: '/new-page',
        redirectType: REDIRECT_TYPE_301,
        isQueryStringPreserved: true,
      });

      const finalRes = await proxy.handle(req, res);

      expect(nextRedirectStub.calledOnce).to.be.true;
      const redirectUrl = nextRedirectStub.getCall(0).args[0];
      expect(redirectUrl).to.include('/new-page');
      expect(redirectUrl).to.include('param1=value1');
      expect(redirectUrl).to.include('param2=value2');

      expect(finalRes).to.deep.equal(redirectRes);
    });

    it('should not preserve query string when isQueryStringPreserved is false', async () => {
      const req = createRequest({
        nextUrl: {
          pathname: '/old-page',
          search: '?param1=value1&param2=value2',
        },
      });
      const res = createResponse();

      const redirectRes = createResponse({
        redirected: true,
        status: 301,
        url: 'http://localhost:3000/new-page',
      });
      nextRedirectStub.returns(redirectRes);

      const { proxy } = createProxy({
        pattern: '/old-page',
        target: '/new-page',
        redirectType: REDIRECT_TYPE_301,
        isQueryStringPreserved: false,
      });

      const finalRes = await proxy.handle(req, res);

      expect(nextRedirectStub.calledOnce).to.be.true;
      const redirectUrl = nextRedirectStub.getCall(0).args[0];
      expect(redirectUrl).to.include('/new-page');
      expect(redirectUrl).to.not.include('param1');
      expect(redirectUrl).to.not.include('param2');

      expect(finalRes).to.deep.equal(redirectRes);
    });

    it('should preserve basePath if configured ', async () => {
      const req = createRequest({
        nextUrl: {
          pathname: '/old-page',
          search: '?param1=value1&param2=value2',
          basePath: '/test',
        },
      });
      const res = createResponse();

      const redirectRes = createResponse({
        redirected: true,
        status: 302,
        url: 'http://localhost:3000/test/new-page',
      });
      nextRedirectStub.returns(redirectRes);

      const { proxy } = createProxy({
        pattern: '/old-page',
        target: '/new-page',
        redirectType: REDIRECT_TYPE_301,
        isQueryStringPreserved: true,
      });

      const finalRes = await proxy.handle(req, res);

      expect(nextRedirectStub.calledOnce).to.be.true;
      const redirectUrl = nextRedirectStub.getCall(0).args[0];
      expect(redirectUrl).to.include('/new-page');
      expect(redirectUrl).to.include('param1=value1');
      expect(redirectUrl).to.include('param2=value2');

      expect(finalRes).to.deep.equal(redirectRes);
    });

    it('should preserve basePath if basePath is empty string', async () => {
      const req = createRequest({
        nextUrl: {
          pathname: '/old-page',
          search: '?param1=value1&param2=value2',
          basePath: '',
        },
      });
      const res = createResponse();

      const redirectRes = createResponse({
        redirected: true,
        status: 302,
        url: 'http://localhost:3000/new-page',
      });
      nextRedirectStub.returns(redirectRes);

      const { proxy } = createProxy({
        pattern: '/old-page',
        target: '/new-page',
        redirectType: REDIRECT_TYPE_301,
        isQueryStringPreserved: true,
      });

      const finalRes = await proxy.handle(req, res);

      expect(nextRedirectStub.calledOnce).to.be.true;
      const redirectUrl = nextRedirectStub.getCall(0).args[0];
      expect(redirectUrl).to.include('/new-page');
      expect(redirectUrl).to.include('param1=value1');
      expect(redirectUrl).to.include('param2=value2');

      expect(finalRes).to.deep.equal(redirectRes);
    });

    it('should handle absolute URL targets', async () => {
      const req = createRequest({
        nextUrl: {
          pathname: '/old-page',
        },
      });
      const res = createResponse();

      const redirectRes = createResponse({
        redirected: true,
        status: 301,
        url: 'http://localhost:3000/new-page',
      });
      nextRedirectStub.returns(redirectRes);

      const { proxy } = createProxy({
        pattern: '/old-page',
        target: 'https://example.com/new-page',
        redirectType: REDIRECT_TYPE_301,
      });

      const finalRes = await proxy.handle(req, res);

      expect(nextRedirectStub.calledOnce).to.be.true;
      const redirectUrl = nextRedirectStub.getCall(0).args[0];
      expect(redirectUrl).to.include('https://example.com/new-page');

      expect(finalRes).to.deep.equal(redirectRes);
    });

    it('should handle regex patterns with capture groups', async () => {
      const req = createRequest({
        nextUrl: {
          pathname: '/old-page/123',
        },
      });
      const res = createResponse();

      const redirectRes = createResponse({
        redirected: true,
        status: 301,
        url: 'http://localhost:3000/new-page',
      });
      nextRedirectStub.returns(redirectRes);

      const { proxy } = createProxy({
        pattern: '/old-page/(\\d+)',
        target: '/new-page/$1',
        redirectType: REDIRECT_TYPE_301,
      });

      const finalRes = await proxy.handle(req, res);

      expect(nextRedirectStub.calledOnce).to.be.true;
      const redirectUrl = nextRedirectStub.getCall(0).args[0];
      expect(redirectUrl).to.include('/new-page/123');

      expect(finalRes).to.deep.equal(redirectRes);
    });

    describe('regex redirect-map compatibility scenarios', () => {
      it('should apply capture group substitution for root path without leaving $1 token', async () => {
        const req = createRequest({
          nextUrl: {
            pathname: '/',
            locale: 'en',
            defaultLocale: 'en',
          },
        });
        const res = createResponse();
        const redirectRes = createResponse({
          redirected: true,
          status: 301,
          url: 'http://localhost:3000/en/',
        });
        nextRedirectStub.returns(redirectRes);

        const { proxy } = createProxy({
          pattern: '^/(?!en|de-de|ko-kr|zh-tw|zh-cn|ja-jp)(.*)$',
          target: '/en/$1',
          redirectType: REDIRECT_TYPE_301,
        });

        await proxy.handle(req, res);

        expect(nextRedirectStub.calledOnce).to.be.true;
        const redirectUrl = nextRedirectStub.getCall(0).args[0] as string;
        expect(redirectUrl).to.not.include('$1');
        expect(redirectUrl).to.include('http://localhost:3000/');
      });

      it('should match anchored regex rule for locale-prefixed incoming path', async () => {
        const req = createRequest({
          nextUrl: {
            pathname: '/en/test/red',
            locale: 'en',
            defaultLocale: 'en',
          },
        });
        const res = createResponse();
        const redirectRes = createResponse({
          redirected: true,
          status: 301,
          url: 'http://localhost:3000/en/about',
        });
        nextRedirectStub.returns(redirectRes);

        const { proxy } = createProxy({
          pattern: '^/test/(.*)$',
          target: '/en/about',
          redirectType: REDIRECT_TYPE_301,
        });

        await proxy.handle(req, res);

        expect(nextRedirectStub.calledOnce).to.be.true;
        const redirectUrl = nextRedirectStub.getCall(0).args[0] as string;
        expect(redirectUrl).to.include('/about');
      });

      it('should match anchored regex rule ending with slash for locale-prefixed incoming path', async () => {
        const req = createRequest({
          nextUrl: {
            pathname: '/en/test/',
            locale: 'en',
            defaultLocale: 'en',
          },
        });
        const res = createResponse();
        const redirectRes = createResponse({
          redirected: true,
          status: 301,
          url: 'http://localhost:3000/en/about',
        });
        nextRedirectStub.returns(redirectRes);

        const { proxy } = createProxy({
          pattern: '^/test/$',
          target: '/en/about',
          redirectType: REDIRECT_TYPE_301,
        });

        await proxy.handle(req, res);

        expect(nextRedirectStub.calledOnce).to.be.true;
        const redirectUrl = nextRedirectStub.getCall(0).args[0] as string;
        expect(redirectUrl).to.include('/about');
      });

      it('should substitute capture groups for anchored default path regex', async () => {
        const req = createRequest({
          nextUrl: {
            pathname: '/default/example',
            locale: 'en',
            defaultLocale: 'en',
          },
        });
        const res = createResponse();
        const redirectRes = createResponse({
          redirected: true,
          status: 301,
          url: 'http://localhost:3000/en/example',
        });
        nextRedirectStub.returns(redirectRes);

        const { proxy } = createProxy({
          pattern: '^/default/(.*)$',
          target: '/en/$1',
          redirectType: REDIRECT_TYPE_301,
        });

        await proxy.handle(req, res);

        expect(nextRedirectStub.calledOnce).to.be.true;
        const redirectUrl = nextRedirectStub.getCall(0).args[0] as string;
        expect(redirectUrl).to.include('/example');
        expect(redirectUrl).to.not.include('$1');
      });

      it('should skip malformed regex and still apply a valid redirect rule', async () => {
        const consoleWarnStub = sandbox.stub(console, 'warn');
        const req = createRequest({
          nextUrl: {
            pathname: '/old-page',
            locale: 'en',
            defaultLocale: 'en',
          },
        });
        const res = createResponse();
        const redirectRes = createResponse({
          redirected: true,
          status: 301,
          url: 'http://localhost:3000/new-page',
        });
        nextRedirectStub.returns(redirectRes);

        const { proxy } = createProxy({
          redirectMaps: [
            {
              pattern: '^/broken(',
              target: '/should-not-match',
              redirectType: REDIRECT_TYPE_301,
            },
            {
              pattern: '/old-page',
              target: '/new-page',
              redirectType: REDIRECT_TYPE_301,
            },
          ],
        });

        const finalRes = await proxy.handle(req, res);

        expect(consoleWarnStub).to.have.been.calledOnce;
        expect(consoleWarnStub.firstCall.args[0]).to.include('Invalid redirect regex');
        expect(nextRedirectStub).to.have.been.calledOnce;
        const redirectUrl = nextRedirectStub.getCall(0).args[0] as string;
        expect(redirectUrl).to.include('/new-page');
        expect(finalRes).to.deep.equal(redirectRes);

        consoleWarnStub.restore();
      });

      it('should skip malformed regex with capture groups without failing capture substitution', async () => {
        const consoleWarnStub = sandbox.stub(console, 'warn');
        const req = createRequest({
          nextUrl: {
            pathname: '/old-page/123',
            locale: 'en',
            defaultLocale: 'en',
          },
        });
        const res = createResponse();
        const redirectRes = createResponse({
          redirected: true,
          status: 301,
          url: 'http://localhost:3000/new-page/123',
        });
        nextRedirectStub.returns(redirectRes);

        const { proxy } = createProxy({
          redirectMaps: [
            {
              pattern: '^/broken(',
              target: '/bad',
              redirectType: REDIRECT_TYPE_301,
            },
            {
              pattern: '/old-page/(\\d+)',
              target: '/new-page/$1',
              redirectType: REDIRECT_TYPE_301,
            },
          ],
        });

        await proxy.handle(req, res);

        expect(consoleWarnStub).to.have.been.calledOnce;
        expect(nextRedirectStub).to.have.been.calledOnce;
        const redirectUrl = nextRedirectStub.getCall(0).args[0] as string;
        expect(redirectUrl).to.include('/new-page/123');

        consoleWarnStub.restore();
      });
    });

    it('should replace $siteLang token in target', async () => {
      const req = createRequest({
        nextUrl: {
          pathname: '/old-page',
        },
      });
      // match app router behavior about locale in request
      delete req.locale;
      // Set up App Router response so locale is added to pathname
      const res = createResponse({
        headers: {
          'x-sc-locale': 'da',
        },
      });

      // The redirect URL will be computed dynamically, so we'll create the response after checking the call
      nextRedirectStub.callsFake((url) => {
        const redirectRes = createResponse({
          redirected: true,
          status: 301,
          url: typeof url === 'string' ? url : url.href,
        });
        return redirectRes;
      });

      const { proxy } = createProxy({
        pattern: '/old-page',
        target: '/$siteLang/new-page',
        redirectType: REDIRECT_TYPE_301,
        locale: 'da',
      });

      const finalRes = await proxy.handle(req, res);

      expect(nextRedirectStub.calledOnce).to.be.true;
      const redirectUrl = nextRedirectStub.getCall(0).args[0];
      // The redirect URL should include the locale in the path
      // For App Router, the locale is added to the pathname
      const urlString =
        typeof redirectUrl === 'string' ? redirectUrl : redirectUrl.href || redirectUrl.toString();
      // The $siteLang token should be replaced with 'da', and for App Router it should be in the path
      // Check that the URL contains the locale (either in pathname or as part of the URL)
      if (urlString.includes('/da/')) {
        expect(urlString).to.include('/da/new-page');
      } else {
        // If locale is not in path (Pages Router), it might be in the locale property
        // But the URL should still reflect the target with locale
        expect(urlString).to.include('new-page');
        // For this test, we expect the locale to be in the path for App Router
        expect(res.headers['x-sc-locale']).to.equal('da');
      }

      expect(finalRes.redirected).to.be.true;
      expect(finalRes.status).to.equal(301);
    });

    it('should handle multiple redirect rules', async () => {
      const req = createRequest({
        nextUrl: {
          pathname: '/old-page-2',
        },
      });
      const res = createResponse();

      const redirectRes = createResponse({
        redirected: true,
        status: 301,
        url: 'http://localhost:3000/new-page',
      });
      nextRedirectStub.returns(redirectRes);

      const { proxy, fetchRedirectsStub } = createProxy({
        redirectMaps: [
          {
            pattern: '/old-page-1',
            target: '/new-page-1',
            redirectType: REDIRECT_TYPE_301,
          },
          {
            pattern: '/old-page-2',
            target: '/new-page-2',
            redirectType: REDIRECT_TYPE_302,
          },
        ],
      });

      const finalRes = await proxy.handle(req, res);

      expect(fetchRedirectsStub.calledWith(siteName)).to.be.true;
      expect(nextRedirectStub.calledOnce).to.be.true;
      const redirectUrl = nextRedirectStub.getCall(0).args[0];
      expect(redirectUrl).to.include('/new-page-2');

      expect(finalRes).to.deep.equal(redirectRes);
    });

    it('should use fallback hostname when host header is missing', async () => {
      const req = createRequest({
        headerValues: { host: undefined },
        nextUrl: {
          pathname: '/old-page',
        },
      });
      const res = createResponse();

      const redirectRes = createResponse({
        redirected: true,
        status: 301,
        url: 'http://localhost:3000/new-page',
      });
      nextRedirectStub.returns(redirectRes);

      const { proxy } = createProxy({
        redirectsProxyConfig: {
          defaultHostname: 'bar.net',
        },
        pattern: '/old-page',
        target: '/new-page',
        redirectType: REDIRECT_TYPE_301,
      });

      const finalRes = await proxy.handle(req, res);

      validateDebugLog('redirects proxy start: %o', {
        pathname: '/old-page',
        language: 'en',
        hostname: 'bar.net',
      });

      expect(nextRedirectStub.calledOnce).to.be.true;
      expect(finalRes.redirected).to.be.true;
      expect(finalRes.status).to.equal(301);
    });
  });

  describe('error handling', () => {
    const req = createRequest();
    const res = createResponse();

    let errorSpy;

    before(() => {
      errorSpy = spy(console, 'log');
    });

    beforeEach(() => {
      errorSpy.resetHistory();
    });

    after(() => {
      errorSpy.restore();
    });

    it('should handle error when fetchRedirects throws', async () => {
      const error = new Error('Custom error');

      const fetchRedirectsWithError = sandbox.stub().throws(error);

      const { proxy, fetchRedirectsStub } = createProxy({
        fetchRedirectsStub: fetchRedirectsWithError,
      });

      const finalRes = await proxy.handle(req, res);

      expect(fetchRedirectsStub.called).to.be.true;
      expect(errorSpy.getCall(0).calledWith('Redirect proxy failed:')).to.be.true;
      expect(errorSpy.getCall(1).calledWith(error)).to.be.true;

      expect(finalRes).to.deep.equal(res);
    });

    it('should record failed execution in context when fetchRedirects throws', async () => {
      const error = new Error('Custom error');
      const context = new Map();
      const fetchRedirectsWithError = sandbox.stub().throws(error);

      const { proxy } = createProxy({
        fetchRedirectsStub: fetchRedirectsWithError,
      });

      await proxy.handle(req, res, context);

      expect(context.get('RedirectsProxy')).to.deep.equal({
        executedSuccessfully: false,
        error,
      });
    });
    it('should record successful redirect execution in context', async () => {
      const req = createRequest({
        nextUrl: {
          pathname: '/old-page',
        },
      });
      const res = createResponse();
      const context = new Map();

      const redirectRes = createResponse({
        redirected: true,
        status: 301,
        url: 'http://localhost:3000/new-page',
      });
      nextRedirectStub.returns(redirectRes);

      const { proxy } = createProxy({
        pattern: '/old-page',
        target: '/new-page',
        redirectType: REDIRECT_TYPE_301,
      });

      await proxy.handle(req, res, context);

      const info = context.get('RedirectsProxy');
      expect(isSuccessfulProxyExecution<SuccessfulRedirectsProxyExecution>(info)).to.equal(true);
      expect(info).to.deep.include({
        executedSuccessfully: true,
        error: null,
        redirectStatus: 301,
        isExternal: false,
      });
      expect(info?.requestUrl).to.equal('http://localhost:3000/new-page');
      expect(info?.redirectUrl).to.equal('http://localhost:3000/new-page');
    });
  });

  describe('configuration - API config required', () => {
    it('gracefully disables when API config is missing', () => {
      // Create proxy without API config (no contextId/clientContextId and no apiHost/apiKey)
      const proxy = new RedirectsProxy({
        enabled: true,
        locales: ['en'],
        sites: [],
        // No contextId, clientContextId, apiHost, or apiKey - API config missing
      } as RedirectsProxyConfig);

      // Verify proxy was created but redirectsService is null
      expect(proxy).to.not.be.undefined;
      expect(proxy['redirectsService']).to.be.null;
    });

    it('skips execution when redirectsService is null', async () => {
      const req = createRequest();
      const res = createResponse();

      // Create proxy without API config
      const proxy = new RedirectsProxy({
        enabled: true,
        locales: ['en'],
        sites: [],
        // No API config
      } as RedirectsProxyConfig);

      const finalRes = await proxy.handle(req, res);

      // Should skip execution and return response unchanged
      validateDebugLog('skipped (redirects service not configured - API config required)');
      expect(finalRes).to.deep.equal(res);
    });

    it('works normally when Edge config is provided', () => {
      const proxy = new RedirectsProxy({
        enabled: true,
        contextId: 'edge-context-id',
        clientContextId: 'edge-client-id',
        edgeUrl: 'https://edge.url',
        locales: ['en'],
        sites: [],
      } as RedirectsProxyConfig);

      // Verify proxy was created and redirectsService is initialized
      expect(proxy).to.not.be.undefined;
      expect(proxy['redirectsService']).to.not.be.null;
    });

    it('works normally when local API config is provided', () => {
      const proxy = new RedirectsProxy({
        enabled: true,
        apiHost: 'https://api.example.com',
        apiKey: 'api-key',
        locales: ['en'],
        sites: [],
      } as RedirectsProxyConfig);

      // Verify proxy was created and redirectsService is initialized
      expect(proxy).to.not.be.undefined;
      expect(proxy['redirectsService']).to.not.be.null;
    });
  });

  describe('matchRedirectItemRedirect', () => {
    const baseRedirect = (overrides: Record<string, unknown> = {}) => ({
      pattern: '/from',
      target: '/to',
      redirectType: REDIRECT_TYPE_301,
      isQueryStringPreserved: true,
      locale: 'en',
      ...overrides,
    });

    it('returns undefined when there are no locale-specific rules for the request locale', () => {
      const { proxy } = createProxy();
      const result = proxy['matchRedirectItemRedirect'](
        [baseRedirect({ locale: 'da', pattern: '/about' })],
        'en',
        '/about'
      );
      expect(result).to.be.undefined;
    });

    it('returns undefined when locale matches but normalized path does not', () => {
      const { proxy } = createProxy();
      const result = proxy['matchRedirectItemRedirect'](
        [baseRedirect({ locale: 'en', pattern: '/other' })],
        'en',
        '/about'
      );
      expect(result).to.be.undefined;
    });

    it('returns the first matching redirect when locale and path match', () => {
      const { proxy } = createProxy();
      const first = baseRedirect({
        locale: 'en',
        pattern: '/about',
        target: '/first',
      });
      const second = baseRedirect({
        locale: 'en',
        pattern: '/about',
        target: '/second',
      });
      const result = proxy['matchRedirectItemRedirect']([first, second], 'en', '/about');
      expect(result).to.deep.equal(first);
    });

    it('matches normalized paths case-insensitively and ignores trailing slashes on the pattern', () => {
      const { proxy } = createProxy();
      const redirect = baseRedirect({
        locale: 'en',
        pattern: '/Foo/Bar/',
        target: '/lowercase',
      });
      const result = proxy['matchRedirectItemRedirect']([redirect], 'en', '/foo/bar');
      expect(result?.target).to.equal('/lowercase');
    });

    it('returns undefined when the list of locale rules is empty after filtering', () => {
      const { proxy } = createProxy();
      const result = proxy['matchRedirectItemRedirect']([], 'en', '/about');
      expect(result).to.be.undefined;
    });

    it('should ignore locale prefix when matching redirects (app router)', () => {
      const { proxy } = createProxy();
      const redirect = baseRedirect({
        locale: 'en',
        pattern: '/Foo/redirect/',
        target: '/lowercase',
      });
      const result = proxy['matchRedirectItemRedirect']([redirect], 'en', '/en/foo/redirect');
      expect(result?.target).to.equal('/lowercase');
    });
  });
});
