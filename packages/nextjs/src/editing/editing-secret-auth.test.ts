/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { EDITING_SECRET_HEADER } from './constants';

describe('editing-secret-auth', () => {
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

      return proxyquire('./editing-secret-auth', {
        'next/headers': { headers: headersStub },
      }) as typeof import('./editing-secret-auth');
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

    it('should return false when the editing secret header does not match', async () => {
      process.env.SITECORE_EDITING_SECRET = 'real-secret';
      const { isDesignLibraryAuthorizedFromHeaders } = loadHelper('wrong-secret');
      expect(await isDesignLibraryAuthorizedFromHeaders()).to.be.false;
    });

    it('should return true when the editing secret header matches', async () => {
      process.env.SITECORE_EDITING_SECRET = 'real-secret';
      const { isDesignLibraryAuthorizedFromHeaders } = loadHelper('real-secret');
      expect(await isDesignLibraryAuthorizedFromHeaders()).to.be.true;
    });
  });
});
