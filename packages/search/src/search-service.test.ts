import { describe, it } from 'mocha';
import { constants, NativeDataFetcherError } from '@sitecore-content-sdk/core';
import { SearchService, SortSetting } from './search-service';
import { expect } from 'chai';
import nock from 'nock';
import proxyquire from 'proxyquire';

describe('SearchService', () => {
  const searchIndexId = '1234567890';
  const contextId = 'dbc124567890';

  afterEach(() => {
    nock.cleanAll();
  });

  it('should send a request with the keyphrase', async () => {
    nock(constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
      reqheaders: {
        'x-sitecore-contextid': contextId,
      },
    })
      .post(`/v1/search`, {
        config: {
          id: searchIndexId,
        },
        limit: 10,
        offset: 0,
        query: {
          keyphrase: 'test',
        },
        sessionId: '',
        sort: {
          fields: [],
        },
      })
      .reply(200, {
        content: [{ id: 1 }, { id: 2 }, { id: 3 }],
        total: 3,
      });

    const searchService = new SearchService({
      contextId,
    });

    const searchResponse = await searchService.search({
      searchIndexId,
      keyphrase: 'test',
    });

    expect(searchResponse.results).to.deep.equal([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(searchResponse.total).to.equal(3);
  });

  it('should send a request with empty keyphrase', async () => {
    nock(constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
      reqheaders: {
        'x-sitecore-contextid': contextId,
      },
    })
      .post(`/v1/search`, {
        config: {
          id: searchIndexId,
        },
        limit: 10,
        offset: 0,
        query: {
          keyphrase: '',
        },
        sessionId: '',
        sort: {
          fields: [],
        },
      })
      .reply(200, {
        content: [{ id: 1 }, { id: 2 }, { id: 3 }],
        total: 3,
      });

    const searchService = new SearchService({
      contextId,
    });

    const searchResponse = await searchService.search({
      searchIndexId,
    });

    expect(searchResponse.results).to.deep.equal([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(searchResponse.total).to.equal(3);
  });

  it('should send a request with custom edge url', async () => {
    const customEdgeUrl = 'https://custom-edge-url.com';

    nock(customEdgeUrl, {
      reqheaders: {
        'x-sitecore-contextid': contextId,
      },
    })
      .post(`/v1/search`, {
        config: {
          id: searchIndexId,
        },
        limit: 10,
        offset: 0,
        query: {
          keyphrase: 'test',
        },
        sessionId: '',
        sort: {
          fields: [],
        },
      })
      .reply(200, {
        content: [{ id: 1 }, { id: 2 }, { id: 3 }],
        total: 3,
      });

    const searchService = new SearchService({
      contextId,
      edgeUrl: customEdgeUrl,
    });

    const searchResponse = await searchService.search({
      searchIndexId,
      keyphrase: 'test',
    });

    expect(searchResponse.results).to.deep.equal([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(searchResponse.total).to.equal(3);
  });

  it('should send a request with custom limit', async () => {
    const limit = 20;

    nock(constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
      reqheaders: {
        'x-sitecore-contextid': contextId,
      },
    })
      .post(`/v1/search`, {
        config: {
          id: searchIndexId,
        },
        limit,
        offset: 0,
        query: {
          keyphrase: 'test',
        },
        sessionId: '',
        sort: {
          fields: [],
        },
      })
      .reply(200, {
        content: [{ id: 1 }, { id: 2 }, { id: 3 }],
        total: 3,
      });

    const searchService = new SearchService({
      contextId,
    });

    const searchResponse = await searchService.search({
      searchIndexId,
      keyphrase: 'test',
      limit,
    });

    expect(searchResponse.results).to.deep.equal([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(searchResponse.total).to.equal(3);
  });

  it('should sent a request with custom offset', async () => {
    const offset = 50;

    nock(constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
      reqheaders: {
        'x-sitecore-contextid': contextId,
      },
    })
      .post(`/v1/search`, {
        config: {
          id: searchIndexId,
        },
        limit: 10,
        offset,
        query: {
          keyphrase: 'test',
        },
        sessionId: '',
        sort: {
          fields: [],
        },
      })
      .reply(200, {
        content: [{ id: 1 }, { id: 2 }, { id: 3 }],
        total: 3,
      });

    const searchService = new SearchService({
      contextId,
    });

    const searchResponse = await searchService.search({
      searchIndexId,
      keyphrase: 'test',
      offset,
    });

    expect(searchResponse.results).to.deep.equal([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(searchResponse.total).to.equal(3);
  });

  it('should send a request with custom sort', async () => {
    const sort: SortSetting = { name: 'event', order: 'asc' };

    nock(constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
      reqheaders: {
        'x-sitecore-contextid': contextId,
      },
    })
      .post(`/v1/search`, {
        config: {
          id: searchIndexId,
        },
        limit: 10,
        offset: 0,
        query: {
          keyphrase: 'test',
        },
        sessionId: '',
        sort: {
          fields: [sort],
        },
      })
      .reply(200, {
        content: [{ id: 1 }, { id: 2 }, { id: 3 }],
        total: 3,
      });

    const searchService = new SearchService({
      contextId,
    });

    const searchResponse = await searchService.search({
      searchIndexId,
      keyphrase: 'test',
      sort,
    });

    expect(searchResponse.results).to.deep.equal([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(searchResponse.total).to.equal(3);
  });

  it('should send a request with custom sort array', async () => {
    const sort: SortSetting[] = [
      { name: 'event', order: 'asc' },
      { name: 'title', order: 'desc' },
    ];

    nock(constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
      reqheaders: {
        'x-sitecore-contextid': contextId,
      },
    })
      .post(`/v1/search`, {
        config: {
          id: searchIndexId,
        },
        limit: 10,
        offset: 0,
        query: {
          keyphrase: 'test',
        },
        sessionId: '',
        sort: {
          fields: sort,
        },
      })
      .reply(200, {
        content: [{ id: 1 }, { id: 2 }, { id: 3 }],
        total: 3,
      });

    const searchService = new SearchService({
      contextId,
    });

    const searchResponse = await searchService.search({
      searchIndexId,
      keyphrase: 'test',
      sort,
    });

    expect(searchResponse.results).to.deep.equal([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(searchResponse.total).to.equal(3);
  });

  it('should return a default response when no results are found', async () => {
    nock(constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
      reqheaders: {
        'x-sitecore-contextid': contextId,
      },
    })
      .post(`/v1/search`, {
        config: {
          id: searchIndexId,
        },
        limit: 10,
        offset: 0,
        query: {
          keyphrase: 'test',
        },
        sessionId: '',
        sort: {
          fields: [],
        },
      })
      .reply(200, {});

    const searchService = new SearchService({
      contextId,
    });

    const searchResponse = await searchService.search({
      searchIndexId,
      keyphrase: 'test',
    });

    expect(searchResponse.results).to.deep.equal([]);
    expect(searchResponse.total).to.equal(0);
  });

  it('should throw an error if the request fails', async () => {
    nock(constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
      reqheaders: {
        'x-sitecore-contextid': contextId,
      },
    })
      .post(`/v1/search`, {
        config: {
          id: searchIndexId,
        },
        limit: 10,
        offset: 0,
        query: {
          keyphrase: '',
        },
        sessionId: '',
        sort: {
          fields: [],
        },
      })
      .reply(500, { message: 'Internal server error' });

    const searchService = new SearchService({
      contextId,
    });

    try {
      await searchService.search({
        searchIndexId,
      });
    } catch (error) {
      expect((error as NativeDataFetcherError).name).to.equal('Error');
      expect((error as NativeDataFetcherError).message).to.equal('HTTP 500 Internal Server Error');
      expect((error as NativeDataFetcherError).stack).to.be.a('string');
      expect((error as NativeDataFetcherError).response).to.deep.equal({
        status: 500,
        statusText: 'Internal Server Error',
        headers: {
          'content-type': 'application/json',
        },
        data: { message: 'Internal server error' },
      });
    }
  });

  describe('validation', () => {
    it('should throw an error if limit is not a positive number', async () => {
      const searchService = new SearchService({
        contextId,
      });

      try {
        await searchService.search({
          searchIndexId,
          keyphrase: 'test',
          limit: -1,
        });
      } catch (error) {
        expect(error)
          .to.be.an.instanceOf(RangeError)
          .and.to.have.property('message', 'Limit must be a positive number');
      }
    });

    it('should throw an error if limit is greater than 500', async () => {
      const searchService = new SearchService({
        contextId,
      });

      try {
        await searchService.search({
          searchIndexId,
          keyphrase: 'test',
          limit: 501,
        });
      } catch (error) {
        expect(error)
          .to.be.an.instanceOf(RangeError)
          .and.to.have.property('message', 'Limit must be less than or equal to 500');
      }
    });

    it('should throw an error if offset is not a positive number', async () => {
      const searchService = new SearchService({
        contextId,
      });

      try {
        await searchService.search({
          searchIndexId,
          keyphrase: 'test',
          offset: -1,
        });
      } catch (error) {
        expect(error)
          .to.be.an.instanceOf(RangeError)
          .and.to.have.property('message', 'Offset must be a positive number');
      }
    });

    it('should throw an error if search index ID is not provided', async () => {
      const searchService = new SearchService({
        contextId,
      });

      try {
        await searchService.search({
          searchIndexId: '',
          keyphrase: 'test',
        });
      } catch (error) {
        expect(error)
          .to.be.an.instanceOf(TypeError)
          .and.to.have.property('message', 'Search index ID is required');
      }
    });

    it('should throw an error if sort is not an array or an object', async () => {
      const searchService = new SearchService({
        contextId,
      });

      try {
        await searchService.search({
          searchIndexId,
          keyphrase: 'test',
          sort: 'test' as unknown as SortSetting,
        });
      } catch (error) {
        expect(error)
          .to.be.an.instanceOf(TypeError)
          .and.to.have.property('message', 'Sort must be an array or an object');
      }

      try {
        await searchService.search({
          searchIndexId,
          keyphrase: 'test',
          sort: 1 as unknown as SortSetting,
        });
      } catch (error) {
        expect(error)
          .to.be.an.instanceOf(TypeError)
          .and.to.have.property('message', 'Sort must be an array or an object');
      }
    });
  });

  describe('facets', () => {
    it('should send facet: { all: true } in the request body and return facets in response', async () => {
      const facetResponse = [{ name: 'industry', value: [{ text: 'Tech', count: 5 }, { text: 'Finance', count: 3 }] }];

      nock(constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
        reqheaders: { 'x-sitecore-contextid': contextId },
      })
        .post('/v1/search', {
          config: { id: searchIndexId },
          limit: 10,
          offset: 0,
          query: { keyphrase: '' },
          sessionId: '',
          sort: { fields: [] },
          facet: { all: true },
        })
        .reply(200, { content: [{ id: 1 }], total: 1, facet: facetResponse });

      const searchService = new SearchService({ contextId });
      const response = await searchService.search({ searchIndexId, facet: { all: true } });

      expect(response.facets).to.deep.equal(facetResponse);
      expect(response.total).to.equal(1);
    });

    it('should send facet with fields and filters in the request body', async () => {
      const facet = {
        all: true,
        fields: [{ name: 'industry', filters: [{ operator: 'eq', value: ['Tech', 'Finance'] }] }],
      };
      const facetResponse = [{ name: 'industry', value: [{ text: 'Tech', count: 5 }, { text: 'Finance', count: 3 }] }];

      nock(constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
        reqheaders: { 'x-sitecore-contextid': contextId },
      })
        .post('/v1/search', {
          config: { id: searchIndexId },
          limit: 10,
          offset: 0,
          query: { keyphrase: '' },
          sessionId: '',
          sort: { fields: [] },
          facet,
        })
        .reply(200, { content: [{ id: 1 }], total: 1, facet: facetResponse });

      const searchService = new SearchService({ contextId });
      const response = await searchService.search({ searchIndexId, facet });

      expect(response.facets).to.deep.equal(facetResponse);
    });

    it('should not include facet in the request when not provided', async () => {
      nock(constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
        reqheaders: { 'x-sitecore-contextid': contextId },
      })
        .post('/v1/search', {
          config: { id: searchIndexId },
          limit: 10,
          offset: 0,
          query: { keyphrase: '' },
          sessionId: '',
          sort: { fields: [] },
        })
        .reply(200, { content: [{ id: 1 }], total: 1 });

      const searchService = new SearchService({ contextId });
      const response = await searchService.search({ searchIndexId });

      expect(response.facets).to.equal(undefined);
    });
  });

  describe('locale', () => {
    it('should send a request with locale when provided', async () => {
      const locale = 'fr-FR';

      nock(constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
        reqheaders: {
          'x-sitecore-contextid': contextId,
        },
      })
        .post(`/v1/search`, {
          config: {
            id: searchIndexId,
          },
          limit: 10,
          offset: 0,
          query: {
            keyphrase: 'test',
          },
          sessionId: '',
          sort: {
            fields: [],
          },
          locale,
        })
        .reply(200, {
          content: [{ id: 1 }, { id: 2 }],
          total: 2,
        });

      const searchService = new SearchService({ contextId });

      const searchResponse = await searchService.search({
        searchIndexId,
        keyphrase: 'test',
        locale,
      });

      expect(searchResponse.results).to.deep.equal([{ id: 1 }, { id: 2 }]);
      expect(searchResponse.total).to.equal(2);
    });

    it('should not include locale in the request when not provided', async () => {
      nock(constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
        reqheaders: {
          'x-sitecore-contextid': contextId,
        },
      })
        .post(`/v1/search`, {
          config: {
            id: searchIndexId,
          },
          limit: 10,
          offset: 0,
          query: {
            keyphrase: 'test',
          },
          sessionId: '',
          sort: {
            fields: [],
          },
        })
        .reply(200, {
          content: [{ id: 1 }],
          total: 1,
        });

      const searchService = new SearchService({ contextId });

      const searchResponse = await searchService.search({
        searchIndexId,
        keyphrase: 'test',
      });

      expect(searchResponse.results).to.deep.equal([{ id: 1 }]);
      expect(searchResponse.total).to.equal(1);
    });
  });

  describe('MLT', () => {
    it('should send a request with seedItemId and map content to results', async () => {
      nock(constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
        reqheaders: {
          'x-sitecore-contextid': contextId,
        },
      })
        .post(`/v1/search`, {
          config: {
            id: searchIndexId,
          },
          limit: 10,
          offset: 0,
          query: {
            seedItemId: 'item-123',
          },
          sessionId: '',
          sort: {
            fields: [],
          },
        })
        .reply(200, {
          content: [{ id: 'related-1' }, { id: 'related-2' }],
          total: 2,
        });

      const searchService = new SearchService({
        contextId,
      });

      const searchResponse = await searchService.search({
        searchIndexId,
        seedItemId: 'item-123',
      });

      expect(searchResponse.results).to.deep.equal([{ id: 'related-1' }, { id: 'related-2' }]);
      expect(searchResponse.total).to.equal(2);
    });

    it('should send a request with seedItemUrl and map content to results', async () => {
      nock(constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
        reqheaders: {
          'x-sitecore-contextid': contextId,
        },
      })
        .post(`/v1/search`, {
          config: {
            id: searchIndexId,
          },
          limit: 5,
          offset: 0,
          query: {
            seedItemUrl: 'https://example.com/articles/cloud',
          },
          sessionId: '',
          sort: {
            fields: [],
          },
        })
        .reply(200, {
          content: [{ id: 'related-1' }],
          total: 1,
          facet: [{ name: 'type', value: [{ text: 'article', count: 1 }] }],
        });

      const searchService = new SearchService({
        contextId,
      });

      const searchResponse = await searchService.search({
        searchIndexId,
        seedItemUrl: 'https://example.com/articles/cloud',
        limit: 5,
      });

      expect(searchResponse.results).to.deep.equal([{ id: 'related-1' }]);
      expect(searchResponse.total).to.equal(1);
      expect(searchResponse.facets).to.deep.equal([
        { name: 'type', value: [{ text: 'article', count: 1 }] },
      ]);
    });

    it('should trim seedItemId before sending the request', async () => {
      nock(constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
        reqheaders: {
          'x-sitecore-contextid': contextId,
        },
      })
        .post(`/v1/search`, {
          config: {
            id: searchIndexId,
          },
          limit: 10,
          offset: 0,
          query: {
            seedItemId: 'item-123',
          },
          sessionId: '',
          sort: {
            fields: [],
          },
        })
        .reply(200, {
          content: [{ id: 'related-1' }],
          total: 1,
        });

      const searchService = new SearchService({
        contextId,
      });

      const searchResponse = await searchService.search({
        searchIndexId,
        seedItemId: '  item-123  ',
      });

      expect(searchResponse.results).to.deep.equal([{ id: 'related-1' }]);
    });

    it('should default missing MLT content to an empty results array', async () => {
      nock(constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
        reqheaders: {
          'x-sitecore-contextid': contextId,
        },
      })
        .post(`/v1/search`, {
          config: {
            id: searchIndexId,
          },
          limit: 10,
          offset: 0,
          query: {
            seedItemId: 'item-123',
          },
          sessionId: '',
          sort: {
            fields: [],
          },
        })
        .reply(200, {});

      const searchService = new SearchService({
        contextId,
      });

      const searchResponse = await searchService.search({
        searchIndexId,
        seedItemId: 'item-123',
      });

      expect(searchResponse.results).to.deep.equal([]);
      expect(searchResponse.total).to.equal(0);
    });

    it('should throw an error if keyphrase and seedItemId are both provided', async () => {
      const searchService = new SearchService({
        contextId,
      });

      try {
        await searchService.search({
          searchIndexId,
          keyphrase: 'running shoes',
          seedItemId: 'item-123',
        });
        expect.fail('Expected search to throw');
      } catch (error) {
        expect(error)
          .to.be.an.instanceOf(TypeError)
          .and.to.have.property(
            'message',
            'Query fields are mutually exclusive. Provide only one of: keyphrase, seedItemId, seedItemUrl. Received: keyphrase, seedItemId'
          );
      }
    });

    it('should throw an error if keyphrase and seedItemUrl are both provided', async () => {
      const searchService = new SearchService({
        contextId,
      });

      try {
        await searchService.search({
          searchIndexId,
          keyphrase: 'running shoes',
          seedItemUrl: 'https://example.com/articles/cloud',
        });
        expect.fail('Expected search to throw');
      } catch (error) {
        expect(error)
          .to.be.an.instanceOf(TypeError)
          .and.to.have.property(
            'message',
            'Query fields are mutually exclusive. Provide only one of: keyphrase, seedItemId, seedItemUrl. Received: keyphrase, seedItemUrl'
          );
      }
    });

    it('should throw an error if seedItemId and seedItemUrl are both provided', async () => {
      const searchService = new SearchService({
        contextId,
      });

      try {
        await searchService.search({
          searchIndexId,
          seedItemId: 'item-123',
          seedItemUrl: 'https://example.com/articles/cloud',
        });
        expect.fail('Expected search to throw');
      } catch (error) {
        expect(error)
          .to.be.an.instanceOf(TypeError)
          .and.to.have.property(
            'message',
            'Query fields are mutually exclusive. Provide only one of: keyphrase, seedItemId, seedItemUrl. Received: seedItemId, seedItemUrl'
          );
      }
    });

    it('should throw an error if seedItemId is empty', async () => {
      const searchService = new SearchService({
        contextId,
      });

      try {
        await searchService.search({
          searchIndexId,
          seedItemId: '',
        });
        expect.fail('Expected search to throw');
      } catch (error) {
        expect(error)
          .to.be.an.instanceOf(TypeError)
          .and.to.have.property('message', 'seedItemId must be a non-empty string');
      }
    });

    it('should throw an error if seedItemUrl is whitespace only', async () => {
      const searchService = new SearchService({
        contextId,
      });

      try {
        await searchService.search({
          searchIndexId,
          seedItemUrl: '   ',
        });
        expect.fail('Expected search to throw');
      } catch (error) {
        expect(error)
          .to.be.an.instanceOf(TypeError)
          .and.to.have.property('message', 'seedItemUrl must be a non-empty string');
      }
    });
  });

  describe('sessionId', () => {
    it('should send the sessionId when the analytics plugin is registered', async () => {
      const clientId = 'test-client-id';

      const { SearchService: SearchServiceWithPlugin } = proxyquire('./search-service', {
        '@sitecore-content-sdk/analytics-core': {
          getClientId: () => clientId,
        },
      });

      nock(constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
        reqheaders: {
          'x-sitecore-contextid': contextId,
        },
      })
        .post(`/v1/search`, {
          config: {
            id: searchIndexId,
          },
          limit: 10,
          offset: 0,
          query: {
            keyphrase: '',
          },
          sessionId: clientId,
          sort: {
            fields: [],
          },
        })
        .reply(200, {
          content: [],
          total: 0,
        });

      const searchService = new SearchServiceWithPlugin({ contextId });
      const searchResponse = await searchService.search({ searchIndexId });

      expect(searchResponse.results).to.deep.equal([]);
    });

    it('should send an empty sessionId when the analytics plugin is not registered', async () => {
      const { SearchService: SearchServiceNoPlugin } = proxyquire('./search-service', {
        '@sitecore-content-sdk/analytics-core': {
          getClientId: () => {
            throw new Error('Plugin not registered');
          },
        },
      });

      nock(constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
        reqheaders: {
          'x-sitecore-contextid': contextId,
        },
      })
        .post(`/v1/search`, {
          config: {
            id: searchIndexId,
          },
          limit: 10,
          offset: 0,
          query: {
            keyphrase: '',
          },
          sessionId: '',
          sort: {
            fields: [],
          },
        })
        .reply(200, {
          content: [],
          total: 0,
        });

      const searchService = new SearchServiceNoPlugin({ contextId });
      const searchResponse = await searchService.search({ searchIndexId });

      expect(searchResponse.results).to.deep.equal([]);
    });
  });

  describe('suggest', () => {
    it('should send a suggest request with the keyphrase', async () => {
      const querySuggestions = [
        { text: 'running sho', queryPlusText: 'running shoes' },
        { text: 'running sho', queryPlusText: 'running shorts' },
      ];
      const previewResults = [
        { sc_item_id: 'doc-1', title: 'Running Shoes' },
        { sc_item_id: 'doc-2', title: 'Trail Shoes' },
      ];

      nock(constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
        reqheaders: {
          'x-sitecore-contextid': contextId,
        },
      })
        .post(`/v1/search/suggest`, {
          config: {
            id: searchIndexId,
          },
          query: {
            keyphrase: 'running sho',
          },
        })
        .reply(200, {
          querySuggestions,
          previewResults,
        });

      const searchService = new SearchService({
        contextId,
      });

      const suggestResponse = await searchService.suggest({
        searchIndexId,
        keyphrase: 'running sho',
      });

      expect(suggestResponse.querySuggestions).to.deep.equal(querySuggestions);
      expect(suggestResponse.previewResults).to.deep.equal(previewResults);
    });

    it('should send a suggest request with custom edge url', async () => {
      const customEdgeUrl = 'https://custom-edge-url.com';

      nock(customEdgeUrl, {
        reqheaders: {
          'x-sitecore-contextid': contextId,
        },
      })
        .post(`/v1/search/suggest`, {
          config: {
            id: searchIndexId,
          },
          query: {
            keyphrase: 'test',
          },
        })
        .reply(200, {
          querySuggestions: [],
          previewResults: [],
        });

      const searchService = new SearchService({
        contextId,
        edgeUrl: customEdgeUrl,
      });

      const suggestResponse = await searchService.suggest({
        searchIndexId,
        keyphrase: 'test',
      });

      expect(suggestResponse.querySuggestions).to.deep.equal([]);
      expect(suggestResponse.previewResults).to.deep.equal([]);
    });

    it('should trim keyphrase before sending the request', async () => {
      nock(constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
        reqheaders: {
          'x-sitecore-contextid': contextId,
        },
      })
        .post(`/v1/search/suggest`, {
          config: {
            id: searchIndexId,
          },
          query: {
            keyphrase: 'shoes',
          },
        })
        .reply(200, {
          querySuggestions: [{ text: 'shoes', queryPlusText: 'shoes' }],
          previewResults: [],
        });

      const searchService = new SearchService({
        contextId,
      });

      const suggestResponse = await searchService.suggest({
        searchIndexId,
        keyphrase: '  shoes  ',
      });

      expect(suggestResponse.querySuggestions).to.deep.equal([
        { text: 'shoes', queryPlusText: 'shoes' },
      ]);
    });

    it('should send a suggest request with locale when provided', async () => {
      const locale = 'fr-FR';

      nock(constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
        reqheaders: {
          'x-sitecore-contextid': contextId,
        },
      })
        .post(`/v1/search/suggest`, {
          config: {
            id: searchIndexId,
          },
          query: {
            keyphrase: 'test',
          },
          locale,
        })
        .reply(200, {
          querySuggestions: [],
          previewResults: [{ id: 1 }],
        });

      const searchService = new SearchService({ contextId });

      const suggestResponse = await searchService.suggest({
        searchIndexId,
        keyphrase: 'test',
        locale,
      });

      expect(suggestResponse.previewResults).to.deep.equal([{ id: 1 }]);
    });

    it('should not include locale in the suggest request when not provided', async () => {
      nock(constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
        reqheaders: {
          'x-sitecore-contextid': contextId,
        },
      })
        .post(`/v1/search/suggest`, {
          config: {
            id: searchIndexId,
          },
          query: {
            keyphrase: 'test',
          },
        })
        .reply(200, {
          querySuggestions: [],
          previewResults: [],
        });

      const searchService = new SearchService({ contextId });

      const suggestResponse = await searchService.suggest({
        searchIndexId,
        keyphrase: 'test',
      });

      expect(suggestResponse.querySuggestions).to.deep.equal([]);
      expect(suggestResponse.previewResults).to.deep.equal([]);
    });

    it('should default missing suggest arrays to empty arrays', async () => {
      nock(constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
        reqheaders: {
          'x-sitecore-contextid': contextId,
        },
      })
        .post(`/v1/search/suggest`, {
          config: {
            id: searchIndexId,
          },
          query: {
            keyphrase: 'test',
          },
        })
        .reply(200, {});

      const searchService = new SearchService({ contextId });

      const suggestResponse = await searchService.suggest({
        searchIndexId,
        keyphrase: 'test',
      });

      expect(suggestResponse.querySuggestions).to.deep.equal([]);
      expect(suggestResponse.previewResults).to.deep.equal([]);
    });

    it('should throw an error if the suggest request fails', async () => {
      nock(constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT, {
        reqheaders: {
          'x-sitecore-contextid': contextId,
        },
      })
        .post(`/v1/search/suggest`, {
          config: {
            id: searchIndexId,
          },
          query: {
            keyphrase: 'test',
          },
        })
        .reply(500, { message: 'Internal server error' });

      const searchService = new SearchService({
        contextId,
      });

      try {
        await searchService.suggest({
          searchIndexId,
          keyphrase: 'test',
        });
      } catch (error) {
        expect((error as NativeDataFetcherError).name).to.equal('Error');
        expect((error as NativeDataFetcherError).message).to.equal('HTTP 500 Internal Server Error');
        expect((error as NativeDataFetcherError).stack).to.be.a('string');
        expect((error as NativeDataFetcherError).response).to.deep.equal({
          status: 500,
          statusText: 'Internal Server Error',
          headers: {
            'content-type': 'application/json',
          },
          data: { message: 'Internal server error' },
        });
      }
    });

    describe('validation', () => {
      it('should throw an error if search index ID is not provided', async () => {
        const searchService = new SearchService({
          contextId,
        });

        try {
          await searchService.suggest({
            searchIndexId: '',
            keyphrase: 'test',
          });
        } catch (error) {
          expect(error)
            .to.be.an.instanceOf(TypeError)
            .and.to.have.property('message', 'Search index ID is required');
        }
      });

      it('should throw an error if keyphrase is empty', async () => {
        const searchService = new SearchService({
          contextId,
        });

        try {
          await searchService.suggest({
            searchIndexId,
            keyphrase: '',
          });
        } catch (error) {
          expect(error)
            .to.be.an.instanceOf(TypeError)
            .and.to.have.property('message', 'Keyphrase is required');
        }
      });

      it('should throw an error if keyphrase is whitespace only', async () => {
        const searchService = new SearchService({
          contextId,
        });

        try {
          await searchService.suggest({
            searchIndexId,
            keyphrase: '   ',
          });
        } catch (error) {
          expect(error)
            .to.be.an.instanceOf(TypeError)
            .and.to.have.property('message', 'Keyphrase is required');
        }
      });
    });
  });
});
