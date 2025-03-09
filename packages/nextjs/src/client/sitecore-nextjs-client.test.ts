import { expect } from 'chai';
import sinon from 'sinon';
import { SitecoreNextjsClient } from './sitecore-nextjs-client';
import { ComponentBuilder } from '../ComponentBuilder';
import { DefaultRetryStrategy } from '@sitecore-content-sdk/core';
import * as personalizeTools from '@sitecore-content-sdk/core/personalize';
import { VARIANT_PREFIX } from '@sitecore-content-sdk/core/personalize';
import { SITE_PREFIX } from '@sitecore-content-sdk/core/site';
import { GetServerSidePropsContext } from 'next';

xdescribe('SitecoreClient', () => {
  const sandbox = sinon.createSandbox();
  const builder = new ComponentBuilder({ components: new Map() });
  const moduleFactory = builder.getModuleFactory();
  const defaultSiteDeets = { hostName: 'http://unit.test', language: 'ua' };
  const defaultInitOptions = {
    api: {
      edge: {
        contextId: 'test-context-id',
        clientContextId: 'client-context-id',
        edgeUrl: 'https://edge.example.com',
      },
      local: {
        apiHost: 'http://local.example.com',
        apiKey: 'test-api-key',
        path: '/api/graph/test',
      },
    },
    editingSecret: '********-****',
    retries: { count: 3, retryStrategy: sinon.createStubInstance(DefaultRetryStrategy) },
    sites: [
      { name: 'default-site', ...defaultSiteDeets },
      { name: 'other-site', ...defaultSiteDeets },
    ],
    defaultSite: 'default-site',
    defaultLanguage: 'en',
    layout: { formatLayoutQuery: sandbox.stub() },
    dictionary: { caching: { enabled: true, timeout: 60000 } },
    moduleFactory,
  };

  let sitecoreClient = new SitecoreNextjsClient(defaultInitOptions);

  let layoutServiceStub = {
    fetchLayoutData: sandbox.stub(),
  };
  let dictionaryServiceStub = {
    fetchDictionaryData: sandbox.stub(),
  };
  let errorPagesServiceStub = {
    fetchErrorPages: sandbox.stub(),
  };
  let editingServiceStub = {
    fetchEditingData: sandbox.stub(),
    fetchDictionaryData: sandbox.stub(),
  };
  let siteResolverStub = {
    getByHost: sandbox.stub(),
    getByName: sandbox.stub(),
  };
  let restComponentServiceStub = {
    fetchComponentData: sandbox.stub(),
  };
  let sitemapServiceStub = {
    fetchSitemap: sandbox.stub(),
  };

  beforeEach(() => {
    layoutServiceStub = {
      fetchLayoutData: sandbox.stub(),
    };
    dictionaryServiceStub = {
      fetchDictionaryData: sandbox.stub(),
    };
    errorPagesServiceStub = {
      fetchErrorPages: sandbox.stub(),
    };
    editingServiceStub = {
      fetchEditingData: sandbox.stub(),
      fetchDictionaryData: sandbox.stub(),
    };
    siteResolverStub = {
      getByHost: sandbox.stub(),
      getByName: sandbox.stub(),
    };
    restComponentServiceStub = {
      fetchComponentData: sandbox.stub(),
    };
    sitemapServiceStub = {
      fetchSitemap: sandbox.stub(),
    };

    sitecoreClient = new SitecoreNextjsClient(defaultInitOptions);

    (sitecoreClient as any).layoutService = layoutServiceStub;
    (sitecoreClient as any).dictionaryService = dictionaryServiceStub;
    (sitecoreClient as any).errorPagesService = errorPagesServiceStub;
    (sitecoreClient as any).editingService = editingServiceStub;
    (sitecoreClient as any).siteResolver = siteResolverStub;
    (sitecoreClient as any).componentService = restComponentServiceStub;
    (sitecoreClient as any).sitemapService = sitemapServiceStub;
  });

  describe('resolveSiteFromPath', () => {
    it('should resolve site correctly with string path', () => {
      const path = '/some/path';
      const siteInfo = { name: 'default-site', hostName: '*', language: 'en' };
      const getSiteRewriteDataStub = sinon.stub().returns({ siteName: 'default-site' });
      sinon.replace(require('../site'), 'getSiteRewriteData', getSiteRewriteDataStub);
      siteResolverStub.getByName.returns(siteInfo);

      const result = sitecoreClient.resolveSiteFromPath(path);

      expect(result).to.equal(siteInfo);
      expect(siteResolverStub.getByName.calledWith('default-site')).to.be.true;
    });

    it('should resolve site correctly with array path', () => {
      const path = ['/some', 'path'];
      const siteInfo = { name: 'other-site', hostName: '*', language: 'en' };
      const getSiteRewriteDataStub = sinon.stub().returns({ siteName: 'other-site' });
      sinon.replace(require('../site'), 'getSiteRewriteData', getSiteRewriteDataStub);
      siteResolverStub.getByName.returns(siteInfo);

      const result = sitecoreClient.resolveSiteFromPath(path);

      expect(result).to.equal(siteInfo);
      expect(siteResolverStub.getByName.calledWith('other-site')).to.be.true;
    });
  });

  describe('getPage', () => {
    it('should return personalized page', async () => {
      const path = `${VARIANT_PREFIX}variant1/test/path`;
      const locale = 'en-US';
      const siteInfo = {
        name: 'default-site',
        hostName: 'example.com',
        language: 'en',
      };
      const layoutData = {
        sitecore: {
          route: {
            name: 'home',
            placeholders: {},
          },
          context: { site: siteInfo },
        },
      };
      const variantIds = ['variant1'];
      siteResolverStub.getByName.returns(siteInfo);
      sandbox.stub(sitecoreClient, 'resolveSite').returns(siteInfo);
      layoutServiceStub.fetchLayoutData.returns(layoutData);
      sandbox
        .stub(sitecoreClient, 'getHeadLinks')
        .returns([{ rel: 'stylesheet', href: '/test.css' }]);

      const personalizeSpy = sandbox.spy(personalizeTools, 'personalizeLayout');
      const getGroomedVariantIdsSpy = sandbox.spy(personalizeTools, 'getGroomedVariantIds');

      // sandbox.replace(require('../personalize'), 'getGroomedVariantIds', getGroomedVariantIdsStub);
      // sandbox.replace(require('../personalize'), 'personalizeLayout', personalizeStub);

      const result = await sitecoreClient.getPage(path, { locale });

      expect(result?.layout).to.deep.include({
        // TODO: add layout
      });
      expect(result?.headLinks).to.have.lengthOf(1);

      expect(getGroomedVariantIdsSpy.calledWith(variantIds)).to.be.true;
      // TODO: add layout
      // expect(personalizeSpy.calledWithMatch('variant1')).to.be.true;
    });
  });

  describe('parsePath', () => {
    describe('parsePath', () => {
      it('should return string path when accepting string[] path', () => {
        const path = ['/some', 'path'];
        const expectedPath = '/some/path';
        const normalizeSiteRewriteStub = sinon.stub().returns(expectedPath);
        const normalizePersonalizedRewriteStub = sinon.stub().returns(expectedPath);

        const result = sitecoreClient.parsePath(path);

        expect(result).to.equal(expectedPath);
        expect(normalizeSiteRewriteStub.calledOnce).to.be.true;
        expect(normalizePersonalizedRewriteStub.calledOnce).to.be.true;
      });

      it('should strip site and variant prefixes from path', () => {
        const path = `/${SITE_PREFIX}site1/${VARIANT_PREFIX}variant1/some/path`;
        const expectedPath = '/some/path';
        const normalizeSiteRewriteStub = sinon.stub().returns(expectedPath);
        const normalizePersonalizedRewriteStub = sinon.stub().returns(expectedPath);

        const result = sitecoreClient.parsePath(path);

        expect(result).to.equal(expectedPath);
        expect(normalizeSiteRewriteStub.calledOnce).to.be.true;
        expect(normalizePersonalizedRewriteStub.calledOnce).to.be.true;
      });
    });
  });

  describe('getComponentData', () => {
    it('should return componentData when component has getServerSideProps method', async () => {
      const context = ({
        params: { path: ['test', 'path'] },
        query: {},
        req: {},
        res: {},
        resolvedUrl: '/test/path',
      } as unknown) as GetServerSidePropsContext;
      const layoutData = {
        sitecore: {
          context,
          route: {
            name: 'test',
            placeholders: {
              main: [
                {
                  componentName: 'TestComponent',
                  uid: 'test-uid',
                },
              ],
            },
          },
        },
      };

      const mockComponent = {
        getServerSideProps: sinon.stub().resolves({ props: { data: 'test-data' } }),
      };

      const moduleFactoryStub = sinon.stub().returns(mockComponent);
      // eslint-disable-next-line
      sitecoreClient['initOptions'].moduleFactory = moduleFactoryStub;

      const result = await sitecoreClient.getComponentData(layoutData, context);

      expect(result).to.deep.equal({
        'test-uid': { data: 'test-data' },
      });
      expect(mockComponent.getServerSideProps.calledOnce).to.be.true;
    });
  });

  describe('getPagePaths', () => {
    it('should return page paths', async () => {
      const languages = ['en', 'fr'];
      const expectedPaths = [
        { params: { path: ['home'] }, locale: 'en' },
        { params: { path: ['accueil'] }, locale: 'fr' },
      ];
      sitemapServiceStub.fetchSitemap.withArgs(languages).resolves(expectedPaths);

      const result = await sitecoreClient.getPagePaths(languages);

      expect(result).to.deep.equal(expectedPaths);
    });
  });
});
