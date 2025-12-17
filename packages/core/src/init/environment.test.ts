import { expect } from 'chai';
import sinon from 'sinon';
import {
  createBrowserEnvironment,
  createServerEnvironment,
  createNextJsAppRouterEnvironment,
  createNextJsMiddlewareEnvironment,
  mergeEnvironments,
} from './environment';

describe('environment helpers', () => {
  describe('createBrowserEnvironment', () => {
    let originalDocument: typeof global.document;

    beforeEach(() => {
      originalDocument = global.document;
    });

    afterEach(() => {
      global.document = originalDocument;
    });

    it('should return environment handlers', () => {
      const env = createBrowserEnvironment();

      expect(env.getCookie).to.be.a('function');
      expect(env.setCookie).to.be.a('function');
      expect(env.deleteCookie).to.be.a('function');
      expect(env.getPathname).to.be.a('function');
    });

    it('getCookie should return undefined when document is undefined', () => {
      // @ts-expect-error - testing undefined document
      global.document = undefined;
      const env = createBrowserEnvironment();

      expect(env.getCookie?.('test')).to.be.undefined;
    });

    it('getCookie should parse cookie value', () => {
      global.document = {
        cookie: 'foo=bar; test=hello%20world; baz=qux',
      } as Document;

      const env = createBrowserEnvironment();

      expect(env.getCookie?.('test')).to.equal('hello world');
      expect(env.getCookie?.('foo')).to.equal('bar');
      expect(env.getCookie?.('nonexistent')).to.be.undefined;
    });

    it('setCookie should set cookie with options', () => {
      let setCookieValue = '';
      global.document = {
        get cookie() {
          return '';
        },
        set cookie(value: string) {
          setCookieValue = value;
        },
      } as Document;

      const env = createBrowserEnvironment();

      env.setCookie?.('test', 'value', {
        maxAge: 3600,
        path: '/app',
        secure: true,
        sameSite: 'strict',
      });

      expect(setCookieValue).to.include('test=value');
      expect(setCookieValue).to.include('max-age=3600');
      expect(setCookieValue).to.include('path=/app');
      expect(setCookieValue).to.include('secure');
      expect(setCookieValue).to.include('samesite=strict');
    });

    it('setCookie should use default path', () => {
      let setCookieValue = '';
      global.document = {
        get cookie() {
          return '';
        },
        set cookie(value: string) {
          setCookieValue = value;
        },
      } as Document;

      const env = createBrowserEnvironment();
      env.setCookie?.('test', 'value');

      expect(setCookieValue).to.include('path=/');
    });

    it('deleteCookie should set max-age to 0', () => {
      let setCookieValue = '';
      global.document = {
        get cookie() {
          return '';
        },
        set cookie(value: string) {
          setCookieValue = value;
        },
      } as Document;

      const env = createBrowserEnvironment();
      env.deleteCookie?.('test');

      expect(setCookieValue).to.include('test=');
      expect(setCookieValue).to.include('max-age=0');
    });
  });

  describe('createServerEnvironment', () => {
    it('should return no-op handlers', () => {
      const env = createServerEnvironment();

      expect(env.getCookie?.('test')).to.be.undefined;
      expect(env.getHeader?.('test')).to.be.undefined;
      expect(env.getPathname?.()).to.equal('');

      // These should not throw
      env.setCookie?.('test', 'value');
      env.deleteCookie?.('test');
    });
  });

  describe('createNextJsAppRouterEnvironment', () => {
    it('should use cookies function for getCookie', () => {
      const mockCookies = {
        get: sinon.stub().returns({ value: 'cookie-value' }),
        set: sinon.stub(),
        delete: sinon.stub(),
      };

      const env = createNextJsAppRouterEnvironment({
        cookies: () => mockCookies,
      });

      const result = env.getCookie?.('my-cookie');

      expect(result).to.equal('cookie-value');
      expect(mockCookies.get.calledWith('my-cookie')).to.be.true;
    });

    it('should return undefined when cookie not found', () => {
      const mockCookies = {
        get: sinon.stub().returns(undefined),
        set: sinon.stub(),
        delete: sinon.stub(),
      };

      const env = createNextJsAppRouterEnvironment({
        cookies: () => mockCookies,
      });

      expect(env.getCookie?.('nonexistent')).to.be.undefined;
    });

    it('should use cookies function for setCookie', () => {
      const mockCookies = {
        get: sinon.stub(),
        set: sinon.stub(),
        delete: sinon.stub(),
      };

      const env = createNextJsAppRouterEnvironment({
        cookies: () => mockCookies,
      });

      env.setCookie?.('test', 'value', { maxAge: 3600 });

      expect(mockCookies.set.calledWith('test', 'value', { maxAge: 3600 })).to.be.true;
    });

    it('should use cookies function for deleteCookie', () => {
      const mockCookies = {
        get: sinon.stub(),
        set: sinon.stub(),
        delete: sinon.stub(),
      };

      const env = createNextJsAppRouterEnvironment({
        cookies: () => mockCookies,
      });

      env.deleteCookie?.('test');

      expect(mockCookies.delete.calledWith('test')).to.be.true;
    });

    it('should use headers function for getHeader', () => {
      const mockCookies = {
        get: sinon.stub(),
        set: sinon.stub(),
        delete: sinon.stub(),
      };
      const mockHeaders = {
        get: sinon.stub().returns('header-value'),
      };

      const env = createNextJsAppRouterEnvironment({
        cookies: () => mockCookies,
        headers: () => mockHeaders,
      });

      const result = env.getHeader?.('x-custom-header');

      expect(result).to.equal('header-value');
      expect(mockHeaders.get.calledWith('x-custom-header')).to.be.true;
    });

    it('should handle errors gracefully', () => {
      const env = createNextJsAppRouterEnvironment({
        cookies: () => {
          throw new Error('Not available');
        },
      });

      // Should not throw, just return undefined
      expect(env.getCookie?.('test')).to.be.undefined;
    });
  });

  describe('createNextJsMiddlewareEnvironment', () => {
    it('should use request.cookies for getCookie', () => {
      const mockRequest = {
        cookies: {
          get: sinon.stub().returns({ value: 'middleware-cookie' }),
        },
        headers: {
          get: sinon.stub(),
        },
        nextUrl: {
          pathname: '/test/path',
        },
      };

      const env = createNextJsMiddlewareEnvironment({ request: mockRequest });

      expect(env.getCookie?.('test')).to.equal('middleware-cookie');
      expect(mockRequest.cookies.get.calledWith('test')).to.be.true;
    });

    it('should use response.cookies for setCookie', () => {
      const mockRequest = {
        cookies: { get: sinon.stub() },
        headers: { get: sinon.stub() },
        nextUrl: { pathname: '/' },
      };
      const mockResponse = {
        cookies: {
          set: sinon.stub(),
          delete: sinon.stub(),
        },
      };

      const env = createNextJsMiddlewareEnvironment({
        request: mockRequest,
        response: mockResponse,
      });

      env.setCookie?.('test', 'value', { path: '/' });

      expect(mockResponse.cookies.set.calledWith('test', 'value', { path: '/' })).to.be.true;
    });

    it('should use response.cookies for deleteCookie', () => {
      const mockRequest = {
        cookies: { get: sinon.stub() },
        headers: { get: sinon.stub() },
        nextUrl: { pathname: '/' },
      };
      const mockResponse = {
        cookies: {
          set: sinon.stub(),
          delete: sinon.stub(),
        },
      };

      const env = createNextJsMiddlewareEnvironment({
        request: mockRequest,
        response: mockResponse,
      });

      env.deleteCookie?.('test');

      expect(mockResponse.cookies.delete.calledWith('test')).to.be.true;
    });

    it('should use request.headers for getHeader', () => {
      const mockRequest = {
        cookies: { get: sinon.stub() },
        headers: {
          get: sinon.stub().returns('my-header-value'),
        },
        nextUrl: { pathname: '/' },
      };

      const env = createNextJsMiddlewareEnvironment({ request: mockRequest });

      expect(env.getHeader?.('x-custom')).to.equal('my-header-value');
    });

    it('should use request.nextUrl for getPathname', () => {
      const mockRequest = {
        cookies: { get: sinon.stub() },
        headers: { get: sinon.stub() },
        nextUrl: { pathname: '/my/path' },
      };

      const env = createNextJsMiddlewareEnvironment({ request: mockRequest });

      expect(env.getPathname?.()).to.equal('/my/path');
    });

    it('should have no-op setCookie/deleteCookie when response not provided', () => {
      const mockRequest = {
        cookies: { get: sinon.stub() },
        headers: { get: sinon.stub() },
        nextUrl: { pathname: '/' },
      };

      const env = createNextJsMiddlewareEnvironment({ request: mockRequest });

      // Should not throw
      env.setCookie?.('test', 'value');
      env.deleteCookie?.('test');
    });
  });

  describe('mergeEnvironments', () => {
    it('should merge multiple environments', () => {
      const env1 = { getCookie: () => 'from-env1' };
      const env2 = { setCookie: () => {} };
      const env3 = { customHandler: () => 'custom' };

      const merged = mergeEnvironments(env1, env2, env3);

      expect(merged.getCookie).to.equal(env1.getCookie);
      expect(merged.setCookie).to.equal(env2.setCookie);
      expect((merged as { customHandler: () => string }).customHandler).to.equal(
        env3.customHandler
      );
    });

    it('should override earlier handlers with later ones', () => {
      const env1 = { getCookie: () => 'from-env1' };
      const env2 = { getCookie: () => 'from-env2' };

      const merged = mergeEnvironments(env1, env2);

      expect(merged.getCookie?.('test')).to.equal('from-env2');
    });

    it('should handle empty environments', () => {
      const merged = mergeEnvironments({}, {}, {});
      expect(merged).to.deep.equal({});
    });
  });
});

