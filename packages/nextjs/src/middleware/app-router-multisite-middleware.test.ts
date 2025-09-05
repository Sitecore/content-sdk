/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-expressions */
/* eslint-disable dot-notation */
import chai, { use } from 'chai';
import chaiString from 'chai-string';
import sinonChai from 'sinon-chai';
import sinon, { spy } from 'sinon';
import nextjs, { NextRequest, NextResponse } from 'next/server';
import { debug } from '@sitecore-content-sdk/core';

import { AppRouterMultisiteMiddleware } from './app-router-multisite-middleware';
import { SiteResolver } from '@sitecore-content-sdk/core/site';
import { describe } from 'node:test';

use(sinonChai);
const expect = chai.use(chaiString).expect;

describe('AppRouterMultisiteMiddleware', () => {
  const debugSpy = spy(debug, 'multisite');
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

  const createMiddleware = (input: { [key: string]: any; siteResolver?: SiteResolver } = {}) => {
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
    const middleware = new AppRouterMultisiteMiddleware({
      ...props,
    });
    middleware['siteResolver'] = siteResolver;

    return { middleware, siteResolver };
  };

  // Stub for NextResponse generation, see https://github.com/vercel/next.js/issues/42374
  (Headers.prototype as any).getAll = () => [];

  beforeEach(() => {
    debugSpy.resetHistory();
  });

  describe('getSiteRewrite', () => {
    let nextRewriteStub = sinon.stub();
    const defaultSiteCookieAttributes = {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
    };

    afterEach(() => {
      nextRewriteStub.restore();
    });

    it('should rewrite path for site without _site_ prefix', async () => {
      const req = createRequest({
        headerValues: { host: undefined },
      });

      const res = createResponse();

      nextRewriteStub = sinon.stub(nextjs.NextResponse, 'rewrite').returns(res);

      const { middleware, siteResolver } = createMiddleware();

      const finalRes = await middleware.handle(req, res);

      validateDebugLog('multisite middleware start: %o', {
        pathname: '/styleguide',
        language: 'en',
        hostname: 'localhost',
      });

      validateEndMessageDebugLog('multisite middleware end in %dms: %o', {
        rewritePath: `/${siteName}/styleguide`,
        siteName: siteName,
        headers: {
          'x-sc-rewrite': `/${siteName}/styleguide`,
        },
        cookies: {
          ...res.cookies,
          sc_site: {
            ...defaultSiteCookieAttributes,
            value: siteName,
          },
        },
      });

      expect(siteResolver.getByHost).to.be.calledWith('localhost');

      expect(finalRes).to.deep.equal(res);

      expect(nextRewriteStub).calledWith({
        ...req.nextUrl,
        pathname: `/${siteName}/styleguide`,
      });
    });
  });
});
