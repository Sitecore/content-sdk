import { expect } from 'chai';
import sinon from 'sinon';
import { SitecoreClient } from './sitecore-client';
import { GraphQLErrorPagesService } from '../site';
import { GraphQLLayoutService, LayoutServicePageState } from '../layout';
import { GraphQLEditingService, RestComponentLayoutService } from '../editing';
import { SiteResolver } from '../site';
import { GraphQLDictionaryService } from '../i18n';
import { LayoutKind } from '../../editing';
import { LayoutServiceData } from '../../layout';

describe('SitecoreClient', () => {
  let sitecoreClient: SitecoreClient;
  let initOptions: any;
  let layoutServiceStub: sinon.SinonStubbedInstance<GraphQLLayoutService>;
  let dictionaryServiceStub: sinon.SinonStubbedInstance<GraphQLDictionaryService>;
  let errorPagesServiceStub: sinon.SinonStubbedInstance<GraphQLErrorPagesService>;
  let editingServiceStub: sinon.SinonStubbedInstance<GraphQLEditingService>;
  let siteResolverStub: sinon.SinonStubbedInstance<SiteResolver>;

  beforeEach(() => {
    initOptions = {
      api: {
        edge: { contextId: 'test-context-id', edgeUrl: 'https://edge.example.com' },
        local: { apiHost: 'http://local.example.com', apiKey: 'test-api-key' },
      },
      retries: { count: 3, retryStrategy: sinon.stub() },
      sites: [{ name: 'default-site' }, { name: 'other-site' }],
      defaultSite: 'default-site',
      defaultLanguage: 'en',
      layout: { formatLayoutQuery: sinon.stub() },
      dictionary: { caching: { enabled: true, timeout: 60000 } },
    };

    // Create stubs
    layoutServiceStub = sinon.createStubInstance(GraphQLLayoutService);
    dictionaryServiceStub = sinon.createStubInstance(GraphQLDictionaryService);
    errorPagesServiceStub = sinon.createStubInstance(GraphQLErrorPagesService);
    editingServiceStub = sinon.createStubInstance(GraphQLEditingService);
    siteResolverStub = sinon.createStubInstance(SiteResolver);

    // Create client
    sitecoreClient = new SitecoreClient(initOptions);

    (sitecoreClient as any).layoutService = layoutServiceStub;
    (sitecoreClient as any).dictionaryService = dictionaryServiceStub;
    (sitecoreClient as any).errorPagesService = errorPagesServiceStub;
    (sitecoreClient as any).editingService = editingServiceStub;
    (sitecoreClient as any).siteResolver = siteResolverStub;
  });

  // describe('resolveSite', () => {
  //   it('should resolve site correctly with string path', () => {
  //     const path = '/some/path';
  //     const siteInfo = { name: 'default-site' };
  //     const getSiteRewriteDataStub = sinon.stub().returns({ siteName: 'default-site' });
  //     sinon.replace(require('../site'), 'getSiteRewriteData', getSiteRewriteDataStub);
  //     siteResolverStub.getByName.returns(siteInfo);

  //     const result = sitecoreClient.resolveSite(path);

  //     expect(result).to.equal(siteInfo);
  //     expect(siteResolverStub.getByName.calledWith('default-site')).to.be.true;
  //   });

  //   it('should resolve site correctly with array path', () => {
  //     const path = ['/some', 'path'];
  //     const siteInfo = { name: 'other-site' };
  //     const getSiteRewriteDataStub = sinon.stub().returns({ siteName: 'other-site' });
  //     sinon.replace(require('../site'), 'getSiteRewriteData', getSiteRewriteDataStub);
  //     siteResolverStub.getByName.returns(siteInfo);

  //     const result = sitecoreClient.resolveSite(path);

  //     expect(result).to.equal(siteInfo);
  //     expect(siteResolverStub.getByName.calledWith('other-site')).to.be.true;
  //   });
  // });

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
      sinon.stub(sitecoreClient, 'resolveSite').returns(siteInfo);
      sinon.stub(sitecoreClient, 'normalizePath').returns('/normalized/path');
      layoutServiceStub.fetchLayoutData.resolves(layoutData);
      sinon
        .stub(sitecoreClient, 'getHeadLinks')
        .returns([{ rel: 'stylesheet', href: '/test.css' }]);

      const result = await sitecoreClient.getPage(path, locale);

      expect(result).to.deep.include({
        layout: layoutData,
        notFound: false,
        site: siteInfo,
        locale: locale,
      });
      expect(result.headLinks).to.have.lengthOf(1);
      expect(
        layoutServiceStub.fetchLayoutData.calledWith('/normalized/path', locale, siteInfo.name)
      ).to.be.true;
    });

    it('should return notFound when route does not exist', async () => {
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
      sinon.stub(sitecoreClient, 'resolveSite').returns(siteInfo);
      sinon.stub(sitecoreClient, 'normalizePath').returns('/normalized/non-existent');
      layoutServiceStub.fetchLayoutData.resolves(layoutData);

      const result = await sitecoreClient.getPage(path);

      expect(result).to.deep.include({
        layout: layoutData,
        notFound: true,
        site: siteInfo,
      });
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
      sinon.stub(sitecoreClient, 'resolveSite').returns(siteInfo);
      sinon.stub(sitecoreClient, 'normalizePath').returns('/normalized/path');
      layoutServiceStub.fetchLayoutData.resolves(layoutData);
      sinon.stub(sitecoreClient, 'getHeadLinks').returns([]);

      await sitecoreClient.getPage(path);

      expect(
        layoutServiceStub.fetchLayoutData.calledWith(
          '/normalized/path',
          initOptions.defaultLanguage,
          siteInfo.name
        )
      ).to.be.true;
    });
  });

  describe('getDictionary', () => {
    it('should fetch dictionary data with specified site and locale', async () => {
      const site = 'test-site';
      const locale = 'fr-FR';
      const dictionaryData = { key1: 'value1', key2: 'value2' };

      dictionaryServiceStub.fetchDictionaryData.resolves(dictionaryData);

      const result = await sitecoreClient.getDictionary(site, locale);

      expect(result).to.deep.equal(dictionaryData);
      expect(dictionaryServiceStub.fetchDictionaryData.calledWith(locale, site)).to.be.true;
    });

    it('should use default site and language when not specified', async () => {
      const dictionaryData = { key1: 'value1', key2: 'value2' };
      dictionaryServiceStub.fetchDictionaryData.resolves(dictionaryData);

      const result = await sitecoreClient.getDictionary();

      expect(result).to.deep.equal(dictionaryData);
      expect(
        dictionaryServiceStub.fetchDictionaryData.calledWith(
          initOptions.defaultLanguage,
          initOptions.defaultSite
        )
      ).to.be.true;
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

      const result = await sitecoreClient.getErrorPages(site, locale);

      expect(result).to.deep.equal(mockErrorPages);
      expect(errorPagesServiceStub.fetchErrorPages.calledWith(site, locale)).to.be.true;
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
        sitecore: { route: { name: 'home', placeholders: {} }, context: {} },
      };
      const dictionaryData = { key: 'value' };

      const restComponentServiceStub = sinon.createStubInstance(RestComponentLayoutService);
      sinon.stub(global, 'RestComponentLayoutService').returns(restComponentServiceStub);
      restComponentServiceStub.fetchComponentData.resolves(componentData);
      editingServiceStub.fetchDictionaryData.resolves(dictionaryData);
      sinon.stub(sitecoreClient, 'getHeadLinks').returns([]);

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

      if (typeof global.RestComponentLayoutService === 'function') {
        (global.RestComponentLayoutService as any).restore();
      }
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

      (sitecoreClient as any).initOptions.api.local = null;

      try {
        await sitecoreClient.getComponentLibraryData(componentLibData);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.include(
          'Component Library requires Sitecore apiHost and apiKey'
        );
      }
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
        variantIds: ['variant1', 'variant2'],
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
      sinon
        .stub(sitecoreClient, 'getHeadLinks')
        .returns([{ rel: 'stylesheet', href: '/test.css' }]);

      const personalizeStub = sinon.stub();
      const getGroomedVariantIdsStub = sinon.stub().returns({
        variantId: 'variant1',
        componentVariantIds: { component1: 'variant1' },
      });

      sinon.replace(require('../personalize'), 'getGroomedVariantIds', getGroomedVariantIdsStub);
      sinon.replace(require('../personalize'), 'personalizeLayout', personalizeStub);

      const result = await sitecoreClient.getPreview(previewData);

      expect(result).to.deep.include({
        locale: previewData.language,
        layout: editingData.layoutData,
        dictionary: editingData.dictionary,
        site: editingData.layoutData.sitecore.context.site,
      });
      expect(result.headLinks).to.have.lengthOf(1);

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

      expect(getGroomedVariantIdsStub.calledWith(previewData.variantIds)).to.be.true;
      expect(
        personalizeStub.calledWith(editingData.layoutData, 'variant1', { component1: 'variant1' })
      ).to.be.true;
    });

    it('should log error when preview data is missing', async () => {
      const consoleErrorStub = sinon.stub(console, 'error');

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

      sinon.stub(sitecoreClient, 'getHeadLinks').returns([]);

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

  afterEach(() => {
    sinon.restore();
  });
});
