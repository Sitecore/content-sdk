/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-expressions */
/* eslint-disable dot-notation */
import chai, { use } from 'chai';
import chaiString from 'chai-string';
import sinonChai from 'sinon-chai';
import sinon, { spy } from 'sinon';
import nextjs, { NextRequest, NextResponse } from 'next/server';
import { debug } from '@sitecore-content-sdk/core';

import { MultisiteProxy } from './multisite-proxy';
import { SiteResolver } from '@sitecore-content-sdk/core/site';

use(sinonChai);
const expect = chai.use(chaiString).expect;

describe('MultisiteProxy', () => {
  let debugSpy;
  const validateDebugLog = (message, ...params) =>
    expect(debugSpy.args.find((log) => log[0] === message)).to.deep.equal([message, ...params]);
  const validateEndMessageDebugLog = (message, params) => {
    const logParams = debugSpy.args.find((log) => log[0] === message) as Array<unknown>;

    expect(logParams[2]).to.deep.equal(params);
  };

  const siteName = 'foo';

  const defaultConfig = {
    sites: [],
    enabled: true,
    useCookieResolution: () => false,
    defaultHostname: '',
  };

  const createRequest = (props: any = {}) => {
    const nextUrlBase = {
      pathname: props.nextUrl?.pathname || '/styleguide',
      origin: props.nextUrl?.origin || 'http://localhost:3000',
      search: props.nextUrl?.search || '',
      locale: props.nextUrl?.locale || 'en',
      defaultLocale: props.nextUrl?.defaultLocale || 'en',
      searchParams: props.nextUrl?.searchParams || {},
    };
    
    const req: any = {
      ...props,
      nextUrl: null as any,
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

    // Create nextUrl with computed href
    req.nextUrl = {
      ...nextUrlBase,
      get href() {
        return `${this.origin}${this.pathname}${this.search}`;
      },
      clone() {
        const cloned: any = {
          pathname: req.nextUrl.pathname,
          search: req.nextUrl.search,
          origin: req.nextUrl.origin,
          locale: req.nextUrl.locale,
          defaultLocale: req.nextUrl.defaultLocale,
          searchParams: req.nextUrl.searchParams,
        };
        // Define href as a getter that computes from current pathname, search, and origin
        Object.defineProperty(cloned, 'href', {
          get() {
            return `${this.origin}${this.pathname}${this.search}`;
          },
          enumerable: true,
          configurable: true,
        });
        return cloned;
      },
      searchParams: {
        get(key) {
          const searchParams = req.nextUrl.searchParams || {};
          return searchParams[key];
        },
        ...props.searchParams,
      },
      ...props.nextUrl,
    };

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

  const createProxy = (input: { [key: string]: any; siteResolver?: SiteResolver } = {}) => {
    const props = { ...defaultConfig, ...input.config };
    class MockSiteResolver extends SiteResolver {
      getByName = sinon.stub().returns({
        name: siteName,
        language: input.language || '',
        hostName: input.hostName,
      });

      getByHost = sinon.stub().returns({
        name: siteName,
        language: input.language || '',
        hostName: input.hostName,
      });
    }

    const siteResolver = input.siteResolver || new MockSiteResolver([]);
    const proxy = new MultisiteProxy({
      ...props,
    });
    proxy['siteResolver'] = siteResolver;

    return { proxy, siteResolver };
  };

  // Stub for NextResponse generation, see https://github.com/vercel/next.js/issues/42374
  (Headers.prototype as any).getAll = () => [];

  before(() => {
    debugSpy = spy(debug, 'multisite');
  });

  afterEach(() => {
    debugSpy.resetHistory();
  });

  describe('request skipped', () => {
    describe('disabled / skip', () => {
      const res = createResponse();

      const test = async (pathname: string, proxy) => {
        const req = createRequest({
          nextUrl: {
            pathname,
          },
        });

        const finalRes = await proxy.handle(req, res);
        const isDisabledGlobally = proxy['config'].enabled === false;

        if (!isDisabledGlobally) {
          validateDebugLog('multisite proxy start: %o', {
            pathname,
            language: 'en',
            hostname: 'foo.net',
          });
        }

        const message = isDisabledGlobally
          ? 'skipped (multisite proxy is disabled globally)'
          : 'skipped (multisite proxy is disabled)';
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
          config: { ...defaultConfig, skip },
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

    describe('Sitecore Preview', () => {
      let nextRewriteStub = sinon.stub();

      afterEach(() => {
        nextRewriteStub.restore();
      });

      it('request is passed', async () => {
        const defaultSiteCookieAttributes = {
          secure: true,
          httpOnly: true,
          sameSite: 'none',
        };

        const req = createRequest({
          cookieValues: { sc_site: 'foobar', sc_preview: 'true' },
        });

        const res = createResponse();

        nextRewriteStub = sinon.stub(nextjs.NextResponse, 'rewrite').returns(res);

        const { proxy, siteResolver } = createProxy({
          config: { ...defaultConfig, useCookieResolution: () => true },
        });

        const finalRes = await proxy.handle(req, res);

        validateDebugLog('multisite proxy start: %o', {
          pathname: '/styleguide',
          language: 'en',
          hostname: 'foo.net',
        });

        validateEndMessageDebugLog('multisite proxy end in %dms: %o', {
          rewritePath: '/_site_foobar/styleguide',
          siteName: 'foobar',
          headers: {
            'x-sc-rewrite': '/_site_foobar/styleguide',
          },
          cookies: {
            ...res.cookies,
            sc_site: {
              ...defaultSiteCookieAttributes,
              value: 'foobar',
            },
          },
        });

        expect(siteResolver.getByHost).not.called.equal(true);
        expect(siteResolver.getByName).not.called.equal(true);

        expect(finalRes).to.deep.equal(res);

        expect(nextRewriteStub).calledWith('http://localhost:3000/_site_foobar/styleguide');
      });

      it('should not be skipped if multisite proxy is disabled globally', async () => {
        const defaultSiteCookieAttributes = {
          secure: true,
          httpOnly: true,
          sameSite: 'none',
        };

        const req = createRequest({
          cookieValues: { sc_site: 'foobar', sc_preview: 'true' },
        });

        const res = createResponse();

        nextRewriteStub = sinon.stub(nextjs.NextResponse, 'rewrite').returns(res);

        const { proxy, siteResolver } = createProxy({
          config: { ...defaultConfig, enabled: false, useCookieResolution: () => true },
        });

        const finalRes = await proxy.handle(req, res);

        validateDebugLog('multisite proxy start: %o', {
          pathname: '/styleguide',
          language: 'en',
          hostname: 'foo.net',
        });

        validateEndMessageDebugLog('multisite proxy end in %dms: %o', {
          rewritePath: '/_site_foobar/styleguide',
          siteName: 'foobar',
          headers: {
            'x-sc-rewrite': '/_site_foobar/styleguide',
          },
          cookies: {
            ...res.cookies,
            sc_site: {
              ...defaultSiteCookieAttributes,
              value: 'foobar',
            },
          },
        });

        expect(siteResolver.getByHost).not.called.equal(true);
        expect(siteResolver.getByName).not.called.equal(true);

        expect(finalRes).to.deep.equal(res);

        expect(nextRewriteStub).calledWith('http://localhost:3000/_site_foobar/styleguide');
      });
    });
  });

  describe('request passed', () => {
    let nextRewriteStub = sinon.stub();
    const defaultSiteCookieAttributes = {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
    };

    afterEach(() => {
      nextRewriteStub.restore();
    });

    it('fallback hostname is used', async () => {
      const req = createRequest({
        headerValues: { host: undefined },
      });

      const res = createResponse();

      nextRewriteStub = sinon.stub(nextjs.NextResponse, 'rewrite').returns(res);

      const { proxy, siteResolver } = createProxy({
        config: { ...defaultConfig, defaultHostname: 'bar.net' },
      });

      const finalRes = await proxy.handle(req, res);

      validateDebugLog('multisite proxy start: %o', {
        pathname: '/styleguide',
        language: 'en',
        hostname: 'bar.net',
      });

      validateEndMessageDebugLog('multisite proxy end in %dms: %o', {
        rewritePath: '/_site_foo/styleguide',
        siteName: 'foo',
        headers: {
          'x-sc-rewrite': '/_site_foo/styleguide',
        },
        cookies: {
          ...res.cookies,
          sc_site: {
            ...defaultSiteCookieAttributes,
            value: 'foo',
          },
        },
      });

      expect(siteResolver.getByHost).to.be.calledWith('bar.net');

      expect(finalRes).to.deep.equal(res);

      expect(nextRewriteStub).calledWith('http://localhost:3000/_site_foo/styleguide');
    });

    it('nexturl request pathname is used', async () => {
      const req = createRequest({
        nextUrl: { pathname: '/styleguide/foo' },
      });
      const res = createResponse();

      nextRewriteStub = sinon.stub(nextjs.NextResponse, 'rewrite').returns(res);

      const { proxy, siteResolver } = createProxy({
        config: { ...defaultConfig },
      });

      const finalRes = await proxy.handle(req, res);

      validateDebugLog('multisite proxy start: %o', {
        pathname: '/styleguide/foo',
        language: 'en',
        hostname: 'foo.net',
      });

      validateEndMessageDebugLog('multisite proxy end in %dms: %o', {
        rewritePath: '/_site_foo/styleguide/foo',
        siteName: 'foo',
        headers: {
          'x-sc-rewrite': '/_site_foo/styleguide/foo',
        },
        cookies: {
          ...res.cookies,
          sc_site: {
            ...defaultSiteCookieAttributes,
            value: 'foo',
          },
        },
      });

      expect(siteResolver.getByHost).to.be.calledWith('foo.net');

      expect(finalRes).to.deep.equal(res);

      expect(nextRewriteStub).calledWith('http://localhost:3000/_site_foo/styleguide/foo');
    });

    it('app router application and next preview cookies are present', async () => {
      const req = createRequest({
        nextUrl: { pathname: '/styleguide/foo' },
        cookieValues: {
          __prerender_bypass: true,
          __next_preview_data: true,
        },
      });
      const res = createResponse({
        headers: { 'x-sc-rewrite': '/en/some/otherpath', 'x-sc-locale': 'en' },
      });

      nextRewriteStub = sinon.stub(nextjs.NextResponse, 'rewrite').returns(res);

      const { proxy, siteResolver } = createProxy({
        config: { ...defaultConfig },
      });

      const finalRes = await proxy.handle(req, res);

      validateDebugLog('multisite proxy start: %o', {
        pathname: '/en/some/otherpath',
        language: 'en',
        hostname: 'foo.net',
      });

      validateEndMessageDebugLog('multisite proxy end in %dms: %o', {
        rewritePath: '/_site_foo/en/some/otherpath',
        siteName: 'foo',
        headers: {
          'x-sc-rewrite': '/_site_foo/en/some/otherpath',
          'x-sc-locale': 'en',
        },
        cookies: {
          ...res.cookies,
          sc_site: {
            ...defaultSiteCookieAttributes,
            value: 'foo',
          },
        },
      });

      expect(siteResolver.getByHost).to.be.calledWith('foo.net');

      expect(finalRes).to.deep.equal(res);

      expect(nextRewriteStub).calledWith('http://localhost:3000/_site_foo/en/some/otherpath');
    });

    it('rewritten pathname from header is used when present in response', async () => {
      const req = createRequest({
        nextUrl: { pathname: '/styleguide/foo' },
      });
      const res = createResponse({
        headers: { 'x-sc-rewrite': '/en/some/otherpath' },
      });

      nextRewriteStub = sinon.stub(nextjs.NextResponse, 'rewrite').returns(res);

      const { proxy, siteResolver } = createProxy({
        config: { ...defaultConfig },
      });

      const finalRes = await proxy.handle(req, res);

      validateDebugLog('multisite proxy start: %o', {
        pathname: '/en/some/otherpath',
        language: 'en',
        hostname: 'foo.net',
      });

      validateEndMessageDebugLog('multisite proxy end in %dms: %o', {
        rewritePath: '/_site_foo/en/some/otherpath',
        siteName: 'foo',
        headers: {
          'x-sc-rewrite': '/_site_foo/en/some/otherpath',
        },
        cookies: {
          ...res.cookies,
          sc_site: {
            ...defaultSiteCookieAttributes,
            value: 'foo',
          },
        },
      });

      expect(siteResolver.getByHost).to.be.calledWith('foo.net');

      expect(finalRes).to.deep.equal(res);

      expect(nextRewriteStub).calledWith('http://localhost:3000/_site_foo/en/some/otherpath');
    });

    it('fallback default hostName is used', async () => {
      const req = createRequest({
        headerValues: { host: undefined },
      });

      const res = createResponse();

      nextRewriteStub = sinon.stub(nextjs.NextResponse, 'rewrite').returns(res);

      const { proxy, siteResolver } = createProxy();

      const finalRes = await proxy.handle(req, res);

      validateDebugLog('multisite proxy start: %o', {
        pathname: '/styleguide',
        language: 'en',
        hostname: 'localhost',
      });

      validateEndMessageDebugLog('multisite proxy end in %dms: %o', {
        rewritePath: '/_site_foo/styleguide',
        siteName: 'foo',
        headers: {
          'x-sc-rewrite': '/_site_foo/styleguide',
        },
        cookies: {
          ...res.cookies,
          sc_site: {
            ...defaultSiteCookieAttributes,
            value: 'foo',
          },
        },
      });

      expect(siteResolver.getByHost).to.be.calledWith('localhost');

      expect(finalRes).to.deep.equal(res);

      expect(nextRewriteStub).calledWith('http://localhost:3000/_site_foo/styleguide');
    });

    it('host header is used', async () => {
      const req = createRequest();

      const res = createResponse();

      nextRewriteStub = sinon.stub(nextjs.NextResponse, 'rewrite').returns(res);

      const { proxy, siteResolver } = createProxy();

      const finalRes = await proxy.handle(req, res);

      validateDebugLog('multisite proxy start: %o', {
        pathname: '/styleguide',
        language: 'en',
        hostname: 'foo.net',
      });

      validateEndMessageDebugLog('multisite proxy end in %dms: %o', {
        rewritePath: '/_site_foo/styleguide',
        siteName: 'foo',
        headers: {
          'x-sc-rewrite': '/_site_foo/styleguide',
        },
        cookies: {
          ...res.cookies,
          sc_site: {
            ...defaultSiteCookieAttributes,
            value: 'foo',
          },
        },
      });

      expect(siteResolver.getByHost).to.be.calledWith('foo.net');

      expect(finalRes).to.deep.equal(res);

      expect(nextRewriteStub).calledWith('http://localhost:3000/_site_foo/styleguide');
    });

    it('custom response object is not provided', async () => {
      const req = createRequest();

      const res = createResponse();

      nextRewriteStub = sinon.stub(nextjs.NextResponse, 'rewrite').returns(res);

      const { proxy, siteResolver } = createProxy({});

      const finalRes = await proxy.handle(req, res);

      validateDebugLog('multisite proxy start: %o', {
        pathname: '/styleguide',
        language: 'en',
        hostname: 'foo.net',
      });

      validateEndMessageDebugLog('multisite proxy end in %dms: %o', {
        rewritePath: '/_site_foo/styleguide',
        siteName: 'foo',
        headers: {
          'x-sc-rewrite': '/_site_foo/styleguide',
        },
        cookies: {
          ...res.cookies,
          sc_site: {
            ...defaultSiteCookieAttributes,
            value: 'foo',
          },
        },
      });

      expect(siteResolver.getByHost).to.be.calledWith('foo.net');

      expect(finalRes).to.deep.equal(res);

      expect(nextRewriteStub).calledWith('http://localhost:3000/_site_foo/styleguide');
    });

    it('site querystring parameter is provided', async () => {
      const req = createRequest({
        searchParams: { site: 'qsFoo' },
      });

      const res = createResponse();

      nextRewriteStub = sinon.stub(nextjs.NextResponse, 'rewrite').returns(res);

      const { proxy, siteResolver } = createProxy({
        useCookieResolution: () => true,
      });

      const finalRes = await proxy.handle(req, res);

      validateDebugLog('multisite proxy start: %o', {
        pathname: '/styleguide',
        language: 'en',
        hostname: 'foo.net',
      });

      validateEndMessageDebugLog('multisite proxy end in %dms: %o', {
        rewritePath: '/_site_qsFoo/styleguide',
        siteName: 'qsFoo',
        headers: {
          'x-sc-rewrite': '/_site_qsFoo/styleguide',
        },
        cookies: {
          ...res.cookies,
        },
      });

      expect(siteResolver.getByHost).not.called.equal(true);
      expect(siteResolver.getByName).not.called.equal(true);

      expect(finalRes).to.deep.equal(res);

      expect(nextRewriteStub).calledWith('http://localhost:3000/_site_qsFoo/styleguide');
    });

    it('sc_site querystring parameter is provided', async () => {
      const req = createRequest({
        searchParams: { sc_site: 'qsFoo' },
      });

      const res = createResponse();

      nextRewriteStub = sinon.stub(nextjs.NextResponse, 'rewrite').returns(res);

      const { proxy, siteResolver } = createProxy({
        useCookieResolution: () => true,
      });

      const finalRes = await proxy.handle(req, res);

      validateDebugLog('multisite proxy start: %o', {
        pathname: '/styleguide',
        language: 'en',
        hostname: 'foo.net',
      });

      validateEndMessageDebugLog('multisite proxy end in %dms: %o', {
        rewritePath: '/_site_qsFoo/styleguide',
        siteName: 'qsFoo',
        headers: {
          'x-sc-rewrite': '/_site_qsFoo/styleguide',
        },
        cookies: {
          ...res.cookies,
          sc_site: {
            ...defaultSiteCookieAttributes,
            value: 'qsFoo',
          },
        },
      });

      expect(siteResolver.getByHost).not.called.equal(true);
      expect(siteResolver.getByName).not.called.equal(true);

      expect(finalRes).to.deep.equal(res);

      expect(nextRewriteStub).calledWith('http://localhost:3000/_site_qsFoo/styleguide');
    });

    it('sc_site cookie is provided and its usage enabled', async () => {
      const req = createRequest({
        cookieValues: { sc_site: 'foobar' },
      });

      const res = createResponse();

      nextRewriteStub = sinon.stub(nextjs.NextResponse, 'rewrite').returns(res);

      const { proxy, siteResolver } = createProxy({
        config: { ...defaultConfig, useCookieResolution: () => true },
      });

      const finalRes = await proxy.handle(req, res);

      validateDebugLog('multisite proxy start: %o', {
        pathname: '/styleguide',
        language: 'en',
        hostname: 'foo.net',
      });

      validateEndMessageDebugLog('multisite proxy end in %dms: %o', {
        rewritePath: '/_site_foobar/styleguide',
        siteName: 'foobar',
        headers: {
          'x-sc-rewrite': '/_site_foobar/styleguide',
        },
        cookies: {
          ...res.cookies,
          sc_site: {
            ...defaultSiteCookieAttributes,
            value: 'foobar',
          },
        },
      });

      expect(siteResolver.getByHost).not.called.equal(true);
      expect(siteResolver.getByName).not.called.equal(true);

      expect(finalRes).to.deep.equal(res);

      expect(nextRewriteStub).calledWith('http://localhost:3000/_site_foobar/styleguide');
    });

    it('sc_site cookie is provided and its usage disabled', async () => {
      const req = createRequest({
        cookieValues: { sc_site: 'foobar' },
      });

      const res = createResponse();

      nextRewriteStub = sinon.stub(nextjs.NextResponse, 'rewrite').returns(res);

      const { proxy, siteResolver } = createProxy();

      const finalRes = await proxy.handle(req, res);

      validateDebugLog('multisite proxy start: %o', {
        pathname: '/styleguide',
        language: 'en',
        hostname: 'foo.net',
      });

      validateEndMessageDebugLog('multisite proxy end in %dms: %o', {
        rewritePath: '/_site_foo/styleguide',
        siteName: 'foo',
        headers: {
          'x-sc-rewrite': '/_site_foo/styleguide',
        },
        cookies: {
          ...res.cookies,
          sc_site: {
            ...defaultSiteCookieAttributes,
            value: 'foo',
          },
        },
      });

      expect(siteResolver.getByHost).to.be.calledWith('foo.net');

      expect(finalRes).to.deep.equal(res);

      expect(nextRewriteStub).calledWith('http://localhost:3000/_site_foo/styleguide');
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

    it('should handle error', async () => {
      const error = new Error('Custom error');

      class SampleSiteResolver extends SiteResolver {
        constructor(sites) {
          super(sites);
        }

        getByHost = () => {
          throw error;
        };
      }

      const { proxy } = createProxy({
        siteResolver: new SampleSiteResolver([]),
      });

      const finalRes = await proxy.handle(req, res);

      expect(errorSpy.getCall(0).calledWith('Multisite proxy failed:')).to.be.true;
      expect(errorSpy.getCall(1).calledWith(error)).to.be.true;

      expect(finalRes).to.deep.equal(res);
    });
  });
});
