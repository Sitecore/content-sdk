/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-expressions */
/* eslint-disable dot-notation */
import chai, { use } from 'chai';
import chaiString from 'chai-string';
import sinonChai from 'sinon-chai';
import sinon, { spy } from 'sinon';
import nextjs, { NextRequest, NextResponse } from 'next/server';
import { GraphQLRequestClient, debug } from '@sitecore-content-sdk/core';
import { SiteResolver } from '@sitecore-content-sdk/core/site';
import { CdpHelper } from '@sitecore-content-sdk/core/personalize';
import { PersonalizeProxyConfig } from './personalize-proxy';
import proxyquire from 'proxyquire';

use(sinonChai);
const expect = chai.use(chaiString).expect;
const sandbox = sinon.createSandbox();

describe('PersonalizeProxy', () => {
  const CDKPersonalizeStub = sandbox.stub().callsFake(() => {
    return Promise.resolve({ variantId: 'variant-2' });
  });

  const { PersonalizeProxy } = proxyquire('./personalize-proxy', {
    '@sitecore-content-sdk/personalize/server': { personalize: CDKPersonalizeStub },
  });

  const ua = 'user-agent-string';
  const userAgentStub = sandbox.stub(nextjs, 'userAgent').returns({ ua } as any);
  const debugSpy = spy(debug, 'personalize');
  const validateDebugLog = (message, ...params) => {
    expect(debugSpy.args.find((log) => log[0] === message)).to.deep.equal([message, ...params]);
  };
  const validateEndMessageDebugLog = (message, params) => {
    const logParams = debugSpy.args.find((log) => log[0] === message) as Array<unknown>;
    expect(logParams?.[2]).to.deep.equal(params);
  };

  const hostname = 'foo.net';
  const siteName = 'bar';

  const pageId = 'item-id';
  const variantIds = ['variant-1', 'variant-2'];
  const defaultLang = 'en';
  const referrer = 'http://localhost:3000';

  const defaultConfig: Omit<PersonalizeProxyConfig, 'clientFactory'> = {
    enabled: true,
    edgeTimeout: 400,
    cdpTimeout: 400,
    scope: undefined,
    channel: undefined,
    currency: undefined,
    contextId: '0000-0000-0000',
    clientContextId: '0000-0000-0000',
    edgeUrl: 'https://foo.bar',
    sites: [],
  };

  const createRequest = (props: any = {}) => {
    const req = {
      ...props,
      nextUrl: {
        pathname: '/styleguide',
        locale: defaultLang,
        searchParams: {
          get(key) {
            return {
              utm_campaign: 'utm_campaign',
              utm_content: undefined,
              utm_medium: undefined,
              utm_source: undefined,
            }[key];
          },
        },
        clone() {
          return Object.assign({}, req.nextUrl);
        },
        ...props?.nextUrl,
      },
      cookies: {
        get(cookieName: string) {
          const cookies = {
            'bid_cdp-client-key': 'browser-id',
            ...props.cookieValues,
          };

          return { value: cookies[cookieName] };
        },
        ...props.cookies,
      },
      headers: {
        host: hostname,
        get(key: string) {
          return req.headers[key];
        },
        referer: referrer,
        ...props.headerValues,
      },
      referrer: 'about:client',
    } as NextRequest;

    Object.defineProperties(req.headers, {
      set: {
        value: (key, value) => {
          req.headers[key] = value;
        },
        enumerable: false,
      },
      forEach: {
        value: (cb) => {
          Object.keys(req.headers).forEach((key) => cb(req.headers[key], key, req.headers));
        },
        enumerable: false,
      },
    });

    return req;
  };

  const createResponse = (props: any = {}) => {
    const res = {
      cookies: {
        set(key, value) {
          res.cookies[key] = value;
        },
        get(key) {
          return { value: res.cookies[key] };
        },
        getAll() {
          return Object.keys(res.cookies).map((key) => ({ name: key, value: res.cookies[key] }));
        },
        ...props.cookieValues,
      },
      headers: {
        host: hostname,
        get(key: string) {
          return res.headers[key];
        },
        ...props.headerValues,
      },
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

  const createProxy = (
    props: {
      [key: string]: unknown;
      config?: Omit<PersonalizeProxyConfig, 'clientFactory'>;
      language?: string;
      siteResolver?: SiteResolver;
      variantId?: string;
      personalizeInfo?: {
        pageId: string;
        variantIds: string[];
      } | null;
      getPersonalizeInfoStub?: sinon.SinonStub;
      personalizeStub?: sinon.SinonStub;
      handleCookieStub?: sinon.SinonStub;
      getClientFactoryStub?: sinon.SinonStub;
      extractGeoDataCb?: sinon.SinonStub;
    } = { config: defaultConfig }
  ) => {
    const clientFactory = GraphQLRequestClient.createClientFactory({
      apiKey: 'edge-api-key',
      endpoint: 'http://edge-endpoint/api/graph/edge',
    });
    const personalizeConfig = {
      ...defaultConfig,
      ...(props?.config || {}),
    };

    class MockSiteResolver extends SiteResolver {
      getByName = sandbox.stub().callsFake((siteName: string) => ({
        name: siteName,
        language: props.language || '',
        hostName: hostname,
      }));

      getByHost = sandbox.stub().callsFake((hostName: string) => ({
        name: siteName,
        language: props.language || '',
        hostName,
      }));
    }

    const siteResolver: SiteResolver = props.siteResolver || new MockSiteResolver([]);
    const proxy = new PersonalizeProxy({
      ...props,
      ...personalizeConfig,
    });
    proxy['siteResolver'] = siteResolver;

    const initPersonalizeServer = (proxy['initPersonalizeServer'] = sandbox.stub());

    const getClientFactory = (proxy['getClientFactory'] =
      props.getClientFactoryStub || sandbox.stub().returns(clientFactory));

    const personalize = (proxy['personalize'] =
      props.personalizeStub ||
      sandbox.stub().returns(
        Promise.resolve({
          variantId: props.variantId,
        })
      ));

    const getPersonalizeInfo = (proxy['personalizeService']['getPersonalizeInfo'] =
      props.getPersonalizeInfoStub ||
      sandbox.stub().returns(
        Promise.resolve(
          props.personalizeInfo === null
            ? undefined
            : props.personalizeInfo || {
                pageId,
                variantIds,
              }
        )
      ));

    return {
      proxy,
      getPersonalizeInfo,
      siteResolver,
      initPersonalizeServer,
      personalize,
      getClientFactory,
    };
  };

  // Stub for NextResponse generation, see https://github.com/vercel/next.js/issues/42374
  (Headers.prototype as any).getAll = () => [];

  beforeEach(() => {
    userAgentStub.resetHistory();
    debugSpy.resetHistory();
  });

  afterEach(() => {
    sandbox.restore();
    userAgentStub.returns({ ua } as any);
  });

  describe('Extensibility', () => {
    it('should apply custom experience params from getExtraUtmParams, when provided', async () => {
      const customParams = {
        campaign: 'custom_campaign',
        source: 'custom_source',
        medium: 'custom_medium',
        content: 'custom_content',
      };

      const req = createRequest();
      const res = createResponse();
      const nextRewriteStub = sandbox.stub(nextjs.NextResponse, 'rewrite').returns(res);

      const getOverrideExperienceParamsStub = sandbox.stub().returns(customParams);

      const { proxy, getPersonalizeInfo, initPersonalizeServer, personalize } = createProxy({
        variantId: 'variant-2',
        config: {
          ...defaultConfig,
          getExtraUtmParams: getOverrideExperienceParamsStub,
        },
      });

      const finalRes = await proxy.handle(req, res);

      validateDebugLog('personalize proxy start: %o', {
        headers: {
          ...req.headers,
        },
        hostname: 'foo.net',
        pathname: '/styleguide',
        language: 'en',
      });

      expect(getPersonalizeInfo.calledWith('/styleguide', 'en')).to.be.true;
      expect(initPersonalizeServer.calledOnce).to.be.true;
      expect(personalize.calledOnce).to.be.true;

      expect(getOverrideExperienceParamsStub.calledOnceWith(req)).to.be.true;
      expect(
        personalize.calledWith(sandbox.match({ params: { utm: customParams } }), sandbox.match.any)
      ).to.be.true;

      validateEndMessageDebugLog('personalize proxy end in %dms: %o', {
        rewritePath: '/styleguide/_variantId_variant-2',
        headers: {
          ...res.headers,
          'x-proxy-cache': 'no-cache',
          'x-sc-rewrite': '/styleguide/_variantId_variant-2',
        },
      });

      expect(finalRes).to.deep.equal(res);
      nextRewriteStub.restore();
    });

    it('should use custom personalizeService when provided', async () => {
      const req = createRequest();
      const res = createResponse();
      const nextRewriteStub = sandbox.stub(nextjs.NextResponse, 'rewrite').returns(res);

      const customPersonalizeService = {
        getPersonalizeInfo: sandbox.stub().returns(
          Promise.resolve({
            pageId,
            variantIds,
          })
        ),
      };

      const { proxy, initPersonalizeServer, personalize } = createProxy({
        config: {
          ...defaultConfig,
          personalizeService: customPersonalizeService,
        },
        variantId: variantIds[1],
      });

      const finalRes = await proxy.handle(req, res);

      expect(customPersonalizeService.getPersonalizeInfo.calledWith('/styleguide', 'en')).to.be
        .true;
      expect(initPersonalizeServer.calledOnce).to.be.true;
      expect(personalize.calledOnce).to.be.true;

      validateDebugLog('personalize proxy start: %o', {
        headers: {
          ...req.headers,
        },
        hostname: 'foo.net',
        pathname: '/styleguide',
        language: 'en',
      });

      validateEndMessageDebugLog('personalize proxy end in %dms: %o', {
        rewritePath: '/styleguide/_variantId_variant-2',
        headers: {
          ...res.headers,
          'x-proxy-cache': 'no-cache',
          'x-sc-rewrite': '/styleguide/_variantId_variant-2',
        },
      });

      expect(finalRes).to.deep.equal(res);
      nextRewriteStub.restore();
    });
  });

  describe('request skipped', () => {
    it('redirected', async () => {
      const req = createRequest();

      const res = createResponse({ redirected: true });

      const { proxy } = createProxy();

      const finalRes = await proxy.handle(req, res);

      validateDebugLog('personalize proxy start: %o', {
        hostname: 'foo.net',
        pathname: '/styleguide',
        language: 'en',
        headers: {
          ...req.headers,
        },
      });

      validateDebugLog('skipped (%s)', 'redirected');

      expect(finalRes).to.deep.equal(res);
    });

    describe('preview', () => {
      it('prerender bypass cookie is present', async () => {
        const req = createRequest({
          cookieValues: {
            __prerender_bypass: true,
          },
        });
        const res = createResponse();
        const { proxy } = createProxy();
        const getCookiesSpy = spy(req.cookies, 'get');
        const finalRes = await proxy.handle(req, res);

        validateDebugLog('personalize proxy start: %o', {
          hostname: 'foo.net',
          pathname: '/styleguide',
          language: 'en',
          headers: {
            ...req.headers,
          },
        });
        validateDebugLog('skipped (%s)', 'preview');
        expect(getCookiesSpy.calledWith('__prerender_bypass')).to.be.true;
        expect(finalRes).to.deep.equal(res);
      });

      it('preview data cookie is present', async () => {
        const req = createRequest({
          cookieValues: {
            __next_preview_data: true,
          },
        });
        const res = createResponse();
        const { proxy } = createProxy();
        const getCookiesSpy = spy(req.cookies, 'get');
        const finalRes = await proxy.handle(req, res);

        validateDebugLog('personalize proxy start: %o', {
          hostname: 'foo.net',
          pathname: '/styleguide',
          language: 'en',
          headers: {
            ...req.headers,
          },
        });
        validateDebugLog('skipped (%s)', 'preview');
        expect(getCookiesSpy.calledWith('__prerender_bypass')).to.be.true;
        expect(getCookiesSpy.calledWith('__next_preview_data')).to.be.true;
        expect(finalRes).to.deep.equal(res);
      });
    });
    describe('disabled / skip', () => {
      const res = createResponse();

      const test = async (pathname: string, proxy: PersonalizeProxy) => {
        const req = createRequest({
          nextUrl: {
            pathname,
          },
        });
        const finalRes = await proxy.handle(req, res);
        const headers = {};
        req.headers.forEach((value, key) => (headers[key] = value));
        const isDisabledGlobally = proxy['config'].enabled === false;
        if (!isDisabledGlobally) {
          validateDebugLog('personalize proxy start: %o', {
            hostname: 'foo.net',
            pathname,
            language: 'en',
            headers,
          });
        }
        const message = isDisabledGlobally
          ? 'skipped (personalize proxy is disabled globally)'
          : 'skipped (personalize proxy is disabled)';
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
      it('should apply both default and custom rules when custom skip function provided', async () => {
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
      it('should be disable when "enable" prop is false', async () => {
        const { proxy } = createProxy({
          config: { ...defaultConfig, enabled: false },
        });
        await test('/src/image.png', proxy);
        await test('/api/layout/render', proxy);
        await test('/sitecore/render', proxy);
        await test('/_next/webpack', proxy);
        await test('/crazypath/luna', proxy);
      });
    });
    it('personalize info not found', async () => {
      const req = createRequest();
      const res = createResponse();
      const { proxy, getPersonalizeInfo } = createProxy({
        personalizeInfo: null,
      });
      const finalRes = await proxy.handle(req, res);
      const headers = {};
      req.headers.forEach((value, key) => (headers[key] = value));
      validateDebugLog('personalize proxy start: %o', {
        hostname: 'foo.net',
        pathname: '/styleguide',
        language: 'en',
        headers,
      });
      expect(getPersonalizeInfo.calledWith('/styleguide', 'en')).to.be.true;
      validateDebugLog('skipped (personalize info not found)');
      expect(finalRes).to.deep.equal(res);
    });
    it('no personalization configured', async () => {
      const req = createRequest();
      const res = createResponse();
      const { proxy, getPersonalizeInfo } = createProxy({
        personalizeInfo: {
          pageId,
          variantIds: [],
        },
      });
      const finalRes = await proxy.handle(req, res);
      const headers = {};
      req.headers.forEach((value, key) => (headers[key] = value));
      validateDebugLog('personalize proxy start: %o', {
        hostname: 'foo.net',
        pathname: '/styleguide',
        language: 'en',
        headers,
      });
      expect(getPersonalizeInfo.calledWith('/styleguide', 'en')).to.be.true;
      validateDebugLog('skipped (no personalization configured)');
      expect(finalRes).to.deep.equal(res);
    });
    it('no variant identified', async () => {
      const req = createRequest();
      const res = createResponse();
      const { proxy, getPersonalizeInfo, initPersonalizeServer, personalize } = createProxy({
        variantId: undefined,
      });
      const headers = {};
      req.headers.forEach((value, key) => (headers[key] = value));
      const finalRes = await proxy.handle(req, res);
      validateDebugLog('personalize proxy start: %o', {
        hostname: 'foo.net',
        pathname: '/styleguide',
        language: 'en',
        headers,
      });
      expect(getPersonalizeInfo.calledWith('/styleguide', 'en')).to.be.true;
      expect(initPersonalizeServer.called).to.be.true;
      expect(personalize.called).to.be.true;
      validateDebugLog('skipped (no variant(s) identified)');
      expect(finalRes).to.deep.equal(res);
    });
    it('invalid variant', async () => {
      const req = createRequest();
      const res = createResponse();
      const handleCookieStub = sandbox.stub().resolves();
      const invalidVariant = 'invalid-variant';
      const { proxy, getPersonalizeInfo, initPersonalizeServer, personalize } = createProxy({
        personalizeInfo: {
          pageId,
          variantIds,
        },
        variantId: invalidVariant,
        handleCookieStub,
      });
      const finalRes = await proxy.handle(req, res);
      const headers = {};
      req.headers.forEach((value, key) => (headers[key] = value));
      validateDebugLog('personalize proxy start: %o', {
        hostname: 'foo.net',
        pathname: '/styleguide',
        language: 'en',
        headers,
      });
      expect(getPersonalizeInfo.calledWith('/styleguide', 'en')).to.be.true;
      expect(initPersonalizeServer.called).to.be.true;
      expect(personalize.called).to.be.true;
      validateDebugLog('invalid variant %s', invalidVariant);
      expect(finalRes).to.deep.equal(res);
    });

    it('prefetch', async () => {
      const req = createRequest({
        headerValues: {
          purpose: 'prefetch',
        },
      });
      const res = createResponse();
      const { proxy } = createProxy();
      const finalRes = await proxy.handle(req, res);

      validateDebugLog('personalize proxy start: %o', {
        hostname: 'foo.net',
        pathname: '/styleguide',
        language: 'en',
        headers: {
          ...req.headers,
        },
      });
      validateDebugLog('skipped (prefetch)');
      expect(finalRes).to.deep.equal(res);
      expect(finalRes.headers['x-proxy-cache']).to.equal('no-cache');
      expect(finalRes.headers['Cache-Control']).to.equal('no-store, must-revalidate');
    });
  });

  describe('request passed', () => {
    it('fallback defaultLocale is used', async () => {
      const language = 'da-DK';
      const req = createRequest({
        nextUrl: {
          locale: undefined,
          defaultLocale: language,
        },
      });
      const res = createResponse();
      const nextRewriteStub = sandbox.stub(nextjs.NextResponse, 'rewrite').returns(res);
      const { proxy, getPersonalizeInfo, siteResolver, initPersonalizeServer, personalize } =
        createProxy({
          language,
          variantId: 'variant-2',
          personalizeInfo: {
            variantIds,
            pageId,
          },
        });
      const finalRes = await proxy.handle(req, res);

      validateDebugLog('personalize proxy start: %o', {
        headers: {
          ...req.headers,
        },
        hostname: 'foo.net',
        pathname: '/styleguide',
        language: language,
      });
      expect(getPersonalizeInfo.calledWith('/styleguide', 'da-DK')).to.be.true;
      expect(initPersonalizeServer.calledOnce).to.be.true;
      expect(personalize.calledOnce).to.be.true;
      validateEndMessageDebugLog('personalize proxy end in %dms: %o', {
        rewritePath: '/styleguide/_variantId_variant-2',
        headers: {
          ...res.headers,
          'x-proxy-cache': 'no-cache',
          'x-sc-rewrite': '/styleguide/_variantId_variant-2',
        },
      });
      expect(siteResolver.getByHost).to.be.calledWith(hostname);
      expect(finalRes).to.deep.equal(res);
      nextRewriteStub.restore();
    });

    it('fallback locale is used', async () => {
      const req = createRequest({
        nextUrl: {
          locale: undefined,
          defaultLocale: undefined,
        },
      });
      const res = createResponse();
      const nextRewriteStub = sandbox.stub(nextjs.NextResponse, 'rewrite').returns(res);
      const { proxy, getPersonalizeInfo, siteResolver, initPersonalizeServer, personalize } =
        createProxy({
          variantId: 'variant-2',
        });
      const finalRes = await proxy.handle(req, res);

      validateDebugLog('personalize proxy start: %o', {
        headers: {
          ...req.headers,
        },
        hostname: 'foo.net',
        pathname: '/styleguide',
        language: 'en',
      });
      expect(getPersonalizeInfo.calledWith('/styleguide', 'en')).to.be.true;
      expect(initPersonalizeServer.calledOnce).to.be.true;
      expect(personalize.calledOnce).to.be.true;
      validateEndMessageDebugLog('personalize proxy end in %dms: %o', {
        rewritePath: '/styleguide/_variantId_variant-2',
        headers: {
          ...res.headers,
          'x-proxy-cache': 'no-cache',
          'x-sc-rewrite': '/styleguide/_variantId_variant-2',
        },
      });
      expect(siteResolver.getByHost).to.be.calledWith(hostname);
      expect(finalRes).to.deep.equal(res);
      nextRewriteStub.restore();
    });

    it('custom response object is not provided', async () => {
      const req = createRequest();
      const res = createResponse();
      const nextRewriteStub = sandbox.stub(nextjs.NextResponse, 'rewrite').returns(res);
      const { proxy, getPersonalizeInfo, siteResolver, initPersonalizeServer, personalize } =
        createProxy({
          variantId: 'variant-2',
        });
      const finalRes = await proxy.handle(req, res);

      expect(getPersonalizeInfo.calledWith('/styleguide', 'en')).to.be.true;
      expect(initPersonalizeServer.calledOnce).to.be.true;
      expect(personalize.calledOnce).to.be.true;
      validateDebugLog('personalize proxy start: %o', {
        headers: {
          ...req.headers,
        },
        hostname: 'foo.net',
        pathname: '/styleguide',
        language: 'en',
      });
      validateEndMessageDebugLog('personalize proxy end in %dms: %o', {
        rewritePath: '/styleguide/_variantId_variant-2',
        headers: {
          ...res.headers,
          'x-proxy-cache': 'no-cache',
          'x-sc-rewrite': '/styleguide/_variantId_variant-2',
        },
      });
      expect(siteResolver.getByHost).to.be.calledWith(hostname);
      expect(finalRes).to.deep.equal(res);
      nextRewriteStub.restore();
    });

    it('optional experience params are not present', async () => {
      userAgentStub.returns({ ua: '' } as any);
      const req = createRequest({ headerValues: { referer: null } });
      const res = createResponse();
      const nextRewriteStub = sandbox.stub(nextjs.NextResponse, 'rewrite').returns(res);
      const { proxy, getPersonalizeInfo, siteResolver, initPersonalizeServer, personalize } =
        createProxy({
          variantId: 'variant-2',
        });
      const finalRes = await proxy.handle(req, res);

      validateDebugLog('personalize proxy start: %o', {
        headers: {
          ...req.headers,
        },
        hostname: 'foo.net',
        pathname: '/styleguide',
        language: 'en',
      });
      expect(getPersonalizeInfo.calledWith('/styleguide', 'en')).to.be.true;
      expect(initPersonalizeServer.calledOnce).to.be.true;
      expect(personalize.calledOnce).to.be.true;
      validateEndMessageDebugLog('personalize proxy end in %dms: %o', {
        rewritePath: '/styleguide/_variantId_variant-2',
        headers: {
          ...res.headers,
          'x-proxy-cache': 'no-cache',
          'x-sc-rewrite': '/styleguide/_variantId_variant-2',
        },
      });
      expect(siteResolver.getByHost).to.be.calledWith(hostname);
      expect(finalRes).to.deep.equal(res);
      nextRewriteStub.restore();
    });
    it('sc_site cookie is provided', async () => {
      const req = createRequest();
      const res = createResponse({
        cookieValues: {
          'BID_cdp-client-key': 'browser-id',
          sc_site: 'foo',
        },
      });
      const nextRewriteStub = sandbox.stub(nextjs.NextResponse, 'rewrite').returns(res);
      const { proxy, getPersonalizeInfo, initPersonalizeServer, personalize, siteResolver } =
        createProxy({
          variantId: 'variant-2',
        });
      const finalRes = await proxy.handle(req, res);

      validateDebugLog('personalize proxy start: %o', {
        headers: {
          ...req.headers,
        },
        hostname: 'foo.net',
        pathname: '/styleguide',
        language: 'en',
      });
      expect(getPersonalizeInfo.calledWith('/styleguide', 'en', 'foo')).to.be.true;
      expect(initPersonalizeServer.calledOnce).to.be.true;
      expect(personalize.calledOnce).to.be.true;
      validateEndMessageDebugLog('personalize proxy end in %dms: %o', {
        rewritePath: '/styleguide/_variantId_variant-2',
        headers: {
          ...res.headers,
          'x-proxy-cache': 'no-cache',
          'x-sc-rewrite': '/styleguide/_variantId_variant-2',
        },
      });
      expect(siteResolver.getByHost).not.called.to.equal(true);
      expect(siteResolver.getByName).calledOnceWith('foo');
      expect(finalRes).to.deep.equal(res);
      nextRewriteStub.restore();
    });

    it('x-sc-rewrite header is provided', async () => {
      const req = createRequest();
      const res = createResponse({
        headerValues: {
          'x-sc-rewrite': '/_site_nextjs-app/styleguide/',
        },
      });
      const nextRewriteStub = sandbox.stub(nextjs.NextResponse, 'rewrite').returns(res);
      const { proxy, getPersonalizeInfo, initPersonalizeServer, personalize, siteResolver } =
        createProxy({
          variantId: 'variant-2',
        });
      const finalRes = await proxy.handle(req, res);

      validateDebugLog('personalize proxy start: %o', {
        headers: {
          ...req.headers,
        },
        hostname: 'foo.net',
        pathname: '/styleguide',
        language: 'en',
      });
      expect(getPersonalizeInfo.calledWith('/styleguide', 'en', siteName)).to.be.true;
      expect(initPersonalizeServer.calledOnce).to.be.true;
      expect(personalize.calledOnce).to.be.true;
      validateEndMessageDebugLog('personalize proxy end in %dms: %o', {
        rewritePath: '/_site_nextjs-app/styleguide/_variantId_variant-2',
        headers: {
          ...res.headers,
          'x-proxy-cache': 'no-cache',
          'x-sc-rewrite': '/_site_nextjs-app/styleguide/_variantId_variant-2',
        },
      });
      expect(siteResolver.getByHost).to.be.calledWith(hostname);
      expect(finalRes).to.deep.equal(res);
      nextRewriteStub.restore();
    });

    it('default fallback hostname is used', async () => {
      const req = createRequest({
        headerValues: {
          host: undefined,
        },
      });
      const res = createResponse();
      const nextRewriteStub = sandbox.stub(nextjs.NextResponse, 'rewrite').returns(res);
      const { proxy, getPersonalizeInfo, initPersonalizeServer, personalize, siteResolver } =
        createProxy({
          variantId: 'variant-2',
        });
      const finalRes = await proxy.handle(req, res);

      validateDebugLog('personalize proxy start: %o', {
        headers: {
          ...req.headers,
        },
        hostname: 'localhost',
        pathname: '/styleguide',
        language: 'en',
      });
      expect(getPersonalizeInfo.calledWith('/styleguide', 'en', siteName)).to.be.true;
      expect(initPersonalizeServer.calledOnce).to.be.true;
      expect(personalize.calledOnce).to.be.true;
      validateEndMessageDebugLog('personalize proxy end in %dms: %o', {
        rewritePath: '/styleguide/_variantId_variant-2',
        headers: {
          ...res.headers,
          'x-proxy-cache': 'no-cache',
          'x-sc-rewrite': '/styleguide/_variantId_variant-2',
        },
      });
      expect(siteResolver.getByHost).to.be.calledWith('localhost');
      expect(finalRes).to.deep.equal(res);
      nextRewriteStub.restore();
    });

    it('custom fallback hostname is used', async () => {
      const req = createRequest({
        headerValues: {
          host: undefined,
        },
      });
      const res = createResponse();
      const nextRewriteStub = sandbox.stub(nextjs.NextResponse, 'rewrite').returns(res);
      const { proxy, getPersonalizeInfo, initPersonalizeServer, personalize, siteResolver } =
        createProxy({
          variantId: 'variant-2',
          defaultHostname: 'foobar',
        });
      const finalRes = await proxy.handle(req, res);
      expect(initPersonalizeServer.calledOnce).to.be.true;
      expect(personalize.calledOnce).to.be.true;
      validateDebugLog('personalize proxy start: %o', {
        headers: { ...req.headers },
        hostname: 'foobar',
        pathname: '/styleguide',
        language: 'en',
      });
      expect(getPersonalizeInfo.calledWith('/styleguide', 'en', siteName)).to.be.true;
      validateEndMessageDebugLog('personalize proxy end in %dms: %o', {
        rewritePath: '/styleguide/_variantId_variant-2',
        headers: {
          ...res.headers,
          'x-proxy-cache': 'no-cache',
          'x-sc-rewrite': '/styleguide/_variantId_variant-2',
        },
      });
      expect(siteResolver.getByHost).to.be.calledWith('foobar');
      expect(finalRes).to.deep.equal(res);
      nextRewriteStub.restore();
    });

    it('configured scope is used', async () => {
      const pageId = 'item-id';
      const scope = 'myscope';
      const req = createRequest();
      const res = createResponse();
      const nextRewriteStub = sandbox.stub(nextjs.NextResponse, 'rewrite').returns(res);
      const personalizeStub = sandbox.stub().returns(Promise.resolve({ variantId: undefined }));
      const { proxy, getPersonalizeInfo, personalize } = createProxy({
        config: { ...defaultConfig, scope },
        personalizeInfo: {
          pageId,
          variantIds: ['variant1'],
        },
        personalizeStub,
      });
      const finalRes = await proxy.handle(req, res);

      expect(getPersonalizeInfo.calledWith('/styleguide', 'en', siteName)).to.be.true;
      expect(
        personalize.calledWith(
          sandbox.match({ friendlyId: CdpHelper.getPageFriendlyId(pageId, 'en', scope) }),
          sandbox.match.any
        )
      ).to.be.true;
      expect(finalRes).to.deep.equal(res);
      nextRewriteStub.restore();
    });

    it('configured timeouts are used', async () => {
      const pageId = 'item-id';
      const edgeTimeout = 1000;
      const cdpTimeout = 1000;
      const req = createRequest();
      const res = createResponse();
      const nextRewriteStub = sandbox.stub(nextjs.NextResponse, 'rewrite').returns(res);
      const personalizeStub = sandbox.stub().returns(Promise.resolve({ variantId: undefined }));
      const { proxy, personalize } = createProxy({
        config: { ...defaultConfig, edgeTimeout, cdpTimeout },
        personalizeInfo: {
          pageId,
          variantIds: ['variant1'],
        },
        personalizeStub,
      });
      const finalRes = await proxy.handle(req, res);

      expect(proxy['personalizeService']['config'].timeout).to.equal(edgeTimeout);
      expect(personalize.calledWith(sandbox.match({ timeout: cdpTimeout }), sandbox.match.any)).to
        .be.true;
      expect(finalRes).to.deep.equal(res);
      nextRewriteStub.restore();
    });

    it('component testing is executed', async () => {
      const pageId = 'item-id';
      const req = createRequest();
      const res = createResponse();
      const nextRewriteStub = sandbox.stub(nextjs.NextResponse, 'rewrite').returns(res);
      const personalizeStub = sandbox.stub();
      personalizeStub
        .withArgs(
          sandbox.match({
            friendlyId: CdpHelper.getComponentFriendlyId(pageId, 'component1', 'en'),
            variantIds: ['component1_default', 'component1_variant1'],
          }),
          sandbox.match.any
        )
        .returns(Promise.resolve({ variantId: 'component1_default' }));
      personalizeStub
        .withArgs(
          sandbox.match({
            friendlyId: CdpHelper.getComponentFriendlyId(pageId, 'component2', 'en'),
            variantIds: ['component2_default', 'component2_variant1', 'component2_variant2'],
          }),
          sandbox.match.any
        )
        .returns(Promise.resolve({ variantId: 'component2_variant1' }));
      personalizeStub
        .withArgs(
          sandbox.match({
            friendlyId: CdpHelper.getComponentFriendlyId(pageId, 'component3', 'en'),
            variantIds: [
              'component3_default',
              'component3_variant1',
              'component3_variant2',
              'component3_variant3',
            ],
          }),
          sandbox.match.any
        )
        .returns(Promise.resolve({ variantId: 'component3_variant3' }));
      const { proxy, getPersonalizeInfo, initPersonalizeServer } = createProxy({
        personalizeInfo: {
          pageId,
          variantIds: [
            'component1_variant1',
            'component2_variant1',
            'component2_variant2',
            'component3_variant1',
            'component3_variant2',
            'component3_variant3',
          ],
        },
        personalizeStub,
      });
      const finalRes = await proxy.handle(req, res);

      expect(getPersonalizeInfo.calledWith('/styleguide', 'en')).to.be.true;
      expect(initPersonalizeServer.calledOnce).to.be.true;
      expect(personalizeStub.calledThrice).to.be.true;
      validateDebugLog('personalize proxy start: %o', {
        headers: {
          ...req.headers,
        },
        hostname: 'foo.net',
        pathname: '/styleguide',
        language: 'en',
      });
      validateEndMessageDebugLog('personalize proxy end in %dms: %o', {
        rewritePath:
          '/styleguide/_variantId_component1_default/_variantId_component2_variant1/_variantId_component3_variant3',
        headers: {
          ...res.headers,
          'x-proxy-cache': 'no-cache',
          'x-sc-rewrite':
            '/styleguide/_variantId_component1_default/_variantId_component2_variant1/_variantId_component3_variant3',
        },
      });
      expect(finalRes).to.deep.equal(res);
      nextRewriteStub.restore();
    });

    describe('geo data', () => {
      const geo = { country: 'US', region: 'CA', city: 'San Francisco' };
      const req = createRequest();
      const res = createResponse();
      const personalizeInfo = {
        pageId,
        variantIds: [
          'component1_variant1',
          'component2_variant1',
          'component2_variant2',
          'component3_variant1',
          'component3_variant2',
          'component3_variant3',
        ],
      };

      afterEach(() => {
        CDKPersonalizeStub.reset();
      });

      it('should call personalize with geo data', async () => {
        const extractGeoDataCb = sandbox.stub().returns(geo);

        const { proxy, initPersonalizeServer } = createProxy({
          personalizeInfo,
          extractGeoDataCb,
        });

        proxy['personalize'] = PersonalizeProxy.prototype['personalize'];

        await proxy.handle(req, res);

        validateDebugLog('personalize proxy start: %o', {
          geo,
          headers: {
            ...req.headers,
          },
          hostname: 'foo.net',
          pathname: '/styleguide',
          language: 'en',
        });

        expect(extractGeoDataCb.calledOnce).to.be.true;
        expect(initPersonalizeServer.calledOnce).to.be.true;
        expect(CDKPersonalizeStub.calledThrice).to.be.true;
        expect(CDKPersonalizeStub.firstCall.args[1].geo).to.deep.equal(geo);
        expect(CDKPersonalizeStub.secondCall.args[1].geo).to.deep.equal(geo);
        expect(CDKPersonalizeStub.thirdCall.args[1].geo).to.deep.equal(geo);
      });

      it('should call personalize with geo data when an async cb is provided', async () => {
        const extractGeoDataCb = sandbox.stub().resolves(geo);

        const { proxy, initPersonalizeServer } = createProxy({
          extractGeoDataCb,
          personalizeInfo,
        });

        proxy['personalize'] = PersonalizeProxy.prototype['personalize'];

        await proxy.handle(req, res);

        validateDebugLog('personalize proxy start: %o', {
          geo,
          headers: {
            ...req.headers,
          },
          hostname: 'foo.net',
          pathname: '/styleguide',
          language: 'en',
        });

        expect(extractGeoDataCb.calledOnce).to.be.true;
        expect(initPersonalizeServer.calledOnce).to.be.true;
        expect(CDKPersonalizeStub.calledThrice).to.be.true;
        expect(CDKPersonalizeStub.firstCall.args[1].geo).to.deep.equal(geo);
        expect(CDKPersonalizeStub.secondCall.args[1].geo).to.deep.equal(geo);
        expect(CDKPersonalizeStub.thirdCall.args[1].geo).to.deep.equal(geo);
      });

      it('should call personalize without geo data when not available', async () => {
        const { proxy, initPersonalizeServer } = createProxy({
          personalizeInfo,
        });

        proxy['personalize'] = PersonalizeProxy.prototype['personalize'];

        await proxy.handle(req, res);

        expect(initPersonalizeServer.calledOnce).to.be.true;
        expect(CDKPersonalizeStub.calledThrice).to.be.true;
        expect(CDKPersonalizeStub.firstCall.args[1]).to.not.have.property('geo');
        expect(CDKPersonalizeStub.secondCall.args[1]).to.not.have.property('geo');
        expect(CDKPersonalizeStub.thirdCall.args[1]).to.not.have.property('geo');
      });
    });

    describe('getLanguage', () => {
      it('should get Language from locale response header if present', async () => {
        const languageInHeader = 'fr-FR';
        const language = 'da-DK';
        const req = createRequest({
          nextUrl: {
            locale: language,
          },
        });
        const res = createResponse({ headers: { 'x-sc-locale': languageInHeader } });
        const nextRewriteStub = sandbox.stub(nextjs.NextResponse, 'rewrite').returns(res);
        const { proxy, getPersonalizeInfo } = createProxy({
          language,
          variantId: 'variant-2',
          personalizeInfo: {
            variantIds,
            pageId,
          },
        });
        await proxy.handle(req, res);

        validateDebugLog('personalize proxy start: %o', {
          headers: {
            ...req.headers,
          },
          hostname: 'foo.net',
          pathname: '/styleguide',
          language: languageInHeader,
        });
        expect(getPersonalizeInfo.calledWith('/styleguide', languageInHeader)).to.be.true;
        nextRewriteStub.restore();
      });

      it('should get Language from nexturl if locale header is not present', async () => {
        const language = 'da-DK';
        const req = createRequest({
          nextUrl: {
            locale: language,
          },
        });
        const res = createResponse({ headers: {} });
        const nextRewriteStub = sandbox.stub(nextjs.NextResponse, 'rewrite').returns(res);
        const { proxy, getPersonalizeInfo } = createProxy({
          language,
          variantId: 'variant-2',
          personalizeInfo: {
            variantIds,
            pageId,
          },
        });
        await proxy.handle(req, res);

        validateDebugLog('personalize proxy start: %o', {
          headers: {
            ...req.headers,
          },
          hostname: 'foo.net',
          pathname: '/styleguide',
          language,
        });
        expect(getPersonalizeInfo.calledWith('/styleguide', language)).to.be.true;
        nextRewriteStub.restore();
      });
    });
  });

  describe('error handling', () => {
    const req = createRequest();
    const res = createResponse({
      body: '<div> Regular page </div>',
    });

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

    it('should log error when getPersonalizeInfo throws', async () => {
      const error = new Error('Edge fails');

      const getPersonalizeInfoWithError = sandbox.stub().throws(error);

      const { proxy, getPersonalizeInfo, initPersonalizeServer, personalize } = createProxy({
        getPersonalizeInfoStub: getPersonalizeInfoWithError,
      });

      const finalRes = await proxy.handle(req, res);

      expect(initPersonalizeServer.called).to.be.false;
      expect(personalize.called).to.be.false;

      expect(getPersonalizeInfo.called).to.be.true;
      expect(errorSpy.getCall(0).calledWith('Personalize proxy failed:')).to.be.true;
      expect(errorSpy.getCall(1).calledWith(error)).to.be.true;

      expect(finalRes).to.deep.equal(res);
    });
  });

  describe('configuration - Edge API required', () => {
    it('gracefully disables when Edge config is missing', () => {
      // Create proxy without Edge config (no contextId or clientContextId)
      const proxy = new PersonalizeProxy({
        enabled: true,
        edgeTimeout: 400,
        cdpTimeout: 400,
        sites: [],
        // No contextId or clientContextId - Edge config missing
      });

      // Verify proxy was created but personalizeService is null
      expect(proxy).to.not.be.undefined;
      expect(proxy['personalizeService']).to.be.null;
    });

    it('skips execution when personalizeService is null', async () => {
      const req = createRequest();
      const res = createResponse();

      // Create proxy without Edge config
      const proxy = new PersonalizeProxy({
        enabled: true,
        edgeTimeout: 400,
        cdpTimeout: 400,
        sites: [],
        // No contextId or clientContextId
      });

      const finalRes = await proxy.handle(req, res);

      // Should skip execution and return response unchanged
      validateDebugLog('skipped (personalize service not configured - edge config required)');
      expect(finalRes).to.deep.equal(res);
    });

    it('works normally when Edge config is provided', () => {
      const proxy = new PersonalizeProxy({
        enabled: true,
        contextId: 'edge-context-id',
        clientContextId: 'edge-client-id',
        edgeUrl: 'https://edge.url',
        edgeTimeout: 400,
        cdpTimeout: 400,
        sites: [],
      });

      // Verify proxy was created and personalizeService is initialized
      expect(proxy).to.not.be.undefined;
      expect(proxy['personalizeService']).to.not.be.null;
    });
  });
});
