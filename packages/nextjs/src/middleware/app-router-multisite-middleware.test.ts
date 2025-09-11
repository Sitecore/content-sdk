/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-expressions */
/* eslint-disable dot-notation */
import chai, { use } from 'chai';
import chaiString from 'chai-string';
import sinonChai from 'sinon-chai';

import { AppRouterMultisiteMiddleware } from './app-router-multisite-middleware';

use(sinonChai);
const expect = chai.use(chaiString).expect;

describe('AppRouterMultisiteMiddleware', () => {
  const defaultConfig = {
    sites: [],
    enabled: true,
    useCookieResolution: () => false,
    defaultHostname: '',
  };

  describe('getSiteRewrite', () => {
    it('should rewrite path for site without _site_ prefix', async () => {
      const middleware = new AppRouterMultisiteMiddleware({
        ...defaultConfig,
      });

      const result = middleware['getSiteRewrite']('/some/path', 'mysite');
      expect(result).to.equal('/mysite/some/path');
    });
  });

  describe('getAppRouterSiteRewrite', () => {
    const middleware = new AppRouterMultisiteMiddleware({
      ...defaultConfig,
    });

    it('should return the correct rewrite path with leading slash in pathname', () => {
      const result = middleware['getAppRouterSiteRewrite']('/some/path', 'mysite');
      expect(result).to.equal('/mysite/some/path');
    });

    it('should return the correct rewrite path without leading slash in pathname', () => {
      const result = middleware['getAppRouterSiteRewrite']('some/path', 'mysite');
      expect(result).to.equal('/mysite/some/path');
    });

    it('should handle root path correctly', () => {
      const result = middleware['getAppRouterSiteRewrite']('/', 'mysite');
      expect(result).to.equal('/mysite/');
    });
  });
});
