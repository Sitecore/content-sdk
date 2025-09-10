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
    //   const req = createRequest({
    //     headerValues: { host: undefined },
    //   });

    //   const res = createResponse();

    //   nextRewriteStub = sinon.stub(nextjs.NextResponse, 'rewrite').returns(res);

    //   const { middleware, siteResolver } = createMiddleware();

    //   const finalRes = await middleware.handle(req, res);

    //   validateDebugLog('multisite middleware start: %o', {
    //     pathname: '/styleguide',
    //     language: 'en',
    //     hostname: 'localhost',
    //   });

    //   validateEndMessageDebugLog('multisite middleware end in %dms: %o', {
    //     rewritePath: `/${siteName}/styleguide`,
    //     siteName: siteName,
    //     headers: {
    //       'x-sc-rewrite': `/${siteName}/styleguide`,
    //     },
    //     cookies: {
    //       ...res.cookies,
    //       sc_site: {
    //         ...defaultSiteCookieAttributes,
    //         value: siteName,
    //       },
    //     },
    //   });

    //   expect(siteResolver.getByHost).to.be.calledWith('localhost');

    //   expect(finalRes).to.deep.equal(res);

    //   expect(nextRewriteStub).calledWith({
    //     ...req.nextUrl,
    //     pathname: `/${siteName}/styleguide`,
    //   });
    // });
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
