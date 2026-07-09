/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { isServer, resolveUrl } from '.';
import {
  getEnforcedCorsHeaders,
  getAllowedOriginsFromEnv,
  isTimeoutError,
  isRegexOrUrl,
  areURLSearchParamsEqual,
  escapeNonSpecialQuestionMarks,
  escapeRegExp,
  mergeURLSearchParams,
} from './utils';

// must make TypeScript happy with `global` variable modification
interface CustomWindow {
  [key: string]: unknown;
  document: unknown;
}

interface Global {
  window: CustomWindow | undefined;
}

declare const global: Global;

describe('utils', () => {
  describe('isServer', () => {
    it('should return true when invoked on server', () => {
      expect(isServer()).to.be.true;
    });

    it('should return false when not invoked on server', () => {
      global.window = { document: {} };

      expect(isServer()).to.be.false;
    });

    after(() => {
      global.window = undefined;
    });
  });

  describe('resolveUrl', () => {
    const testData = [
      {
        test: 'should support querystring params',
        url: 'https://test.io',
        params: { foo: 'foo', bar: 1 },
        expected: 'https://test.io/?foo=foo&bar=1',
      },
      {
        test: 'should support empty querystring params',
        url: 'https://test.io',
        params: {},
        expected: 'https://test.io/',
      },
      {
        test: 'should support undefined querystring params',
        url: 'https://test.io',
        params: undefined,
        expected: 'https://test.io/',
      },
      {
        test: 'should support undefined querystring params',
        url: 'https://test.io',
        params: undefined,
        expected: 'https://test.io/',
      },
      {
        test: 'should support existing querystring params in url',
        url: 'https://test.io?foo=foo',
        params: { bar: 1 },
        expected: 'https://test.io/?foo=foo&bar=1',
      },
    ];

    testData.forEach(({ test, url, params, expected }) => {
      it(test, () => {
        const result = resolveUrl(url, params);
        expect(result).to.equal(expected);
      });
    });

    it('should throw an error when url is empty', () => {
      expect(() => resolveUrl('')).to.throw('url must be a non-empty string');
    });
  });

  describe('isTimeoutError', () => {
    it('should return true when error is timeout error', () => {
      expect(isTimeoutError({ response: { status: 408 } })).to.be.true;
      expect(isTimeoutError({ name: 'AbortError' })).to.be.true;
    });
  });

  describe('getEnforcedCorsHeaders', () => {
    const mockOrigin = 'https://maybeallowed.com';
    const mockHeaders = {
      origin: mockOrigin,
    };

    it('should return headers if origin is found in allowedOrigins from JSS_ALLOWED_ORIGINS env variable', () => {
      process.env.JSS_ALLOWED_ORIGINS = mockOrigin;
      const result = getEnforcedCorsHeaders({
        requestMethod: 'GET',
        headers: mockHeaders,
      });
      expect(result).to.deep.equal({
        'Access-Control-Allow-Origin': mockOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE, PUT, PATCH',
        'x-middleware-cache': 'no-cache',
        'Cache-Control': 'no-store, must-revalidate',
      });
      delete process.env.JSS_ALLOWED_ORIGINS;
    });

    it('should return truthly empty object when theres no origin header', () => {
      const result = getEnforcedCorsHeaders({
        requestMethod: 'GET',
        headers: {},
      });
      expect(result).to.deep.equal({});
    });

    it('should return headers if origin is found in allowedOrigins passed as argument', () => {
      const result = getEnforcedCorsHeaders({
        requestMethod: 'GET',
        headers: { origin: 'http://allowed.com' },
        allowedOrigins: ['http://allowed.com'],
      });
      expect(result).to.deep.equal({
        'Access-Control-Allow-Origin': 'http://allowed.com',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE, PUT, PATCH',
        'x-middleware-cache': 'no-cache',
        'Cache-Control': 'no-store, must-revalidate',
      });
    });

    it('should return empy if origin matches neither allowedOrigins from JSS_ALLOWED_ORIGINS env variable nor argument', () => {
      process.env.JSS_ALLOWED_ORIGINS = 'https://strictallowed.com, https://alsoallowed.com';
      const result = getEnforcedCorsHeaders({
        requestMethod: 'GET',
        headers: { origin: 'https://notallowed.com' },
        allowedOrigins: ['https://paramallowed.com'],
      });
      expect(result).to.be.null;
      delete process.env.JSS_ALLOWED_ORIGINS;
    });

    it('should return headers when origin matches a wildcard value from allowedOrigins', () => {
      const result = getEnforcedCorsHeaders({
        requestMethod: 'GET',
        headers: { origin: 'https://allowed.dev.com' },
        allowedOrigins: ['https://allowed.*.com'],
      });
      expect(result).to.deep.equal({
        'Access-Control-Allow-Origin': 'https://allowed.dev.com',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE, PUT, PATCH',
        'x-middleware-cache': 'no-cache',
        'Cache-Control': 'no-store, must-revalidate',
      });
    });

    it('should include additional headers for preflight OPTIONS request', () => {
      const result = getEnforcedCorsHeaders({
        requestMethod: 'OPTIONS',
        headers: { origin: mockOrigin },
        allowedOrigins: [mockOrigin],
      });
      expect(result).to.deep.equal({
        'Access-Control-Allow-Origin': mockOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE, PUT, PATCH',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'x-middleware-cache': 'no-cache',
        'Cache-Control': 'no-store, must-revalidate',
      });
    });

    it('should consider preset CORS header when provided', () => {
      const result = getEnforcedCorsHeaders({
        requestMethod: 'GET',
        headers: { origin: 'https://preallowed.com' },
        presetCorsHeader: 'https://preallowed.com',
      });
      expect(result).to.deep.equal({
        'Access-Control-Allow-Origin': 'https://preallowed.com',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE, PUT, PATCH',
        'x-middleware-cache': 'no-cache',
        'Cache-Control': 'no-store, must-revalidate',
      });
    });
    it('should handle two different types of headers', () => {
      // Test with IncomingHttpHeaders
      const incomingHeaders = {
        origin: 'http://allowed.com',
      };

      const result1 = getEnforcedCorsHeaders({
        requestMethod: 'GET',
        headers: incomingHeaders,
        allowedOrigins: ['http://allowed.com'],
      });

      expect(result1).to.deep.equal({
        'Access-Control-Allow-Origin': 'http://allowed.com',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE, PUT, PATCH',
        'x-middleware-cache': 'no-cache',
        'Cache-Control': 'no-store, must-revalidate',
      });

      // Test with Headers
      const headers = new Headers();
      headers.set('origin', 'http://allowed.com');

      const result2 = getEnforcedCorsHeaders({
        requestMethod: 'GET',
        headers: headers,
        allowedOrigins: ['http://allowed.com'],
      });

      expect(result2).to.deep.equal({
        'Access-Control-Allow-Origin': 'http://allowed.com',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE, PUT, PATCH',
        'x-middleware-cache': 'no-cache',
        'Cache-Control': 'no-store, must-revalidate',
      });
    });
  });

  describe('getAllowedOriginsFromEnv', () => {
    it('should return an empty array when JSS_ALLOWED_ORIGINS is not set', () => {
      delete process.env.JSS_ALLOWED_ORIGINS;
      expect(getAllowedOriginsFromEnv()).to.be.empty;
    });

    it('should return an array of allowed origins from JSS_ALLOWED_ORIGINS', () => {
      process.env.JSS_ALLOWED_ORIGINS = 'https://allowed.com, https://alsoallowed.com';
      expect(getAllowedOriginsFromEnv()).to.deep.equal([
        'https://allowed.com',
        'https://alsoallowed.com',
      ]);
      delete process.env.JSS_ALLOWED_ORIGINS;
    });
  });

  describe('isRegexOrUrl', () => {
    it('should return "url" for valid URL-like strings', () => {
      expect(isRegexOrUrl('/path/to/resource?param=value')).to.equal('url');
      expect(isRegexOrUrl('/another/path')).to.equal('url');
    });

    it('should return "regex" for non-URL strings', () => {
      expect(isRegexOrUrl('/path/.*')).to.equal('regex');
      expect(isRegexOrUrl('^/path/(\\d+)$')).to.equal('regex');
    });
  });

  describe('areURLSearchParamsEqual', () => {
    it('should return true for equal URLSearchParams objects', () => {
      const params1 = new URLSearchParams('a=1&b=2&c=3');
      const params2 = new URLSearchParams('c=3&b=2&a=1');
      expect(areURLSearchParamsEqual(params1, params2)).to.be.true;
    });

    it('should return false for different URLSearchParams objects', () => {
      const params1 = new URLSearchParams('a=1&b=2');
      const params2 = new URLSearchParams('a=1&b=3');
      expect(areURLSearchParamsEqual(params1, params2)).to.be.false;
    });

    it('should return false if one of the URLSearchParams objects is empty', () => {
      const params1 = new URLSearchParams('a=1&b=2');
      const params2 = new URLSearchParams();
      expect(areURLSearchParamsEqual(params1, params2)).to.be.false;
    });
  });

  describe('mergeURLSearchParams', () => {
    it('should merge two URLSearchParams objects with unique keys', () => {
      const params1 = new URLSearchParams('a=1&b=2');
      const params2 = new URLSearchParams('c=3&d=4');

      expect(mergeURLSearchParams(params1, params2)).to.equal('a=1&b=2&c=3&d=4');
    });

    it('should override keys from the first object with keys from the second', () => {
      const params1 = new URLSearchParams('a=1&b=2');
      const params2 = new URLSearchParams('b=3&c=4');

      expect(mergeURLSearchParams(params1, params2)).to.equal('a=1&b=3&c=4');
    });

    it('should return only the second object if the first is empty', () => {
      const params1 = new URLSearchParams();
      const params2 = new URLSearchParams('a=1&b=2');

      expect(mergeURLSearchParams(params1, params2)).to.equal('a=1&b=2');
    });

    it('should return only the first object if the second is empty', () => {
      const params1 = new URLSearchParams('a=1&b=2');
      const params2 = new URLSearchParams();

      expect(mergeURLSearchParams(params1, params2)).to.equal('a=1&b=2');
    });

    it('should return an empty string if both objects are empty', () => {
      const params1 = new URLSearchParams();
      const params2 = new URLSearchParams();

      expect(mergeURLSearchParams(params1, params2)).to.equal('');
    });
  });

  describe('escapeNonSpecialQuestionMarks', () => {
    it('should return regex patterns unchanged', () => {
      expect(escapeNonSpecialQuestionMarks('^/testpage/?$')).to.equal('^/testpage/?$');
      expect(escapeNonSpecialQuestionMarks('^/path(abc)?/def*?/ghi+?$')).to.equal(
        '^/path(abc)?/def*?/ghi+?$'
      );
    });

    it('should escape literal question marks in non-regex strings', () => {
      expect(escapeNonSpecialQuestionMarks('abc?def?ghi')).to.equal('abc\\?def\\?ghi');
      expect(escapeNonSpecialQuestionMarks('abc.*?def+?ghi')).to.equal('abc.*\\?def+\\?ghi');
    });

    it('should handle empty strings', () => {
      expect(escapeNonSpecialQuestionMarks('')).to.equal('');
    });
  });

  describe('escapeRegExp', () => {
    it('should escape regex special characters', () => {
      expect(escapeRegExp('.*+?^${}()|[]\\')).to.equal('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
    });

    it('should leave non-special characters unchanged', () => {
      expect(escapeRegExp('abc123')).to.equal('abc123');
    });

    it('should produce a pattern that matches the original string literally', () => {
      const input = 'edge.sitecorecloud.io';
      expect(new RegExp(escapeRegExp(input)).test(input)).to.be.true;
      expect(new RegExp(escapeRegExp(input)).test('edgeXsitecorecloudXio')).to.be.false;
    });

    it('should handle empty strings', () => {
      expect(escapeRegExp('')).to.equal('');
    });
  });
});
