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
        facet: {
          fields: [],
          all: true,
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
        facet: {
          fields: [],
          all: true,
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
        facet: {
          fields: [],
          all: true,
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
        facet: {
          fields: [],
          all: true,
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
        facet: {
          fields: [],
          all: true,
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
        facet: {
          fields: [],
          all: true,
        },
        sort,
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
        facet: {
          fields: [],
          all: true,
        },
        sort,
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
        facet: {
          fields: [],
          all: true,
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
});
