/* eslint-disable dot-notation */
import chai, { use } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import chaiString from 'chai-string';
import { defineMiddleware, Middleware, MiddlewareBase, REWRITE_HEADER_NAME } from './middleware';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { SiteResolver } from '../site';

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

describe('MiddlewareBase', () => {
  class SampleMiddleware extends MiddlewareBase {
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
    return {
      ...props,
      cookies: {
        get(cookieName: string) {
          const cookies = { ...props.cookies };
          return { value: cookies[cookieName] };
        },
      },
    } as NextResponse;
  };

  describe('defaultHostname', () => {
    it('should set default hostname', () => {
      const middleware = new SampleMiddleware({ sites: [] });

      expect(middleware['defaultHostname']).to.equal('localhost');
    });

    it('should set custom hostname', () => {
      const middleware = new SampleMiddleware({
        sites: [],
        defaultHostname: 'foo',
      });

      expect(middleware['defaultHostname']).to.equal('foo');
    });
  });

  describe('isPreview', () => {
    it('should return true prerender bypass cookie is provided', () => {
      const middleware = new SampleMiddleware({ sites: [] });
      const req = createReq({
        cookieValues: {
          __prerender_bypass: true,
        },
      });

      expect(middleware['isPreview'](req)).to.equal(true);
    });

    it('should return true when preview data cookie is provided', () => {
      const middleware = new SampleMiddleware({ sites: [] });
      const req = createReq({
        cookieValues: {
          __next_preview_data: true,
        },
      });

      expect(middleware['isPreview'](req)).to.equal(true);
    });

    it('should return false when required cookie is not provided', () => {
      const middleware = new SampleMiddleware({ sites: [] });
      const req = createReq();

      expect(middleware['isPreview'](req)).to.equal(false);
    });
  });

  describe('isPrefetch', () => {
    it('should return true when purpose header is prefetch', () => {
      const middleware = new SampleMiddleware({ sites: [] });
      const req = createReq({
        headerValues: {
          purpose: 'prefetch',
        },
      });

      expect(middleware['isPrefetch'](req)).to.equal(true);
    });

    it('should return true when Next-Router-Prefetch header is 1', () => {
      const middleware = new SampleMiddleware({ sites: [] });
      const req = createReq({
        headerValues: {
          'Next-Router-Prefetch': '1',
        },
      });

      expect(middleware['isPrefetch'](req)).to.equal(true);
    });

    it('should return false when required header is not provided', () => {
      const middleware = new SampleMiddleware({ sites: [] });
      const req = createReq();

      expect(middleware['isPrefetch'](req)).to.equal(false);
    });
  });

  describe('disabled / skip', () => {
    it('default', () => {
      const middleware = new SampleMiddleware({ sites: [] });

      expect(
        middleware['disabled'](
          createReq({
            nextUrl: {
              pathname: '/api/layout/render',
            },
          }),
          createRes()
        )
      ).to.equal(true);
      expect(
        middleware['disabled'](
          createReq({
            nextUrl: {
              pathname: '/sitecore/render',
            },
          }),
          createRes()
        )
      ).to.equal(true);
      expect(
        middleware['disabled'](
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
      const middleware = new SampleMiddleware({
        sites: [],
        skip(req: NextRequest) {
          const path = req.nextUrl.pathname;
          return path === 'foo';
        },
      });

      expect(
        middleware['disabled'](
          createReq({
            nextUrl: {
              pathname: 'bar',
            },
          }),
          createRes()
        )
      ).to.equal(false);
      expect(
        middleware['disabled'](
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
    const middleware = new SampleMiddleware({ sites: [] });

    const headers = new Headers({});
    headers.set('foo', 'net');
    headers.set('bar', 'one');

    expect(middleware['extractDebugHeaders'](headers)).to.deep.equal({
      foo: 'net',
      bar: 'one',
    });
  });

  describe('getHostHeader', () => {
    it('should return default hostname when header is not present', () => {
      const middleware = new SampleMiddleware({ sites: [] });
      const req = createReq({
        headerValues: {
          foo: 'one',
        },
      });

      expect(middleware['getHostHeader'](req)).to.equal(undefined);
    });

    it('should return host header', () => {
      const middleware = new SampleMiddleware({ sites: [] });
      const req = createReq({
        headerValues: {
          foo: 'one',
          host: 'bar.net:9999',
        },
      });

      expect(middleware['getHostHeader'](req)).to.equal('bar.net');
    });
  });

  describe('getLanguage', () => {
    it('should return defined language', () => {
      const middleware = new SampleMiddleware({ sites: [] });
      const req = createReq({
        nextUrl: {
          locale: 'be',
          defaultLocale: 'fr',
        },
      });

      expect(middleware['getLanguage'](req)).to.equal('be');
    });

    it('should return defined default language', () => {
      const middleware = new SampleMiddleware({ sites: [] });
      const req = createReq({
        nextUrl: {
          defaultLocale: 'fr',
        },
      });

      expect(middleware['getLanguage'](req)).to.equal('fr');
    });

    it('should use fallback language from config when present', () => {
      const middleware = new SampleMiddleware({ sites: [], defaultLanguage: 'es-ES' });
      const req = createReq();

      expect(middleware['getLanguage'](req)).to.equal('es-ES');
    });

    it('should return fallback language', () => {
      const middleware = new SampleMiddleware({ sites: [] });
      const req = createReq();

      expect(middleware['getLanguage'](req)).to.equal('en');
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
      const middleware = new SampleMiddleware({ sites: [] });
      middleware['siteResolver'] = new MockSiteResolver([]);

      expect(middleware['getSite'](req, res).name).to.equal('xxx');
      expect(middleware['siteResolver'].getByName).to.be.calledWith('xxx');
    });

    it('should get default site info when site cookie is provided', () => {
      class MockSiteResolver extends SiteResolver {
        getByName = sinon.stub().callsFake((_siteName: string) => undefined);
      }

      const req = createReq();
      const res = createRes({
        cookies: {
          sc_site: 'xxx',
        },
      });
      const middleware = new SampleMiddleware({ sites: [] });
      middleware['siteResolver'] = new MockSiteResolver([]);

      expect(middleware['getSite'](req, res)).deep.equal({
        name: 'xxx',
        language: 'en',
        hostName: '*',
      });
      expect(middleware['siteResolver'].getByName).to.be.calledWith('xxx');
    });
  });

  it('should get site by host header', () => {
    const req = createReq({
      headerValues: {
        host: 'xxx.net:9999',
      },
    });
    const res = createRes();
    const middleware = new SampleMiddleware({ sites: [] });
    middleware['siteResolver'] = new MockSiteResolver([]);

    expect(middleware['getSite'](req, res).hostName).to.equal('xxx.net');
    expect(middleware['siteResolver'].getByHost).to.be.calledWith('xxx.net');
  });

  it('should get site by default host', () => {
    const req = createReq();
    const res = createRes();
    const middleware = new SampleMiddleware({ sites: [] });
    middleware['siteResolver'] = new MockSiteResolver([]);

    expect(middleware['getSite'](req, res).hostName).to.equal('localhost');
    expect(middleware['siteResolver'].getByHost).to.be.calledWith('localhost');
  });

  it('should get site by custom default host', () => {
    const req = createReq();
    const res = createRes();
    const middleware = new SampleMiddleware({ sites: [], defaultHostname: 'yyy.net' });
    middleware['siteResolver'] = new MockSiteResolver([]);

    expect(middleware['getSite'](req, res).hostName).to.equal('yyy.net');
    expect(middleware['siteResolver'].getByHost).to.be.calledWith('yyy.net');
  });

  describe('rewrite', () => {
    let rewriteStub = sinon.stub();
    before(() => {
      rewriteStub = sinon.stub(NextResponse, 'rewrite').callsFake((rewritePath) => {
        return createRes({
          url: typeof rewritePath === 'string' ? rewritePath : rewritePath.pathname,
          headers: new Map<string, unknown>(),
        });
      });
    });

    after(() => {
      rewriteStub.restore();
    });

    it('should rewrite path and add header by default', () => {
      const middleware = new SampleMiddleware({ sites: [] });
      const cloneUrl = () => Object.assign({}, req.nextUrl);
      const url = {
        clone: cloneUrl,
        href: 'http://localhost:3000/not-found',
        locale: 'en',
        pathname: 'http://localhost:3000/found',
      };
      const req = createReq({
        nextUrl: url,
      });
      const res = createRes();

      const response = middleware['rewrite']('/new', req, res);

      expect(response.headers.get(REWRITE_HEADER_NAME)).to.equal('/new');
      expect(response.url).to.endWith('/new');
    });

    it('should rewrite path and not rewrite header when skipHeader is true', () => {
      const middleware = new SampleMiddleware({ sites: [] });
      const cloneUrl = () => Object.assign({}, req.nextUrl);
      const url = {
        clone: cloneUrl,
        href: 'http://localhost:3000/not-found',
        locale: 'en',
        pathname: 'http://localhost:3000/found',
      };
      const req = createReq({
        nextUrl: url,
      });
      const res = createRes();

      const response = middleware['rewrite']('/new', req, res, true);
      expect(response.headers.get(REWRITE_HEADER_NAME)).to.be.undefined;
      expect(response.url).to.endWith('/new');
    });
  });
});

describe('defineMiddleware', () => {
  it('should execute middlewares', async () => {
    type CustomResponse = {
      params: string[];
    } & NextResponse;
    class SampleMiddleware extends MiddlewareBase {
      handle(_req: NextRequest, res: CustomResponse) {
        res.params.push('m1');

        return Promise.resolve(res);
      }
    }

    const middleware1 = new SampleMiddleware({
      sites: [],
    });
    const middleware2: Middleware = {
      handle: (_req, res) => {
        (res as CustomResponse).params.push('m2');
        return Promise.resolve(res);
      },
    };
    const middleware3: Middleware = {
      handle: (_req, res) => {
        (res as CustomResponse).params.push('m3');
        return Promise.resolve(res);
      },
    };

    const req = {} as NextRequest;
    const res = ({
      params: [],
    } as unknown) as NextResponse;
    const ev = {} as NextFetchEvent;

    const result = await defineMiddleware(middleware2, middleware1, middleware3).exec(req, ev, res);

    expect(result).to.deep.equal({
      params: ['m2', 'm1', 'm3'],
    });
  });

  it('should execute middlewares with empty response', async () => {
    class SampleMiddleware extends MiddlewareBase {
      handle(_req: NextRequest, res: NextResponse) {
        res.headers.set('m1', 'true');

        return Promise.resolve(res);
      }
    }

    const middleware1 = new SampleMiddleware({ sites: [] });
    const middleware2: Middleware = {
      handle: (_req, res) => {
        res.headers.set('m2', 'true');
        return Promise.resolve(res);
      },
    };
    const middleware3: Middleware = {
      handle: (_req, res) => {
        res.headers.set('m3', 'true');
        return Promise.resolve(res);
      },
    };

    const req = {} as NextRequest;
    const ev = {} as NextFetchEvent;

    const result = await defineMiddleware(middleware2, middleware1, middleware3).exec(req, ev);

    expect(result.headers.get('m1')).to.equal('true');
    expect(result.headers.get('m2')).to.equal('true');
    expect(result.headers.get('m3')).to.equal('true');
  });
});
