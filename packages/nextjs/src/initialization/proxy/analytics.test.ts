/* eslint-disable no-unused-expressions */
import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { NextRequest, NextResponse } from 'next/server';

chai.use(sinonChai);
const expect = chai.expect;

describe('analyticsProxyEnvironment', () => {
  const sandbox = sinon.createSandbox();

  let analyticsProxyEnvironmentModule: any;
  let getAnalyticsPluginStub: sinon.SinonStub;
  let getCoreSettingsStub: sinon.SinonStub;
  let getDefaultCookieAttributesStub: sinon.SinonStub;
  let fetchClientIdFromEdgeProxyStub: sinon.SinonStub;

  const mockAnalyticsPlugin = {
    settings: {
      cookieSettings: {
        name: { clientId: 'sc_cid' },
        expiryDays: 730,
        domain: '.example.com',
      },
      timeout: 3000,
      proxyValues: undefined as any,
    },
  };

  const mockCoreSettings = {
    settings: {
      contextId: 'test-context-id',
      sitecoreEdgeUrl: 'https://edge.test.com',
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
    return {
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
    mockAnalyticsPlugin.settings.proxyValues = undefined;

    getAnalyticsPluginStub = sandbox.stub().returns(mockAnalyticsPlugin);
    getCoreSettingsStub = sandbox.stub().returns(mockCoreSettings);
    getDefaultCookieAttributesStub = sandbox.stub().returns(mockCookieAttributes);
    fetchClientIdFromEdgeProxyStub = sandbox.stub();

    analyticsProxyEnvironmentModule = proxyquire('./analytics', {
      '@sitecore-content-sdk/core': {
        getCoreSettings: getCoreSettingsStub,
      },
      '@sitecore-content-sdk/analytics-core/internal': {
        COOKIE_NAME_PREFIX: 'sc_',
        getDefaultCookieAttributes: getDefaultCookieAttributesStub,
        fetchClientIdFromEdgeProxy: fetchClientIdFromEdgeProxyStub,
        getAnalyticsPlugin: getAnalyticsPluginStub,
      },
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getClientId', () => {
    it('should return the client ID from request cookies', () => {
      const request = createMockRequest({ sc_cid: 'client-id-123' });

      const result = analyticsProxyEnvironmentModule.getClientId(request);

      expect(result).to.equal('client-id-123');
    });

    it('should return null when cookie does not exist', () => {
      const request = createMockRequest({});

      const result = analyticsProxyEnvironmentModule.getClientId(request);

      expect(result).to.be.null;
    });

    it('should return null when cookie value is empty', () => {
      const request = createMockRequest({ sc_cid: '' });

      const result = analyticsProxyEnvironmentModule.getClientId(request);

      expect(result).to.be.null;
    });
  });

  describe('analyticsProxyEnvironment', () => {
    it('should return an environment with type "proxy"', () => {
      const request = createMockRequest();
      const response = createMockResponse();

      const environment = analyticsProxyEnvironmentModule.analyticsProxyEnvironment(
        request,
        response
      );

      expect(environment.type).to.equal('proxy');
    });

    describe('getClientId', () => {
      it('should return client ID from request cookies', () => {
        const request = createMockRequest({ sc_cid: 'client-id-456' });
        const response = createMockResponse();

        const environment = analyticsProxyEnvironmentModule.analyticsProxyEnvironment(
          request,
          response
        );
        const result = environment.getClientId();

        expect(result).to.equal('client-id-456');
      });
    });

    describe('setClientId', () => {
      describe('legacy cookie migration', () => {
        it('should migrate legacy cookie and set new cookie in response', async () => {
          const request = createMockRequest({ 'sc_test-context-id': 'legacy-client-id' });
          const response = createMockResponse();

          const environment = analyticsProxyEnvironmentModule.analyticsProxyEnvironment(
            request,
            response
          );
          await environment.setClientId();

          expect(response.cookieStore.sc_cid).to.deep.include({
            value: 'legacy-client-id',
            sameSite: 'none',
          });
        });

        it('should set new cookie on request when migrating legacy cookie', async () => {
          const cookieStore = { 'sc_test-context-id': 'legacy-client-id' };
          const request = createMockRequest(cookieStore);
          const response = createMockResponse();

          const environment = analyticsProxyEnvironmentModule.analyticsProxyEnvironment(
            request,
            response
          );
          await environment.setClientId();

          expect(request.cookies.get('sc_cid')?.value).to.equal('legacy-client-id');
        });

        it('should delete legacy cookie from request and response', async () => {
          const request = createMockRequest({ 'sc_test-context-id': 'legacy-client-id' });
          const response = createMockResponse();

          const environment = analyticsProxyEnvironmentModule.analyticsProxyEnvironment(
            request,
            response
          );
          await environment.setClientId();

          expect(request.cookies.get('sc_test-context-id')).to.be.undefined;
        });

        it('should not fetch from edge proxy when legacy cookie exists', async () => {
          const request = createMockRequest({ 'sc_test-context-id': 'legacy-client-id' });
          const response = createMockResponse();

          const environment = analyticsProxyEnvironmentModule.analyticsProxyEnvironment(
            request,
            response
          );
          await environment.setClientId();

          expect(fetchClientIdFromEdgeProxyStub).to.not.have.been.called;
        });
      });

      describe('existing client ID', () => {
        it('should use existing client ID and set cookie in response', async () => {
          const request = createMockRequest({ sc_cid: 'existing-client-id' });
          const response = createMockResponse();

          const environment = analyticsProxyEnvironmentModule.analyticsProxyEnvironment(
            request,
            response
          );
          await environment.setClientId();

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

          const environment = analyticsProxyEnvironmentModule.analyticsProxyEnvironment(
            request,
            response
          );
          await environment.setClientId();

          // The request cookie should remain unchanged
          expect(request.cookies.get('sc_cid')?.value).to.equal('existing-client-id');
        });
      });

      describe('fetch from edge proxy', () => {
        it('should fetch client ID from edge proxy when no cookies exist', async () => {
          fetchClientIdFromEdgeProxyStub.resolves({
            clientId: 'new-client-id',
            guestId: 'guest-id',
          });

          const request = createMockRequest({});
          const response = createMockResponse();

          const environment = analyticsProxyEnvironmentModule.analyticsProxyEnvironment(
            request,
            response
          );
          await environment.setClientId();

          expect(fetchClientIdFromEdgeProxyStub).to.have.been.calledWith(
            'https://edge.test.com',
            'test-context-id',
            3000
          );
        });

        it('should store proxy values in plugin settings after fetching', async () => {
          const proxyValues = {
            clientId: 'new-client-id',
            guestId: 'guest-id',
          };
          fetchClientIdFromEdgeProxyStub.resolves(proxyValues);

          const request = createMockRequest({});
          const response = createMockResponse();

          const environment = analyticsProxyEnvironmentModule.analyticsProxyEnvironment(
            request,
            response
          );
          await environment.setClientId();

          expect(mockAnalyticsPlugin.settings.proxyValues).to.deep.equal(proxyValues);
        });

        it('should set new cookie on request when fetching from edge proxy', async () => {
          fetchClientIdFromEdgeProxyStub.resolves({
            clientId: 'new-client-id',
          });

          const cookieStore: Record<string, string> = {};
          const request = createMockRequest(cookieStore);
          const response = createMockResponse();

          const environment = analyticsProxyEnvironmentModule.analyticsProxyEnvironment(
            request,
            response
          );
          await environment.setClientId();

          expect(request.cookies.get('sc_cid')?.value).to.equal('new-client-id');
        });

        it('should set cookie in response with correct attributes', async () => {
          fetchClientIdFromEdgeProxyStub.resolves({
            clientId: 'new-client-id',
          });

          const request = createMockRequest({});
          const response = createMockResponse();

          const environment = analyticsProxyEnvironmentModule.analyticsProxyEnvironment(
            request,
            response
          );
          await environment.setClientId();

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

        const environment = analyticsProxyEnvironmentModule.analyticsProxyEnvironment(
          request,
          response
        );
        const result = environment.location.getSearchParams();

        expect(result).to.equal('param1=value1&param2=value2');
      });

      it('should return empty string when no search params', () => {
        const request = createMockRequest({}, '');
        const response = createMockResponse();

        const environment = analyticsProxyEnvironmentModule.analyticsProxyEnvironment(
          request,
          response
        );
        const result = environment.location.getSearchParams();

        expect(result).to.equal('');
      });
    });
  });
});
