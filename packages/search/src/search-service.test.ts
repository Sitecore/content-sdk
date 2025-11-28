import { describe, it } from 'mocha';
import { constants } from '@sitecore-content-sdk/core';
import { SearchService, SortSetting } from './search-service';
import { expect } from 'chai';
import nock from 'nock';

describe('SearchService', () => {
  const searchIndexId = '1234567890';
  const contextId = 'dbc124567890';

  afterEach(() => {
    nock.cleanAll();
  });

  it('should send a request with the keyphrase', async () => {
    nock(constants.SITECORE_EDGE_URL_DEFAULT)
      .post(`/v1/search?sitecoreContextId=${contextId}`, {
        config: {
          id: searchIndexId,
        },
        limit: 10,
        offset: 0,
        query: {
          keyphrase: 'test',
        },
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
    nock(constants.SITECORE_EDGE_URL_DEFAULT)
      .post(`/v1/search?sitecoreContextId=${contextId}`, {
        config: {
          id: searchIndexId,
        },
        limit: 10,
        offset: 0,
        query: {
          keyphrase: '',
        },
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

    nock(customEdgeUrl)
      .post(`/v1/search?sitecoreContextId=${contextId}`, {
        config: {
          id: searchIndexId,
        },
        limit: 10,
        offset: 0,
        query: {
          keyphrase: 'test',
        },
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

    nock(constants.SITECORE_EDGE_URL_DEFAULT)
      .post(`/v1/search?sitecoreContextId=${contextId}`, {
        config: {
          id: searchIndexId,
        },
        limit,
        offset: 0,
        query: {
          keyphrase: 'test',
        },
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

    nock(constants.SITECORE_EDGE_URL_DEFAULT)
      .post(`/v1/search?sitecoreContextId=${contextId}`, {
        config: {
          id: searchIndexId,
        },
        limit: 10,
        offset,
        query: {
          keyphrase: 'test',
        },
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

    nock(constants.SITECORE_EDGE_URL_DEFAULT)
      .post(`/v1/search?sitecoreContextId=${contextId}`, {
        config: {
          id: searchIndexId,
        },
        limit: 10,
        offset: 0,
        query: {
          keyphrase: 'test',
        },
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

    nock(constants.SITECORE_EDGE_URL_DEFAULT)
      .post(`/v1/search?sitecoreContextId=${contextId}`, {
        config: {
          id: searchIndexId,
        },
        limit: 10,
        offset: 0,
        query: {
          keyphrase: 'test',
        },
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
    nock(constants.SITECORE_EDGE_URL_DEFAULT)
      .post(`/v1/search?sitecoreContextId=${contextId}`, {
        config: {
          id: searchIndexId,
        },
        limit: 10,
        offset: 0,
        query: {
          keyphrase: 'test',
        },
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
});
