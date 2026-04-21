/* eslint-disable no-unused-expressions */
import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { NextRequest, NextResponse } from 'next/server';

chai.use(sinonChai);
const expect = chai.expect;

describe('analyticsProxyAdapter', () => {
  const sandbox = sinon.createSandbox();

  let analyticsProxyAdapterModule: any;
  let getAnalyticsPluginStub: sinon.SinonStub;
  let getCoreContextStub: sinon.SinonStub;
  let getDefaultCookieAttributesStub: sinon.SinonStub;
  let fetchClientIdFromEdgeProxyStub: sinon.SinonStub;
  let getBotCookieServerSideStub: sinon.SinonStub;
  let isBotStub: sinon.SinonStub;

  const mockAnalyticsPlugin = {
    options: {
      cookies: {
        name: 'sc_cid',
        expiryDays: 730,
        domain: '.example.com',
      },
      timeout: 3000,
      visitorIds: undefined as any,
    },
  };

  const mockCoreContext = {
    config: {
      contextId: 'test-context-id',
      edgeUrl: 'https://edge.test.com',
    },
  };

  const mockCookieAttributes = {
    domain: '.example.com',
    maxAge: 63072000,
    path: '/',
    sameSite: 'None',
    secure: true,
  };

  const createMockRequest = (
    cookies: Record<string, string> = {},
    searchParams = ''
  ): NextRequest => {
    const cookieStore = { ...cookies };
    const headers: Record<string, string> = {};

    return {
      headers: {
        get: (name: string) => headers[name] || null,
      },
      cookies: {
        get: (name: string) => {
          const value = cookieStore[name];
          return value ? { value } : undefined;
        },
        set: (name: string, value: string) => {
          cookieStore[name] = value;
        },
        delete: (name: string) => {
          delete cookieStore[name];
        },
      },
      nextUrl: {
        searchParams: {
          toString: () => searchParams,
        },
      },
    } as unknown as NextRequest;
  };

  const createMockResponse = (): NextResponse & { cookieStore: Record<string, any> } => {
    const cookieStore: Record<string, any> = {};
    return {
      cookieStore,
      cookies: {
        set: (name: string, value: string, options?: any) => {
          cookieStore[name] = { value, ...options };
        },
        delete: (name: string) => {
          delete cookieStore[name];
        },
      },
    } as unknown as NextResponse & { cookieStore: Record<string, any> };
  };

  beforeEach(() => {
    mockAnalyticsPlugin.options.visitorIds = undefined;

    getAnalyticsPluginStub = sandbox.stub().returns(mockAnalyticsPlugin);
    getCoreContextStub = sandbox.stub().returns(mockCoreContext);
    getDefaultCookieAttributesStub = sandbox.stub().returns(mockCookieAttributes);
    fetchClientIdFromEdgeProxyStub = sandbox.stub();
    getBotCookieServerSideStub = sandbox.stub();
    isBotStub = sandbox.stub();

    analyticsProxyAdapterModule = proxyquire('./analytics-adapter', {
      '@sitecore-content-sdk/core': {
        getCoreContext: getCoreContextStub,
      },
      '@sitecore-content-sdk/analytics-core/internal': {
        COOKIE_NAME_PREFIX: 'sc_',
        getDefaultCookieAttributes: getDefaultCookieAttributesStub,
        fetchClientIdFromEdgeProxy: fetchClientIdFromEdgeProxyStub,
        getAnalyticsPlugin: getAnalyticsPluginStub,
        getBotCookieServerSide: getBotCookieServerSideStub,
        isBot: isBotStub,
      },
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getClientId', () => {
    it('should return the client ID from request cookies', () => {
      const request = createMockRequest({ sc_cid: 'client-id-123' });

      const result = analyticsProxyAdapterModule.getClientId(request);

      expect(result).to.equal('client-id-123');
    });

    it('should return null when cookie does not exist', () => {
      const request = createMockRequest({});

      const result = analyticsProxyAdapterModule.getClientId(request);

      expect(result).to.be.null;
    });

    it('should return null when cookie value is empty', () => {
      const request = createMockRequest({ sc_cid: '' });

      const result = analyticsProxyAdapterModule.getClientId(request);

      expect(result).to.be.null;
    });
  });

  describe('analyticsProxyAdapter', () => {
    it('should return an adapter with type "proxy"', () => {
      const request = createMockRequest();
      const response = createMockResponse();

      const adapter = analyticsProxyAdapterModule.analyticsProxyAdapter(request, response);

      expect(adapter.type).to.equal('proxy');
    });

    describe('getClientId', () => {
      it('should return client ID from request cookies', () => {
        const request = createMockRequest({ sc_cid: 'client-id-456' });
        const response = createMockResponse();

        const adapter = analyticsProxyAdapterModule.analyticsProxyAdapter(request, response);
        const result = adapter.getClientId();

        expect(result).to.equal('client-id-456');
      });
    });

    describe('isBot', () => {
      it('should return true when bot cookie is set', () => {
        getBotCookieServerSideStub.returns('1');
        const request = createMockRequest({});
        const response = createMockResponse();

        const adapter = analyticsProxyAdapterModule.analyticsProxyAdapter(request, response);
        const result = adapter.isBot?.();

        expect(result).to.be.true;
      });

      it('should return false when bot cookie is not set', () => {
        getBotCookieServerSideStub.returns(null);
        isBotStub.returns(false);

        const request = createMockRequest({});
        const response = createMockResponse();

        const adapter = analyticsProxyAdapterModule.analyticsProxyAdapter(request, response);
        const result = adapter.isBot?.();

        expect(result).to.be.false;
      });

      it('should return true when isBot returns true', () => {
        isBotStub.returns(true);
        const request = createMockRequest({});
        const response = createMockResponse();

        const adapter = analyticsProxyAdapterModule.analyticsProxyAdapter(request, response);
        const result = adapter.isBot?.();
        expect(result).to.be.true;
      });
    });

    describe('setClientId', () => {
      describe('legacy cookie migration', () => {
        it('should migrate legacy cookie and set new cookie in response', async () => {
          const request = createMockRequest({ 'sc_test-context-id': 'legacy-client-id' });
          const response = createMockResponse();

          const adapter = analyticsProxyAdapterModule.analyticsProxyAdapter(request, response);
          await adapter.setClientId();

          expect(response.cookieStore.sc_cid).to.deep.include({
            value: 'legacy-client-id',
            sameSite: 'none',
          });
        });

        it('should set new cookie on request when migrating legacy cookie', async () => {
          const cookieStore = { 'sc_test-context-id': 'legacy-client-id' };
          const request = createMockRequest(cookieStore);
          const response = createMockResponse();

          const adapter = analyticsProxyAdapterModule.analyticsProxyAdapter(request, response);
          await adapter.setClientId();

          expect(request.cookies.get('sc_cid')?.value).to.equal('legacy-client-id');
        });

        it('should delete legacy cookie from request and response', async () => {
          const request = createMockRequest({ 'sc_test-context-id': 'legacy-client-id' });
          const response = createMockResponse();

          const adapter = analyticsProxyAdapterModule.analyticsProxyAdapter(request, response);
          await adapter.setClientId();

          expect(request.cookies.get('sc_test-context-id')).to.be.undefined;
        });

        it('should not fetch from edge proxy when legacy cookie exists', async () => {
          const request = createMockRequest({ 'sc_test-context-id': 'legacy-client-id' });
          const response = createMockResponse();

          const adapter = analyticsProxyAdapterModule.analyticsProxyAdapter(request, response);
          await adapter.setClientId();

          expect(fetchClientIdFromEdgeProxyStub).to.not.have.been.called;
        });
      });

      describe('existing client ID', () => {
        it('should use existing client ID and set cookie in response', async () => {
          const request = createMockRequest({ sc_cid: 'existing-client-id' });
          const response = createMockResponse();

          const adapter = analyticsProxyAdapterModule.analyticsProxyAdapter(request, response);
          await adapter.setClientId();

          expect(fetchClientIdFromEdgeProxyStub).to.not.have.been.called;
          expect(response.cookieStore.sc_cid).to.deep.include({
            value: 'existing-client-id',
            sameSite: 'none',
          });
        });

        it('should not set cookie on request when client ID exists', async () => {
          const cookieStore = { sc_cid: 'existing-client-id' };
          const request = createMockRequest(cookieStore);
          const response = createMockResponse();

          const adapter = analyticsProxyAdapterModule.analyticsProxyAdapter(request, response);
          await adapter.setClientId();

          // The request cookie should remain unchanged
          expect(request.cookies.get('sc_cid')?.value).to.equal('existing-client-id');
        });
      });

      describe('fetch from edge proxy', () => {
        it('should fetch client ID from edge proxy when no cookies exist', async () => {
          fetchClientIdFromEdgeProxyStub.resolves({
            clientId: 'new-client-id',
            profileId: 'profile-id',
          });

          const request = createMockRequest({});
          const response = createMockResponse();

          const adapter = analyticsProxyAdapterModule.analyticsProxyAdapter(request, response);
          await adapter.setClientId();

          expect(fetchClientIdFromEdgeProxyStub).to.have.been.calledWith(
            'https://edge.test.com',
            'test-context-id',
            3000
          );
        });

        it('should store proxy values in plugin settings after fetching', async () => {
          const visitorIds = {
            clientId: 'new-client-id',
            profileId: 'profile-id',
          };
          fetchClientIdFromEdgeProxyStub.resolves(visitorIds);

          const request = createMockRequest({});
          const response = createMockResponse();

          const adapter = analyticsProxyAdapterModule.analyticsProxyAdapter(request, response);
          await adapter.setClientId();

          expect(mockAnalyticsPlugin.options.visitorIds).to.deep.equal(visitorIds);
        });

        it('should set new cookie on request when fetching from edge proxy', async () => {
          fetchClientIdFromEdgeProxyStub.resolves({
            clientId: 'new-client-id',
          });

          const cookieStore: Record<string, string> = {};
          const request = createMockRequest(cookieStore);
          const response = createMockResponse();

          const adapter = analyticsProxyAdapterModule.analyticsProxyAdapter(request, response);
          await adapter.setClientId();

          expect(request.cookies.get('sc_cid')?.value).to.equal('new-client-id');
        });

        it('should set cookie in response with correct attributes', async () => {
          fetchClientIdFromEdgeProxyStub.resolves({
            clientId: 'new-client-id',
          });

          const request = createMockRequest({});
          const response = createMockResponse();

          const adapter = analyticsProxyAdapterModule.analyticsProxyAdapter(request, response);
          await adapter.setClientId();

          expect(response.cookieStore.sc_cid).to.deep.include({
            value: 'new-client-id',
            sameSite: 'none',
          });
        });
      });
    });

    describe('location.getSearchParams', () => {
      it('should return search params from request URL', () => {
        const request = createMockRequest({}, 'param1=value1&param2=value2');
        const response = createMockResponse();

        const adapter = analyticsProxyAdapterModule.analyticsProxyAdapter(request, response);
        const result = adapter.location.getSearchParams();

        expect(result).to.equal('param1=value1&param2=value2');
      });

      it('should return empty string when no search params', () => {
        const request = createMockRequest({}, '');
        const response = createMockResponse();

        const adapter = analyticsProxyAdapterModule.analyticsProxyAdapter(request, response);
        const result = adapter.location.getSearchParams();

        expect(result).to.equal('');
      });
    });
  });
});
