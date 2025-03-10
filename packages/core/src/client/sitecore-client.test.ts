import { expect } from 'chai';
import sinon from 'sinon';
import { SitecoreClient } from './sitecore-client';
import { LayoutKind } from '../../editing';
import { LayoutServiceData } from '../../layout';
import { DefaultRetryStrategy } from '../retries';
import { LayoutServicePageState } from '../layout';
import * as personalizeTools from '../personalize/layout-personalizer';
import * as personalizeUtils from '../personalize/utils';

describe('SitecoreClient', () => {
  const sandbox = sinon.createSandbox();
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

  let sitecoreClient = new SitecoreClient(defaultInitOptions);

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

  afterEach(() => {
    sandbox.restore();
  });

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

    sitecoreClient = new SitecoreClient(defaultInitOptions);

    (sitecoreClient as any).layoutService = layoutServiceStub;
    (sitecoreClient as any).dictionaryService = dictionaryServiceStub;
    (sitecoreClient as any).errorPagesService = errorPagesServiceStub;
    (sitecoreClient as any).editingService = editingServiceStub;
    (sitecoreClient as any).siteResolver = siteResolverStub;
    (sitecoreClient as any).componentService = restComponentServiceStub;
  });

  describe('resolveSite', () => {
    it('should resolve site by hostname with SiteResolver', () => {
      const hostname = 'http://unit.test';
      const expectedSiteInfo = { name: 'test', hostName: hostname, language: 'es-ES' };
      // eslint-disable-next-line
      siteResolverStub.getByHost.returns(expectedSiteInfo);
      expect(sitecoreClient.resolveSite(hostname)).to.deep.equal(expectedSiteInfo);
    });
  });

  describe('getPage', () => {
    it('should return page data when route exists', async () => {
      const path = '/test/path';
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
      siteResolverStub.getByName.returns(siteInfo);
      sandbox.stub(sitecoreClient, 'resolveSite').returns(siteInfo);
      layoutServiceStub.fetchLayoutData.returns(layoutData);
      sandbox
        .stub(sitecoreClient, 'getHeadLinks')
        .returns([{ rel: 'stylesheet', href: '/test.css' }]);

      const result = await sitecoreClient.getPage(path, { locale });

      expect(result).to.deep.include({
        layout: layoutData,
        site: siteInfo,
        locale: locale,
      });
      expect(result?.headLinks).to.have.lengthOf(1);
      expect(
        layoutServiceStub.fetchLayoutData.calledWithMatch(path, {
          locale,
          site: siteInfo.name,
        })
      ).to.be.true;
    });

    it('should return null when route does not exist', async () => {
      const path = '/test/non-existent';
      const siteInfo = {
        name: 'default-site',
        hostName: 'example.com',
        language: 'en',
      };
      const layoutData = {
        sitecore: {
          route: null,
          context: { site: siteInfo },
        },
      };

      siteResolverStub.getByName.returns(siteInfo);
      sandbox.stub(sitecoreClient, 'resolveSite').returns(siteInfo);
      layoutServiceStub.fetchLayoutData.resolves(layoutData);

      const result = await sitecoreClient.getPage(path);

      expect(result).to.be.null;
    });

    it('should use default language when locale not specified', async () => {
      const path = '/test/path';
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

      siteResolverStub.getByName.returns(siteInfo);
      sandbox.stub(sitecoreClient, 'resolveSite').returns(siteInfo);
      layoutServiceStub.fetchLayoutData.resolves(layoutData);
      sandbox.stub(sitecoreClient, 'getHeadLinks').returns([]);

      await sitecoreClient.getPage(path);

      expect(
        layoutServiceStub.fetchLayoutData.calledWithMatch(path, {
          locale: defaultInitOptions.defaultLanguage,
          site: siteInfo.name,
        })
      ).to.be.true;
    });

    it('should pass fetchOptions to layoutService when calling getPage', async () => {
      const path = '/test/path';
      const locale = 'en-US';
      const fetchOptions = {
        retries: 3,
        retryStrategy: {
          shouldRetry: () => true,
          getDelay: () => 1000,
        },
        fetch: globalThis.fetch,
        headers: {
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/json',
        },
      };

      const siteInfo = {
        name: 'default-site',
        hostName: 'example.com',
        language: 'en',
      };

      const layoutData = {
        sitecore: {
          route: { placeholders: {} },
          context: { site: siteInfo },
        },
      };

      siteResolverStub.getByName.returns(siteInfo);
      sandbox.stub(sitecoreClient, 'resolveSite').returns(siteInfo);
      sandbox.stub(sitecoreClient, 'getHeadLinks').returns([]);

      layoutServiceStub.fetchLayoutData.resolves(layoutData);

      await sitecoreClient.getPage(path, { locale }, fetchOptions);

      expect(
        layoutServiceStub.fetchLayoutData.calledWith(
          path,
          { locale, site: siteInfo.name },
          fetchOptions
        )
      ).to.be.true;
    });
  });

  describe('getDictionary', () => {
    it('should fetch dictionary data with specified site and locale', async () => {
      const routeOptions = {
        site: 'test-site',
        locale: 'fr-FR',
      };
      const dictionaryData = { key1: 'value1', key2: 'value2' };

      dictionaryServiceStub.fetchDictionaryData.resolves(dictionaryData);

      const result = await sitecoreClient.getDictionary(routeOptions);

      expect(result).to.deep.equal(dictionaryData);
      expect(
        dictionaryServiceStub.fetchDictionaryData.calledWith(routeOptions.locale, routeOptions.site)
      ).to.be.true;
    });

    it('should use default site and language when not specified', async () => {
      const dictionaryData = { key1: 'value1', key2: 'value2' };
      dictionaryServiceStub.fetchDictionaryData.resolves(dictionaryData);

      const result = await sitecoreClient.getDictionary();

      expect(result).to.deep.equal(dictionaryData);
      expect(
        dictionaryServiceStub.fetchDictionaryData.calledWith(
          defaultInitOptions.defaultLanguage,
          defaultInitOptions.defaultSite
        )
      ).to.be.true;
    });

    it('should pass fetchOptions to dictionaryService when calling getDictionary', async () => {
      const locale = 'fr-FR';
      const site = 'test-site';
      const fetchOptions = {
        retries: 3,
        retryStrategy: {
          shouldRetry: () => true,
          getDelay: () => 1000,
        },
        fetch: globalThis.fetch,
        headers: {
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/json',
        },
      };
      const dictionaryData = { key1: 'value1', key2: 'value2' };

      dictionaryServiceStub.fetchDictionaryData.resolves(dictionaryData);

      await sitecoreClient.getDictionary({ locale, site }, fetchOptions);

      expect(dictionaryServiceStub.fetchDictionaryData.calledWith(locale, site, fetchOptions)).to.be
        .true;
    });
  });

  describe('getErrorPages', () => {
    it('should fetch error pages with specified site and locale', async () => {
      const site = 'test-site';
      const locale = 'fr-FR';
      const mockErrorPages = {
        notFoundPagePath: '/notFoundPage',
        notFoundPage: { rendered: {} as LayoutServiceData },
        serverErrorPagePath: '/serverErrorPage',
        serverErrorPage: { rendered: {} as LayoutServiceData },
      };

      errorPagesServiceStub.fetchErrorPages.resolves(mockErrorPages);

      const result = await sitecoreClient.getErrorPages({ site, locale });

      expect(result).to.deep.equal(mockErrorPages);
      expect(errorPagesServiceStub.fetchErrorPages.calledWith(site, locale)).to.be.true;
    });

    it('should pass fetchOptions to errorPagesService when calling getErrorPages', async () => {
      const site = 'test-site';
      const locale = 'fr-FR';
      const fetchOptions = {
        retries: 3,
        retryStrategy: {
          shouldRetry: () => true,
          getDelay: () => 1000,
        },
        fetch: globalThis.fetch,
        headers: {
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/json',
        },
      };

      const mockErrorPages = {
        notFoundPagePath: '/notFoundPage',
        notFoundPage: { rendered: {} as LayoutServiceData },
        serverErrorPagePath: '/serverErrorPage',
        serverErrorPage: { rendered: {} as LayoutServiceData },
      };

      errorPagesServiceStub.fetchErrorPages.resolves(mockErrorPages);

      await sitecoreClient.getErrorPages({ site, locale }, fetchOptions);

      expect(errorPagesServiceStub.fetchErrorPages.calledWith(site, locale, fetchOptions)).to.be
        .true;
    });
  });

  describe('getPreview', () => {
    it('should fetch and return preview data correctly', async () => {
      const previewData = {
        site: 'default-site',
        itemId: 'test-item-id',
        pageState: LayoutServicePageState.Edit,
        language: 'en',
        version: '1',
        variantIds: ['variant1', 'comp_variant2'],
        layoutKind: LayoutKind.Final,
      };

      const editingData = {
        layoutData: {
          sitecore: {
            route: { name: 'home', placeholders: {} },
            context: { site: { name: 'default-site' } },
          },
        },
        dictionary: { key1: 'value1', key2: 'value2' },
      };

      editingServiceStub.fetchEditingData.resolves(editingData);
      sandbox
        .stub(sitecoreClient, 'getHeadLinks')
        .returns([{ rel: 'stylesheet', href: '/test.css' }]);

      const personalizeSpy = sandbox.spy(personalizeTools, 'personalizeLayout');
      const getGroomedVariantIdsSpy = sandbox.spy(personalizeUtils, 'getGroomedVariantIds');

      // sandbox.replace(require('../personalize'), 'getGroomedVariantIds', getGroomedVariantIdsStub);
      // sandbox.replace(require('../personalize'), 'personalizeLayout', personalizeStub);

      const result = await sitecoreClient.getPreview(previewData);

      expect(result).to.deep.include({
        locale: previewData.language,
        layout: editingData.layoutData,
        dictionary: editingData.dictionary,
        site: editingData.layoutData.sitecore.context.site,
      });
      expect(result?.headLinks).to.have.lengthOf(1);

      expect(editingServiceStub.fetchEditingData.calledOnce).to.be.true;
      expect(
        editingServiceStub.fetchEditingData.calledWith({
          siteName: previewData.site,
          itemId: previewData.itemId,
          language: previewData.language,
          version: previewData.version,
          layoutKind: previewData.layoutKind,
        })
      ).to.be.true;

      expect(getGroomedVariantIdsSpy.calledWith(previewData.variantIds)).to.be.true;
      expect(personalizeSpy.calledWith(editingData.layoutData, 'variant1', ['comp_variant1'])).to.be
        .true;
    });

    it('should log error when preview data is missing', async () => {
      const consoleErrorStub = sandbox.stub(console, 'error');

      await sitecoreClient.getPreview(undefined);

      expect(consoleErrorStub.calledWith('Preview data missing')).to.be.true;

      consoleErrorStub.restore();
    });

    it('should throw error when editing data fetch fails', async () => {
      const previewData = {
        site: 'default-site',
        itemId: 'test-item-id',
        pageState: LayoutServicePageState.Edit,
        language: 'en',
        version: '1',
        variantIds: [],
        layoutKind: LayoutKind.Final,
      };

      editingServiceStub.fetchEditingData.resolves(undefined);

      try {
        await sitecoreClient.getPreview(previewData);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.include('Unable to fetch editing data for preview');
      }
    });

    it('should use custom fetch options when provided', async () => {
      const previewData = {
        site: 'default-site',
        itemId: 'test-item-id',
        pageState: LayoutServicePageState.Edit,
        language: 'en',
        version: '1',
        variantIds: [],
        layoutKind: LayoutKind.Final,
      };

      const fetchOptions = {
        headers: { 'Custom-Header': 'test-value' },
      };

      const editingData = {
        layoutData: {
          sitecore: {
            route: { name: 'home', placeholders: {} },
            context: {
              site: {
                name: 'default-site',
                hostName: 'example.com',
                language: 'en',
              },
            },
          },
        },
        dictionary: { key1: 'value1', key2: 'value2' },
      };

      editingServiceStub.fetchEditingData
        .withArgs({
          siteName: previewData.site,
          itemId: previewData.itemId,
          language: previewData.language,
          version: previewData.version,
          layoutKind: previewData.layoutKind,
        })
        .resolves(editingData);

      sandbox.stub(sitecoreClient, 'getHeadLinks').returns([]);

      const getServiceInstanceStub = sinon
        .stub(sitecoreClient as any, 'getServiceInstance')
        .callsFake((service) => service);

      await sitecoreClient.getPreview(previewData, fetchOptions);

      expect(
        editingServiceStub.fetchEditingData.calledWith({
          siteName: previewData.site,
          itemId: previewData.itemId,
          language: previewData.language,
          version: previewData.version,
          layoutKind: previewData.layoutKind,
        })
      ).to.be.true;

      getServiceInstanceStub.restore();
    });
  });

  describe('getComponentLibraryData', () => {
    it('should fetch component library data', async () => {
      const componentLibData = {
        itemId: 'item-id',
        componentUid: 'comp-uid',
        site: 'test-site',
        language: 'en',
        renderingId: 'rendering-id',
        dataSourceId: 'datasource-id',
        version: '1',
        pageState: LayoutServicePageState.Normal,
      };

      const componentData = {
        sitecore: {
          route: { name: 'home', placeholders: {} },
          context: {
            site: {
              name: 'test-site',
              hostName: 'example.com',
              language: 'en',
            },
          },
        },
      };
      const dictionaryData = { key: 'value' };

      const getServiceInstanceStub = sandbox
        .stub(sitecoreClient as any, 'getServiceInstance')
        .callsFake((service) => service);

      restComponentServiceStub.fetchComponentData.resolves(componentData);

      editingServiceStub.fetchDictionaryData
        .withArgs({ siteName: componentLibData.site, language: componentLibData.language })
        .resolves(dictionaryData);

      sandbox.stub(sitecoreClient, 'getHeadLinks').returns([]);

      const result = await sitecoreClient.getComponentLibraryData(componentLibData);

      expect(result).to.deep.include({
        locale: componentLibData.language,
        layout: componentData,
        dictionary: dictionaryData,
      });

      expect(
        editingServiceStub.fetchDictionaryData.calledWith({
          siteName: componentLibData.site,
          language: componentLibData.language,
        })
      ).to.be.true;

      expect(
        restComponentServiceStub.fetchComponentData.calledWith({
          itemId: componentLibData.itemId,
          componentUid: componentLibData.componentUid,
          site: componentLibData.site,
          language: componentLibData.language,
          renderingId: componentLibData.renderingId,
          dataSourceId: componentLibData.dataSourceId,
          version: componentLibData.version,
          pageState: componentLibData.pageState,
        })
      ).to.be.true;

      // Clean up
      getServiceInstanceStub.restore();
    });

    it('should throw error when local API settings are missing', async () => {
      const componentLibData = {
        itemId: 'item-id',
        componentUid: 'comp-uid',
        site: 'test-site',
        language: 'en',
        renderingId: 'rendering-id',
        dataSourceId: 'datasource-id',
        version: '1',
        pageState: LayoutServicePageState.Normal,
      };

      // Create a deep copy of the options to avoid modifying the original
      const modifiedClient = new SitecoreClient({
        ...JSON.parse(JSON.stringify(defaultInitOptions)),
        api: {
          ...JSON.parse(JSON.stringify(defaultInitOptions.api)),
          local: null,
        },
      });

      (modifiedClient as any).editingService = editingServiceStub;
      (modifiedClient as any).restComponentService = restComponentServiceStub;

      try {
        await modifiedClient.getComponentLibraryData(componentLibData);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.include(
          'Component Library requires Sitecore apiHost and apiKey'
        );
      }
    });

    it('should pass fetchOptions to both editingService and componentService when calling getComponentLibraryData', async () => {
      const componentLibData = {
        itemId: 'item-id',
        componentUid: 'comp-uid',
        site: 'test-site',
        language: 'en',
        renderingId: 'rendering-id',
        dataSourceId: 'datasource-id',
        version: '1',
        pageState: LayoutServicePageState.Normal,
      };

      const fetchOptions = {
        headers: { 'Component-Mode': 'library' },
        next: { tags: ['component-library'] },
      };

      const componentData = {
        sitecore: {
          route: { name: 'home', placeholders: {} },
          context: {
            site: {
              name: 'test-site',
              hostName: 'example.com',
              language: 'en',
            },
          },
        },
      };
      const dictionaryData = { key: 'value' };

      const getServiceInstanceStub = sandbox
        .stub(sitecoreClient as any, 'getServiceInstance')
        .returns(editingServiceStub);

      restComponentServiceStub.fetchComponentData.resolves(componentData);
      editingServiceStub.fetchDictionaryData.resolves(dictionaryData);
      sandbox.stub(sitecoreClient, 'getHeadLinks').returns([]);

      await sitecoreClient.getComponentLibraryData(componentLibData, fetchOptions);

      expect(getServiceInstanceStub.calledWith(editingServiceStub, fetchOptions)).to.be.true;

      expect(
        editingServiceStub.fetchDictionaryData.calledWith({
          siteName: componentLibData.site,
          language: componentLibData.language,
        })
      ).to.be.true;
    });
  });
});
