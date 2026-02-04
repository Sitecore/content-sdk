/* eslint-disable no-unused-expressions */
import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { NextRequest, NextResponse } from 'next/server';

chai.use(sinonChai);
const expect = chai.expect;

describe('personalizeProxyEnvironment', () => {
  const sandbox = sinon.createSandbox();

  let personalizeProxyEnvironmentModule: any;
  let getAnalyticsPluginStub: sinon.SinonStub;
  let getCoreSettingsStub: sinon.SinonStub;
  let getPersonalizePluginStub: sinon.SinonStub;
  let getDefaultCookieAttributesStub: sinon.SinonStub;
  let fetchGuestIdFromEdgeProxyStub: sinon.SinonStub;
  let getClientIdStub: sinon.SinonStub;

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

  const mockPersonalizePlugin = {
    settings: {
      cookieSettings: {
        name: { guestId: 'sc_gid' },
      },
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
    headers: Record<string, string> = {}
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
      headers: {
        get: (name: string) => headers[name] || null,
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
    getPersonalizePluginStub = sandbox.stub().returns(mockPersonalizePlugin);
    getDefaultCookieAttributesStub = sandbox.stub().returns(mockCookieAttributes);
    fetchGuestIdFromEdgeProxyStub = sandbox.stub();
    getClientIdStub = sandbox.stub();

    personalizeProxyEnvironmentModule = proxyquire('./personalize', {
      '@sitecore-content-sdk/core': {
        getCoreSettings: getCoreSettingsStub,
      },
      '@sitecore-content-sdk/analytics-core/internal': {
        COOKIE_NAME_PREFIX: 'sc_',
        getDefaultCookieAttributes: getDefaultCookieAttributesStub,
        getAnalyticsPlugin: getAnalyticsPluginStub,
      },
      '@sitecore-content-sdk/personalize/internal': {
        getPersonalizePlugin: getPersonalizePluginStub,
        fetchGuestIdFromEdgeProxy: fetchGuestIdFromEdgeProxyStub,
      },
      './analytics': {
        getClientId: getClientIdStub,
      },
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('personalizeProxyEnvironment', () => {
    it('should return an environment with type "proxy"', () => {
      const request = createMockRequest();
      const response = createMockResponse();

      const environment = personalizeProxyEnvironmentModule.personalizeProxyEnvironment(
        request,
        response
      );

      expect(environment.type).to.equal('proxy');
    });

    describe('getUserAgent', () => {
      it('should return user agent from request headers', () => {
        const request = createMockRequest({}, { 'user-agent': 'Mozilla/5.0 TestBrowser' });
        const response = createMockResponse();

        const environment = personalizeProxyEnvironmentModule.personalizeProxyEnvironment(
          request,
          response
        );
        const result = environment.getUserAgent();

        expect(result).to.equal('Mozilla/5.0 TestBrowser');
      });

      it('should return undefined when user agent header is not present', () => {
        const request = createMockRequest({}, {});
        const response = createMockResponse();

        const environment = personalizeProxyEnvironmentModule.personalizeProxyEnvironment(
          request,
          response
        );
        const result = environment.getUserAgent();

        expect(result).to.be.undefined;
      });
    });

    describe('getGuestId', () => {
      it('should return guest ID from request cookies', () => {
        const request = createMockRequest({ sc_gid: 'guest-id-123' });
        const response = createMockResponse();

        const environment = personalizeProxyEnvironmentModule.personalizeProxyEnvironment(
          request,
          response
        );
        const result = environment.getGuestId();

        expect(result).to.equal('guest-id-123');
      });

      it('should return null when guest ID cookie does not exist', () => {
        const request = createMockRequest({});
        const response = createMockResponse();

        const environment = personalizeProxyEnvironmentModule.personalizeProxyEnvironment(
          request,
          response
        );
        const result = environment.getGuestId();

        expect(result).to.be.null;
      });
    });

    describe('setGuestId', () => {
      describe('legacy cookie migration', () => {
        it('should migrate legacy cookie and set new cookie in response', async () => {
          const request = createMockRequest({
            'sc_test-context-id_personalize': 'legacy-guest-id',
          });
          const response = createMockResponse();

          const environment = personalizeProxyEnvironmentModule.personalizeProxyEnvironment(
            request,
            response
          );
          await environment.setGuestId();

          expect(response.cookieStore.sc_gid).to.deep.include({
            value: 'legacy-guest-id',
            sameSite: 'none',
          });
        });

        it('should set new cookie on request when migrating legacy cookie', async () => {
          const cookieStore = { 'sc_test-context-id_personalize': 'legacy-guest-id' };
          const request = createMockRequest(cookieStore);
          const response = createMockResponse();

          const environment = personalizeProxyEnvironmentModule.personalizeProxyEnvironment(
            request,
            response
          );
          await environment.setGuestId();

          expect(request.cookies.get('sc_gid')?.value).to.equal('legacy-guest-id');
        });

        it('should delete legacy cookie from request and response', async () => {
          const request = createMockRequest({
            'sc_test-context-id_personalize': 'legacy-guest-id',
          });
          const response = createMockResponse();

          const environment = personalizeProxyEnvironmentModule.personalizeProxyEnvironment(
            request,
            response
          );
          await environment.setGuestId();

          expect(request.cookies.get('sc_test-context-id_personalize')).to.be.undefined;
        });

        it('should not fetch from edge proxy when legacy cookie exists', async () => {
          const request = createMockRequest({
            'sc_test-context-id_personalize': 'legacy-guest-id',
          });
          const response = createMockResponse();

          const environment = personalizeProxyEnvironmentModule.personalizeProxyEnvironment(
            request,
            response
          );
          await environment.setGuestId();

          expect(fetchGuestIdFromEdgeProxyStub).to.not.have.been.called;
        });
      });

      describe('existing guest ID', () => {
        it('should use existing guest ID and set cookie in response', async () => {
          const request = createMockRequest({ sc_gid: 'existing-guest-id' });
          const response = createMockResponse();

          const environment = personalizeProxyEnvironmentModule.personalizeProxyEnvironment(
            request,
            response
          );
          await environment.setGuestId();

          expect(fetchGuestIdFromEdgeProxyStub).to.not.have.been.called;
          expect(response.cookieStore.sc_gid).to.deep.include({
            value: 'existing-guest-id',
            sameSite: 'none',
          });
        });

        it('should not set cookie on request when guest ID already exists', async () => {
          const cookieStore = { sc_gid: 'existing-guest-id' };
          const request = createMockRequest(cookieStore);
          const response = createMockResponse();

          const environment = personalizeProxyEnvironmentModule.personalizeProxyEnvironment(
            request,
            response
          );
          await environment.setGuestId();

          // The request cookie should remain unchanged
          expect(request.cookies.get('sc_gid')?.value).to.equal('existing-guest-id');
        });

        it('should not modify request cookie when guest ID cookie already exists (branch coverage)', async () => {
          // This test ensures the branch `if (!guestIdCookie)` at line 85 is covered
          // when guestIdCookie is truthy - the request.cookies.set should NOT be called
          let setCalled = false;
          const request = {
            cookies: {
              get: (name: string) => {
                if (name === 'sc_gid') return { value: 'existing-guest-id' };
                return undefined;
              },
              set: () => {
                setCalled = true;
              },
              delete: () => {},
            },
            headers: {
              get: () => null,
            },
          } as unknown as NextRequest;
          const response = createMockResponse();

          const environment = personalizeProxyEnvironmentModule.personalizeProxyEnvironment(
            request,
            response
          );
          await environment.setGuestId();

          // The request.cookies.set should not have been called because guestIdCookie exists
          expect(setCalled).to.be.false;
        });
      });

      describe('proxy values from edge server', () => {
        it('should use guest ID from proxy values when available', async () => {
          mockAnalyticsPlugin.settings.proxyValues = {
            clientId: 'client-id',
            guestId: 'proxy-guest-id',
          };

          const request = createMockRequest({});
          const response = createMockResponse();

          const environment = personalizeProxyEnvironmentModule.personalizeProxyEnvironment(
            request,
            response
          );
          await environment.setGuestId();

          expect(fetchGuestIdFromEdgeProxyStub).to.not.have.been.called;
          expect(response.cookieStore.sc_gid).to.deep.include({
            value: 'proxy-guest-id',
            sameSite: 'none',
          });
        });

        it('should set cookie on request when using proxy values', async () => {
          mockAnalyticsPlugin.settings.proxyValues = {
            clientId: 'client-id',
            guestId: 'proxy-guest-id',
          };

          const cookieStore: Record<string, string> = {};
          const request = createMockRequest(cookieStore);
          const response = createMockResponse();

          const environment = personalizeProxyEnvironmentModule.personalizeProxyEnvironment(
            request,
            response
          );
          await environment.setGuestId();

          expect(request.cookies.get('sc_gid')?.value).to.equal('proxy-guest-id');
        });

        it('should fallback to edge proxy fetch when proxy values exist but guestId is undefined', async () => {
          mockAnalyticsPlugin.settings.proxyValues = {
            clientId: 'client-id',
            guestId: undefined,
          };
          getClientIdStub.returns('client-id-123');
          fetchGuestIdFromEdgeProxyStub.resolves('fetched-guest-id');

          const request = createMockRequest({});
          const response = createMockResponse();

          const environment = personalizeProxyEnvironmentModule.personalizeProxyEnvironment(
            request,
            response
          );
          await environment.setGuestId();

          expect(fetchGuestIdFromEdgeProxyStub).to.have.been.calledWith(
            'client-id-123',
            'test-context-id',
            'https://edge.test.com'
          );
          expect(response.cookieStore.sc_gid).to.deep.include({
            value: 'fetched-guest-id',
            sameSite: 'none',
          });
        });
      });

      describe('fetch from edge proxy', () => {
        it('should fetch guest ID from edge proxy when client ID exists', async () => {
          getClientIdStub.returns('client-id-123');
          fetchGuestIdFromEdgeProxyStub.resolves('new-guest-id');

          const request = createMockRequest({});
          const response = createMockResponse();

          const environment = personalizeProxyEnvironmentModule.personalizeProxyEnvironment(
            request,
            response
          );
          await environment.setGuestId();

          expect(fetchGuestIdFromEdgeProxyStub).to.have.been.calledWith(
            'client-id-123',
            'test-context-id',
            'https://edge.test.com'
          );
        });

        it('should set guest ID cookie from edge proxy response', async () => {
          getClientIdStub.returns('client-id-123');
          fetchGuestIdFromEdgeProxyStub.resolves('new-guest-id');

          const request = createMockRequest({});
          const response = createMockResponse();

          const environment = personalizeProxyEnvironmentModule.personalizeProxyEnvironment(
            request,
            response
          );
          await environment.setGuestId();

          expect(response.cookieStore.sc_gid).to.deep.include({
            value: 'new-guest-id',
            sameSite: 'none',
          });
        });

        it('should set cookie on request when fetching from edge proxy', async () => {
          getClientIdStub.returns('client-id-123');
          fetchGuestIdFromEdgeProxyStub.resolves('new-guest-id');

          const cookieStore: Record<string, string> = {};
          const request = createMockRequest(cookieStore);
          const response = createMockResponse();

          const environment = personalizeProxyEnvironmentModule.personalizeProxyEnvironment(
            request,
            response
          );
          await environment.setGuestId();

          expect(request.cookies.get('sc_gid')?.value).to.equal('new-guest-id');
        });
      });

      describe('no client ID available', () => {
        it('should return early when no client ID or proxy values exist', async () => {
          getClientIdStub.returns(null);

          const request = createMockRequest({});
          const response = createMockResponse();

          const environment = personalizeProxyEnvironmentModule.personalizeProxyEnvironment(
            request,
            response
          );
          await environment.setGuestId();

          expect(fetchGuestIdFromEdgeProxyStub).to.not.have.been.called;
          expect(response.cookieStore.sc_gid).to.be.undefined;
        });
      });
    });
  });
});
