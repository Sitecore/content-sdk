/* eslint-disable dot-notation */
/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { DocumentNode } from 'graphql';
import { DefaultRetryStrategy, NativeDataFetcher } from '@sitecore-content-sdk/core';
import { ErrorPage, SitecoreClient } from './sitecore-client';
import { LayoutKind, DesignLibraryMode } from '../../src/editing';
import { LayoutServiceData } from '../../layout';
import { LayoutServicePageState } from '../layout';
import { layoutData, componentsWithExperiencesArray } from '../test-data/personalizeData';
import { DesignLibraryVariantGeneration } from '../editing/models';

chai.use(sinonChai);

describe('SitecoreClient', () => {
  const sandbox = sinon.createSandbox();
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
    defaultSite: 'default-site',
    defaultLanguage: 'en',
    layout: { formatLayoutQuery: sandbox.stub() },
    dictionary: { caching: { enabled: true, timeout: 60000 } },
    disableCodeGeneration: false,
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
  let restComponentServiceStub = {
    fetchComponentData: sandbox.stub(),
  };

  let sitePathServiceStub = {
    fetchSiteRoutes: sandbox.stub(),
  };

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
    restComponentServiceStub = {
      fetchComponentData: sandbox.stub(),
    };

    sitePathServiceStub = {
      fetchSiteRoutes: sandbox.stub(),
    };

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
    (sitecoreClient as any).componentService = restComponentServiceStub;
    (sitecoreClient as any).sitePathService = sitePathServiceStub;
    (sitecoreClient as any).sitemapXmlService = sitemapXmlServiceStub;
  });

  describe('getData', () => {
    let requestStub: sinon.SinonStub;

    beforeEach(() => {
      // Attach a fake GraphQL client to the instance
      const fakeGraphQLClient = { request: sandbox.stub() };
      (sitecoreClient as any).graphQLClient = fakeGraphQLClient as any;
      requestStub = fakeGraphQLClient.request as sinon.SinonStub;
    });

    it('should forwards query, variables, and fetchOptions to graphQLClient.request and returns the result', async () => {
      const query = 'query ($id: String!) { item(id: $id) { id name } }';
      const variables = { id: '123' };
      const fetchOptions = {
        headers: { 'x-test': 'ok' },
        retries: 0,
      };

      const expected = { item: { id: '123', name: 'Home' } };
      requestStub.resolves(expected);

      const result = await sitecoreClient.getData<typeof expected>(query, variables, fetchOptions);

      expect(result).to.equal(expected);
      sinon.assert.calledOnceWithExactly(requestStub, query, variables, fetchOptions);
    });

    it('should accept a DocumentNode as the query', async () => {
      const doc = { kind: 'Document' } as unknown as DocumentNode;

      const expected = { ok: true };
      requestStub.resolves(expected);

      const result = await sitecoreClient.getData<typeof expected>(doc);

      expect(result).to.equal(expected);
      sinon.assert.calledOnceWithExactly(requestStub, doc, undefined, undefined);
    });

    it('should work when variables and fetchOptions are omitted', async () => {
      const query = 'query { ping }';
      const expected = { ping: 'pong' };
      requestStub.resolves(expected);

      const result = await sitecoreClient.getData<typeof expected>(query);

      expect(result).to.equal(expected);
      sinon.assert.calledOnceWithExactly(requestStub, query, undefined, undefined);
    });

    it('should allow per-call fetchOptions overrides (e.g., headers, retries, fetch impl)', async () => {
      const query = 'query { me { id } }';
      const customFetch = sinon.stub() as unknown as typeof fetch;
      const fetchOptions = {
        headers: { Authorization: 'Bearer test' },
        retries: 2,
        fetch: customFetch,
      };
      const expected = { me: { id: 'u1' } };
      requestStub.resolves(expected);

      await sitecoreClient.getData(query, undefined, fetchOptions);

      sinon.assert.calledOnce(requestStub);
      const [, , passedOptions] = requestStub.firstCall.args;
      expect(passedOptions).to.include({
        retries: 2,
        fetch: customFetch,
      });
      expect(passedOptions?.headers).to.deep.equal({ Authorization: 'Bearer test' });
    });

    it('should propagate errors from graphQLClient.request', async () => {
      const query = 'query { broken }';
      const boom = new Error('Boom');
      requestStub.rejects(boom);

      try {
        await sitecoreClient.getData(query);
        expect.fail('Expected getData to throw');
      } catch (err: any) {
        expect(err).to.equal(boom);
      }
    });
  });

  describe('Extensibility', () => {
    it('should use custom layoutService when provided', async () => {
      const customLayoutService = {
        fetchLayoutData: sandbox.stub().resolves({
          sitecore: {
            route: { name: 'custom-home', placeholders: {} },
            context: { site: { name: 'custom-site' } },
          },
        }),
      };

      const customClient = new SitecoreClient({
        ...defaultInitOptions,
        custom: {
          layoutService: customLayoutService,
        },
      });

      const result = await customClient.getPage('/custom-path');

      expect(result?.layout.sitecore.route?.name).to.equal('custom-home');
      expect(customLayoutService.fetchLayoutData.calledOnce).to.be.true;
    });

    it('should use custom dictionaryService when provided', async () => {
      const customDictionaryService = {
        fetchDictionaryData: sandbox.stub().resolves({ key: 'custom-value' }),
      };

      const customClient = new SitecoreClient({
        ...defaultInitOptions,
        custom: {
          dictionaryService: customDictionaryService,
        },
      });

      const result = await customClient.getDictionary();

      expect(result).to.deep.equal({ key: 'custom-value' });
      expect(customDictionaryService.fetchDictionaryData.calledOnce).to.be.true;
    });

    it('should use custom editingService when provided', async () => {
      const customEditingService = {
        fetchEditingData: sandbox.stub().resolves({
          layoutData: {
            sitecore: {
              route: { name: 'custom-edit', placeholders: {} },
              context: { site: { name: 'custom-site' } },
            },
          },
        }),
      };

      const customClient = new SitecoreClient({
        ...defaultInitOptions,
        custom: {
          editingService: customEditingService,
        },
      });

      const previewData = {
        site: 'custom-site',
        itemId: 'custom-item-id',
        mode: LayoutServicePageState.Edit,
        language: 'en',
        version: '1',
        layoutKind: LayoutKind.Final,
        variantIds: 'variant1,comp_variant2',
      };

      const result = await customClient.getPreview(previewData);

      expect(result?.layout.sitecore.route?.name).to.equal('custom-edit');
      expect(customEditingService.fetchEditingData.calledOnce).to.be.true;
    });

    it('should use custom errorPagesService when provided', async () => {
      const customErrorPagesService = {
        fetchErrorPages: sandbox.stub().resolves({
          notFoundPagePath: '/custom-not-found',
          serverErrorPagePath: '/custom-server-error',
        }),
      };

      const customClient = new SitecoreClient({
        ...defaultInitOptions,
        custom: {
          errorPagesService: customErrorPagesService,
        },
      });

      const result = await customClient.getErrorPages({ site: 'custom-site', locale: 'en' });

      expect(result?.notFoundPagePath).to.equal('/custom-not-found');
      expect(customErrorPagesService.fetchErrorPages.calledOnce).to.be.true;
    });

    it('should use custom sitePathService when provided', async () => {
      const customSitePathService = {
        fetchSiteRoutes: sandbox
          .stub()
          .resolves([{ params: { path: ['custom-home'] }, locale: 'en' }]),
      };

      const customClient = new SitecoreClient({
        ...defaultInitOptions,
        custom: {
          sitePathService: customSitePathService,
        },
      });

      const result = await customClient.getPagePaths(['en']);

      expect(result).to.deep.equal([{ params: { path: ['custom-home'] }, locale: 'en' }]);
      expect(customSitePathService.fetchSiteRoutes.calledOnce).to.be.true;
    });
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
          context: { site: siteInfo, pageState: LayoutServicePageState.Normal },
        },
      };
      layoutServiceStub.fetchLayoutData.returns(layoutData);

      const result = await sitecoreClient.getPage(path, { locale });

      expect(result).to.deep.include({
        layout: layoutData,
        siteName: siteInfo.name,
        locale: locale,
        mode: {
          name: LayoutServicePageState.Normal,
          isNormal: true,
          isPreview: false,
          isEditing: false,
          isDesignLibrary: false,
          designLibrary: {
            isVariantGeneration: false,
          },
        },
      });
      expect(
        layoutServiceStub.fetchLayoutData.calledWithMatch(path, {
          locale,
          site: siteInfo.name,
        })
      ).to.be.true;
    });

    it('should return page data when site is not resolved', async () => {
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
      layoutServiceStub.fetchLayoutData.returns(layoutData);

      const result = await sitecoreClient.getPage(path, { locale });

      expect(result).to.deep.include({
        layout: layoutData,
        siteName: siteInfo.name,
        locale: locale,
        mode: {
          name: LayoutServicePageState.Normal,
          isNormal: true,
          isPreview: false,
          isEditing: false,
          isDesignLibrary: false,
          designLibrary: {
            isVariantGeneration: false,
          },
        },
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

      layoutServiceStub.fetchLayoutData.returns(testLayoutData);

      const result = await sitecoreClient.getPage(path, {
        locale,
        personalize: { variantId: 'variant1', componentVariantIds: ['mountain_bike_audience'] },
      });

      expect(result?.layout.sitecore.route?.placeholders).to.deep.equal({
        'content-sdk-main': [...componentsWithExperiencesArray],
      });
    });

    it('should apply content rewrite when rewriteMediaUrls is a function', async () => {
      const path = '/test/path';
      const locale = 'en-US';
      const siteInfo = { name: 'default-site', hostName: 'example.com', language: 'en' };
      const rawLayout = {
        sitecore: {
          route: { name: 'home', placeholders: {} },
          context: { site: siteInfo, pageState: LayoutServicePageState.Normal },
        },
      };
      layoutServiceStub.fetchLayoutData.returns(rawLayout);
      const stringTransformer = (value: string) =>
        value === 'home' ? 'rewritten' : value;
      const clientWithRewrite = new SitecoreClient({
        ...defaultInitOptions,
        rewriteMediaUrls: stringTransformer,
      } as any);
      (clientWithRewrite as any).layoutService = layoutServiceStub;

      const result = await clientWithRewrite.getPage(path, { locale });

      expect(result?.layout.sitecore.route?.name).to.equal('rewritten');
    });

    it('should apply default Edge host rewrite when rewriteMediaUrls is true and custom hostname is set', async () => {
      const path = '/test/path';
      const locale = 'en-US';
      const siteInfo = { name: 'default-site', hostName: 'example.com', language: 'en' };
      const rawLayout = {
        sitecore: {
          route: {
            name: 'home',
            placeholders: {},
            fields: {
              image: { value: { src: 'https://edge-platform.sitecorecloud.io/-/media/hero.jpg' } },
            },
          },
          context: { site: siteInfo, pageState: LayoutServicePageState.Normal },
        },
      };
      layoutServiceStub.fetchLayoutData.returns(rawLayout);
      const clientWithRewrite = new SitecoreClient({
        ...defaultInitOptions,
        api: {
          ...defaultInitOptions.api,
          edge: {
            ...defaultInitOptions.api.edge,
            edgeUrl: 'https://custom.example.com',
          },
        },
        rewriteMediaUrls: true,
      } as any);
        (clientWithRewrite as any).layoutService = layoutServiceStub;

      const result = await clientWithRewrite.getPage(path, { locale });

      expect(
        (result?.layout.sitecore.route?.fields?.image?.value as { src: string }).src
      ).to.equal('https://custom.example.com/-/media/hero.jpg');
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

  describe('getErrorPage', () => {
    it('should fetch error page with default site and language', async () => {
      const errorPage = {
        notFoundPage: { rendered: { sitecore: { route: { name: 'home' } } } },
      };

      errorPagesServiceStub.fetchErrorPages.resolves(errorPage);

      const result = await sitecoreClient.getErrorPage(ErrorPage.NotFound);

      expect(result).to.deep.equal({
        layout: errorPage.notFoundPage?.rendered,
        locale: defaultInitOptions.defaultLanguage,
        siteName: defaultInitOptions.defaultSite,
        mode: {
          name: LayoutServicePageState.Normal,
          isNormal: true,
          isPreview: false,
          isEditing: false,
          isDesignLibrary: false,
          designLibrary: {
            isVariantGeneration: false,
          },
        },
      });

      expect(
        errorPagesServiceStub.fetchErrorPages.calledWith(
          defaultInitOptions.defaultSite,
          defaultInitOptions.defaultLanguage
        )
      ).to.be.true;
      expect(errorPagesServiceStub.fetchErrorPages.calledOnce).to.be.true;
    });

    it('should return null when unknown error page is requested', async () => {
      const result = await sitecoreClient.getErrorPage('unknown' as ErrorPage, {
        site: 'test-site',
        locale: 'fr-FR',
      });
      expect(result).to.be.null;
    });

    describe('404 page', () => {
      it('should return not found page', async () => {
        const site = 'test-site';
        const locale = 'fr-FR';
        const errorPage = {
          notFoundPage: { rendered: { sitecore: { route: { name: 'home' } } } },
        };

        errorPagesServiceStub.fetchErrorPages.resolves(errorPage);

        const result = await sitecoreClient.getErrorPage(ErrorPage.NotFound, { site, locale });

        expect(result).to.deep.equal({
          layout: errorPage.notFoundPage?.rendered,
          locale,
          siteName: site,
          mode: {
            name: LayoutServicePageState.Normal,
            isNormal: true,
            isPreview: false,
            isEditing: false,
            isDesignLibrary: false,
            designLibrary: {
              isVariantGeneration: false,
            },
          },
        });
      });

      it('should return null when not found page is not found', async () => {
        const site = 'test-site';
        const locale = 'fr-FR';
        const errorPage = {
          notFoundPage: null,
        };

        errorPagesServiceStub.fetchErrorPages.resolves(errorPage);

        const result = await sitecoreClient.getErrorPage(ErrorPage.NotFound, { site, locale });

        expect(result).to.be.null;
      });
    });

    describe('500 page', () => {
      it('should return server error page', async () => {
        const site = 'test-site';
        const locale = 'fr-FR';
        const errorPage = {
          serverErrorPage: { rendered: { sitecore: { route: { name: 'home' } } } },
        };

        errorPagesServiceStub.fetchErrorPages.resolves(errorPage);

        const result = await sitecoreClient.getErrorPage(ErrorPage.InternalServerError, {
          site,
          locale,
        });

        expect(result).to.deep.equal({
          layout: errorPage.serverErrorPage?.rendered,
          locale,
          siteName: site,
          mode: {
            name: LayoutServicePageState.Normal,
            isNormal: true,
            isPreview: false,
            isEditing: false,
            isDesignLibrary: false,
            designLibrary: {
              isVariantGeneration: false,
            },
          },
        });
      });

      it('should return null when server error page is not found', async () => {
        const site = 'test-site';
        const locale = 'fr-FR';
        const errorPage = {
          serverErrorPage: null,
        };

        errorPagesServiceStub.fetchErrorPages.resolves(errorPage);

        const result = await sitecoreClient.getErrorPage(ErrorPage.InternalServerError, {
          site,
          locale,
        });

        expect(result).to.be.null;
      });
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
      const sites = ['default-site', 'other-site'];
      const languages = ['en', 'fr'];
      const expectedPaths = [
        { params: { path: ['home'] }, locale: 'en' },
        { params: { path: ['accueil'] }, locale: 'fr' },
      ];
      sitePathServiceStub.fetchSiteRoutes.resolves([]);
      sitePathServiceStub.fetchSiteRoutes.withArgs(sites, languages).resolves(expectedPaths);

      const result = await sitecoreClient.getPagePaths(sites, languages);

      expect(result).to.deep.equal(expectedPaths);
    });
  });

  describe('getPreview', () => {
    it('should fetch and return preview data correctly in edit mode', async () => {
      const previewData = {
        site: 'default-site',
        itemId: 'test-item-id',
        mode: LayoutServicePageState.Edit,
        language: 'en',
        version: '1',
        variantIds: 'variant1,comp_variant2',
        layoutKind: LayoutKind.Final,
      };

      const editingData = {
        layoutData: {
          sitecore: {
            route: { name: 'home', placeholders: {} },
            context: { site: { name: 'default-site' } },
          },
        },
      };

      editingServiceStub.fetchEditingData.resolves(editingData);

      const result = await sitecoreClient.getPreview(previewData);

      expect(result).to.deep.include({
        locale: previewData.language,
        layout: editingData.layoutData,
        mode: {
          name: LayoutServicePageState.Edit,
          isEditing: true,
          isNormal: false,
          isPreview: false,
          isDesignLibrary: false,
          designLibrary: {
            isVariantGeneration: false,
          },
        },
      });

      expect(editingServiceStub.fetchEditingData.calledOnce).to.be.true;
      expect(
        editingServiceStub.fetchEditingData.calledWith({
          itemId: previewData.itemId,
          language: previewData.language,
          version: previewData.version,
          layoutKind: previewData.layoutKind,
          mode: previewData.mode,
        })
      ).to.be.true;
    });

    it('should fetch and return preview data correctly in preview mode', async () => {
      const previewData = {
        site: 'default-site',
        itemId: 'test-item-id',
        mode: LayoutServicePageState.Preview,
        language: 'en',
        version: '1',
        variantIds: 'variant1,comp_variant2',
        layoutKind: LayoutKind.Final,
      };

      const editingData = {
        layoutData: {
          sitecore: {
            route: { name: 'home', placeholders: {} },
            context: { site: { name: 'default-site' } },
          },
        },
      };

      editingServiceStub.fetchEditingData.resolves(editingData);

      const result = await sitecoreClient.getPreview(previewData);

      expect(result).to.deep.include({
        locale: previewData.language,
        layout: editingData.layoutData,
        mode: {
          name: LayoutServicePageState.Preview,
          isNormal: false,
          isPreview: true,
          isEditing: false,
          isDesignLibrary: false,
          designLibrary: {
            isVariantGeneration: false,
          },
        },
      });

      expect(editingServiceStub.fetchEditingData.calledOnce).to.be.true;
      expect(
        editingServiceStub.fetchEditingData.calledWith({
          itemId: previewData.itemId,
          language: previewData.language,
          version: previewData.version,
          layoutKind: previewData.layoutKind,
          mode: previewData.mode,
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
        variantIds: [variant, ...componentVariantIds].join(','),
        layoutKind: LayoutKind.Final,
      };

      const editingData = {
        layoutData: testLayoutData,
      };

      editingServiceStub.fetchEditingData.resolves(editingData);

      const result = await sitecoreClient.getPreview(previewData);

      expect(result?.layout.sitecore.route?.placeholders).to.deep.equal({
        'content-sdk-main': [...componentsWithExperiencesArray],
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
        mode: LayoutServicePageState.Edit,
        language: 'en',
        version: '1',
        variantIds: '',
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
        mode: LayoutServicePageState.Edit,
        language: 'en',
        version: '1',
        variantIds: '',
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
      };

      editingServiceStub.fetchEditingData
        .withArgs({
          itemId: previewData.itemId,
          language: previewData.language,
          version: previewData.version,
          layoutKind: previewData.layoutKind,
          mode: previewData.mode,
        })
        .resolves(editingData);

      await sitecoreClient.getPreview(previewData, fetchOptions);

      expect(
        editingServiceStub.fetchEditingData.calledWith(
          {
            itemId: previewData.itemId,
            language: previewData.language,
            version: previewData.version,
            layoutKind: previewData.layoutKind,
            mode: previewData.mode,
          },
          fetchOptions
        )
      ).to.be.true;
    });
  });

  describe('getDesignLibraryData', () => {
    it('should fetch component library data in Normal mode', async () => {
      const componentLibData = {
        itemId: 'item-id',
        componentUid: 'comp-uid',
        site: 'test-site',
        language: 'en',
        renderingId: 'rendering-id',
        dataSourceId: 'datasource-id',
        version: '1',
        pageState: LayoutServicePageState.Normal,
        mode: DesignLibraryMode.Normal,
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

      restComponentServiceStub.fetchComponentData.resolves(componentData);

      const result = await sitecoreClient.getDesignLibraryData(componentLibData);

      expect(result).to.deep.include({
        locale: componentLibData.language,
        layout: componentData,
        siteName: componentData.sitecore.context.site?.name,
        mode: {
          name: DesignLibraryMode.Normal,
          isDesignLibrary: true,
          isNormal: false,
          isPreview: false,
          isEditing: false,
          designLibrary: {
            isVariantGeneration: false,
          },
        },
      });

      expect(
        restComponentServiceStub.fetchComponentData.calledWith({
          itemId: componentLibData.itemId,
          componentUid: componentLibData.componentUid,
          siteName: componentLibData.site,
          language: componentLibData.language,
          renderingId: componentLibData.renderingId,
          dataSourceId: componentLibData.dataSourceId,
          version: componentLibData.version,
          mode: componentLibData.mode,
        })
      ).to.be.true;
    });

    it('should fetch component library data in VariantGeneration mode', async () => {
      const componentLibData = {
        itemId: 'item-id',
        componentUid: 'comp-uid',
        site: 'test-site',
        language: 'en',
        renderingId: 'rendering-id',
        dataSourceId: 'datasource-id',
        version: '1',
        pageState: LayoutServicePageState.Normal,
        mode: DesignLibraryMode.Normal,
        generation: DesignLibraryVariantGeneration.Variant,
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

      restComponentServiceStub.fetchComponentData.resolves(componentData);

      const result = await sitecoreClient.getDesignLibraryData(componentLibData);

      expect(result).to.deep.include({
        locale: componentLibData.language,
        layout: componentData,
        siteName: componentData.sitecore.context.site?.name,
        mode: {
          name: DesignLibraryMode.Normal,
          isDesignLibrary: true,
          isNormal: false,
          isPreview: false,
          isEditing: true,
          designLibrary: {
            isVariantGeneration: true,
          },
        },
      });

      expect(
        restComponentServiceStub.fetchComponentData.calledWith({
          itemId: componentLibData.itemId,
          componentUid: componentLibData.componentUid,
          siteName: componentLibData.site,
          language: componentLibData.language,
          renderingId: componentLibData.renderingId,
          dataSourceId: componentLibData.dataSourceId,
          version: componentLibData.version,
          mode: componentLibData.mode,
          generation: componentLibData.generation,
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

    it('should pass fetchOptions to componentService when calling getDesignLibraryData', async () => {
      const componentLibData = {
        itemId: 'item-id',
        componentUid: 'comp-uid',
        site: 'test-site',
        language: 'en',
        renderingId: 'rendering-id',
        dataSourceId: 'datasource-id',
        version: '1',
        mode: DesignLibraryMode.Normal,
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

      restComponentServiceStub.fetchComponentData.resolves(componentData);

      await sitecoreClient.getDesignLibraryData(componentLibData, fetchOptions);

      expect(
        restComponentServiceStub.fetchComponentData.calledWith(
          {
            siteName: componentLibData.site,
            itemId: componentLibData.itemId,
            language: componentLibData.language,
            componentUid: componentLibData.componentUid,
            renderingId: componentLibData.renderingId,
            dataSourceId: componentLibData.dataSourceId,
            version: componentLibData.version,
            mode: componentLibData.mode,
          },
          fetchOptions
        )
      ).to.be.true;
    });
  });

  describe('getPageMode', () => {
    it('should return the correct page mode for a given mode name', () => {
      expect(sitecoreClient['getPageMode'](LayoutServicePageState.Normal)).to.deep.equal({
        name: LayoutServicePageState.Normal,
        isNormal: true,
        isPreview: false,
        isEditing: false,
        isDesignLibrary: false,
        designLibrary: {
          isVariantGeneration: false,
        },
      });

      expect(sitecoreClient['getPageMode'](LayoutServicePageState.Preview)).to.deep.equal({
        name: LayoutServicePageState.Preview,
        isNormal: false,
        isPreview: true,
        isEditing: false,
        isDesignLibrary: false,
        designLibrary: {
          isVariantGeneration: false,
        },
      });

      expect(sitecoreClient['getPageMode'](LayoutServicePageState.Edit)).to.deep.equal({
        name: LayoutServicePageState.Edit,
        isNormal: false,
        isPreview: false,
        isEditing: true,
        isDesignLibrary: false,
        designLibrary: {
          isVariantGeneration: false,
        },
      });

      expect(sitecoreClient['getPageMode'](DesignLibraryMode.Normal)).to.deep.equal({
        name: DesignLibraryMode.Normal,
        isNormal: false,
        isPreview: false,
        isEditing: false,
        isDesignLibrary: true,
        designLibrary: {
          isVariantGeneration: false,
        },
      });

      expect(sitecoreClient['getPageMode'](DesignLibraryMode.Metadata)).to.deep.equal({
        name: DesignLibraryMode.Metadata,
        designLibrary: {
          isVariantGeneration: false,
        },
        isNormal: false,
        isPreview: false,
        isEditing: true,
        isDesignLibrary: true,
      });

      expect(sitecoreClient['getPageMode'](DesignLibraryMode.Normal)).to.deep.equal({
        name: DesignLibraryMode.Normal,
        designLibrary: {
          isVariantGeneration: false,
        },
        isNormal: false,
        isPreview: false,
        isEditing: false,
        isDesignLibrary: true,
      });

      expect(sitecoreClient['getPageMode']('invalid-mode' as any)).to.deep.equal({
        name: 'invalid-mode',
        isNormal: false,
        isPreview: false,
        isEditing: false,
        isDesignLibrary: false,
        designLibrary: {
          isVariantGeneration: false,
        },
      });
    });
  });

  describe('getHeadLinks', function () {
    const SITECORE_EDGE_URL_ENV = 'SITECORE_EDGE_URL';

    beforeEach(() => {
      process.env[SITECORE_EDGE_URL_ENV] = 'https://edge.example.com';
    });
    afterEach(() => {
      delete process.env[SITECORE_EDGE_URL_ENV];
    });

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
          href: 'https://edge.example.com/v1/files/pages/styles/content-styles.css?sitecoreContextId=test-context-id',
          rel: 'stylesheet',
        },
        {
          href: 'https://edge.example.com/v1/files/components/styles/foo.css?sitecoreContextId=test-context-id',
          rel: 'stylesheet',
        },
      ]);
    });

    it('should return stylesheets using clientContextId when server contextId is not set', () => {
      const sitecoreClient = new SitecoreClient({
        ...defaultInitOptions,
        api: {
          ...defaultInitOptions.api,
          edge: {
            ...defaultInitOptions.api.edge,
            contextId: undefined as any,
          },
        },
      });

      const result = sitecoreClient.getHeadLinks(layoutData);

      expect(result).to.deep.equal([
        {
          href: 'https://edge.example.com/v1/files/pages/styles/content-styles.css?sitecoreContextId=client-context-id',
          rel: 'stylesheet',
        },
        {
          href: 'https://edge.example.com/v1/files/components/styles/foo.css?sitecoreContextId=client-context-id',
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
          href: 'https://edge.example.com/v1/files/components/styles/foo.css?sitecoreContextId=test-context-id',
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
          href: 'https://edge.example.com/v1/files/pages/styles/content-styles.css?sitecoreContextId=test-context-id',
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

  describe('getSiteMap', () => {
    const defaultReqConfig = {
      reqHost: 'example.com',
      reqProtocol: 'https',
      id: undefined,
      siteName: 'test-site',
    };

    let getGraphqlSitemapXMLServiceStub: sinon.SinonStub;

    beforeEach(() => {
      getGraphqlSitemapXMLServiceStub = sandbox
        .stub(SitecoreClient.prototype, 'getGraphqlSitemapXMLService')
        .returns(sitemapXmlServiceStub);
    });

    it('should fetch and return sitemap content when specific sitemap exists', async () => {
      const absoluteSitemapPath = 'https://cdn.example.com/sitemap.xml';
      const xmlContent = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">...</urlset>';

      sitemapXmlServiceStub.getSitemap.resolves(absoluteSitemapPath);
      const dataFetcherStub = sandbox
        .stub(NativeDataFetcher.prototype, 'fetch')
        .resolves({ data: xmlContent, status: 200, statusText: 'OK' });

      const result = await sitecoreClient.getSiteMap({ ...defaultReqConfig });

      expect(getGraphqlSitemapXMLServiceStub.calledWith(defaultReqConfig.siteName)).to.be.true;
      expect(dataFetcherStub.calledWith(absoluteSitemapPath)).to.be.true;
      expect(result).to.equal(xmlContent);
    });

    it('should rewrite Edge hostnames in sitemap path and XML when custom hostname is configured', async () => {
      const clientWithCustomEdge = new SitecoreClient({
        ...defaultInitOptions,
        api: {
          ...defaultInitOptions.api,
          edge: {
            ...defaultInitOptions.api.edge,
            edgeUrl: 'https://custom.example.com',
          },
        },
      } as any);

      const edgeSitemapPath = 'https://edge-platform.sitecorecloud.io/sitemap.xml';
      const xmlContent =
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://edge-platform.sitecorecloud.io/a</loc></url></urlset>';

      sitemapXmlServiceStub.getSitemap.resolves(edgeSitemapPath);
      const dataFetcherStub = sandbox
        .stub(NativeDataFetcher.prototype, 'fetch')
        .resolves({ data: xmlContent, status: 200, statusText: 'OK' });

      const result = await clientWithCustomEdge.getSiteMap({ ...defaultReqConfig });

      expect(getGraphqlSitemapXMLServiceStub.calledWith(defaultReqConfig.siteName)).to.be.true;
      expect(dataFetcherStub.calledWith('https://custom.example.com/sitemap.xml')).to.be.true;
      expect(result).to.include('https://custom.example.com/a');
    });

    it('should fetch specific sitemap when ID is provided', async () => {
      const sitemapId = '1';
      const absoluteSitemapPath = 'https://cdn.example.com/sitemap-1.xml';
      const xmlContent = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">...</urlset>';

      sitemapXmlServiceStub.getSitemap.withArgs(sitemapId).resolves(absoluteSitemapPath);
      const dataFetcherStub = sandbox
        .stub(NativeDataFetcher.prototype, 'fetch')
        .resolves({ data: xmlContent, status: 200, statusText: 'OK' });

      const result = await sitecoreClient.getSiteMap({ ...defaultReqConfig, id: sitemapId });

      expect(sitemapXmlServiceStub.getSitemap.calledWith(sitemapId)).to.be.true;
      expect(dataFetcherStub.calledWith(absoluteSitemapPath)).to.be.true;
      expect(result).to.equal(xmlContent);
    });

    it('should generate sitemap index XML when no specific sitemap is found', async () => {
      const absoluteSitemapPaths = [
        'https://cdn.example.com/sitemap-0.xml',
        'https://cdn.example.com/sitemap-1.xml',
      ];

      sitemapXmlServiceStub.getSitemap.resolves(undefined);
      sitemapXmlServiceStub.fetchSitemaps.resolves(absoluteSitemapPaths);

      const result = await sitecoreClient.getSiteMap({ ...defaultReqConfig });

      expect(sitemapXmlServiceStub.fetchSitemaps.called).to.be.true;
      expect(result).to.include('<?xml version="1.0" encoding="UTF-8"?>');
      expect(result).to.include('<sitemapindex xmlns="http://sitemaps.org/schemas/sitemap/0.9">');

      absoluteSitemapPaths.forEach((path) => {
        const fileName = path.split('/').pop();
        expect(result).to.include(`<loc>https://example.com/${fileName}</loc>`);
      });
    });

    it('should throw REDIRECT_404 error when sitemap fetch fails', async () => {
      const sitemapId = '3';
      const absoluteSitemapPaths = ['https://cdn.example.com/sitemap-1.xml'];

      sitemapXmlServiceStub.getSitemap.withArgs(sitemapId).resolves(absoluteSitemapPaths);
      sandbox
        .stub(NativeDataFetcher.prototype, 'fetch')
        .rejects(new Error('Failed to fetch sitemap'));

      try {
        await sitecoreClient.getSiteMap({ ...defaultReqConfig, id: sitemapId });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(getGraphqlSitemapXMLServiceStub.calledWith('test-site')).to.be.true;
        expect((error as Error).message).to.equal('REDIRECT_404');
      }
    });

    it('should throw REDIRECT_404 error when no sitemaps are found', async () => {
      sitemapXmlServiceStub.getSitemap.withArgs(undefined).resolves(null);
      sitemapXmlServiceStub.fetchSitemaps.resolves([]);

      try {
        await sitecoreClient.getSiteMap({ ...defaultReqConfig });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(getGraphqlSitemapXMLServiceStub.calledWith('test-site')).to.be.true;
        expect((error as Error).message).to.equal('REDIRECT_404');
      }
    });

    it('should use specified protocol in generated sitemap index', async () => {
      const absoluteSitemapPaths = ['https://cdn.example.com/sitemap-1.xml'];
      sitemapXmlServiceStub.getSitemap.resolves(undefined);
      sitemapXmlServiceStub.fetchSitemaps.resolves(absoluteSitemapPaths);

      const result = await sitecoreClient.getSiteMap({
        ...defaultReqConfig,
        reqProtocol: 'http',
      });

      expect(result).to.include('<loc>http://example.com/sitemap-1.xml</loc>');
    });

    it('should pass fetchOptions to fetchSitemaps method', async () => {
      const absoluteSitemapPaths = ['https://cdn.example.com/sitemap-1.xml'];
      const fetchOptions = {
        headers: { 'Custom-Header': 'test' },
        cache: 'no-store' as RequestCache,
      };

      sitemapXmlServiceStub.getSitemap.withArgs(undefined).resolves(null);
      sitemapXmlServiceStub.fetchSitemaps.resolves(absoluteSitemapPaths);

      await sitecoreClient.getSiteMap(defaultReqConfig, fetchOptions);

      expect(getGraphqlSitemapXMLServiceStub.calledWith('test-site')).to.be.true;
      expect(sitemapXmlServiceStub.fetchSitemaps.calledWith(fetchOptions)).to.be.true;
    });

    it('should properly escape special characters in sitemap URLs', async () => {
      const absoluteSitemapPath = 'https://cdn.example.com/sitemap.xml?param=value&other=value';
      sitemapXmlServiceStub.getSitemap.resolves(undefined);
      sitemapXmlServiceStub.fetchSitemaps.resolves([absoluteSitemapPath]);

      const result = await sitecoreClient.getSiteMap(defaultReqConfig);

      expect(result).to.include(
        '<loc>https://example.com/sitemap.xml?param=value&amp;other=value</loc>'
      );
    });
  });

  describe('getRobots', () => {
    const siteName = 'test-site';
    let getRobotsServiceStub: sinon.SinonStub;
    const mockRobotsService = {
      fetchRobots: sandbox.stub(),
    };

    beforeEach(() => {
      getRobotsServiceStub = sandbox
        .stub(SitecoreClient.prototype, 'getRobotsService')
        .returns(mockRobotsService as any);
    });

    it('should return robots.txt content if available', async () => {
      const content = 'User-agent: *\nDisallow: /';
      mockRobotsService.fetchRobots.resolves(content);

      const result = await sitecoreClient.getRobots(siteName);

      expect(getRobotsServiceStub.calledWith(siteName)).to.be.true;
      expect(result).to.equal(content);
    });

    it('should return null if fetchRobots returns null or empty', async () => {
      mockRobotsService.fetchRobots.resolves(null);

      const result = await sitecoreClient.getRobots(siteName);

      expect(getRobotsServiceStub.calledWith(siteName)).to.be.true;
      expect(result).to.be.null;
    });

    it('should propagate errors from fetchRobots', async () => {
      const error = new Error('Network error');
      mockRobotsService.fetchRobots.rejects(error);

      try {
        await sitecoreClient.getRobots(siteName);
        expect.fail('Expected error to be thrown');
      } catch (err) {
        expect(getRobotsServiceStub.calledWith(siteName)).to.be.true;
        expect(err).to.equal(error);
      }
    });

    it('should pass fetchOptions to fetchRobots', async () => {
      const fetchOptions = {
        headers: { 'X-Test': 'true' },
        cache: 'no-store' as RequestCache,
      };

      mockRobotsService.fetchRobots.resolves('User-agent: *\nDisallow: /');

      await sitecoreClient.getRobots(siteName, fetchOptions);

      expect(mockRobotsService.fetchRobots.calledWith(fetchOptions)).to.be.true;
    });
  });
});
