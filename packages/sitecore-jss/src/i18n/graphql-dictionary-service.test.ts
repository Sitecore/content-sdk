/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon, { SinonSpy } from 'sinon';
import nock from 'nock';
import { GraphQLClient, GraphQLRequestClient } from '../graphql-request-client';
import { GraphQLDictionaryServiceConfig } from './graphql-dictionary-service';
import { GraphQLDictionaryService } from '.';
import dictionarySiteQueryResponse from '../test-data/mockDictionarySiteQueryResponse.json';

class TestService extends GraphQLDictionaryService {
  public client: GraphQLClient;
  constructor(options: GraphQLDictionaryServiceConfig) {
    super(options);
    this.client = this.getGraphQLClient();
  }
}

describe('GraphQLDictionaryService', () => {
  const endpoint = 'http://site';
  const siteName = 'site-name';
  const apiKey = 'api-key';
  const rootItemId = '{GUID}';
  const clientFactory = GraphQLRequestClient.createClientFactory({
    endpoint,
    apiKey,
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should use cache', async () => {
    nock(endpoint, { reqheaders: { sc_apikey: apiKey } })
      .post('/', /DictionarySiteQuery/gi)
      .reply(200, dictionarySiteQueryResponse.singlepage);

    const service = new GraphQLDictionaryService({
      clientFactory,
      siteName,
      rootItemId,
      cacheEnabled: true,
      cacheTimeout: 2,
    });

    const result1 = await service.fetchDictionaryData('en');
    expect(result1).to.have.all.keys('foo', 'bar');

    const result2 = await service.fetchDictionaryData('en');
    expect(result2).to.have.all.keys('foo', 'bar');
  });

  it('should provide a default GraphQL client', () => {
    const service = new TestService({
      clientFactory,
      siteName,
      rootItemId,
      cacheEnabled: false,
    });

    const graphQLClient = service.client as GraphQLClient;
    const graphQLRequestClient = service.client as GraphQLRequestClient;
    // eslint-disable-next-line no-unused-expressions
    expect(graphQLClient).to.exist;
    // eslint-disable-next-line no-unused-expressions
    expect(graphQLRequestClient).to.exist;
  });

  it('should call clientFactory with the correct arguments', () => {
    const clientFactorySpy: SinonSpy = sinon.spy();
    const mockServiceConfig = {
      siteName: 'supersite',
      clientFactory: clientFactorySpy,
      retries: 3,
      retryStrategy: {
        getDelay: () => 1000,
        shouldRetry: () => true,
      },
    };

    new GraphQLDictionaryService(mockServiceConfig);

    expect(clientFactorySpy.calledOnce).to.be.true;

    const calledWithArgs = clientFactorySpy.firstCall.args[0];
    expect(calledWithArgs.debugger).to.exist;
    expect(calledWithArgs.retries).to.equal(mockServiceConfig.retries);
    expect(calledWithArgs.retryStrategy).to.deep.equal(mockServiceConfig.retryStrategy);
  });

  it('should fetch dictionary phrases using clientFactory', async () => {
    nock(endpoint, { reqheaders: { sc_apikey: apiKey } })
      .post('/')
      .reply(200, dictionarySiteQueryResponse.singlepage);

    const service = new GraphQLDictionaryService({
      siteName,
      cacheEnabled: false,
      clientFactory,
      useSiteQuery: true,
    });
    const result = await service.fetchDictionaryData('en');
    expect(result.foo).to.equal('foo');
    expect(result.bar).to.equal('bar');
  });

  it('should use default pageSize of 500, if pageSize not provided in constructor', async () => {
    nock(endpoint)
      .persist()
      .post(
        '/',
        (body) =>
          body.query.indexOf('$pageSize: Int = 500') > 0 && body.variables.pageSize === undefined
      )
      .reply(200, dictionarySiteQueryResponse.singlepage);

    const service = new GraphQLDictionaryService({
      clientFactory,
      siteName,
      cacheEnabled: false,
      pageSize: undefined,
      useSiteQuery: true,
    });
    const result = await service.fetchDictionaryData('en');
    expect(result).to.have.all.keys('foo', 'bar');
  });

  it('should use a custom pageSize, if provided', async () => {
    const customPageSize = 1;

    nock(endpoint)
      .post('/', (body) => body.variables.pageSize === customPageSize)
      .reply(200, dictionarySiteQueryResponse.multipage.page1)
      .post(
        '/',
        (body) => body.variables.pageSize === customPageSize && body.variables.after === 'nextpage'
      )
      .reply(200, dictionarySiteQueryResponse.multipage.page2);

    const service = new GraphQLDictionaryService({
      clientFactory,
      siteName,
      cacheEnabled: false,
      pageSize: customPageSize,
      useSiteQuery: true,
    });
    const result = await service.fetchDictionaryData('en');
    expect(result).to.have.all.keys('foo', 'bar', 'baz');
  });

  it('should throw when getting http errors', async () => {
    nock(endpoint)
      .post('/')
      .reply(401, {
        error: 'whoops',
      });

    const service = new GraphQLDictionaryService({
      clientFactory,
      siteName,
      cacheEnabled: false,
      useSiteQuery: true,
    });

    await service.fetchDictionaryData('en').catch((error) => {
      expect(error.response.status).to.equal(401);
      expect(error.response.error).to.equal('whoops');
    });
  });

  it('should return empty result when no dictionary entries found', async () => {
    nock(endpoint)
      .post('/')
      .reply(200, {
        data: {
          site: {
            siteInfo: null,
          },
        },
      });

    const service = new GraphQLDictionaryService({
      clientFactory,
      siteName,
      cacheEnabled: false,
      useSiteQuery: true,
    });

    const result = await service.fetchDictionaryData('en');
    expect(result).to.deep.equal({});
  });

  it('should throw error if siteName is not provided', async () => {
    const service = new GraphQLDictionaryService({
      clientFactory,
      siteName: '',
      cacheEnabled: false,
      useSiteQuery: true,
    });

    await service.fetchDictionaryData('en').catch((error) => {
      expect(error.message).to.equal('The site name must be a non-empty string');
    });
  });

  it('should throw error if language is not provided', async () => {
    const service = new GraphQLDictionaryService({
      clientFactory,
      siteName,
      cacheEnabled: false,
      useSiteQuery: true,
    });

    await service.fetchDictionaryData('').catch((error) => {
      expect(error.message).to.equal('The language must be a non-empty string');
    });
  });
});
