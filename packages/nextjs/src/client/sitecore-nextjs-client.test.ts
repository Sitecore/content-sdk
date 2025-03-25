import { expect } from 'chai';
import sinon from 'sinon';
import { SitecoreNextjsClient } from './sitecore-nextjs-client';
import { ComponentBuilder } from '../ComponentBuilder';
import { DefaultRetryStrategy } from '@sitecore-content-sdk/core';
import * as siteTools from '@sitecore-content-sdk/core/site';
import { SITE_PREFIX } from '@sitecore-content-sdk/core/site';
import { GetServerSidePropsContext } from 'next';
import { layoutData, componentsWithExperiencesArray } from '../test-data/personalizeData';
import { VARIANT_PREFIX } from '@sitecore-content-sdk/core/personalize';

describe('SitecoreClient', () => {
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

    req = {
      headers: {
        host: 'example.com',
        'x-forwarded-proto': 'https',
      },
      query: {},
    };

    sitecoreClient = new SitecoreNextjsClient(defaultInitOptions);

    (sitecoreClient as any).layoutService = layoutServiceStub;
    (sitecoreClient as any).dictionaryService = dictionaryServiceStub;
    (sitecoreClient as any).errorPagesService = errorPagesServiceStub;
    (sitecoreClient as any).editingService = editingServiceStub;
    (sitecoreClient as any).siteResolver = siteResolverStub;
    (sitecoreClient as any).componentService = restComponentServiceStub;
  });

  describe('getPage', () => {
    it('should personalize page layout when variants present in path', async () => {
      const path = `${VARIANT_PREFIX}variant1/${VARIANT_PREFIX}mountain_bike_audience/test/path`;
      const locale = 'en-US';
      const testLayoutData = structuredClone(layoutData);

      const siteInfo = {
        name: 'default-site',
        hostName: 'example.com',
        language: 'en',
      };
      siteResolverStub.getByName.returns(siteInfo);
      sandbox.stub(sitecoreClient, 'resolveSite').returns(siteInfo);
      layoutServiceStub.fetchLayoutData.returns(testLayoutData);
      sandbox.stub(sitecoreClient, 'getHeadLinks').returns([]);

      const result = await sitecoreClient.getPage(path, { locale });

      expect(result?.layout.sitecore.route?.placeholders).to.deep.equal({
        'jss-main': [...componentsWithExperiencesArray],
      });
    });

    it('should use personalize details passed in page options over variants present in path', async () => {
      const path = `${VARIANT_PREFIX}variant1/${VARIANT_PREFIX}sand_bike_audience/test/path`;
      const locale = 'en-US';
      const testLayoutData = structuredClone(layoutData);

      const siteInfo = {
        name: 'default-site',
        hostName: 'example.com',
        language: 'en',
      };
      siteResolverStub.getByName.returns(siteInfo);
      sandbox.stub(sitecoreClient, 'resolveSite').returns(siteInfo);
      layoutServiceStub.fetchLayoutData.returns(testLayoutData);
      sandbox.stub(sitecoreClient, 'getHeadLinks').returns([]);

      const result = await sitecoreClient.getPage(path, {
        locale,
        personalize: { variantId: 'variant2', componentVariantIds: ['mountain_bike_audience'] },
      });

      expect(result?.layout.sitecore.route?.placeholders).to.deep.equal({
        'jss-main': [...componentsWithExperiencesArray],
      });
    });

    it('should pass site from path to base getPage method', async () => {
      const path = `${SITE_PREFIX}mysite/test/path`;
      const locale = 'en-US';
      const testLayoutData = structuredClone(layoutData);

      const siteInfo = {
        name: 'mysite',
        hostName: 'example.com',
        language: 'en',
      };
      siteResolverStub.getByName.returns(siteInfo);
      sandbox.stub(sitecoreClient, 'resolveSite').returns(siteInfo);
      sandbox.stub(sitecoreClient, 'parsePath').returns('/test/path');
      layoutServiceStub.fetchLayoutData.returns(testLayoutData);

      await sitecoreClient.getPage(path, {
        locale,
      });

      expect(layoutServiceStub.fetchLayoutData).to.be.calledWithMatch('/test/path', {
        locale,
        site: 'mysite',
      });
    });

    it('should use site passed in page options over site parsed from path', async () => {
      const path = `${SITE_PREFIX}mysite/test/path`;
      const locale = 'en-US';
      const testLayoutData = structuredClone(layoutData);

      const siteInfo = {
        name: 'mysite',
        hostName: 'example.com',
        language: 'en',
      };
      siteResolverStub.getByName.returns(siteInfo);
      sandbox.stub(sitecoreClient, 'resolveSite').returns(siteInfo);
      sandbox.stub(sitecoreClient, 'parsePath').returns('/test/path');
      layoutServiceStub.fetchLayoutData.returns(testLayoutData);

      await sitecoreClient.getPage(path, {
        locale,
        site: 'other-site',
      });

      expect(layoutServiceStub.fetchLayoutData).to.be.calledWithMatch('/test/path', {
        locale,
        site: 'other-site',
      });
    });
  });

  describe('resolveSiteFromPath', () => {
    it('should resolve site correctly with string path', () => {
      const path = '/some/path';
      const siteInfo = { name: 'default-site', hostName: '*', language: 'en' };
      sandbox.stub(siteTools, 'getSiteRewriteData').returns({ siteName: 'default-site' });
      siteResolverStub.getByName.returns(siteInfo);

      const result = sitecoreClient.resolveSiteFromPath(path);

      expect(result).to.equal(siteInfo);
      expect(siteResolverStub.getByName.calledWith('default-site')).to.be.true;
    });

    it('should resolve site correctly with array path', () => {
      const path = [`${SITE_PREFIX}other-site`, '/some', 'path'];
      const siteInfo = { name: 'other-site', hostName: '*', language: 'en' };
      siteResolverStub.getByName.returns(siteInfo);

      const result = sitecoreClient.resolveSiteFromPath(path);

      expect(result).to.equal(siteInfo);
      expect(siteResolverStub.getByName.calledWith('other-site')).to.be.true;
    });
  });

  describe('parsePath', () => {
    it('should return string path when accepting string[] path', () => {
      const path = ['/some', 'path'];
      const expectedPath = '/some/path';

      const result = sitecoreClient.parsePath(path);

      expect(result).to.equal(expectedPath);
    });

    it('should strip site and variant prefixes from path', () => {
      const path = `/${SITE_PREFIX}site1/${VARIANT_PREFIX}variant1/some/path`;
      const expectedPath = '/some/path';

      const result = sitecoreClient.parsePath(path);

      expect(result).to.equal(expectedPath);
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
        getServerSideProps: sandbox.stub().resolves({ props: { data: 'test-data' } }),
      };

      const moduleFactoryStub = sandbox.stub().returns(mockComponent);

      const result = await sitecoreClient.getComponentData(layoutData, context, moduleFactoryStub);

      expect(result).to.deep.equal({
        'test-uid': { props: { data: 'test-data' } },
      });
      expect(mockComponent.getServerSideProps.calledOnce).to.be.true;
    });
  });
});
