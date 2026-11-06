/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { REWRITE_HEADER_NAME } from '../proxy/proxy';
import { EDITING_SECRET_HEADER } from '../editing/constants';
import { getEditingSecret, parseRewriteHeader } from './utils';

describe('utils', () => {
  describe('getEditingSecret', () => {
    after(() => {
      delete process.env.SITECORE_EDITING_SECRET;
    });

    it('should throw if env variable missing', () => {
      expect(() => getEditingSecret()).to.throw();
    });

    it('should return env variable', () => {
      const secret = '1234abcd';
      process.env.SITECORE_EDITING_SECRET = secret;
      const result = getEditingSecret();
      expect(result).to.equal(secret);
    });
  });

  describe('isDesignLibraryAuthorizedFromHeaders', () => {
    const originalSecret = process.env.SITECORE_EDITING_SECRET;
    const sandbox = sinon.createSandbox();

    afterEach(() => {
      sandbox.restore();
      if (originalSecret === undefined) {
        delete process.env.SITECORE_EDITING_SECRET;
      } else {
        process.env.SITECORE_EDITING_SECRET = originalSecret;
      }
    });

    const loadHelper = (headerValue: string | null, headersThrows = false) => {
      const headersStub = headersThrows
        ? sandbox.stub().rejects(new Error('headers unavailable'))
        : sandbox.stub().resolves({
            get: sandbox.stub().withArgs(EDITING_SECRET_HEADER).returns(headerValue),
          });

      return proxyquire('./utils', {
        'next/headers': { headers: headersStub },
      }) as typeof import('./utils');
    };

    it('should return false when headers() is unavailable', async () => {
      process.env.SITECORE_EDITING_SECRET = 'real-secret';
      const { isDesignLibraryAuthorizedFromHeaders } = loadHelper(null, true);
      expect(await isDesignLibraryAuthorizedFromHeaders()).to.be.false;
    });

    it('should return false when the editing secret header is missing', async () => {
      process.env.SITECORE_EDITING_SECRET = 'real-secret';
      const { isDesignLibraryAuthorizedFromHeaders } = loadHelper(null);
      expect(await isDesignLibraryAuthorizedFromHeaders()).to.be.false;
    });

    it('should return true when the editing secret header matches', async () => {
      process.env.SITECORE_EDITING_SECRET = 'real-secret';
      const { isDesignLibraryAuthorizedFromHeaders } = loadHelper('real-secret');
      expect(await isDesignLibraryAuthorizedFromHeaders()).to.be.true;
    });
  });

  describe('parseRewriteHeader', () => {
    let headers: Headers;

    beforeEach(() => {
      headers = new Headers();
    });

    it('should extract site and locale from a valid rewrite header', () => {
      headers.set(REWRITE_HEADER_NAME, '/mysite/en-us/page1');
      const result = parseRewriteHeader(headers);
      expect(result).to.deep.equal({ site: 'mysite', locale: 'en-us' });
    });

    it('should handle rewrite header with leading/trailing slashes', () => {
      headers.set(REWRITE_HEADER_NAME, '///mysite/en-us///page2///');
      const result = parseRewriteHeader(headers);
      expect(result).to.deep.equal({ site: 'mysite', locale: 'en-us' });
    });

    it('should return undefined for site and locale if header is missing', () => {
      const result = parseRewriteHeader(headers);
      expect(result).to.deep.equal({ site: undefined, locale: undefined });
    });

    it('should return undefined for locale if only site is present', () => {
      headers.set(REWRITE_HEADER_NAME, '/mysite');
      const result = parseRewriteHeader(headers);
      expect(result).to.deep.equal({ site: 'mysite', locale: undefined });
    });

    it('should return undefined for both if header is empty', () => {
      headers.set(REWRITE_HEADER_NAME, '');
      const result = parseRewriteHeader(headers);
      expect(result).to.deep.equal({ site: undefined, locale: undefined });
    });
  });
});
