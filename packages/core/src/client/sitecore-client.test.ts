import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { SitecoreClient } from './sitecore-client';
import { LayoutKind } from '../../editing';
import { LayoutServiceData } from '../../layout';
import { DefaultRetryStrategy } from '../retries';
import { LayoutServicePageState } from '../layout';
import { layoutData, componentsWithExperiencesArray } from '../test-data/personalizeData';
import { NativeDataFetcher } from '../native-fetcher';
import { IncomingMessage, ServerResponse } from 'http';

chai.use(sinonChai);

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

  let sitePathServiceStub = {
    fetchSiteRoutes: sandbox.stub(),
  };

  let req: Partial<IncomingMessage>;
  let sitemapXmlServiceStub: any;

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

    sitePathServiceStub = {
      fetchSiteRoutes: sandbox.stub(),
    };

    req = {
      headers: {
        host: 'example.com',
        'x-forwarded-proto': 'https',
      },
    };

    // Create stubs for the dependencies
    sitemapXmlServiceStub = {
      getSitemap: sandbox.stub(),
      fetchSitemaps: sandbox.stub(),
      setSiteName: sandbox.stub(),
    };

    sitecoreClient = new SitecoreClient(defaultInitOptions);

    (sitecoreClient as any).layoutService = layoutServiceStub;
    (sitecoreClient as any).dictionaryService = dictionaryServiceStub;
    (sitecoreClient as any).errorPagesService = errorPagesServiceStub;
    (sitecoreClient as any).editingService = editingServiceStub;
    (sitecoreClient as any).siteResolver = siteResolverStub;
    (sitecoreClient as any).componentService = restComponentServiceStub;
    (sitecoreClient as any).sitePathService = sitePathServiceStub;
    (sitecoreClient as any).sitemapXmlService = sitemapXmlServiceStub;
  });

  describe('parsePath', () => {
    it('should return path as string, when input is array', () => {
      const test = ['my', 'path'];
      expect(sitecoreClient.parsePath(test)).to.equal('/my/path');
    });

    it('should return path and ensure prefix slash, when input is string', () => {
      const test = 'my/path';
      expect(sitecoreClient.parsePath(test)).to.equal('/my/path');
    });

    it('should return path as string and clear extra slashes, when input is array', () => {
      const test = ['/', 'my', '/', '/path/'];
      expect(sitecoreClient.parsePath(test)).to.equal('/my/path');
    });
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

      const result = await sitecoreClient.getPage(path, { locale });

      expect(result).to.deep.include({
        layout: layoutData,
        site: siteInfo,
        locale: locale,
      });
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

      const result = await sitecoreClient.getPage(path, {});

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

      await sitecoreClient.getPage(path);

      expect(
        layoutServiceStub.fetchLayoutData.calledWithMatch(path, {
          locale: defaultInitOptions.defaultLanguage,
          site: siteInfo.name,
        })
      ).to.be.true;
    });

    it('should personalize page layout when variants are passed in page options', async () => {
      const path = '/test/path';
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

      const result = await sitecoreClient.getPage(path, {
        locale,
        personalize: { variantId: 'variant1', componentVariantIds: ['mountain_bike_audience'] },
      });

      expect(result?.layout.sitecore.route?.placeholders).to.deep.equal({
        'jss-main': [...componentsWithExperiencesArray],
      });
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

  describe('getPagePaths', () => {
    it('should return page paths', async () => {
      const languages = ['en', 'fr'];
      const expectedPaths = [
        { params: { path: ['home'] }, locale: 'en' },
        { params: { path: ['accueil'] }, locale: 'fr' },
      ];
      sitePathServiceStub.fetchSiteRoutes.resolves([]);
      sitePathServiceStub.fetchSiteRoutes.withArgs(languages).resolves(expectedPaths);

      const result = await sitecoreClient.getPagePaths(languages);

      expect(result).to.deep.equal(expectedPaths);
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

      const result = await sitecoreClient.getPreview(previewData);

      expect(result).to.deep.include({
        locale: previewData.language,
        layout: editingData.layoutData,
        dictionary: editingData.dictionary,
        site: editingData.layoutData.sitecore.context.site,
      });

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
    });

    it('should apply personalization', async () => {
      const variant = 'test';
      const testLayoutData = structuredClone(layoutData);
      const componentVariantIds = ['mountain_bike_audience', 'another_variant', 'third_variant'];
      const previewData = {
        site: 'default-site',
        itemId: 'test-item-id',
        pageState: LayoutServicePageState.Edit,
        language: 'en',
        version: '1',
        variantIds: [variant, ...componentVariantIds],
        layoutKind: LayoutKind.Final,
      };

      const editingData = {
        layoutData: testLayoutData,
        dictionary: { key1: 'value1', key2: 'value2' },
      };

      editingServiceStub.fetchEditingData.resolves(editingData);

      const result = await sitecoreClient.getPreview(previewData);

      expect(result?.layout.sitecore.route?.placeholders).to.deep.equal({
        'jss-main': [...componentsWithExperiencesArray],
      });
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

      await sitecoreClient.getPreview(previewData, fetchOptions);

      expect(
        editingServiceStub.fetchEditingData.calledWith(
          {
            siteName: previewData.site,
            itemId: previewData.itemId,
            language: previewData.language,
            version: previewData.version,
            layoutKind: previewData.layoutKind,
          },
          fetchOptions
        )
      ).to.be.true;
    });
  });

  describe('getDesignLibraryData', () => {
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

      restComponentServiceStub.fetchComponentData.resolves(componentData);

      editingServiceStub.fetchDictionaryData
        .withArgs({ siteName: componentLibData.site, language: componentLibData.language })
        .resolves(dictionaryData);

      const result = await sitecoreClient.getDesignLibraryData(componentLibData);

      expect(result).to.deep.include({
        locale: componentLibData.language,
        layout: componentData,
        dictionary: dictionaryData,
      });

      expect(
        editingServiceStub.fetchDictionaryData.calledWithMatch({
          siteName: componentLibData.site,
          language: componentLibData.language,
        })
      ).to.be.true;

      expect(
        restComponentServiceStub.fetchComponentData.calledWith({
          itemId: componentLibData.itemId,
          componentUid: componentLibData.componentUid,
          siteName: componentLibData.site,
          language: componentLibData.language,
          renderingId: componentLibData.renderingId,
          dataSourceId: componentLibData.dataSourceId,
          version: componentLibData.version,
        })
      ).to.be.true;
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
        await modifiedClient.getDesignLibraryData(componentLibData);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.include(
          'Component Library requires Sitecore apiHost and apiKey'
        );
      }
    });

    it('should pass fetchOptions to both editingService and componentService when calling getDesignLibraryData', async () => {
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

      restComponentServiceStub.fetchComponentData.resolves(componentData);
      editingServiceStub.fetchDictionaryData.resolves(dictionaryData);

      await sitecoreClient.getDesignLibraryData(componentLibData, fetchOptions);

      expect(
        editingServiceStub.fetchDictionaryData.calledWith(
          {
            siteName: componentLibData.site,
            language: componentLibData.language,
          },
          fetchOptions
        )
      ).to.be.true;
    });
  });

  describe('getHeadLinks', function() {
    const truthyValue = {
      value: '<div class="test bar"><p class="foo ck-content">bar</p></div>',
    };
    const falsyValue = { value: '<div class="test bar"><p class="foo">ck-content</p></div>' };

    const layoutData = {
      sitecore: {
        context: {},
        route: {
          name: 'route',
          placeholders: {
            car: [
              {
                componentName: 'foo',
                fields: { car: falsyValue },
                placeholders: {
                  bar: [{ componentName: 'cow', fields: { dog: truthyValue } }],
                },
              },
              {
                componentName: 'test',
                fields: {
                  CSSStyles: {
                    value: '-library--foo',
                  },
                  LibraryId: {
                    value: 'bar',
                  },
                },
              },
            ],
          },
        },
      },
    };

    it('should return stylesheets when enableStyles and enableThemes are true', () => {
      const result = sitecoreClient.getHeadLinks(layoutData);

      expect(result).to.deep.equal([
        {
          href:
            'https://edge.example.com/v1/files/pages/styles/content-styles.css?sitecoreContextId=test-context-id',
          rel: 'stylesheet',
        },
        {
          href:
            'https://edge.example.com/v1/files/components/styles/foo.css?sitecoreContextId=test-context-id',
          rel: 'stylesheet',
        },
      ]);
    });

    it('should return only theme stylesheets when enableStyles is false', () => {
      const result = sitecoreClient.getHeadLinks(layoutData, {
        enableStyles: false,
        enableThemes: true,
      });
      expect(result).to.deep.equal([
        {
          href:
            'https://edge.example.com/v1/files/components/styles/foo.css?sitecoreContextId=test-context-id',
          rel: 'stylesheet',
        },
      ]);
    });

    it('should return only content stylesheets when enableThemes is false', () => {
      const result = sitecoreClient.getHeadLinks(layoutData, {
        enableStyles: true,
        enableThemes: false,
      });
      expect(result).to.deep.equal([
        {
          href:
            'https://edge.example.com/v1/files/pages/styles/content-styles.css?sitecoreContextId=test-context-id',
          rel: 'stylesheet',
        },
      ]);
    });

    it('should return an empty array when both enableStyles and enableThemes are false', () => {
      const result = sitecoreClient.getHeadLinks(layoutData, {
        enableStyles: false,
        enableThemes: false,
      });

      expect(result).to.deep.equal([]);
    });
  });

  describe('getSiteMapData', () => {
    it('should fetch and return sitemap', async () => {
      const sitemapId = '1';
      const sitemapPath = '/sitemap-1.xml';
      const xmlContent = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">...</urlset>';

      sitemapXmlServiceStub.getSitemap.withArgs(sitemapId).resolves(sitemapPath);
      const dataFetcherStub = sandbox
        .stub(NativeDataFetcher.prototype, 'fetch')
        .withArgs(`${defaultInitOptions.api.local.apiHost}${sitemapPath}`)
        .resolves({ data: xmlContent, status: 200, statusText: 'OK' });

      const result = await sitecoreClient.getSiteMap(req as IncomingMessage, sitemapId);

      expect(sitemapXmlServiceStub.getSitemap.calledWith(sitemapId)).to.be.true;
      expect(dataFetcherStub.calledWith(`${defaultInitOptions.api.local.apiHost}${sitemapPath}`)).to
        .be.true;
      expect(result).to.equal(xmlContent);
    });

    it('should handle absolute URLs in sitemap path', async () => {
      const sitemapId = '2';
      const absoluteSitemapPath = 'https://cdn.example.com/sitemap-2.xml';
      const xmlContent = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">...</urlset>';

      sitemapXmlServiceStub.getSitemap.withArgs(sitemapId).resolves(absoluteSitemapPath);
      const dataFetcherStub = sandbox
        .stub(NativeDataFetcher.prototype, 'fetch')
        .resolves({ data: xmlContent, status: 200, statusText: 'OK' });

      const result = await sitecoreClient.getSiteMap(req as IncomingMessage, sitemapId);

      const wasCalledWithAbsoluteUrl = dataFetcherStub
        .getCalls()
        .some((call) => call.args[0] === absoluteSitemapPath);

      expect(wasCalledWithAbsoluteUrl).to.be.true;
      expect(result).to.equal(xmlContent);
    });

    it('should throw REDIRECT_404 error when sitemap fetch fails', async () => {
      const sitemapId = '3';
      const sitemapPath = '/sitemap-3.xml';

      sitemapXmlServiceStub.getSitemap.withArgs(sitemapId).resolves(sitemapPath);
      sandbox
        .stub(NativeDataFetcher.prototype, 'fetch')
        .rejects(new Error('Failed to fetch sitemap'));

      try {
        await sitecoreClient.getSiteMap(req as IncomingMessage, sitemapId);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.equal('REDIRECT_404');
      }
    });

    it('should generate sitemap index XML when no id is provided', async () => {
      const sitemaps = ['/sitemap-1.xml', '/sitemap-2.xml'];

      sitemapXmlServiceStub.getSitemap.withArgs(undefined).resolves(null);
      sitemapXmlServiceStub.fetchSitemaps.resolves(sitemaps);

      const result = await sitecoreClient.getSiteMap(req as IncomingMessage);

      expect(sitemapXmlServiceStub.fetchSitemaps.calledOnce).to.be.true;
      expect(result).to.include('<?xml version="1.0" encoding="UTF-8"?>');
      expect(result).to.include('<sitemapindex xmlns="http://sitemaps.org/schemas/sitemap/0.9">');
      expect(result).to.include('<loc>https://example.com/sitemap-1.xml</loc>');
      expect(result).to.include('<loc>https://example.com/sitemap-2.xml</loc>');
    });

    it('should throw REDIRECT_404 error when no sitemaps are found', async () => {
      sitemapXmlServiceStub.getSitemap.withArgs(undefined).resolves(null);
      sitemapXmlServiceStub.fetchSitemaps.resolves([]);

      try {
        await sitecoreClient.getSiteMap(req as IncomingMessage);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.equal('REDIRECT_404');
      }
    });

    it('should use HTTP protocol when specified in x-forwarded-proto header', async () => {
      const httpReq = {
        headers: {
          host: 'example.com',
          'x-forwarded-proto': 'http',
        },
      };

      const sitemaps = ['/sitemap-1.xml'];
      sitemapXmlServiceStub.getSitemap.withArgs(undefined).resolves(null);
      sitemapXmlServiceStub.fetchSitemaps.resolves(sitemaps);

      const result = await sitecoreClient.getSiteMap((httpReq as unknown) as IncomingMessage);

      expect(result).to.include('<loc>http://example.com/sitemap-1.xml</loc>');
    });

    it('should pass fetchOptions to fetchSitemaps method', async () => {
      const sitemaps = ['/sitemap-1.xml'];
      const fetchOptions = {
        headers: { 'Custom-Header': 'test' },
        cache: 'no-store' as RequestCache,
      };

      sitemapXmlServiceStub.getSitemap.withArgs(undefined).resolves(null);
      sitemapXmlServiceStub.fetchSitemaps.resolves(sitemaps);

      await sitecoreClient.getSiteMap(req as IncomingMessage, undefined, fetchOptions);

      expect(sitemapXmlServiceStub.fetchSitemaps.calledWith(fetchOptions)).to.be.true;
    });

    it('should escape special characters in sitemap URLs', async () => {
      const sitemaps = ['/sitemap-1.xml?param1=value&param2=value'];
      sitemapXmlServiceStub.getSitemap.withArgs(undefined).resolves(null);
      sitemapXmlServiceStub.fetchSitemaps.resolves(sitemaps);

      const result = await sitecoreClient.getSiteMap(req as IncomingMessage);

      expect(result).to.include(
        '<loc>https://example.com/sitemap-1.xml?param1=value&amp;param2=value</loc>'
      );
    });
  });
});
