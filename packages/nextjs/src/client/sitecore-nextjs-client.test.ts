import { expect } from 'chai';
import sinon from 'sinon';
import { GraphQLLayoutService } from '@sitecore-content-sdk/core/layout';
import { SitecoreNextjsClient } from './sitecore-nextjs-client';
import { GraphQLDictionaryService } from '@sitecore-content-sdk/core/i18n';
import { GraphQLErrorPagesService, SiteResolver } from '@sitecore-content-sdk/core/site';
import { GraphQLEditingService } from '@sitecore-content-sdk/core/editing';
import { MultisiteGraphQLSitemapService } from '../services/mutisite-graphql-sitemap-service';
import { ComponentPropsService } from '../services/component-props-service';

xdescribe('SitecoreClient', () => {
  let sitecoreClient: SitecoreNextjsClient;
  let initOptions: any;
  let layoutServiceStub: sinon.SinonStubbedInstance<GraphQLLayoutService>;
  let dictionaryServiceStub: sinon.SinonStubbedInstance<GraphQLDictionaryService>;
  let errorPagesServiceStub: sinon.SinonStubbedInstance<GraphQLErrorPagesService>;
  let editingServiceStub: sinon.SinonStubbedInstance<GraphQLEditingService>;
  let siteResolverStub: sinon.SinonStubbedInstance<SiteResolver>;
  let graphqlSitemapServiceStub: sinon.SinonStubbedInstance<MultisiteGraphQLSitemapService>;
  let componentPropsServiceStub: sinon.SinonStubbedInstance<ComponentPropsService>;

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
    graphqlSitemapServiceStub = sinon.createStubInstance(MultisiteGraphQLSitemapService);
    componentPropsServiceStub = sinon.createStubInstance(ComponentPropsService);

    // Create client
    sitecoreClient = new SitecoreNextjsClient(initOptions);

    (sitecoreClient as any).layoutService = layoutServiceStub;
    (sitecoreClient as any).dictionaryService = dictionaryServiceStub;
    (sitecoreClient as any).errorPagesService = errorPagesServiceStub;
    (sitecoreClient as any).editingService = editingServiceStub;
    (sitecoreClient as any).siteResolver = siteResolverStub;
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

  });

  describe('parsePath', () => {

  });

  describe('getComponentData', () => {

  });

  describe('getPagePaths', () => {

  });
});
