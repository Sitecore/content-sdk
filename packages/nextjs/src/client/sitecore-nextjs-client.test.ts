import { expect } from 'chai';
import sinon from 'sinon';
import { SitecoreNextjsClient } from './sitecore-nextjs-client';
import { ComponentBuilder } from '../ComponentBuilder';
import { DefaultRetryStrategy, NativeDataFetcher } from '@sitecore-content-sdk/core';
import * as siteTools from '@sitecore-content-sdk/core/site';
import { SITE_PREFIX } from '@sitecore-content-sdk/core/site';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
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

  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;
  let sitemapServiceStub: {
    getSitemap: sinon.SinonStub;
    fetchSitemaps: sinon.SinonStub;
    setSiteName: sinon.SinonStub;
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

    res = {
      setHeader: sandbox.stub(),
      send: sandbox.stub(),
      redirect: sandbox.stub().callsFake(() => {
        return res as NextApiResponse;
      }),
    };

    sitemapServiceStub = {
      getSitemap: sandbox.stub(),
      fetchSitemaps: sandbox.stub(),
      setSiteName: sandbox.stub(),
    };

    sitecoreClient = new SitecoreNextjsClient(defaultInitOptions);

    (sitecoreClient as any).layoutService = layoutServiceStub;
    (sitecoreClient as any).dictionaryService = dictionaryServiceStub;
    (sitecoreClient as any).errorPagesService = errorPagesServiceStub;
    (sitecoreClient as any).editingService = editingServiceStub;
    (sitecoreClient as any).siteResolver = siteResolverStub;
    (sitecoreClient as any).componentService = restComponentServiceStub;
    (sitecoreClient as any).sitemapXmlService = sitemapServiceStub;
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

  describe.only('getSitemap', () => {
    it('should return XML for specific sitemap when id is provided', async () => {
      const mockSitemapId = '1';
      const mockSitemapPath = '/sitemap-1.xml';
      const mockXmlContent = '<urlset>...</urlset>';

      sitemapServiceStub.getSitemap.withArgs(mockSitemapId).resolves(mockSitemapPath);
      sitemapServiceStub.getSitemap.withArgs(undefined).resolves(null);
      sitemapServiceStub.fetchSitemaps.resolves([]);

      const dataFetcherStub = sandbox
        .stub(NativeDataFetcher.prototype, 'fetch')
        .withArgs(`${defaultInitOptions.api.local.apiHost}${mockSitemapPath}`)
        .resolves({ data: mockXmlContent, status: 200, statusText: 'OK' });

      const request = {
        ...req,
        query: { id: mockSitemapId },
      } as NextApiRequest;

      await sitecoreClient.getSitemap(request, res as NextApiResponse, mockSitemapId);

      expect(sitemapServiceStub.getSitemap.calledWith(mockSitemapId)).to.be.true;
      expect(
        dataFetcherStub.calledWith(`${defaultInitOptions.api.local.apiHost}${mockSitemapPath}`)
      ).to.be.true;
      expect(res.setHeader).to.have.been.calledWith('Content-Type', 'text/xml;charset=utf-8');
      expect(res.send).to.have.been.calledWith(mockXmlContent);
    });

    it('should handle absolute URLs in sitemap path', async () => {
      const mockSitemapId = '2';
      const absoluteSitemapPath = 'https://cdn.example.com/sitemap-2.xml';
      const mockXmlContent = '<urlset>...</urlset>';

      sandbox.restore();

      const sitemapServiceStub = {
        getSitemap: sandbox.stub(),
        fetchSitemaps: sandbox.stub().resolves([]),
        setSiteName: sandbox.stub(),
      };
      sitemapServiceStub.getSitemap.withArgs(mockSitemapId).resolves(absoluteSitemapPath);
      sitemapServiceStub.getSitemap.withArgs(undefined).resolves(null);

      const dataFetcherStub = sandbox
        .stub(NativeDataFetcher.prototype, 'fetch')
        .resolves({ data: mockXmlContent, status: 200, statusText: 'OK' });

      sandbox.stub(sitecoreClient, 'resolveSite').returns({
        name: 'test-site',
        hostName: 'example.com',
        language: 'en',
      });

      (sitecoreClient as any).sitemapXmlService = sitemapServiceStub;

      await sitecoreClient.getSitemap(
        {
          ...req,
          query: { id: mockSitemapId },
          headers: {
            host: 'example.com',
            'x-forwarded-proto': 'https',
          },
        } as NextApiRequest,
        res as NextApiResponse,
        mockSitemapId
      );

      const wasCalledWithAbsoluteUrl = dataFetcherStub
        .getCalls()
        .some((call) => call.args[0] === absoluteSitemapPath);

      expect(wasCalledWithAbsoluteUrl).to.be.true;
      expect(res.setHeader).to.have.been.calledWith('Content-Type', 'text/xml;charset=utf-8');
      expect(res.send).to.have.been.calledWith(mockXmlContent);
    });

    it('should redirect to 404 when specific sitemap fetch fails', async () => {
      const mockSitemapId = '3';
      const mockSitemapPath = '/sitemap-3.xml';
      const fullSitemapUrl = `${defaultInitOptions.api.local.apiHost}${mockSitemapPath}`;

      sandbox.restore();

      const sitemapServiceStub = {
        getSitemap: sandbox.stub(),
        fetchSitemaps: sandbox.stub().resolves([]),
        setSiteName: sandbox.stub(),
      };
      sitemapServiceStub.getSitemap.withArgs(mockSitemapId).resolves(mockSitemapPath);
      sitemapServiceStub.getSitemap.withArgs(undefined).resolves(null);

      const dataFetcherStub = sandbox
        .stub(NativeDataFetcher.prototype, 'fetch')
        .rejects(new Error('Failed to fetch sitemap'));

      sandbox.stub(sitecoreClient, 'resolveSite').returns({
        name: 'test-site',
        hostName: 'example.com',
        language: 'en',
      });

      (sitecoreClient as any).sitemapXmlService = sitemapServiceStub;

      await sitecoreClient.getSitemap(
        {
          ...req,
          query: { id: mockSitemapId },
          headers: {
            host: 'example.com',
            'x-forwarded-proto': 'https',
          },
        } as NextApiRequest,
        res as NextApiResponse,
        mockSitemapId
      );

      const wasCalledWithExpectedUrl = dataFetcherStub
        .getCalls()
        .some((call) => call.args[0] === fullSitemapUrl);

      expect(wasCalledWithExpectedUrl).to.be.true;
      expect(res.redirect).to.have.been.calledWith('/404');
    });

    it('should return index sitemap XML when no id is provided', async () => {
      const mockSitemaps = ['/sitemap-1.xml', '/sitemap-2.xml'];

      (sitecoreClient as any).sitemapXmlService.getSitemap.withArgs(undefined).resolves(null);

      (sitecoreClient as any).sitemapXmlService.fetchSitemaps.resolves(mockSitemaps);

      await sitecoreClient.getSitemap(req as NextApiRequest, res as NextApiResponse);

      expect((sitecoreClient as any).sitemapXmlService.fetchSitemaps.calledOnce).to.be.true;
      expect(res.setHeader).to.have.been.calledWith('Content-Type', 'text/xml;charset=utf-8');

      const sendArg = (res.send as sinon.SinonStub).args[0][0];
      expect(sendArg).to.include('<sitemapindex xmlns="http://sitemaps.org/schemas/sitemap/0.9"');
      expect(sendArg).to.include('<sitemap>');
      expect(sendArg).to.include('<loc>https://example.com/sitemap-1.xml</loc>');
      expect(sendArg).to.include('<loc>https://example.com/sitemap-2.xml</loc>');
    });

    it('should redirect to 404 when no sitemaps are found', async () => {
      (sitecoreClient as any).sitemapXmlService.getSitemap.withArgs(undefined).resolves(null);

      (sitecoreClient as any).sitemapXmlService.fetchSitemaps.resolves([]);

      await sitecoreClient.getSitemap(req as NextApiRequest, res as NextApiResponse);

      expect(res.redirect).to.have.been.calledWith('/404');
    });

    it('should use HTTPS protocol by default when x-forwarded-proto is missing', async () => {
      const reqWithoutProto = {
        ...req,
        headers: {
          host: 'example.com',
        },
      };

      const mockSitemaps = ['/sitemap-1.xml'];

      (sitecoreClient as any).sitemapXmlService.getSitemap.withArgs(undefined).resolves(null);

      (sitecoreClient as any).sitemapXmlService.fetchSitemaps.resolves(mockSitemaps);

      await sitecoreClient.getSitemap(reqWithoutProto as NextApiRequest, res as NextApiResponse);

      const sendArg = (res.send as sinon.SinonStub).args[0][0];
      expect(sendArg).to.include('<loc>https://example.com/sitemap-1.xml</loc>');
    });

    it('should respect the provided protocol in x-forwarded-proto', async () => {
      const httpReq = {
        ...req,
        headers: {
          host: 'example.com',
          'x-forwarded-proto': 'http',
        },
      };

      const mockSitemaps = ['/sitemap-1.xml'];

      (sitecoreClient as any).sitemapXmlService.getSitemap.withArgs(undefined).resolves(null);

      (sitecoreClient as any).sitemapXmlService.fetchSitemaps.resolves(mockSitemaps);

      await sitecoreClient.getSitemap(httpReq as NextApiRequest, res as NextApiResponse);

      const sendArg = (res.send as sinon.SinonStub).args[0][0];
      expect(sendArg).to.include('<loc>http://example.com/sitemap-1.xml</loc>');
    });
  });
});
