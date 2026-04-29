/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { SitecoreNextjsClient } from './sitecore-nextjs-client';
import { DefaultRetryStrategy } from '@sitecore-content-sdk/core';
import { SitecoreClient } from '@sitecore-content-sdk/content/client';
import * as siteTools from '@sitecore-content-sdk/content/site';
import { SITE_PREFIX } from '@sitecore-content-sdk/content/site';
import { GetServerSidePropsContext } from 'next';
import { layoutData, componentsWithExperiencesArray } from '../test-data/personalizeData';
import { VARIANT_PREFIX } from '@sitecore-content-sdk/content/personalize';

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
  let restComponentServiceStub = {
    fetchComponentData: sandbox.stub(),
  };
  let sitePathServiceStub = {
    fetchSiteRoutes: sandbox.stub(),
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
    restComponentServiceStub = {
      fetchComponentData: sandbox.stub(),
    };
    sitePathServiceStub = {
      fetchSiteRoutes: sandbox.stub(),
    };

    sitecoreClient = new SitecoreNextjsClient(defaultInitOptions);

    (sitecoreClient as any).layoutService = layoutServiceStub;
    (sitecoreClient as any).dictionaryService = dictionaryServiceStub;
    (sitecoreClient as any).errorPagesService = errorPagesServiceStub;
    (sitecoreClient as any).editingService = editingServiceStub;
    (sitecoreClient as any).componentService = restComponentServiceStub;
    (sitecoreClient as any).sitePathService = sitePathServiceStub;
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
      layoutServiceStub.fetchLayoutData.returns(testLayoutData);
      sandbox.stub(sitecoreClient, 'getHeadLinks').returns([]);

      const result = await sitecoreClient.getPage(path, { locale });

      expect(result?.layout.sitecore.route?.placeholders).to.deep.equal({
        'content-sdk-main': [...componentsWithExperiencesArray],
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
      layoutServiceStub.fetchLayoutData.returns(testLayoutData);
      sandbox.stub(sitecoreClient, 'getHeadLinks').returns([]);

      const result = await sitecoreClient.getPage(path, {
        locale,
        personalize: { variantId: 'variant2', componentVariantIds: ['mountain_bike_audience'] },
      });

      expect(result?.layout.sitecore.route?.placeholders).to.deep.equal({
        'content-sdk-main': [...componentsWithExperiencesArray],
      });
    });

    it('should pass site from path to base getPage method', async () => {
      const path = `${SITE_PREFIX}mysite/test/path`;
      const locale = 'en-US';
      const testLayoutData = structuredClone(layoutData);

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

  describe('getSiteNameFromPath', () => {
    it('should get site name correctly with string path', () => {
      const path = '/some/path';
      const siteInfo = { name: 'default-site', hostName: '*', language: 'en' };
      sandbox.stub(siteTools, 'getSiteRewriteData').returns({ siteName: 'default-site' });

      const result = sitecoreClient.getSiteNameFromPath(path);

      expect(result).to.equal(siteInfo.name);
    });

    it('should get site name correctly with array path', () => {
      const path = [`${SITE_PREFIX}other-site`, '/some', 'path'];
      const siteInfo = { name: 'other-site', hostName: '*', language: 'en' };

      const result = sitecoreClient.getSiteNameFromPath(path);

      expect(result).to.equal(siteInfo.name);
    });

    it('should get default site name when site not found', () => {
      const path = ['wrong-path-yet-anoother-site', '/some', 'path'];

      const result = sitecoreClient.getSiteNameFromPath(path);

      expect(result).to.equal('default-site');
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
    it('should return componentData when component has getComponentsProps method', async () => {
      const context = {
        params: { path: ['test', 'path'] },
        query: {},
        req: {},
        res: {},
        resolvedUrl: '/test/path',
      } as unknown as GetServerSidePropsContext;
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
        getComponentServerProps: sandbox.stub().resolves({ props: { data: 'test-data' } }),
      };

      const componentMap = new Map([['TestComponent', mockComponent]]);

      const result = await sitecoreClient.getComponentData(layoutData, context, componentMap);

      expect(result).to.deep.equal({
        'test-uid': { props: { data: 'test-data' } },
      });
      expect(mockComponent.getComponentServerProps.calledOnce).to.be.true;
    });
  });

  describe('getAppRouterStaticParams', () => {
    it('should handle multiple sites and languages and normalize site path rewrites, removing _site_ prefix', async () => {
      const paths = [
        { params: { path: ['_site_site-one', 'home'] }, locale: 'en' },
        { params: { path: ['_site_site-one', 'about'] }, locale: 'en' },
        { params: { path: ['_site_site-one', 'home'] }, locale: 'de-DE' },
        { params: { path: ['_site_site-one', 'about'] }, locale: 'de-DE' },
        { params: { path: ['_site_site-two', 'home'] }, locale: 'en' },
        { params: { path: ['_site_site-two', 'about'] }, locale: 'en' },
      ];

      const expectedStaticParams = [
        { locale: 'en', site: 'site-one', path: ['home'] },
        { locale: 'en', site: 'site-one', path: ['about'] },
        { locale: 'de-DE', site: 'site-one', path: ['home'] },
        { locale: 'de-DE', site: 'site-one', path: ['about'] },
        { locale: 'en', site: 'site-two', path: ['home'] },
        { locale: 'en', site: 'site-two', path: ['about'] },
      ];

      sitePathServiceStub.fetchSiteRoutes.resolves(paths);

      const result = await sitecoreClient.getAppRouterStaticParams(
        ['site-one', 'site-two'],
        ['en', 'de-DE'],
        defaultInitOptions
      );

      expect(result).to.deep.equal(expectedStaticParams);
    });

    it('should use defaultLanguage if locale is missing in static path', async () => {
      const paths = [{ params: { path: ['_site_site-one', 'home'] } }];
      sitePathServiceStub.fetchSiteRoutes.resolves(paths);

      const result = await sitecoreClient.getAppRouterStaticParams(
        ['site-one'],
        ['en', 'de-DE'],
        defaultInitOptions
      );

      expect(result).to.deep.equal([
        { locale: defaultInitOptions.defaultLanguage, site: 'site-one', path: ['home'] },
      ]);
    });

    it('should use defaultSite if site is missing in static path', async () => {
      const paths = [{ params: { path: ['home'] }, locale: 'en' }];
      sitePathServiceStub.fetchSiteRoutes.resolves(paths);

      const result = await sitecoreClient.getAppRouterStaticParams(
        ['site-one'],
        ['en'],
        defaultInitOptions
      );

      expect(result).to.deep.equal([
        { locale: 'en', site: defaultInitOptions.defaultSite, path: ['home'] },
      ]);
    });
  });

  describe('getPreview', () => {
    const localSandbox = sinon.createSandbox();
    let basePreviewStub: sinon.SinonStub;

    const previewData = {
      site: 'my-site',
      itemId: 'item-id',
      language: 'en',
      mode: 'edit',
      variantIds: ['v1'],
    };

    beforeEach(() => {
      basePreviewStub = localSandbox.stub(SitecoreClient.prototype, 'getPreview').resolves(null);
    });

    afterEach(() => {
      localSandbox.restore();
    });

    it('should forward previewData and fetchOptions to base getPreview', async () => {
      const fetchOptions = { retries: 2, headers: { Authorization: 'Bearer abc' } };

      await sitecoreClient.getPreview(previewData, fetchOptions);

      expect(basePreviewStub).to.have.been.calledOnce;

      const [forwardedPreview, forwardedFetchOptions] = basePreviewStub.firstCall.args;
      expect(forwardedPreview).to.equal(previewData);
      expect(forwardedFetchOptions).to.equal(fetchOptions);
    });

    it('should call base getPreview without fetchOptions when none provided', async () => {
      await sitecoreClient.getPreview(previewData);

      expect(basePreviewStub).to.have.been.calledOnce;

      const [forwardedPreview, forwardedFetchOptions] = basePreviewStub.firstCall.args;
      expect(forwardedPreview).to.equal(previewData);
      expect(forwardedFetchOptions).to.be.undefined;
    });
  });

  describe('getDesignLibraryData', () => {
    const localSandbox = sinon.createSandbox();
    let baseDesignLibraryStub: sinon.SinonStub;

    const designLibData = {
      site: 'my-site',
      itemId: 'item-id',
      renderingId: 'rendering-id',
      componentUid: 'component-uid',
      language: 'en',
      mode: 'library',
    };

    beforeEach(() => {
      baseDesignLibraryStub = localSandbox
        .stub(SitecoreClient.prototype, 'getDesignLibraryData')
        .resolves({} as any);
    });

    afterEach(() => {
      localSandbox.restore();
    });

    it('should forward designLibData and fetchOptions to base getDesignLibraryData', async () => {
      const fetchOptions = { retries: 2, headers: { Authorization: 'Bearer abc' } };

      await sitecoreClient.getDesignLibraryData(designLibData, fetchOptions);

      expect(baseDesignLibraryStub).to.have.been.calledOnce;

      const [forwardedData, forwardedFetchOptions] = baseDesignLibraryStub.firstCall.args;
      expect(forwardedData).to.equal(designLibData);
      expect(forwardedFetchOptions).to.equal(fetchOptions);
    });

    it('should call base getDesignLibraryData without fetchOptions when none provided', async () => {
      await sitecoreClient.getDesignLibraryData(designLibData);

      expect(baseDesignLibraryStub).to.have.been.calledOnce;

      const [forwardedData, forwardedFetchOptions] = baseDesignLibraryStub.firstCall.args;
      expect(forwardedData).to.equal(designLibData);
      expect(forwardedFetchOptions).to.be.undefined;
    });
  });

  describe('getPagePaths', () => {
    it('should return static paths with site prefixes - multisite enabled by default', async () => {
      const paths = [
        { params: { path: ['_site_site-one', 'home'] }, locale: 'en' },
        { params: { path: ['_site_site-one', 'about'] }, locale: 'en' },
        { params: { path: ['_site_site-two', 'home'] }, locale: 'de-DE' },
      ];

      sitePathServiceStub.fetchSiteRoutes.resolves(paths);

      const result = await sitecoreClient.getPagePaths(['site-one', 'site-two'], ['en', 'de-DE']);

      expect(result).to.deep.equal(paths);
    });

    it('should return static paths with site prefixes when multisite enabled', async () => {
      const paths = [
        { params: { path: ['_site_site-one', 'home'] }, locale: 'en' },
        { params: { path: ['_site_site-one', 'about'] }, locale: 'en' },
        { params: { path: ['_site_site-two', 'home'] }, locale: 'de-DE' },
      ];

      sitePathServiceStub.fetchSiteRoutes.resolves(paths);

      const result = await sitecoreClient.getPagePaths(
        ['site-one', 'site-two'],
        ['en', 'de-DE'],
        undefined,
        true
      );

      expect(result).to.deep.equal(paths);
    });

    it('should return static paths without site prefixes when multisite is disabled', async () => {
      const paths = [
        { params: { path: ['_site_site-one', 'home'] }, locale: 'en' },
        { params: { path: ['_site_site-one', 'about'] }, locale: 'en' },
        { params: { path: ['_site_site-two', 'home'] }, locale: 'de-DE' },
      ];

      const expectedPaths = [
        { params: { path: ['home'] }, locale: 'en' },
        { params: { path: ['about'] }, locale: 'en' },
        { params: { path: ['home'] }, locale: 'de-DE' },
      ];

      sitePathServiceStub.fetchSiteRoutes.resolves(structuredClone(paths));

      const result = await sitecoreClient.getPagePaths(['site-one'], ['en'], undefined, false);

      expect(result).to.deep.equal(expectedPaths);
    });
  });

  describe('getPreviewData', () => {
    const editingParamsHeader = 'x-sitecore-editing-params';

    it('should return empty previewData when EDITING_PARAMS_HEADER is missing', () => {
      const headers = new Headers();

      const result = sitecoreClient.getPreviewData(headers);

      expect(result).to.deep.equal({});
    });

    it('should return empty previewData when EDITING_PARAMS_HEADER is empty', () => {
      const headers = new Headers({ [editingParamsHeader]: '' });

      const result = sitecoreClient.getPreviewData(headers);

      expect(result).to.deep.equal({});
    });

    it('should return empty previewData when EDITING_PARAMS_HEADER is invalid JSON', () => {
      const headers = new Headers({ [editingParamsHeader]: 'not-json' });

      const result = sitecoreClient.getPreviewData(headers);

      expect(result).to.deep.equal({});
    });

    it('should parse EDITING_PARAMS_HEADER into previewData', () => {
      const previewPayload = {
        site: 'my-site',
        itemId: 'item-id',
        language: 'en',
        mode: 'edit',
        variantIds: 'v1',
      };
      const headers = new Headers({
        [editingParamsHeader]: JSON.stringify(previewPayload),
      });

      const result = sitecoreClient.getPreviewData(headers);

      expect(result).to.deep.equal(previewPayload);
    });

    it('should ignore unrelated headers when parsing previewData', () => {
      const previewPayload = {
        site: 'my-site',
        itemId: 'item-id',
        language: 'en',
        mode: 'library',
      };
      const headers = new Headers({
        [editingParamsHeader]: JSON.stringify(previewPayload),
        Authorization: 'Bearer xyz',
        'X-Custom': 'value',
      });

      const result = sitecoreClient.getPreviewData(headers);

      expect(result).to.deep.equal(previewPayload);
    });
  });
});
