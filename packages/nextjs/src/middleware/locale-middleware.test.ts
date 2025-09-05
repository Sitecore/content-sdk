import chai, { use } from 'chai';
import chaiString from 'chai-string';
import sinonChai from 'sinon-chai';
import sinon, { spy } from 'sinon';
import { debug } from '@sitecore-content-sdk/core';
import nextjs, { NextRequest, NextResponse } from 'next/server';

import { LocaleMiddleware } from './locale-middleware';
import { REWRITE_HEADER_NAME, LOCALE_HEADER_NAME } from './middleware';

use(sinonChai);
const expect = chai.use(chaiString).expect;

const defaultConfig = {
  sites: [],
  enabled: true,
  useCookieResolution: () => false,
  defaultHostname: '',
};

const createMiddleware = (input: { [key: string]: any } = {}) => {
  const props = { ...defaultConfig, ...input.config };

  const middleware = new LocaleMiddleware({
    ...props,
  });

  return { middleware };
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

describe('LocaleMiddleware', () => {
  const debugSpy = spy(debug, 'locale');
  const validateDebugLog = (message, ...params) => {
    expect(debugSpy.args.find((log) => log[0] === message)).to.deep.equal([message, ...params]);
  };

  beforeEach(() => {
    debugSpy.resetHistory();
  });

  describe('disabled / skip', () => {
    const res = createResponse();

    const test = async (pathname: string, middleware) => {
      const req = createRequest({
        nextUrl: {
          pathname,
        },
      });

      const finalRes = await middleware.handle(req, res);

      validateDebugLog('locale middleware start: %o', {
        pathname,
        locale: 'en',
      });

      const message = 'skipped (locale middleware is disabled)';
      validateDebugLog(message);

      expect(finalRes).to.deep.equal(res);

      debugSpy.resetHistory();
    };

    it('default', async () => {
      const { middleware } = createMiddleware();

      await test('/src/image.png', middleware);
      await test('/api/layout/render', middleware);
      await test('/sitecore/render', middleware);
      await test('/_next/webpack', middleware);
    });

    it('should apply both default and custom rules when custom disabled function provided', async () => {
      const skip = (req: NextRequest) => req.nextUrl.pathname === '/crazypath/luna';

      const { middleware } = createMiddleware({
        config: { ...defaultConfig, skip },
      });

      await test('/src/image.png', middleware);
      await test('/api/layout/render', middleware);
      await test('/sitecore/render', middleware);
      await test('/_next/webpack', middleware);
      await test('/crazypath/luna', middleware);
    });
  });

  describe('request passed', () => {
    let nextRewriteStub = sinon.stub();

    afterEach(() => {
      nextRewriteStub.restore();
    });

    it('should set locale header if locale in path', async () => {
      const { middleware } = createMiddleware({
        config: { ...defaultConfig, locales: ['en', 'de-DE'] },
      });

      const req = createRequest({
        nextUrl: {
          pathname: '/de-DE/about',
        },
      });

      const res = createResponse();

      nextRewriteStub = sinon.stub(nextjs.NextResponse, 'rewrite').returns(res);

      const finalRes = await middleware.handle(req, res);

      validateDebugLog('locale middleware start: %o', {
        pathname: '/de-DE/about',
        locale: 'de-DE',
      });

      validateDebugLog('locale middleware end, no rewrite: %o', {
        pathname: '/de-DE/about',
        locale: 'de-DE',
      });

      expect(finalRes.headers.get(LOCALE_HEADER_NAME)).to.equal('de-DE');
    });

    it('should rewrite path and set locale header with default locale if locale not in path', async () => {
      const { middleware } = createMiddleware({
        config: { ...defaultConfig, locales: ['en', 'de-DE'] },
      });

      const req = createRequest({
        nextUrl: {
          pathname: '/about',
        },
      });

      const res = createResponse();

      nextRewriteStub = sinon.stub(nextjs.NextResponse, 'rewrite').returns(res);

      const finalRes = await middleware.handle(req, res);

      validateDebugLog('locale middleware start: %o', {
        pathname: '/about',
        locale: 'en',
      });

      validateDebugLog('locale middleware end, with rewrite: %o', {
        pathname: '/about',
        locale: 'en',
        rewritePath: '/en/about',
      });

      expect(finalRes.headers.get(LOCALE_HEADER_NAME)).to.equal('en');
      expect(finalRes.headers.get(REWRITE_HEADER_NAME)).to.equal('/en/about');
    });

    it('should rewrite path and set locale header with default locale setting if locale not in path', async () => {
      const { middleware } = createMiddleware({
        config: { ...defaultConfig, defaultLanguage: 'de-DE', locales: ['en', 'de-DE'] },
      });

      const req = createRequest({
        nextUrl: {
          pathname: '/about',
        },
      });

      const res = createResponse();

      nextRewriteStub = sinon.stub(nextjs.NextResponse, 'rewrite').returns(res);

      const finalRes = await middleware.handle(req, res);

      validateDebugLog('locale middleware start: %o', {
        pathname: '/about',
        locale: 'de-DE',
      });

      validateDebugLog('locale middleware end, with rewrite: %o', {
        pathname: '/about',
        locale: 'de-DE',
        rewritePath: '/de-DE/about',
      });

      expect(finalRes.headers.get(LOCALE_HEADER_NAME)).to.equal('de-DE');
      expect(finalRes.headers.get(REWRITE_HEADER_NAME)).to.equal('/de-DE/about');
    });
  });
});
