/* eslint-disable no-unused-expressions */
import { expect, use } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import proxyquire from 'proxyquire';
import { REWRITE_HEADER_NAME } from '../proxy/proxy';
import { getEditingSecret, parseRewriteHeader } from './utils';

use(sinonChai);

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

  describe('isDraftModeEnabled', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should return draftMode().isEnabled from next/headers', async () => {
      const draftModeStub = sinon.stub().resolves({ isEnabled: true });
      const module = proxyquire('./utils', {
        'next/headers': {
          draftMode: draftModeStub,
        },
      });

      const result = await module.isDraftModeEnabled();
      expect(result).to.equal(true);
      expect(draftModeStub).to.have.been.calledOnce;
    });

    it('should return false when next/headers is unavailable', async () => {
      const module = proxyquire('./utils', {
        'next/headers': (): never => {
          throw new Error('not in server context');
        },
      });

      const result = await module.isDraftModeEnabled();
      expect(result).to.equal(false);
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
