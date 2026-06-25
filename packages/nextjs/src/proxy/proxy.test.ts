/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable dot-notation */
/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import chai, { use } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import chaiString from 'chai-string';
import { defineProxy, ProxyHandler, ProxyBase, REWRITE_HEADER_NAME, ProxiesContext } from './proxy';
import { NextRequest, NextResponse } from 'next/server';
import { SiteResolver } from '../site';
import { SuccessfulProxyExecution } from './types';

use(sinonChai);
const expect = chai.use(chaiString).expect;

class MockSiteResolver extends SiteResolver {
  getByName = sinon.stub().callsFake((siteName: string) => ({
    name: siteName,
    language: 'en',
    hostName: 'foo.net',
  }));

  getByHost = sinon.stub().callsFake((hostName: string) => ({
    name: 'foo',
    language: 'en',
    hostName,
  }));
}

describe('ProxyBase', () => {
  class SampleProxy extends ProxyBase {
    handle() {
      return Promise.resolve({} as NextResponse);
    }
  }

  const createReq = (props: any = {}) => {
    return {
      cookies: {
        get(cookieName: string) {
          const cookies = { ...props?.cookieValues };
          return { value: cookies[cookieName] };
        },
      },
      headers: {
        get(key: string) {
          const headers = {
            ...props?.headerValues,
          };
          return headers[key];
        },
      },
      nextUrl: {
        ...props?.nextUrl,
      },
    } as NextRequest;
  };

  const createRes = (props: any = {}) => {
    const res = {
      ...props,
      cookies: {
        get(cookieName: string) {
          const cookies = { ...props.cookies };
          return { value: cookies[cookieName] };
        },
      },
      headers: { ...props?.headers },
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
    });

    return res;
  };

  describe('defaultHostname', () => {
    it('should set default hostname', () => {
      const proxy = new SampleProxy({ sites: [] });

      expect(proxy['defaultHostname']).to.equal('localhost');
    });

    it('should set custom hostname', () => {
      const proxy = new SampleProxy({
        sites: [],
        defaultHostname: 'foo',
      });

      expect(proxy['defaultHostname']).to.equal('foo');
    });
  });

  describe('isPreview', () => {
    it('should return true prerender bypass cookie is provided', () => {
      const proxy = new SampleProxy({ sites: [] });
      const req = createReq({
        cookieValues: {
          __prerender_bypass: true,
        },
      });

      expect(proxy['isPreview'](req)).to.equal(true);
    });

    it('should return true when preview data cookie is provided', () => {
      const proxy = new SampleProxy({ sites: [] });
      const req = createReq({
        cookieValues: {
          __next_preview_data: true,
        },
      });

      expect(proxy['isPreview'](req)).to.equal(true);
    });

    it('should return false when required cookie is not provided', () => {
      const proxy = new SampleProxy({ sites: [] });
      const req = createReq();

      expect(proxy['isPreview'](req)).to.equal(false);
    });
  });

  describe('isAppRouter', () => {
    it('should return true when locale header is provided', () => {
      const proxy = new SampleProxy({ sites: [] });
      const res = createRes({
        headers: {
          'x-sc-locale': 'en-US',
        },
      });

      expect(proxy['isAppRouter'](res)).to.equal(true);
    });

    it('should return false when locale header is missing', () => {
      const proxy = new SampleProxy({ sites: [] });
      const res = createRes({});

      expect(proxy['isAppRouter'](res)).to.equal(false);
    });
  });

  describe('isPrefetch', () => {
    it('should return true when purpose header is prefetch', () => {
      const proxy = new SampleProxy({ sites: [] });
      const req = createReq({
        headerValues: {
          purpose: 'prefetch',
        },
      });

      expect(proxy['isPrefetch'](req)).to.equal(true);
    });

    it('should return true when Next-Router-Prefetch header is 1', () => {
      const proxy = new SampleProxy({ sites: [] });
      const req = createReq({
        headerValues: {
          'Next-Router-Prefetch': '1',
        },
      });

      expect(proxy['isPrefetch'](req)).to.equal(true);
    });

    it('should return true when x-middleware-prefetch header is 1', () => {
      const proxy = new SampleProxy({ sites: [] });
      const req = createReq({
        headerValues: {
          'x-middleware-prefetch': '1',
        },
      });

      expect(proxy['isPrefetch'](req)).to.equal(true);
    });

    it('should return false when required header is not provided', () => {
      const proxy = new SampleProxy({ sites: [] });
      const req = createReq();

      expect(proxy['isPrefetch'](req)).to.equal(false);
    });

    it('returns false for known device with x-middleware-prefetch header', () => {
      const proxy = new SampleProxy({ sites: [] });
      const req = createReq({
        headerValues: {
          'x-middleware-prefetch': '1',
          'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X)',
        },
      });

      expect(proxy['isPrefetch'](req)).to.equal(false);
    });

    it('should return true when it is a desktop device and purpose is prefetch', () => {
      const proxy = new SampleProxy({ sites: [] });
      const req = createReq({
        headerValues: {
          purpose: 'prefetch',
          'sec-ch-ua-mobile': '?0',
        },
      });

      expect(proxy['isPrefetch'](req)).to.equal(true);
    });
  });

  describe('disabled / skip', () => {
    it('default', () => {
      const proxy = new SampleProxy({ sites: [] });

      expect(
        proxy['disabled'](
          createReq({
            nextUrl: {
              pathname: '/api/layout/render',
            },
          }),
          createRes()
        )
      ).to.equal(true);
      expect(
        proxy['disabled'](
          createReq({
            nextUrl: {
              pathname: '/sitecore/render',
            },
          }),
          createRes()
        )
      ).to.equal(true);
      expect(
        proxy['disabled'](
          createReq({
            nextUrl: {
              pathname: '/_next/webpack',
            },
          }),
          createRes()
        )
      ).to.equal(true);
    });

    it('custom function', () => {
      const proxy = new SampleProxy({
        sites: [],
        skip(req: NextRequest) {
          const path = req.nextUrl.pathname;
          return path === 'foo';
        },
      });

      expect(
        proxy['disabled'](
          createReq({
            nextUrl: {
              pathname: 'bar',
            },
          }),
          createRes()
        )
      ).to.equal(false);
      expect(
        proxy['disabled'](
          createReq({
            nextUrl: {
              pathname: 'foo',
            },
          }),
          createRes()
        )
      ).to.equal(true);
    });
  });

  it('extractDebugHeaders', () => {
    const proxy = new SampleProxy({ sites: [] });

    const headers = new Headers({});
    headers.set('foo', 'net');
    headers.set('bar', 'one');

    expect(proxy['extractDebugHeaders'](headers)).to.deep.equal({
      foo: 'net',
      bar: 'one',
    });
  });

  describe('getHostHeader', () => {
    it('should return empty string when host headers are not present', () => {
      const proxy = new SampleProxy({ sites: [] });
      const req = createReq({
        headerValues: {
          foo: 'one',
        },
      });

      expect(proxy['getHostHeader'](req)).to.equal('');
    });

    it('should return host header', () => {
      const proxy = new SampleProxy({ sites: [] });
      const req = createReq({
        headerValues: {
          foo: 'one',
          host: 'bar.net:9999',
        },
      });

      expect(proxy['getHostHeader'](req)).to.equal('bar.net');
    });

    it('should strip port from IPv4 host header', () => {
      const proxy = new SampleProxy({ sites: [] });
      const req = createReq({
        headerValues: {
          host: '127.0.0.1:3000',
        },
      });

      expect(proxy['getHostHeader'](req)).to.equal('127.0.0.1');
    });

    it('should parse bracketed IPv6 loopback with port', () => {
      const proxy = new SampleProxy({ sites: [] });
      const req = createReq({
        headerValues: {
          host: '[::1]:3000',
        },
      });

      expect(proxy['getHostHeader'](req)).to.equal('::1');
    });

    it('should preserve unbracketed IPv6 loopback without treating :1 as port', () => {
      const proxy = new SampleProxy({ sites: [] });
      const req = createReq({
        headerValues: {
          host: '::1',
        },
      });

      expect(proxy['getHostHeader'](req)).to.equal('::1');
    });

    it('should parse bracketed IPv6 without port', () => {
      const proxy = new SampleProxy({ sites: [] });
      const req = createReq({
        headerValues: {
          host: '[::1]',
        },
      });

      expect(proxy['getHostHeader'](req)).to.equal('::1');
    });

    it('should parse unbracketed IPv6 with zone id (no port strip)', () => {
      const proxy = new SampleProxy({ sites: [] });
      const req = createReq({
        headerValues: {
          host: 'fe80::1%eth0',
        },
      });

      expect(proxy['getHostHeader'](req)).to.equal('fe80::1%eth0');
    });

    it('should return x-forwarded-host header when present', () => {
      const proxy = new SampleProxy({ sites: [] });
      const req = createReq({
        headerValues: {
          'x-forwarded-host': 'proxy.forwarded.com',
          host: 'localhost:3000',
        },
      });

      expect(proxy['getHostHeader'](req)).to.equal('proxy.forwarded.com');
    });
  });

  describe('getLanguage', () => {
    it('should return defined language', () => {
      const proxy = new SampleProxy({ sites: [] });
      const req = createReq({
        nextUrl: {
          locale: 'be',
          defaultLocale: 'fr',
        },
      });

      expect(proxy['getLanguage'](req)).to.equal('be');
    });

    it('should return defined default language', () => {
      const proxy = new SampleProxy({ sites: [] });
      const req = createReq({
        nextUrl: {
          defaultLocale: 'fr',
        },
      });

      expect(proxy['getLanguage'](req)).to.equal('fr');
    });

    it('should use fallback language from config when present', () => {
      const proxy = new SampleProxy({ sites: [], defaultLanguage: 'es-ES' });
      const req = createReq();

      expect(proxy['getLanguage'](req)).to.equal('es-ES');
    });

    it('should return fallback language', () => {
      const proxy = new SampleProxy({ sites: [] });
      const req = createReq();

      expect(proxy['getLanguage'](req)).to.equal('en');
    });

    it('should return language from resp header if present', () => {
      const proxy = new SampleProxy({ sites: [] });
      const req = createReq({
        nextUrl: {
          defaultLocale: 'fr',
        },
      });
      const res = createRes({
        headers: {
          'x-sc-locale': 'de-DE',
        },
      });

      expect(proxy['getLanguage'](req, res)).to.equal('de-DE');
    });
  });

  describe('getLanguageFromHeader', () => {
    it('should return language from resp header if present', () => {
      const proxy = new SampleProxy({ sites: [] });
      const res = createRes({
        headers: {
          'x-sc-locale': 'de-DE',
        },
      });

      expect(proxy['getLanguageFromHeader'](res)).to.equal('de-DE');
    });

    it('should return undefined from resp header if not present', () => {
      const proxy = new SampleProxy({ sites: [] });
      const res = createRes();

      expect(proxy['getLanguageFromHeader'](res)).to.equal(undefined);
    });

    it('should return undefined from resp header if res not passed', () => {
      const proxy = new SampleProxy({ sites: [] });

      expect(proxy['getLanguageFromHeader']()).to.equal(undefined);
    });
  });

  describe('getSite', () => {
    it('should get site by name when site cookie is provided', () => {
      const req = createReq();
      const res = createRes({
        cookies: {
          sc_site: 'xxx',
        },
      });
      const proxy = new SampleProxy({ sites: [] });
      proxy['siteResolver'] = new MockSiteResolver([]);

      expect(proxy['getSite'](req, res).name).to.equal('xxx');
      expect(proxy['siteResolver'].getByName).to.be.calledWith('xxx');
    });

    it('should get default site info when site cookie is provided', () => {
      class MockSiteResolver extends SiteResolver {
        // eslint-disable-next-line no-unused-vars
        getByName = sinon.stub().callsFake((_siteName: string) => undefined);
      }

      const req = createReq();
      const res = createRes({
        cookies: {
          sc_site: 'xxx',
        },
      });
      const proxy = new SampleProxy({ sites: [] });
      proxy['siteResolver'] = new MockSiteResolver([]);

      expect(proxy['getSite'](req, res)).deep.equal({
        name: 'xxx',
        language: 'en',
        hostName: '*',
      });
      expect(proxy['siteResolver'].getByName).to.be.calledWith('xxx');
    });
  });

  it('should get site by host header', () => {
    const req = createReq({
      headerValues: {
        host: 'xxx.net:9999',
      },
    });
    const res = createRes();
    const proxy = new SampleProxy({ sites: [] });
    proxy['siteResolver'] = new MockSiteResolver([]);

    expect(proxy['getSite'](req, res).hostName).to.equal('xxx.net');
    expect(proxy['siteResolver'].getByHost).to.be.calledWith('xxx.net');
  });

  it('should get site by default host', () => {
    const req = createReq();
    const res = createRes();
    const proxy = new SampleProxy({ sites: [] });
    proxy['siteResolver'] = new MockSiteResolver([]);

    expect(proxy['getSite'](req, res).hostName).to.equal('localhost');
    expect(proxy['siteResolver'].getByHost).to.be.calledWith('localhost');
  });

  it('should get site by custom default host', () => {
    const req = createReq();
    const res = createRes();
    const proxy = new SampleProxy({ sites: [], defaultHostname: 'yyy.net' });
    proxy['siteResolver'] = new MockSiteResolver([]);

    expect(proxy['getSite'](req, res).hostName).to.equal('yyy.net');
    expect(proxy['siteResolver'].getByHost).to.be.calledWith('yyy.net');
  });

  describe('rewrite', () => {
    let rewriteStub = sinon.stub();
    before(() => {
      rewriteStub = sinon.stub(NextResponse, 'rewrite').callsFake((rewritePath) => {
        // rewritePath is now a string URL
        return createRes({
          url: rewritePath,
          headers: new Map<string, unknown>(),
        });
      });
    });

    after(() => {
      rewriteStub.restore();
    });

    it('should rewrite path and add header by default', () => {
      const proxy = new SampleProxy({ sites: [] });
      const url: any = {
        origin: 'http://localhost:3000',
        pathname: '/not-found',
        search: '',
        clone() {
          const cloned: any = {
            pathname: url.pathname,
            origin: url.origin,
            search: url.search,
            locale: url.locale,
          };
          Object.defineProperty(cloned, 'href', {
            get() {
              return `${this.origin}${this.pathname}${this.search}`;
            },
            enumerable: true,
            configurable: true,
          });
          return cloned;
        },
        get href() {
          return `${this.origin}${this.pathname}${this.search}`;
        },
        locale: 'en',
      };
      const req = createReq({
        nextUrl: url,
      });
      const res = createRes({});

      const response = proxy['rewrite']('/new', req, res);

      expect(response.headers.get(REWRITE_HEADER_NAME)).to.equal('/new');
      expect(response.url).to.endWith('/new');
    });

    it('should rewrite path and not rewrite header when skipHeader is true', () => {
      const proxy = new SampleProxy({ sites: [] });
      const url: any = {
        origin: 'http://localhost:3000',
        pathname: '/not-found',
        search: '',
        clone() {
          const cloned: any = {
            pathname: url.pathname,
            origin: url.origin,
            search: url.search,
            locale: url.locale,
          };
          Object.defineProperty(cloned, 'href', {
            get() {
              return `${this.origin}${this.pathname}${this.search}`;
            },
            enumerable: true,
            configurable: true,
          });
          return cloned;
        },
        get href() {
          return `${this.origin}${this.pathname}${this.search}`;
        },
        locale: 'en',
      };
      const req = createReq({
        nextUrl: url,
      });
      const res = createRes();

      const response = proxy['rewrite']('/new', req, res, true);
      expect(response.headers.get(REWRITE_HEADER_NAME)).to.be.undefined;
      expect(response.url).to.endWith('/new');
    });
  });
});

