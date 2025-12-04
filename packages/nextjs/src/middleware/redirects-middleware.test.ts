/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable dot-notation */
import { debug, GraphQLRequestClient } from '@sitecore-content-sdk/core';
import {
  REDIRECT_TYPE_301,
  REDIRECT_TYPE_302,
  REDIRECT_TYPE_SERVER_TRANSFER,
  SiteResolver,
} from '@sitecore-content-sdk/core/site';
import chai, { use } from 'chai';
import chaiString from 'chai-string';
import { NextRequest, NextResponse } from 'next/server';
import sinon, { spy } from 'sinon';
import sinonChai from 'sinon-chai';
import { RedirectsMiddleware, RedirectsMiddlewareConfig } from './redirects-middleware';
import { LOCALE_HEADER_NAME, REWRITE_HEADER_NAME } from './middleware';
import { NextURL } from 'next/dist/server/web/next-url';

use(sinonChai);
const expect = chai.use(chaiString).expect;

describe('RedirectsMiddleware', () => {
  type TestMiddlewareProps = {
    [key: string]: unknown;
    redirectsMiddlewareConfig?: Partial<RedirectsMiddlewareConfig>;
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
  const validateDebugLog = (message: string, ...params: unknown[]) =>
    expect(debugSpy.args.find((log) => log[0] === message)).to.deep.equal([message, ...params]);

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
    if ('url' in expected) expected.url = normalizeUrl(expected.url);

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
  const setCookies = () => {};
  const getCookies = () => {};

  const createRequest = (props: any = {}) => {
    const req = {
      ...props,
      nextUrl: {
        pathname: '/styleguide',
        href: 'http://localhost:3000/styleguide',
        locale: 'en',
        clone() {
          return Object.assign({}, req.nextUrl);
        },
        ...props?.nextUrl,
      },
      cookies: {
        get(key: string) {
          const cookies = { ...props.cookies };
          return { value: cookies[key] };
        },
        ...props.cookies,
      },
      headers: {
        host: hostname,
        get(key: string) {
          const headers = { host: hostname, ...props.headerValues };
          return headers[key];
        },
        ...props.headerValues,
      },
      referrer,
    } as NextRequest;

    return req;
  };

  const createResponse = ({ setCookies, ...rest }: any = {}) => {
    const res = {
      cookies: {
        set: setCookies || (() => {}),
        get: getCookies || (() => {}),
      },
      headers: {},
      ...rest,
    };

    Object.defineProperties(res.headers, {
      set: {
        value: (key: any, value: any) => {
          res.headers[key] = value;
        },
        enumerable: false,
      },
      get: {
        value: (key: any) => res.headers[key],
      },
      forEach: {
        value: (cb: any) => {
          Object.keys(res.headers).forEach((key) => cb(res.headers[key], key, res.headers));
        },
        enumerable: false,
      },
    });

    return res;
  };

  const createMiddleware = (props: TestMiddlewareProps = {}) => {
    class MockSiteResolver extends SiteResolver {
      sites = sitesFromConfigFile;
      getByName = sandbox.stub().callsFake((siteName: string) => ({
        name: siteName,
        language: props.language || '',
        hostName: hostname,
      }));

      getByHost = sandbox.stub().callsFake((hostName: string) => ({
        name: siteName,
        language: props.language || 'da',
        hostName,
      }));
    }

    const siteResolver = props.siteResolver || new MockSiteResolver([]);

    const clientFactory = GraphQLRequestClient.createClientFactory({
      apiKey: 'edge-api-key',
      endpoint: 'http://edge-endpoint/api/graph/edge',
    });

    const redirectMaps = props.redirectMaps || [];
    if (props.pattern && props.target) {
      redirectMaps.push({
        pattern: props.pattern,
        target: props.target,
        redirectType: props.redirectType,
        isQueryStringPreserved: props.isQueryStringPreserved,
        isLanguagePreserved: props.isLanguagePreserved,
      });
    }

    const redirectsService = props.redirectsMiddlewareConfig?.redirectsService || {
      fetchRedirects: sandbox
        .stub()
        .returns(Promise.resolve(props.target || redirectMaps.length > 1 ? redirectMaps : [])),
    };

    const defaultConfig = {
      enabled: true,
      contextId: '1243',
      edgeUrl: '123',
      apiKey: 'api1234',
      apiHost: 'api123',
      path: '/api/graph/edge',
      clientContextId: '123',
      sites: [],
      locales: ['en', 'ua', 'pl-PL'],
      redirectsService,
    };

    const middleware = new RedirectsMiddleware({
      ...defaultConfig,
      ...(props.redirectsMiddlewareConfig || {}),
    });

    middleware['siteResolver'] = siteResolver;

    const fetchRedirects = redirectsService.fetchRedirects;

    const getClientFactory = (middleware['getClientFactory'] =
      props.getClientFactoryStub || sandbox.stub().returns(clientFactory));

    return { middleware, fetchRedirects, siteResolver, getClientFactory };
  };

  const setupRedirectStub = (status = 307) => {
    nextRedirectStub = sandbox.stub(NextResponse, 'redirect').callsFake((url, init) => {
      const statusCode = typeof init === 'number' ? init : init?.status || status;
      const headers = typeof init === 'object' ? init?.headers : {};
      return {
        url,
        status: statusCode,
        cookies: { set: setCookies, get: getCookies },
        headers: new Headers(headers),
      } as unknown as NextResponse;
    });
  };

  const setupRewriteStub = (status = 200, res: any) => {
    nextRewriteStub = sandbox.stub(NextResponse, 'rewrite').callsFake((url) => {
      return {
        url,
        status,
        cookies: { set: setCookies, get: getCookies },
        headers: res.headers,
      } as unknown as NextResponse;
    });
  };

  const runTestWithRedirect = async (
    middlewareProps: TestMiddlewareProps,
    req: any,
    res: any,
    _hostname = hostname
  ) => {
    const { middleware, fetchRedirects, siteResolver } = createMiddleware(middlewareProps);
    const finalRes = await middleware.handle(req, res);

    validateDebugLog('redirects middleware start: %o', {
      hostname: _hostname,
      language: middlewareProps.locale || 'en',
      pathname: req.nextUrl.pathname,
    });

    return { finalRes, fetchRedirects, siteResolver };
  };

  const createTestRequestResponse = ({ response, request, status = 301 }: any) => {
    const res =
      status !== 404
        ? createResponse({
            status: status,
            setCookies,
            headers: new Headers({}),
            ...response,
          })
        : NextResponse.next();
    const req = createRequest(request);
    return { res, req };
  };

  // Stub for NextResponse generation, see https://github.com/vercel/next.js/issues/42374
  (Headers.prototype as any).getAll = () => [];

  beforeEach(() => {
    debugSpy.resetHistory();
  });

  afterEach(() => {
    sandbox.restore();
    nextRedirectStub?.restore();
    nextRewriteStub?.restore();
  });

  describe('redirects middleware - handler', () => {
    describe('preview', () => {
      it('prerender bypass cookie is present', async () => {
        const { middleware } = createMiddleware();
        const res = NextResponse.next();

        const req = createRequest({
          cookies: {
            __prerender_bypass: true,
          },
        });

        const finalRes = await middleware.handle(req, res);

        validateDebugLog('redirects middleware start: %o', {
          hostname: 'foo.net',
          language: 'en',
          pathname: '/styleguide',
        });

        validateDebugLog('skipped (preview)');

        expect(finalRes).to.deep.equal(res);
      });

      it('preview data cookie is present', async () => {
        const { middleware } = createMiddleware();
        const res = NextResponse.next();

        const req = createRequest({
          cookies: {
            __next_preview_data: true,
          },
        });

        const finalRes = await middleware.handle(req, res);

        validateDebugLog('redirects middleware start: %o', {
          hostname: 'foo.net',
          language: 'en',
          pathname: '/styleguide',
        });

        validateDebugLog('skipped (preview)');

        expect(finalRes).to.deep.equal(res);
      });
    });

    describe('Extensibility', () => {
      it('should use custom redirectsService when provided', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          href: 'http://localhost:3000/custom-target',
          pathname: '/custom-target',
          origin: 'http://localhost:3000',
          locale: 'en',
          search: '',
          clone: cloneUrl,
        };
        const { res, req } = createTestRequestResponse({
          response: {
            url,
          },
          request: {
            nextUrl: {
              pathname: '/custom-pattern',
              href: 'http://localhost:3000/custom-pattern',
              locale: 'en',
              origin: 'http://localhost:3000',
              clone: cloneUrl,
            },
          },
          status: 301,
        });
        const customRedirectsService = {
          fetchRedirects: sandbox.stub().resolves([
            {
              pattern: '/custom-pattern',
              target: '/custom-target',
              redirectType: REDIRECT_TYPE_301,
              isQueryStringPreserved: false,
            },
          ]),
        };

        setupRedirectStub(301);

        const { middleware } = createMiddleware({
          redirectsMiddlewareConfig: {
            redirectsService: customRedirectsService,
          },
        });

        const finalRes = await middleware.handle(req, res);

        expect(customRedirectsService.fetchRedirects).to.be.calledOnce;

        validateDebugLog('redirects middleware start: %o', {
          hostname: 'foo.net',
          language: 'en',
          pathname: '/custom-pattern',
        });

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        expect(finalRes.status).to.equal(301);
      });
    });

    it('should apply both default and custom rules when custom disabled function provided', async () => {
      const res = NextResponse.next();

      const test = async (pathname: string, middleware: any) => {
        const req = createRequest({
          nextUrl: {
            pathname,
          },
        });

        const finalRes = await middleware.handle(req, res);

        validateDebugLog('redirects middleware start: %o', {
          hostname: 'foo.net',
          language: 'en',
          pathname,
        });

        validateDebugLog('skipped (redirects middleware is disabled)');

        debugSpy.resetHistory();

        expect(finalRes).to.deep.equal(res);
      };

      const skip = (req: NextRequest) => req.nextUrl.pathname === '/crazypath/luna';

      const { middleware } = createMiddleware({
        redirectsMiddlewareConfig: {
          skip,
        },
      });

      await test('/api/layout/render', middleware);
      await test('/sitecore/render', middleware);
      await test('/_next/webpack', middleware);
      await test('/crazypath/luna', middleware);
    });

    it('should return next response if disabled/skip is true', async () => {
      const res = createResponse({
        url: 'http://localhost:3000',
      });
      const nextStub = sinon
        .stub(NextResponse, 'next')
        .callsFake(() => res as unknown as NextResponse);

      const props = {
        redirectsMiddlewareConfig: {
          skip: (req: any) =>
            req?.nextUrl.pathname === '/styleguide' && req.nextUrl.locale === 'en',
        },
      };
      const req = createRequest();
      const { middleware } = createMiddleware(props);
      const finalRes = await middleware.handle(req, res);

      validateDebugLog('redirects middleware start: %o', {
        hostname: 'foo.net',
        language: 'en',
        pathname: '/styleguide',
      });

      validateDebugLog('skipped (redirects middleware is disabled)');

      expect(finalRes).to.deep.equal(res);

      nextStub.restore();
    });

    it('should honor global "enabled" prop', async () => {
      const res = createResponse({
        url: 'http://localhost:3000',
      });
      const nextStub = sinon
        .stub(NextResponse, 'next')
        .callsFake(() => res as unknown as NextResponse);

      const props = {
        enabled: false,
      };
      const req = createRequest();
      const { middleware } = createMiddleware({
        redirectsMiddlewareConfig: props,
      });
      const finalRes = await middleware.handle(req, res);
      validateDebugLog('skipped (redirects middleware is disabled globally)');

      expect(finalRes).to.deep.equal(res);

      nextStub.restore();
    });

    it('should return next response when redirects does not exist', async () => {
      const res = createResponse({
        url: 'http://localhost:3000/found',
      });
      const nextStub = sandbox.stub(NextResponse, 'next').returns(res as unknown as NextResponse);
      const req = createRequest();
      const { middleware, fetchRedirects, siteResolver } = createMiddleware();
      const finalRes = await middleware.handle(req, res);

      validateDebugLog('redirects middleware start: %o', {
        hostname: 'foo.net',
        language: 'en',
        pathname: '/styleguide',
      });

      validateDebugLog('skipped (redirect does not exist)');

      expect(siteResolver.getByHost).to.be.calledWith(hostname);
      // eslint-disable-next-line no-unused-expressions
      expect(fetchRedirects.called).to.be.true;
      expect(finalRes).to.deep.equal(res);

      nextStub.restore();
    });

    describe('should return appropriate redirect type when redirects exists', () => {
      it('should return 301 redirect', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          href: 'http://localhost:3000/found',
          pathname: '/found',
          origin: 'http://localhost:3000',
          locale: 'en',
          search: '',
          clone: cloneUrl,
        };
        const { res, req } = createTestRequestResponse({
          response: {
            url,
          },
          request: {
            nextUrl: {
              pathname: '/not-found',
              origin: 'http://localhost:3000',
              locale: 'en',
              href: 'http://localhost:3000/not-found',
              clone: cloneUrl,
            },
          },
        });
        setupRedirectStub(301);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: 'not-found',
            target: '/found',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: false,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        // less brittle than deep equal on different url shapes
        expect(finalRes.status).to.equal(res.status);
      });

      it('should override locale with locale parsed from target', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          pathname: 'http://localhost:3000/found',
          href: 'http://localhost:3000/not-found',
          origin: 'http://localhost:3000',
          locale: 'ua',
          clone: cloneUrl,
        };
        const { res, req } = createTestRequestResponse({
          response: {
            url,
          },
          request: {
            nextUrl: {
              pathname: '/not-found',
              href: 'http://localhost:3000/not-found',
              origin: 'http://localhost:3000',
              locale: 'en',
              clone: cloneUrl,
            },
          },
          status: 200,
        });
        setupRewriteStub(200, res);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: 'not-found',
            target: '/ua/found',
            redirectType: REDIRECT_TYPE_SERVER_TRANSFER,
            isQueryStringPreserved: true,
            locale: 'en',
          },
          req,
          res
        );

        // rewrite path -> expect our custom rewrite header
        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: { 'x-sc-rewrite': 'http://localhost:3000/found' },
          redirected: undefined,
          status: 200,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
      });

      it('should preserve query string on relative path redirect, when isQueryStringPreserved is true', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          origin: 'http://localhost:3000',
          pathname: '/found',
          href: 'http://localhost:3000/not-found?abc=def',
          search: '?abc=def',
          locale: 'en',
          clone: cloneUrl,
        };
        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/not-found',
              href: 'http://localhost:3000/not-found?abc=def',
              origin: 'http://localhost:3000',
              locale: 'en',
              search: '?abc=def',
              clone: cloneUrl,
            },
          },
          status: 200,
        });

        setupRewriteStub(200, res);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: '/not-found?abc=def',
            target: '/found',
            redirectType: REDIRECT_TYPE_SERVER_TRANSFER,
            isQueryStringPreserved: true,
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: { 'x-sc-rewrite': 'http://localhost:3000/found?abc=def' },
          redirected: undefined,
          status: 200,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
      });

      it('should redirect, when pattern uses with query string', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          href: 'http://localhost:3000/found?abc=def',
          pathname: '/found',
          origin: 'http://localhost:3000',
          locale: 'en',
          search: '?abc=def',
          clone: cloneUrl,
        };
        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/not-found',
              search: '?abc=def',
              href: 'http://localhost:3000/not-found?abc=def',
              locale: 'en',
              origin: 'http://localhost:3000',
              clone: cloneUrl,
            },
          },
        });
        setupRedirectStub(301);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: '/not-found?abc=def',
            target: '/found',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: true,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
      });

      it('should redirect, when pattern is regex and uses query string', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          href: 'http://localhost:3000/found?abc=def',
          pathname: '/found',
          origin: 'http://localhost:3000',
          locale: 'en',
          search: '?abc=def',
          clone: cloneUrl,
        };
        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/not-found',
              search: '?abc=def',
              href: 'http://localhost:3000/not-found?abc=def',
              locale: 'en',
              origin: 'http://localhost:3000',
              clone: cloneUrl,
            },
          },
        });
        setupRedirectStub(301);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: 'not-found\\?abc=def',
            target: '/found',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: true,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
      });

      it('should not redirect, when pattern uses with query string', async () => {
        const { res, req } = createTestRequestResponse({
          response: { url: {} },
          request: {
            nextUrl: {
              pathname: '/not-found',
              href: 'http://localhost:3000/not-found',
              locale: 'en',
              clone() {
                return Object.assign({}, req.nextUrl);
              },
            },
          },
          status: 404,
        });

        const { finalRes } = await runTestWithRedirect(
          {
            pattern: 'not-found\\?abc=def',
            target: 'http://localhost:3000/found',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: true,
            locale: 'en',
          },
          req,
          res
        );

        validateDebugLog('skipped (redirect does not exist)');

        expect(finalRes).to.deep.equal(res);
      });

      it('should redirect, when target uses query string', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          href: 'http://localhost:3000/found?abc=def',
          pathname: '/found',
          origin: 'http://localhost:3000',
          locale: 'en',
          search: '?abc=def',
          clone: cloneUrl,
        };
        setupRedirectStub(301);
        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/not-found',
              search: '?abc=def',
              href: 'http://localhost:3000/not-found?abc=def',
              locale: 'en',
              origin: 'http://localhost:3000',
              clone: cloneUrl,
            },
          },
          status: 301,
        });

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: 'not-found',
            target: '/found?abc=def',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: false,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
      });

      it('should redirect without QS, when url has query string, pattern doesnt and query string not preserved', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          href: 'http://localhost:3000/found',
          pathname: '/found',
          origin: 'http://localhost:3000',
          locale: 'en',
          search: '',
          clone: cloneUrl,
        };
        setupRedirectStub(301);
        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/not-found',
              search: '?abc=def',
              href: 'http://localhost:3000/not-found?abc=def',
              locale: 'en',
              origin: 'http://localhost:3000',
              clone: cloneUrl,
            },
          },
          status: 301,
        });

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: 'not-found',
            target: '/found',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: false,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
      });

      it('should prefer pattern with locale when pattern is url', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          href: 'http://localhost:3000/found',
          pathname: '/found',
          origin: 'http://localhost:3000',
          locale: 'pl-PL',
          search: '',
          clone: cloneUrl,
        };
        setupRedirectStub(301);
        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/not-found',
              href: 'http://localhost:3000/pl-PL/not-found',
              locale: 'pl-PL',
              origin: 'http://localhost:3000',
              clone: cloneUrl,
            },
          },
          status: 301,
        });

        const { finalRes, fetchRedirects } = await runTestWithRedirect(
          {
            redirectMaps: [
              {
                // note: lowercase locale in pattern should still match
                pattern: '/pl-pl/not-found',
                target: '/found',
                redirectType: REDIRECT_TYPE_301,
                isQueryStringPreserved: false,
              },
              {
                pattern: '/not-found',
                target: '/still-not-found',
                redirectType: REDIRECT_TYPE_301,
                isQueryStringPreserved: false,
              },
            ],
            locale: 'pl-PL',
          },
          req,
          res
        );
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
      });

      it('should prefer pattern with locale when pattern is regex', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          href: 'http://localhost:3000/found/for-real',
          pathname: '/found/for-real',
          origin: 'http://localhost:3000',
          locale: 'pl-PL',
          search: '',
          clone: cloneUrl,
        };
        setupRedirectStub(301);
        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/not-found/for-real',
              search: '',
              href: 'http://localhost:3000/not-found',
              locale: 'pl-PL',
              origin: 'http://localhost:3000',
              clone: cloneUrl,
            },
          },
          status: 301,
        });

        const { finalRes, fetchRedirects } = await runTestWithRedirect(
          {
            redirectMaps: [
              {
                pattern: '/pl-PL/not-found/(.*)',
                target: '/found/$1',
                redirectType: REDIRECT_TYPE_301,
              },
              {
                pattern: 'not-found/(.*)',
                target: '/still-not-found/$1',
                redirectType: REDIRECT_TYPE_301,
              },
            ],
            locale: 'pl-PL',
          },
          req,
          res
        );
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
      });

      it('should redirect uses token in target', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          href: 'http://localhost:3000/test1',
          pathname: '/test1',
          origin: 'http://localhost:3000',
          locale: 'en',
          search: '',
          clone: cloneUrl,
        };
        setupRedirectStub(301);

        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/found1',
              search: '',
              href: 'http://localhost:3000/found1',
              locale: 'en',
              origin: 'http://localhost:3000',
              clone: cloneUrl,
            },
          },
          status: 301,
        });

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: '/found(\\d+)/',
            target: 'test$1',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: false,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
      });

      it('should return 302 redirect', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          href: 'http://localhost:3000/found',
          pathname: '/found',
          origin: 'http://localhost:3000',
          locale: 'en',
          search: '',
          clone: cloneUrl,
        };
        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/not-found',
              href: 'http://localhost:3000/not-found',
              locale: 'en',
              origin: 'http://localhost:3000',
              clone: cloneUrl,
            },
          },
          status: 302,
        });
        setupRedirectStub(302);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: 'not-found',
            target: '/found',
            redirectType: REDIRECT_TYPE_302,
            isQueryStringPreserved: false,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 302,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
      });

      it('should perform variable substitution for regex redirects to external absolute URLs', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const expectedUrl = 'https://museum.olympics.com/docs/AOTC/LONGUEURSDAVANCE-9.4-DE.pdf';

        const url = {
          href: expectedUrl,
          pathname: '/docs/AOTC/LONGUEURSDAVANCE-9.4-DE.pdf',
          origin: 'https://museum.olympics.com',
          locale: 'en',
          search: '',
          clone: cloneUrl,
        };

        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/redirect/docs/AOTC/LONGUEURSDAVANCE-9.4-DE.pdf',
              href: 'http://localhost:3000/redirect/docs/AOTC/LONGUEURSDAVANCE-9.4-DE.pdf',
              origin: 'http://localhost:3000',
              locale: 'en',
              clone: cloneUrl,
            },
          },
          status: 302,
        });

        setupRedirectStub(302);

        const { finalRes } = await runTestWithRedirect(
          {
            pattern: '^/redirect/docs/([^/]+)/([^/]+)$',
            target: 'https://museum.olympics.com/docs/$1/$2',
            redirectType: REDIRECT_TYPE_302,
            isQueryStringPreserved: false,
            locale: 'en',
          },
          req,
          res
        );

        expect(normalizeUrl(finalRes.url)).to.equal(expectedUrl);
      });

      it('should perform variable substitution for regex redirects to internal absolute URLs', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const expectedUrl = 'http://localhost:3000/About/fruit/apple';

        const url = {
          href: expectedUrl,
          pathname: '/About/fruit/apple',
          origin: 'http://localhost:3000',
          locale: 'en',
          search: '',
          clone: cloneUrl,
        };

        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/redirect/fruit/apple',
              href: 'http://localhost:3000/redirect/fruit/apple',
              origin: 'http://localhost:3000',
              locale: 'en',
              clone: cloneUrl,
            },
          },
          status: 301,
        });

        setupRedirectStub(301);

        const { finalRes } = await runTestWithRedirect(
          {
            pattern: '^/redirect/(.*)/(.*)$',
            target: 'http://localhost:3000/About/$1/$2',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: false,
            locale: 'en',
          },
          req,
          res
        );

        expect(normalizeUrl(finalRes.url)).to.equal(expectedUrl);
      });

      it('should handle multiple capture groups in regex redirects to external URLs', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const expectedUrl = 'https://example.com/products/electronics/laptop/dell';

        const url = {
          href: expectedUrl,
          pathname: '/products/electronics/laptop/dell',
          origin: 'https://example.com',
          locale: 'en',
          search: '',
          clone: cloneUrl,
        };

        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/old-shop/electronics/laptop/dell',
              href: 'http://localhost:3000/old-shop/electronics/laptop/dell',
              origin: 'http://localhost:3000',
              locale: 'en',
              clone: cloneUrl,
            },
          },
          status: 301,
        });

        setupRedirectStub(301);

        const { finalRes } = await runTestWithRedirect(
          {
            pattern: '^/old-shop/([^/]+)/([^/]+)/([^/]+)$',
            target: 'https://example.com/products/$1/$2/$3',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: false,
            locale: 'en',
          },
          req,
          res
        );

        expect(normalizeUrl(finalRes.url)).to.equal(expectedUrl);
      });

      it('should handle regex redirects with no capture groups to external URLs', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const expectedUrl = 'https://example.com/static-page';

        const url = {
          href: expectedUrl,
          pathname: '/static-page',
          origin: 'https://example.com',
          locale: 'en',
          search: '',
          clone: cloneUrl,
        };

        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/old-static',
              href: 'http://localhost:3000/old-static',
              origin: 'http://localhost:3000',
              locale: 'en',
              clone: cloneUrl,
            },
          },
          status: 302,
        });

        setupRedirectStub(302);

        const { finalRes } = await runTestWithRedirect(
          {
            pattern: '^/old-static$',
            target: 'https://example.com/static-page',
            redirectType: REDIRECT_TYPE_302,
            isQueryStringPreserved: false,
            locale: 'en',
          },
          req,
          res
        );

        expect(normalizeUrl(finalRes.url)).to.equal(expectedUrl);
      });

      it('should handle regex redirects with trailing slash in external URLs', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const expectedUrl = 'https://example.com/docs/guide/intro/';

        const url = {
          href: expectedUrl,
          pathname: '/docs/guide/intro/',
          origin: 'https://example.com',
          locale: 'en',
          search: '',
          clone: cloneUrl,
        };

        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/documentation/guide/intro/',
              href: 'http://localhost:3000/documentation/guide/intro/',
              origin: 'http://localhost:3000',
              locale: 'en',
              clone: cloneUrl,
            },
          },
          status: 301,
        });

        setupRedirectStub(301);

        const { finalRes } = await runTestWithRedirect(
          {
            pattern: '^/documentation/([^/]+)/([^/]+)/?$',
            target: 'https://example.com/docs/$1/$2/',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: false,
            locale: 'en',
          },
          req,
          res
        );

        expect(normalizeUrl(finalRes.url)).to.equal(expectedUrl);
      });

      it('should preserve unmatched placeholder variables as literal text in external URLs', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const expectedUrl = 'https://example.com/path/first/second/';

        const url = {
          href: expectedUrl,
          pathname: '/path/first/second/',
          origin: 'https://example.com',
          locale: 'en',
          search: '',
          clone: cloneUrl,
        };

        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/old/first/second',
              href: 'http://localhost:3000/old/first/second',
              origin: 'http://localhost:3000',
              locale: 'en',
              clone: cloneUrl,
            },
          },
          status: 301,
        });

        setupRedirectStub(301);

        const { finalRes } = await runTestWithRedirect(
          {
            pattern: '^/old/([^/]+)/([^/]+)$',
            target: 'https://example.com/path/$1/$2/$3',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: false,
            locale: 'en',
          },
          req,
          res
        );

        expect(normalizeUrl(finalRes.url)).to.equal(expectedUrl);
      });

      it('should redirect uses token $siteLang in target url', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          href: 'http://localhost:3000/da/found',
          pathname: '/da/found',
          origin: 'http://localhost:3000',
          locale: 'da',
          search: '',
          clone: cloneUrl,
        };
        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/not-found',
              search: '',
              href: 'http://localhost:3000/not-found',
              locale: 'en',
              origin: 'http://localhost:3000',
              clone: cloneUrl,
            },
          },
        });
        setupRedirectStub(301);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: '/not-found/',
            target: '/$siteLang/found',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: false,
            locale: 'en',
            sites: sitesFromConfigFile,
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
      });

      it('should return default response if no redirect type defined', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          href: 'http://localhost:3000/found',
          pathname: '/found',
          origin: 'http://localhost:3000',
          locale: 'en',
          search: '',
          clone: cloneUrl,
        };
        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/not-found',
              href: 'http://localhost:3000/not-found',
              locale: 'en',
              clone() {
                return Object.assign({}, req.nextUrl);
              },
            },
          },
          status: 404,
        });

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: 'not-found',
            target: 'http://localhost:3000/found',
            redirectType: 'default',
            isQueryStringPreserved: true,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {
            'x-middleware-next': '1',
          },
          redirected: false,
          status: 200,
          url: '',
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes).to.deep.equal(res);
      });

      it('should rewrite path when redirect type is server transfer', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          clone: cloneUrl,
          href: 'http://localhost:3000/not-found',
          locale: 'en',
          pathname: 'http://localhost:3000/found',
        };
        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/not-found',
              href: 'http://localhost:3000/not-found',
              locale: 'en',
              clone: cloneUrl,
            },
          },
          status: 200,
        });
        setupRewriteStub(200, res);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: 'not-found',
            target: 'http://localhost:3000/found',
            redirectType: REDIRECT_TYPE_SERVER_TRANSFER,
            isQueryStringPreserved: true,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 200,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
      });

      it('should use sc_site cookie', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const siteName = 'foo';
        const res = NextResponse.next();
        res.cookies.set('sc_site', siteName);
        const req = createRequest({
          nextUrl: {
            href: 'http://localhost:3000/not-found',
            pathname: '/not-found',
            locale: 'en',
            origin: 'http://localhost:3000',
            search: '',
            clone: cloneUrl,
          },
        });

        setupRedirectStub(301);

        const { middleware, fetchRedirects, siteResolver } = createMiddleware({
          pattern: '/not-found',
          target: '/found',
          redirectType: REDIRECT_TYPE_301,
          isQueryStringPreserved: true,
          locale: 'en',
        });

        const expected = NextResponse.redirect('http://localhost:3000/found', {
          ...res,
          status: 301,
          headers: { ...res?.headers },
        });

        const finalRes = await middleware.handle(req, res);

        expect(siteResolver.getByHost).to.not.have.been.called;
        expect(siteResolver.getByName).to.be.calledWith(siteName);
        expect(fetchRedirects).to.be.calledWith(siteName);
        expect(finalRes.status).to.equal(expected.status);

        validateDebugLog('redirects middleware start: %o', {
          hostname: 'foo.net',
          language: 'en',
          pathname: '/not-found',
        });

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {
            'set-cookie': 'sc_site=foo; Path=/',
            'x-middleware-set-cookie': 'sc_site=foo; Path=/',
          },
          redirected: undefined,
          status: 301,
          url: 'http://localhost:3000/found',
        });
      });

      it('should preserve site name from response data when provided, if no redirect type defined', async () => {
        const res = NextResponse.next();
        const site = 'learn2grow';
        res.cookies.set('sc_site', site);
        const req = createRequest({
          nextUrl: {
            href: 'http://localhost:3000/not-found',
            pathname: '/not-found',
            locale: 'en',
            clone() {
              return Object.assign({}, req.nextUrl);
            },
          },
        });

        const { middleware, fetchRedirects, siteResolver } = createMiddleware();

        const finalRes = await middleware.handle(req, res);

        validateDebugLog('redirects middleware start: %o', {
          hostname: 'foo.net',
          language: 'en',
          pathname: '/not-found',
        });

        expect(siteResolver.getByHost).to.not.be.called;
        expect(siteResolver.getByName).to.be.calledWith(site);
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.cookies.get('sc_site')?.value).to.equal(site);
        // pass-through: ensure the same response instance is returned
        expect(finalRes).to.deep.equal(res);
      });

      it('should preserve site name from response data when provided, if handler is disabled / skipped', async () => {
        const res = NextResponse.next();
        const site = 'learn2grow';
        res.cookies.set('sc_site', site);
        const req = createRequest({
          nextUrl: {
            href: 'http://localhost:3000/not-found',
            pathname: '/not-found',
            locale: 'en',
            clone() {
              return Object.assign({}, req.nextUrl);
            },
          },
        });

        const { middleware, fetchRedirects, siteResolver } = createMiddleware({
          pattern: 'not-found',
          target: 'http://localhost:3000/found',
          redirectType: 'default',
          isQueryStringPreserved: true,
          locale: 'en',
          redirectsMiddlewareConfig: {
            skip: () => true,
          },
        });

        const finalRes = await middleware.handle(req, res);

        validateDebugLog('redirects middleware start: %o', {
          hostname: 'foo.net',
          language: 'en',
          pathname: '/not-found',
        });

        validateDebugLog('skipped (redirects middleware is disabled)');

        expect(siteResolver.getByHost).to.not.be.called;
        expect(siteResolver.getByName).to.not.be.called;
        expect(fetchRedirects.called).to.be.false;
        expect(finalRes.cookies.get('sc_site')?.value).to.equal(site);
        // pass-through: ensure the same response instance is returned
        expect(finalRes).to.deep.equal(res);
      });

      it('default fallback hostname is used', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          clone: cloneUrl,
          href: 'http://localhost:3000/found',
          locale: 'en',
          origin: 'http://localhost:3000',
          pathname: '/not-found',
        };
        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            headerValues: {
              host: undefined,
            },
            nextUrl: {
              pathname: '/not-found',
              href: 'http://localhost:3000/not-found',
              locale: 'en',
              origin: 'http://localhost:3000',
              clone: cloneUrl,
            },
          },
        });
        setupRedirectStub(301);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: 'not-found',
            target: 'http://localhost:3000/found',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: true,
            locale: 'en',
          },
          req,
          res,
          'localhost'
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith('localhost');
        expect(fetchRedirects).to.be.calledWith(siteName);
        expect(finalRes.status).to.equal(res.status);
      });

      it('custom fallback hostname is used', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          clone: cloneUrl,
          href: 'http://localhost:3000/found',
          locale: 'en',
          origin: 'http://localhost:3000',
          pathname: '/not-found',
        };
        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            headerValues: {
              host: undefined,
            },
            nextUrl: {
              pathname: '/not-found',
              href: 'http://localhost:3000/not-found',
              locale: 'en',
              origin: 'http://localhost:3000',
              clone: cloneUrl,
            },
          },
        });
        setupRedirectStub(301);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: 'not-found',
            target: 'http://localhost:3000/found',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: true,
            locale: 'en',
            redirectsMiddlewareConfig: {
              defaultHostname: 'foobar',
            },
          },
          req,
          res,
          'foobar'
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith('foobar');
        expect(fetchRedirects).to.be.calledWith(siteName);
        expect(finalRes.status).to.equal(res.status);
      });

      it('should redirect, when next.config uses params trailingSlash is true', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          clone: cloneUrl,
          href: 'http://localhost:3000/found/',
          locale: 'en',
          origin: 'http://localhost:3000',
          pathname: '/not-found/',
        };
        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/not-found/',
              href: 'http://localhost:3000/not-found/',
              locale: 'en',
              origin: 'http://localhost:3000',
              clone: cloneUrl,
            },
          },
        });
        setupRedirectStub(301);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: '/not-found/',
            target: 'http://localhost:3000/found/',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: true,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
      });

      it('should redirect when the isQueryStringPreserved parameter is true and the target URL contains query string parameters', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          clone: cloneUrl,
          href: 'http://localhost:3000/found?b=1&a=1',
          locale: 'en',
          origin: 'http://localhost:3000',
          search: '?b=1&a=1',
          pathname: '/found',
        };
        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/not-found',
              href: 'http://localhost:3000/not-found?b=1',
              locale: 'en',
              origin: 'http://localhost:3000',
              search: '?b=1',
              clone: cloneUrl,
            },
          },
        });
        setupRedirectStub(301);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: 'not-found\\?b=1',
            target: '/found?a=1',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: true,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
      });

      it('should remove rewrite headers and redirect 301', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          clone: cloneUrl,
          href: 'http://localhost:3000/found',
          locale: 'en',
          origin: 'http://localhost:3000',
          search: '',
          pathname: '/found',
        };
        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              href: 'http://localhost:3000/not-found',
              pathname: '/not-found',
              locale: 'en',
              search: '',
              origin: 'http://localhost:3000',
              clone: cloneUrl,
            },
          },
        });
        setupRedirectStub(301);
        res.headers.set('x-middleware-next', '1');
        res.headers.set('x-middleware-rewrite', '1');
        res.headers.set(REWRITE_HEADER_NAME, 1);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: 'not-found',
            target: '/found',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: false,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        // Check that the headers were not removed
        expect(finalRes.headers.has('x-middleware-next')).to.equal(false);
        expect(finalRes.headers.has('x-middleware-rewrite')).to.equal(false);
        expect(finalRes.headers.has(REWRITE_HEADER_NAME)).to.equal(false);

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
      });

      it('should return 301 redirect when pattern has special symbols "?"', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          clone: cloneUrl,
          href: 'http://localhost:3000/found?a=1&w=1',
          locale: 'en',
          origin: 'http://localhost:3000',
          search: '?a=1&w=1',
          pathname: '/found',
        };

        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/not-found/',
              search: '?a=1&w=1',
              href: 'http://localhost:3000/not-found/?a=1&w=1',
              locale: 'en',
              origin: 'http://localhost:3000',
              clone: cloneUrl,
            },
          },
        });
        setupRedirectStub(301);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: '/[/]?not-found\\?a=1&w=1/',
            target: '/found',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: true,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
      });

      it('should return 301 redirect when pattern has another order of query string', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          clone: cloneUrl,
          href: 'http://localhost:3000/found?a=1&w=1',
          locale: 'en',
          origin: 'http://localhost:3000',
          search: '?a=1&w=1',
          pathname: '/found',
        };

        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/not-found/',
              search: '?a=1&w=1',
              href: 'http://localhost:3000/not-found/?a=1&w=1',
              locale: 'en',
              origin: 'http://localhost:3000',
              clone: cloneUrl,
            },
          },
        });
        setupRedirectStub(301);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: '/not-found?w=1&a=1/',
            target: '/found',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: true,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
      });

      it('should not strip locale from external absolute URLs', async () => {
        const externalUrl = 'https://example.com/en/this-is-en';
        const cloneUrl = () => Object.assign({}, req.nextUrl);

        const url = {
          href: externalUrl,
          pathname: '/en/this-is-en',
          origin: 'https://example.com',
          locale: 'en',
          search: '',
          clone: cloneUrl,
        };

        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/ra',
              href: 'http://localhost:3000/ra',
              origin: 'http://localhost:3000',
              locale: 'en',
              clone: cloneUrl,
            },
          },
          status: 302,
        });

        setupRedirectStub(302);

        const { finalRes } = await runTestWithRedirect(
          {
            pattern: '/ra',
            target: externalUrl,
            redirectType: REDIRECT_TYPE_302,
            isQueryStringPreserved: false,
            locale: 'en',
          },
          req,
          res
        );

        expect(finalRes.url).to.equal(externalUrl);
      });

      it('should redirect to URL with current locale, when isLanguagePreserved is set to true and target does not contain language', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          href: 'http://localhost:3000/target/',
          pathname: '/target/',
          origin: 'http://localhost:3000',
          locale: 'en',
          search: '',
          clone: cloneUrl,
        };

        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/source',
              href: 'http://localhost:3000/source',
              origin: 'http://localhost:3000',
              locale: 'en',
              clone: cloneUrl,
            },
          },
          status: 301,
        });

        setupRedirectStub(301);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: '/source',
            target: '/target/',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: false,
            isLanguagePreserved: true,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
        expect(normalizeUrl(finalRes.url)).to.equal('http://localhost:3000/target/');
        expect((finalRes.url as unknown as NextURL).locale).to.equal('en');
      });

      it('should redirect to URL with empty locale (let nextjs decide), when isLanguagePreserved is set to false and target does not have language', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          href: 'http://localhost:3000/target/',
          pathname: '/target/',
          origin: 'http://localhost:3000',
          locale: '',
          search: '',
          clone: cloneUrl,
        };

        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/source',
              href: 'http://localhost:3000/source',
              origin: 'http://localhost:3000',
              locale: 'en',
              defaultLocale: 'es',
              clone: cloneUrl,
            },
          },
          status: 301,
        });

        setupRedirectStub(301);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: '/source',
            target: '/target/',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: false,
            isLanguagePreserved: false,
            locale: 'en',
            redirectsMiddlewareConfig: {
              locales: ['en', 'es', 'da-DK'],
            },
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
        expect(normalizeUrl(finalRes.url)).to.equal('http://localhost:3000/target/');
        expect((finalRes.url as unknown as NextURL).locale).to.equal('');
      });

      it('should redirect to URL with locale, when target contains locale prefix and isLanguagePreserved is true', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          href: 'http://localhost:3000/target/',
          pathname: '/target/',
          origin: 'http://localhost:3000',
          locale: 'da-DK',
          search: '',
          clone: cloneUrl,
        };

        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/source',
              href: 'http://localhost:3000/source',
              origin: 'http://localhost:3000',
              locale: 'en',
              clone: cloneUrl,
            },
          },
          status: 301,
        });

        setupRedirectStub(301);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            redirectsMiddlewareConfig: {
              locales: ['en', 'da-DK'],
            },
            pattern: '/source',
            target: '/da-DK/target/',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: false,
            isLanguagePreserved: true,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
        expect(normalizeUrl(finalRes.url)).to.equal('http://localhost:3000/target/');
        expect((finalRes.url as unknown as NextURL).locale).to.equal('da-DK');
      });

      it('should redirect to locale path in app router, when isLanguagePreserved is true and incoming request has locale path', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          href: 'http://localhost:3000/target/',
          pathname: '/target/',
          origin: 'http://localhost:3000',
          locale: 'en',
          search: '',
          clone: cloneUrl,
        };

        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/source',
              href: 'http://localhost:3000/source',
              origin: 'http://localhost:3000',
              locale: 'en',
              clone: cloneUrl,
            },
          },
          status: 301,
        });

        // Set locale header to indicate app router
        res.headers.set(LOCALE_HEADER_NAME, 'en');

        setupRedirectStub(301);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            redirectsMiddlewareConfig: {
              locales: ['en', 'da-DK'],
            },
            pattern: 'source',
            target: '/target/',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: false,
            isLanguagePreserved: true,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
        // App router should have locale preserved on the URL
        expect((finalRes.url as unknown as NextURL).locale).to.equal('en');
      });

      it('should set response locale correctly when target contains locale in mixed upper-lower case', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          href: 'http://localhost:3000/target/',
          pathname: '/target/',
          origin: 'http://localhost:3000',
          locale: 'Da-Dk',
          search: '',
          clone: cloneUrl,
        };

        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/source',
              href: 'http://localhost:3000/source',
              origin: 'http://localhost:3000',
              locale: 'en',
              clone: cloneUrl,
            },
          },
          status: 301,
        });

        setupRedirectStub(301);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            redirectsMiddlewareConfig: {
              locales: ['en', 'Da-Dk'],
            },
            pattern: 'source',
            target: '/Da-Dk/target/',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: false,
            isLanguagePreserved: true,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
        expect(normalizeUrl(finalRes.url)).to.equal('http://localhost:3000/target/');
        expect((finalRes.url as unknown as NextURL).locale).to.equal('Da-Dk');
      });

      it('should preserve query string, when isLanguagePreserved is true and incoming request has locale path and query string', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          href: 'http://localhost:3000/target/?foo=bar',
          pathname: '/target/',
          origin: 'http://localhost:3000',
          locale: 'en',
          search: '?foo=bar',
          clone: cloneUrl,
        };

        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/source',
              href: 'http://localhost:3000/source?foo=bar',
              origin: 'http://localhost:3000',
              locale: 'en',
              search: '?foo=bar',
              clone: cloneUrl,
            },
          },
          status: 301,
        });

        setupRedirectStub(301);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            redirectsMiddlewareConfig: {
              locales: ['en', 'da-DK'],
            },
            pattern: 'source',
            target: '/target/',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: true,
            isLanguagePreserved: true,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
        expect((finalRes.url as unknown as NextURL).locale).to.equal('en');
        expect((finalRes.url as unknown as NextURL).search).to.equal('?foo=bar');
      });

      it('should redirect and replace target $1 tokens correctly when target is a regex with replacement tokens and isLanguagePreserved is true (pages router)', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          href: 'http://localhost:3000/products/electronics',
          pathname: '/products/electronics',
          origin: 'http://localhost:3000',
          locale: 'en',
          search: '',
          clone: cloneUrl,
        };

        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/old-products/electronics',
              href: 'http://localhost:3000/old-products/electronics',
              origin: 'http://localhost:3000',
              locale: 'en',
              clone: cloneUrl,
            },
          },
          status: 301,
        });

        setupRedirectStub(301);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            redirectsMiddlewareConfig: {
              locales: ['en', 'da-DK'],
            },
            pattern: '/old-products/(.*)',
            target: '/products/$1',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: false,
            isLanguagePreserved: true,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
        expect(normalizeUrl(finalRes.url)).to.equal('http://localhost:3000/products/electronics');
        expect((finalRes.url as unknown as NextURL).locale).to.equal('en');
      });

      it('should redirect and replace target $1 tokens correctly when target is a regex with replacement tokens and isLanguagePreserved is true (app router)', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          href: 'http://localhost:3000/products/electronics',
          pathname: '/products/electronics',
          origin: 'http://localhost:3000',
          locale: 'en',
          search: '',
          clone: cloneUrl,
        };

        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/old-products/electronics',
              href: 'http://localhost:3000/old-products/electronics',
              origin: 'http://localhost:3000',
              locale: 'en',
              clone: cloneUrl,
            },
          },
          status: 301,
        });

        // Set locale header to indicate app router
        res.headers.set(LOCALE_HEADER_NAME, 'en');

        setupRedirectStub(301);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            redirectsMiddlewareConfig: {
              locales: ['en', 'da-DK'],
            },
            pattern: '/old-products/(.*)',
            target: '/products/$1',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: false,
            isLanguagePreserved: true,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
        // App router should have locale preserved on the URL
        expect((finalRes.url as unknown as NextURL).locale).to.equal('en');
      });
    });

    describe('should redirect to normalized path when nextjs specific "path" query string parameter is provided', () => {
      it('should return 301 redirect', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          clone: cloneUrl,
          href: 'http://localhost:3000/found',
          locale: 'en',
          origin: 'http://localhost:3000',
          search: '',
          pathname: '/found',
        };

        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/not-found',
              search: '?path=not-found',
              href: 'http://localhost:3000/not-found/?path=not-found',
              locale: 'en',
              origin: 'http://localhost:3000',
              clone: cloneUrl,
            },
          },
        });
        setupRedirectStub(301);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: '/not-found',
            target: '/found',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: false,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
      });

      it('should return 301 redirect when trailingSlash is true', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          clone: cloneUrl,
          href: 'http://localhost:3000/found/',
          locale: 'en',
          origin: 'http://localhost:3000',
          search: '',
          pathname: '/found/',
        };

        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/not-found/',
              search: '?path=not-found',
              href: 'http://localhost:3000/not-found/?path=not-found',
              locale: 'en',
              origin: 'http://localhost:3000',
              clone: cloneUrl,
            },
          },
        });
        setupRedirectStub(301);
        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: '/not-found/',
            target: '/found/',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: true,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
      });

      it('should clean redirect headers and return a 302 redirectt', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          clone: cloneUrl,
          href: 'http://localhost:3000/found',
          locale: 'en',
          origin: 'http://localhost:3000',
          search: '',
          pathname: '/found',
        };

        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/not-found',
              search: '?path=not-found&abc=edf',
              href: 'http://localhost:3000/not-found?path=not-found&abc=edf',
              locale: 'en',
              origin: 'http://localhost:3000',
              clone: cloneUrl,
            },
          },
          status: 302,
        });
        setupRedirectStub(302);
        res.headers.set('x-middleware-next', '1');
        res.headers.set('x-middleware-rewrite', '1');
        res.headers.set(REWRITE_HEADER_NAME, 1);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: '/not-found?abc=edf',
            target: '/found',
            redirectType: REDIRECT_TYPE_302,
            isQueryStringPreserved: false,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 302,
          url,
        });

        expect(finalRes.headers.has('x-middleware-next')).to.equal(false);
        expect(finalRes.headers.has('x-middleware-rewrite')).to.equal(false);
        expect(finalRes.headers.has(REWRITE_HEADER_NAME)).to.equal(false);

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(res.status);
      });

      it('should redirect regardless of case in pattern and target', async () => {
        // Set up a clone function (used by both req and res)
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          href: 'http://localhost:3000/Found',
          pathname: '/Found',
          origin: 'http://localhost:3000',
          locale: 'en',
          search: '',
          clone: cloneUrl,
        };

        // Create the test request and response
        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/About',
              href: 'http://localhost:3000/About',
              locale: 'en',
              origin: 'http://localhost:3000',
              clone: cloneUrl,
            },
          },
          status: 301,
        });

        setupRedirectStub(301);
        res.headers.set('x-middleware-next', '1');
        res.headers.set('x-middleware-rewrite', '1');
        res.headers.set(REWRITE_HEADER_NAME, 1);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: '/About',
            target: '/Found',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: false,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        expect(siteResolver.getByHost).to.have.been.called;
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(301);
      });

      it('should redirect to lowercase target even if incoming path is mixed-case', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          href: 'http://localhost:3000/about',
          pathname: '/about',
          origin: 'http://localhost:3000',
          locale: 'en',
          search: '',
          clone: cloneUrl,
        };

        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/AnotherPage',
              href: 'http://localhost:3000/AnotherPage',
              locale: 'en',
              origin: 'http://localhost:3000',
              clone: cloneUrl,
            },
          },
          status: 301,
        });

        setupRedirectStub(301);
        res.headers.set('x-middleware-next', '1');
        res.headers.set('x-middleware-rewrite', '1');
        res.headers.set(REWRITE_HEADER_NAME, 1);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: '/anotherpage',
            target: '/about',
            redirectType: REDIRECT_TYPE_301,
            isQueryStringPreserved: false,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {},
          redirected: undefined,
          status: 301,
          url,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        expect(siteResolver.getByHost).to.have.been.called;
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes.status).to.equal(301);
      });

      // TODO: This test is failing because of this bug https://sitecore.atlassian.net/browse/JSS-3955
      xit('should return rewrite', async () => {
        const cloneUrl = () => Object.assign({}, req.nextUrl);
        const url = {
          origin: 'http://localhost:3000',
          pathname: '/found',
          href: 'http://localhost:3000/found',
          search: '',
          locale: 'en',
          clone: cloneUrl,
        };

        const { res, req } = createTestRequestResponse({
          response: { url },
          request: {
            nextUrl: {
              pathname: '/not-found',
              search: '?path=not-found&abc=edf',
              href: 'http://localhost:3000/not-found?path=not-found&abc=edf',
              locale: 'en',
              origin: 'http://localhost:3000',
              clone: cloneUrl,
            },
          },
          status: 302,
        });
        setupRewriteStub(200, res);

        const { finalRes, fetchRedirects, siteResolver } = await runTestWithRedirect(
          {
            pattern: '/not-found',
            target: '/found',
            redirectType: REDIRECT_TYPE_SERVER_TRANSFER,
            isQueryStringPreserved: false,
            locale: 'en',
          },
          req,
          res
        );

        validateEndMessageDebugLog('redirects middleware end in %dms: %o', {
          headers: {
            'x-sc-rewrite': 'http://localhost:3000/found',
          },
          redirected: undefined,
          url,
          status: 200,
        });

        expect(siteResolver.getByHost).to.be.calledWith(hostname);
        // eslint-disable-next-line no-unused-expressions
        expect(fetchRedirects.called).to.be.true;
        expect(finalRes).to.deep.equal(res);
        expect(finalRes.status).to.equal(res.status);

        nextRedirectStub.restore();
      });
    });
  });

  describe('getLanguage', () => {
    it('should get Language from locale header if present', async () => {
      const cloneUrl = () => Object.assign({}, req.nextUrl);
      const url = {
        href: 'http://localhost:3000/found',
        pathname: '/found',
        origin: 'http://localhost:3000',
        locale: 'en',
        search: '',
        clone: cloneUrl,
      };
      const { res, req } = createTestRequestResponse({
        response: {
          url,
          headers: {
            'x-sc-locale': 'de-DE',
          },
        },
        request: {
          nextUrl: {
            pathname: '/not-found',
            origin: 'http://localhost:3000',
            href: 'http://localhost:3000/not-found',
            clone: cloneUrl,
            locale: 'en',
          },
        },
      });
      setupRedirectStub(301);

      const { middleware } = createMiddleware({
        defaultHostname: 'localhost:3000',
      });

      await middleware.handle(req, res);

      validateDebugLog('redirects middleware start: %o', {
        hostname: hostname,
        language: 'de-DE',
        pathname: '/not-found',
      });
    });

    it('should get Language from nexturl if locale header is not present', async () => {
      const cloneUrl = () => Object.assign({}, req.nextUrl);
      const url = {
        href: 'http://localhost:3000/found',
        pathname: '/found',
        origin: 'http://localhost:3000',
        locale: 'en',
        search: '',
        clone: cloneUrl,
      };
      const { res, req } = createTestRequestResponse({
        response: {
          url,
          headers: {},
        },
        request: {
          nextUrl: {
            pathname: '/not-found',
            origin: 'http://localhost:3000',
            href: 'http://localhost:3000/not-found',
            clone: cloneUrl,
            locale: 'pl-PL',
          },
        },
      });
      setupRedirectStub(301);

      const { middleware } = createMiddleware({
        defaultHostname: 'localhost:3000',
      });

      await middleware.handle(req, res);

      validateDebugLog('redirects middleware start: %o', {
        hostname: hostname,
        language: 'pl-PL',
        pathname: '/not-found',
      });
    });

    it('should update locale for pages router when target uses $siteLang token', async () => {
      const cloneUrl = () => Object.assign({}, req.nextUrl);
      const url = {
        href: 'http://localhost:3000/da/found',
        pathname: '/da/found',
        origin: 'http://localhost:3000',
        locale: 'en',
        clone: cloneUrl,
      };
      setupRedirectStub(301);

      const { res, req } = createTestRequestResponse({
        response: { url },
        request: {
          nextUrl: {
            pathname: '/not-found',
            href: 'http://localhost:3000/not-found',
            locale: 'en',
            origin: 'http://localhost:3000',
            clone: cloneUrl,
          },
        },
        status: 301,
      });

      const { middleware } = createMiddleware({
        pattern: '/not-found/',
        target: '/$siteLang/found',
        redirectType: REDIRECT_TYPE_301,
        isQueryStringPreserved: false,
        sites: sitesFromConfigFile,
        redirectsMiddlewareConfig: {
          locales: ['en', 'da', 'ua'],
        },
      });

      await middleware.handle(req, res);

      const redirectArg = nextRedirectStub.firstCall?.args?.[0] as any;

      expect(redirectArg.locale).to.equal('da');
    });

    it('should not update locale for app router when target uses $siteLang token', async () => {
      const cloneUrl = () => Object.assign({}, req.nextUrl);
      const url = {
        href: 'http://localhost:3000/da/found',
        pathname: '/da/found',
        origin: 'http://localhost:3000',
        locale: 'en',
        clone: cloneUrl,
      };
      setupRedirectStub(301);

      const { res, req } = createTestRequestResponse({
        response: { url },
        request: {
          nextUrl: {
            pathname: '/not-found',
            href: 'http://localhost:3000/not-found',
            locale: 'en',
            origin: 'http://localhost:3000',
            clone: cloneUrl,
          },
        },
        status: 301,
      });

      res.headers.set(LOCALE_HEADER_NAME, 'da');

      const { middleware } = createMiddleware({
        pattern: '/not-found/',
        target: '/$siteLang/found',
        redirectType: REDIRECT_TYPE_301,
        isQueryStringPreserved: false,
        locale: 'en',
        language: 'da',
        sites: sitesFromConfigFile,
        redirectsMiddlewareConfig: {
          locales: ['en', 'da', 'ua'],
        },
      });

      await middleware.handle(req, res);

      const redirectArg = nextRedirectStub.firstCall?.args?.[0] as any;

      expect(req.nextUrl.locale).to.equal('en');
      expect(redirectArg.locale).to.equal('en');
    });

    it('should update locale for pages router when target starts with locale segment', async () => {
      const cloneUrl = () => Object.assign({}, req.nextUrl);
      const url = {
        href: 'http://localhost:3000/ua/found',
        pathname: '/ua/found',
        origin: 'http://localhost:3000',
        locale: 'en',
        clone: cloneUrl,
      };
      setupRedirectStub(301);

      const { res, req } = createTestRequestResponse({
        response: { url },
        request: {
          nextUrl: {
            pathname: '/not-found',
            href: 'http://localhost:3000/not-found',
            locale: 'en',
            origin: 'http://localhost:3000',
            clone: cloneUrl,
          },
        },
        status: 301,
      });

      const { middleware } = createMiddleware({
        pattern: 'not-found',
        target: '/ua/found',
        redirectType: REDIRECT_TYPE_301,
        isQueryStringPreserved: false,
        language: 'en',
      });

      await middleware.handle(req, res);

      const redirectArg = nextRedirectStub.firstCall?.args?.[0] as any;

      expect(redirectArg.locale).to.equal('ua');
    });

    it('should not update locale for app router when target starts with locale segment', async () => {
      const cloneUrl = () => Object.assign({}, req.nextUrl);
      const url = {
        href: 'http://localhost:3000/ua/found',
        pathname: '/ua/found',
        origin: 'http://localhost:3000',
        locale: 'en',
        clone: cloneUrl,
      };
      setupRedirectStub(301);

      const { res, req } = createTestRequestResponse({
        response: { url },
        request: {
          nextUrl: {
            pathname: '/not-found',
            href: 'http://localhost:3000/not-found',
            locale: 'en',
            origin: 'http://localhost:3000',
            clone: cloneUrl,
          },
        },
        status: 301,
      });

      res.headers.set(LOCALE_HEADER_NAME, 'ua');

      const { middleware } = createMiddleware({
        pattern: 'not-found',
        target: '/ua/found',
        redirectType: REDIRECT_TYPE_301,
        isQueryStringPreserved: false,
        locale: 'en',
      });

      await middleware.handle(req, res);

      const redirectArg = nextRedirectStub.firstCall?.args?.[0] as any;

      expect(req.nextUrl.locale).to.equal('en');
      expect(redirectArg.locale).to.equal('en');
    });
  });
});

