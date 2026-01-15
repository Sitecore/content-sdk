/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-expressions */
/* eslint-disable dot-notation */
import chai, { use } from 'chai';
import chaiString from 'chai-string';
import sinonChai from 'sinon-chai';

import { AppRouterMultisiteProxy } from './app-router-multisite-proxy';

use(sinonChai);
const expect = chai.use(chaiString).expect;

describe('AppRouterMultisiteProxy', () => {
  const defaultConfig = {
    sites: [],
    enabled: true,
    useCookieResolution: () => false,
    defaultHostname: '',
  };

  describe('getSiteRewrite', () => {
    const proxy = new AppRouterMultisiteProxy({
      ...defaultConfig,
    });

    it('should rewrite path for site without _site_ prefix', async () => {
      const result = proxy['getSiteRewrite']('/some/path', 'mysite');
      expect(result).to.equal('/mysite/some/path');
    });

    it('should return the correct rewrite path with leading slash in pathname', () => {
      const result = proxy['getSiteRewrite']('/some/path', 'mysite');
      expect(result).to.equal('/mysite/some/path');
    });

    it('should return the correct rewrite path without leading slash in pathname', () => {
      const result = proxy['getSiteRewrite']('some/path', 'mysite');
      expect(result).to.equal('/mysite/some/path');
    });

    it('should handle root path correctly', () => {
      const result = proxy['getSiteRewrite']('/', 'mysite');
      expect(result).to.equal('/mysite/');
    });
  });
});