describe('defineProxy', () => {
  it('should execute proxies', async () => {
    type CustomResponse = {
      params: string[];
    } & NextResponse;
    class SampleProxy extends ProxyBase {
      handle(_req: NextRequest, res: CustomResponse) {
        res.params.push('m1');

        return Promise.resolve(res);
      }
    }

    const proxy1 = new SampleProxy({
      sites: [],
    });
    const proxy2: ProxyHandler = {
      handle: (_req, res) => {
        (res as CustomResponse).params.push('m2');
        return Promise.resolve(res);
      },
    };
    const proxy3: ProxyHandler = {
      handle: (_req, res) => {
        (res as CustomResponse).params.push('m3');
        return Promise.resolve(res);
      },
    };

    const req = {} as NextRequest;
    const res = {
      params: [],
    } as unknown as NextResponse;

    const result = await defineProxy(proxy2, proxy1, proxy3).exec(req, res);

    expect(result).to.deep.equal({
      params: ['m2', 'm1', 'm3'],
    });
  });

  it('should execute proxies with empty response', async () => {
    class SampleProxy extends ProxyBase {
      handle(_req: NextRequest, res: NextResponse) {
        res.headers.set('m1', 'true');

        return Promise.resolve(res);
      }
    }

    const proxy1 = new SampleProxy({ sites: [] });
    const proxy2: ProxyHandler = {
      handle: (_req, res) => {
        res.headers.set('m2', 'true');
        return Promise.resolve(res);
      },
    };
    const proxy3: ProxyHandler = {
      handle: (_req, res) => {
        res.headers.set('m3', 'true');
        return Promise.resolve(res);
      },
    };

    const req = {} as NextRequest;

    const result = await defineProxy(proxy2, proxy1, proxy3).exec(req);

    expect(result.headers.get('m1')).to.equal('true');
    expect(result.headers.get('m2')).to.equal('true');
    expect(result.headers.get('m3')).to.equal('true');
  });

  it('should execute proxies without NextFetchEvent (Next.js 16 style)', async () => {
    class SampleProxy extends ProxyBase {
      handle(_req: NextRequest, res: NextResponse) {
        res.headers.set('m1', 'true');

        return Promise.resolve(res);
      }
    }

    const proxy1 = new SampleProxy({ sites: [] });
    const proxy2: ProxyHandler = {
      handle: (_req, res) => {
        res.headers.set('m2', 'true');
        return Promise.resolve(res);
      },
    };

    const req = {} as NextRequest;

    // Next.js 16 style: ev parameter removed
    const result = await defineProxy(proxy2, proxy1).exec(req);

    expect(result.headers.get('m1')).to.equal('true');
    expect(result.headers.get('m2')).to.equal('true');
  });

  it('should short-circuit the chain once a proxy returns a 403 response', async () => {
    const forbidden = { status: 403 } as unknown as NextResponse;

    const gateProxy: ProxyHandler = {
      handle: sinon.stub().resolves(forbidden),
    };
    const downstreamProxy: ProxyHandler = {
      handle: sinon.stub().resolves({ status: 200 } as unknown as NextResponse),
    };

    const req = {} as NextRequest;
    const res = { status: 200 } as unknown as NextResponse;

    const result = await defineProxy(gateProxy, downstreamProxy).exec(req, res);

    expect(gateProxy.handle).to.have.been.calledOnce;
    expect(downstreamProxy.handle).to.not.have.been.called;
    expect(result).to.equal(forbidden);
  });

  it('should short-circuit the chain once a proxy sets a location header', async () => {
    const redirect = {
      status: 307,
      headers: new Headers({ location: '/en' }),
    } as unknown as NextResponse;

    const nextIntlProxy: ProxyHandler = {
      handle: sinon.stub().resolves(redirect),
    };
    const localeProxy: ProxyHandler = {
      handle: sinon.stub().resolves({ status: 200 } as unknown as NextResponse),
    };
    const downstreamProxy: ProxyHandler = {
      handle: sinon.stub().resolves({ status: 200 } as unknown as NextResponse),
    };

    const req = {} as NextRequest;
    const res = { status: 200, headers: new Headers() } as unknown as NextResponse;

    const result = await defineProxy(nextIntlProxy, localeProxy, downstreamProxy).exec(req, res);

    expect(nextIntlProxy.handle).to.have.been.calledOnce;
    expect(localeProxy.handle).to.not.have.been.called;
    expect(downstreamProxy.handle).to.not.have.been.called;
    expect(result).to.equal(redirect);
    expect(result.headers.get('location')).to.equal('/en');
  });

  it('should short-circuit the chain once a proxy returns a 3xx response without redirected flag', async () => {
    const redirect = {
      status: 302,
      redirected: false,
      headers: new Headers({ location: '/target' }),
    } as unknown as NextResponse;

    const redirectsProxy: ProxyHandler = {
      handle: sinon.stub().resolves(redirect),
    };
    const downstreamProxy: ProxyHandler = {
      handle: sinon.stub().resolves({ status: 200 } as unknown as NextResponse),
    };

    const req = {} as NextRequest;
    const res = { status: 200 } as unknown as NextResponse;

    const result = await defineProxy(redirectsProxy, downstreamProxy).exec(req, res);

    expect(redirectsProxy.handle).to.have.been.calledOnce;
    expect(downstreamProxy.handle).to.not.have.been.called;
    expect(result).to.equal(redirect);
  });

  it('should short-circuit the chain once a proxy sets redirected on the response', async () => {
    const redirect = {
      status: 301,
      redirected: true,
    } as unknown as NextResponse;

    const redirectsProxy: ProxyHandler = {
      handle: sinon.stub().resolves(redirect),
    };
    const downstreamProxy: ProxyHandler = {
      handle: sinon.stub().resolves({ status: 200 } as unknown as NextResponse),
    };

    const req = {} as NextRequest;
    const res = { status: 200 } as unknown as NextResponse;

    const result = await defineProxy(redirectsProxy, downstreamProxy).exec(req, res);

    expect(downstreamProxy.handle).to.not.have.been.called;
    expect(result).to.equal(redirect);
  });

  it('should preserve redirect responses passed as the initial response', async () => {
    const redirect = {
      status: 307,
      headers: new Headers({ location: '/en' }),
    } as unknown as NextResponse;

    const localeProxy: ProxyHandler = {
      handle: sinon.stub().resolves({ status: 200 } as unknown as NextResponse),
    };

    const req = {} as NextRequest;

    const result = await defineProxy(localeProxy).exec(req, redirect);

    expect(localeProxy.handle).to.not.have.been.called;
    expect(result).to.equal(redirect);
  });

  it('should pass context to proxies when generateContext is true', async () => {
    const proxiesContext: ProxiesContext = new Map();
    const successfulExecution: { marker: string } & SuccessfulProxyExecution = {
      executedSuccessfully: true,
      error: null,
      marker: 'seen',
    };

    const contextProxy: ProxyHandler = {
      name: 'ContextProxy',
      handle: (_req, res, proxiesContext) => {
        proxiesContext?.set('ContextProxy', successfulExecution);
        return Promise.resolve(res);
      },
    };

    const req = {} as NextRequest;
    const res = { status: 200 } as unknown as NextResponse;

    await defineProxy(contextProxy).exec(req, res, proxiesContext);

    expect(proxiesContext.get('ContextProxy')).to.deep.equal({
      executedSuccessfully: true,
      error: null,
      marker: 'seen',
    });
  });

  it('should not provide context when proxiesContext is not provided', async () => {
    let receivedContext: unknown;

    const contextProxy: ProxyHandler = {
      name: 'ContextProxy',
      handle: (_req, res, context) => {
        receivedContext = context;
        return Promise.resolve(res);
      },
    };

    const req = {} as NextRequest;
    const res = { status: 200 } as unknown as NextResponse;

    const result = await defineProxy(contextProxy).exec(req, res, undefined);

    expect(receivedContext).to.be.undefined;
    expect(result).to.equal(res);
  });
});
