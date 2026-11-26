/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { REWRITE_HEADER_NAME } from '../proxy/proxy';
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
