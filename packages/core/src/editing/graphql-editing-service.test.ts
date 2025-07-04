/* eslint-disable no-unused-expressions */
import debug from '../debug.js';
import { expect } from 'chai';
import sinon from 'sinon';
import nock from 'nock';
import { GraphQLRequestClient } from '../graphql-request-client.js';
import {
  GraphQLEditingService,
  GraphQLEditingServiceConfig,
  query,
  dictionaryQuery,
} from './graphql-editing-service.js';
import {
  mockEditingServiceDictionaryResponse,
  mockEditingServiceResponse,
} from '../test-data/mockEditingServiceResponse.js';
import { LayoutKind } from './models.js';
import { LayoutServicePageState } from '../layout/index.js';

describe('GraphQLEditingService', () => {
  const hostname = 'http://site';
  const endpointPath = '/?sitecoreContextId=context-id';
  const siteName = 'site-name';
  const clientFactory = GraphQLRequestClient.createClientFactory({
    endpoint: hostname + endpointPath,
  });
  const language = 'en';
  const version = 'latest';
  const itemId = '{3E0A2F20-B325-5E57-881F-FF6648D08575}';

  const editingData = mockEditingServiceResponse();

  const layoutDataResponse = {
    sitecore: {
      context: {
        pageEditing: true,
        language: 'en',
      },
      route: {
        name: 'Sample',
        placeholders: {
          main: [
            {
              componentName: 'Sample',
              fields: {
                title: {
                  value: 'Hello world!',
                },
              },
            },
          ],
        },
      },
    },
  };

  afterEach(() => {
    nock.cleanAll();
    sinon.restore();
  });

  it('should fetch editing data', async () => {
    nock(hostname, { reqheaders: { sc_editMode: 'true' } })
      .post(endpointPath, /EditingQuery/gi)
      .reply(200, editingData);

    const clientFactorySpy = sinon.spy(clientFactory);

    const service = new GraphQLEditingService({
      clientFactory: clientFactorySpy,
    });

    const requestSpy = sinon.spy(clientFactorySpy.returnValues[0], 'request');

    const result = await service.fetchEditingData({
      language,
      version,
      itemId,
      siteName,
      mode: LayoutServicePageState.Edit,
    });

    expect(clientFactorySpy.calledOnce).to.be.true;
    expect(
      clientFactorySpy.calledWith({
        debugger: debug.editing,
      })
    ).to.be.true;
    expect(
      requestSpy.calledOnceWithExactly(
        query,
        {
          language,
          version,
          itemId,
          siteName,
        },
        {
          headers: {
            sc_layoutKind: 'final',
            sc_editMode: 'true',
          },
        }
      )
    ).to.be.true;

    expect(result).to.deep.equal({
      layoutData: layoutDataResponse,
      dictionary: {
        foo: 'foo-phrase',
        bar: 'bar-phrase',
      },
    });
  });

  it('should fetch preview data', async () => {
    nock(hostname, { reqheaders: { sc_editMode: 'false' } })
      .post(endpointPath, /EditingQuery/gi)
      .reply(200, editingData);

    const clientFactorySpy = sinon.spy(clientFactory);

    const service = new GraphQLEditingService({
      clientFactory: clientFactorySpy,
    });

    const requestSpy = sinon.spy(clientFactorySpy.returnValues[0], 'request');

    const result = await service.fetchEditingData({
      language,
      version,
      itemId,
      siteName,
      mode: LayoutServicePageState.Preview,
    });

    expect(clientFactorySpy.calledOnce).to.be.true;
    expect(
      clientFactorySpy.calledWith({
        debugger: debug.editing,
      })
    ).to.be.true;
    expect(
      requestSpy.calledOnceWithExactly(
        query,
        {
          language,
          version,
          itemId,
          siteName,
        },
        {
          headers: {
            sc_layoutKind: 'final',
            sc_editMode: 'false',
          },
        }
      )
    ).to.be.true;

    expect(result).to.deep.equal({
      layoutData: layoutDataResponse,
      dictionary: {
        foo: 'foo-phrase',
        bar: 'bar-phrase',
      },
    });
  });

  it('should return empty dictionary and layout', async () => {
    nock(hostname, { reqheaders: { sc_editMode: 'true' } })
      .post(endpointPath, /EditingQuery/gi)
      .reply(200, {
        data: {
          item: null,
          site: {
            siteInfo: {
              dictionary: null,
            },
          },
        },
      });

    const clientFactorySpy = sinon.spy(clientFactory);

    const service = new GraphQLEditingService({
      clientFactory: clientFactorySpy,
    });

    const requestSpy = sinon.spy(clientFactorySpy.returnValues[0], 'request');

    const result = await service.fetchEditingData({
      language,
      version,
      itemId,
      siteName,
      mode: LayoutServicePageState.Edit,
    });

    expect(clientFactorySpy.calledOnce).to.be.true;
    expect(
      clientFactorySpy.calledWith({
        debugger: debug.editing,
      })
    ).to.be.true;
    expect(
      requestSpy.calledOnceWithExactly(
        query,
        {
          language,
          version,
          itemId,
          siteName,
        },
        {
          headers: {
            sc_layoutKind: 'final',
            sc_editMode: 'true',
          },
        }
      )
    ).to.be.true;

    expect(result).to.deep.equal({
      layoutData: {
        sitecore: {
          context: { pageEditing: true, language },
          route: null,
        },
      },
      dictionary: {},
    });
  });

  it('should fetch editing data with missing optional params', async () => {
    nock(hostname, { reqheaders: { sc_editMode: 'true' } })
      .post(endpointPath, /EditingQuery/gi)
      .reply(200, editingData);

    const clientFactorySpy = sinon.spy(clientFactory);

    const service = new GraphQLEditingService({
      clientFactory: clientFactorySpy,
    });

    const requestSpy = sinon.spy(clientFactorySpy.returnValues[0], 'request');

    const result = await service.fetchEditingData({
      language,
      itemId,
      siteName,
      mode: LayoutServicePageState.Edit,
    });

    expect(clientFactorySpy.calledOnce).to.be.true;
    expect(
      clientFactorySpy.calledWith({
        debugger: debug.editing,
      })
    ).to.be.true;
    expect(
      requestSpy.calledOnceWithExactly(
        query,
        {
          language,
          itemId,
          siteName,
          version: undefined,
        },
        {
          headers: {
            sc_layoutKind: 'final',
            sc_editMode: 'true',
          },
        }
      )
    ).to.be.true;

    expect(result).to.deep.equal({
      layoutData: layoutDataResponse,
      dictionary: {
        foo: 'foo-phrase',
        bar: 'bar-phrase',
      },
    });
  });

  it('should fetch shared layout editing data', async () => {
    nock(hostname, { reqheaders: { sc_editMode: 'true', sc_layoutKind: 'shared' } })
      .post(endpointPath, /EditingQuery/gi)
      .reply(200, editingData);

    const clientFactorySpy = sinon.spy(clientFactory);

    const service = new GraphQLEditingService({
      clientFactory: clientFactorySpy,
    });

    const requestSpy = sinon.spy(clientFactorySpy.returnValues[0], 'request');

    const result = await service.fetchEditingData({
      language,
      version,
      itemId,
      siteName,
      layoutKind: LayoutKind.Shared,
      mode: LayoutServicePageState.Edit,
    });

    expect(clientFactorySpy.calledOnce).to.be.true;
    expect(
      requestSpy.calledOnceWithExactly(
        query,
        {
          language,
          version,
          itemId,
          siteName,
        },
        {
          headers: {
            sc_layoutKind: 'shared',
            sc_editMode: 'true',
          },
        }
      )
    ).to.be.true;

    expect(result).to.deep.equal({
      layoutData: layoutDataResponse,
      dictionary: {
        foo: 'foo-phrase',
        bar: 'bar-phrase',
      },
    });
  });

  it('should fetch editing data when dicionary has multiple pages', async () => {
    nock(hostname, { reqheaders: { sc_editMode: 'true' } })
      .post(endpointPath, /EditingQuery/gi)
      .reply(200, mockEditingServiceResponse(true));

    nock(hostname)
      .post(endpointPath, /DictionaryQuery/gi)
      .reply(200, mockEditingServiceDictionaryResponse.pageOne);

    nock(hostname)
      .post(endpointPath, /DictionaryQuery/gi)
      .reply(200, mockEditingServiceDictionaryResponse.pageTwo);

    const clientFactorySpy = sinon.spy(clientFactory);

    const service = new GraphQLEditingService({
      clientFactory: clientFactorySpy,
    });

    const requestSpy = sinon.spy(clientFactorySpy.returnValues[0], 'request');

    const result = await service.fetchEditingData({
      language,
      version,
      itemId,
      siteName,
      mode: LayoutServicePageState.Edit,
    });

    expect(clientFactorySpy.called).to.be.true;
    expect(
      clientFactorySpy.calledWith({
        debugger: debug.editing,
      })
    ).to.be.true;

    expect(requestSpy.calledThrice).to.be.true;
    expect(
      requestSpy.firstCall.calledWith(query, {
        language,
        version,
        itemId,
        siteName,
      })
    ).to.be.true;

    expect(
      requestSpy.secondCall.calledWith(dictionaryQuery, {
        language,
        siteName,
        after: 'cursor',
      })
    ).to.be.true;

    expect(
      requestSpy.thirdCall.calledWith(dictionaryQuery, {
        language,
        siteName,
        after: 'cursor-one',
      })
    ).to.be.true;

    expect(result).to.deep.equal({
      layoutData: layoutDataResponse,
      dictionary: {
        foo: 'foo-phrase',
        bar: 'bar-phrase',
        'foo-one': 'foo-one-phrase',
        'bar-one': 'bar-one-phrase',
        'foo-two': 'foo-two-phrase',
        'bar-two': 'bar-two-phrase',
      },
    });
  });

  describe('fetchDictionaryData', () => {
    it('should request dictionary from scratch when fetchDictionaryData called on its own', async () => {
      nock(hostname)
        .post(endpointPath, /DictionaryQuery/gi)
        .reply(200, mockEditingServiceDictionaryResponse.pageOne);

      nock(hostname)
        .post(endpointPath, /DictionaryQuery/gi)
        .reply(200, mockEditingServiceDictionaryResponse.pageTwo);

      const service = new GraphQLEditingService({
        clientFactory: clientFactory,
      });

      const result = await service.fetchDictionaryData({
        language,
        siteName,
      });

      expect(result).to.deep.equal({
        'foo-one': 'foo-one-phrase',
        'bar-one': 'bar-one-phrase',
        'foo-two': 'foo-two-phrase',
        'bar-two': 'bar-two-phrase',
      });
    });

    it('should pass fetchOptions to the GraphQL client', async () => {
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
      const requestMock = sinon.stub().resolves({
        layout: {
          item: {
            rendered: {
              sitecore: {
                context: { pageEditing: false, language: 'en' },
                route: null,
              },
            },
          },
        },
      });

      sinon.stub(GraphQLRequestClient.prototype, 'request').callsFake(requestMock);

      const service = new GraphQLEditingService({
        clientFactory: clientFactory,
      });

      await service.fetchDictionaryData(
        {
          language,
          siteName,
        },
        fetchOptions
      );
      expect(requestMock.calledOnce).to.be.true;
      expect(requestMock.firstCall.args[2]).to.deep.equal(fetchOptions);
    });
  });

  it('should return empty dictionary when dictionary is not provided', async () => {
    const editingData = mockEditingServiceResponse();

    (editingData.data.site.siteInfo as any) = null;

    nock(hostname, { reqheaders: { sc_editMode: 'true' } })
      .post(endpointPath, /EditingQuery/gi)
      .reply(200, editingData);

    const clientFactorySpy = sinon.spy(clientFactory);

    const service = new GraphQLEditingService({
      clientFactory: clientFactorySpy,
    });

    const requestSpy = sinon.spy(clientFactorySpy.returnValues[0], 'request');

    const result = await service.fetchEditingData({
      language,
      version,
      itemId,
      siteName,
      mode: LayoutServicePageState.Edit,
    });

    expect(clientFactorySpy.calledOnce).to.be.true;
    expect(
      clientFactorySpy.calledWith({
        debugger: debug.editing,
      })
    ).to.be.true;
    expect(
      requestSpy.calledOnceWithExactly(
        query,
        {
          language,
          version,
          itemId,
          siteName,
        },
        {
          headers: {
            sc_layoutKind: 'final',
            sc_editMode: 'true',
          },
        }
      )
    ).to.be.true;

    expect(result).to.deep.equal({
      layoutData: layoutDataResponse,
      dictionary: {},
    });
  });

  it('should throw an error when client factory is not provided', async () => {
    try {
      const service = new GraphQLEditingService({} as GraphQLEditingServiceConfig);

      await service.fetchEditingData({
        language,
        version,
        itemId,
        siteName,
        mode: LayoutServicePageState.Edit,
      });
    } catch (error) {
      expect(error.message).to.equal(
        'clientFactory needs to be provided when initializing GraphQL client.'
      );
    }
  });

  it('should throw an error when fetching editing data', async () => {
    nock(hostname, { reqheaders: { sc_editMode: 'true' } })
      .post(endpointPath, /EditingQuery/gi)
      .reply(500, 'Internal server error');

    const service = new GraphQLEditingService({
      clientFactory,
    });

    try {
      await service.fetchEditingData({
        language,
        version,
        itemId,
        siteName,
        mode: LayoutServicePageState.Edit,
      });
    } catch (error) {
      expect(error.message).to.include('GraphQL Error (Code: 500)');
    }
  });

  it('should throw an error when siteName is not provided', async () => {
    const service = new GraphQLEditingService({
      clientFactory,
    });

    try {
      await service.fetchEditingData({
        language,
        version,
        itemId,
        siteName: '',
        mode: LayoutServicePageState.Edit,
      });
    } catch (error) {
      expect(error.message).to.equal('The site name must be a non-empty string');
    }
  });

  it('should throw an error when language is not provided', async () => {
    const service = new GraphQLEditingService({
      clientFactory,
    });

    try {
      await service.fetchEditingData({
        language: '',
        version,
        itemId,
        siteName,
        mode: LayoutServicePageState.Edit,
      });
    } catch (error) {
      expect(error.message).to.equal('The language must be a non-empty string');
    }
  });

  it('should pass fetchOptions to the GraphQL client', async () => {
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
    const editingOptions = {
      siteName: 'example-site',
      itemId: 'item-123',
      language: 'en',
      version: '1',
      layoutKind: LayoutKind.Final,
      mode: LayoutServicePageState.Edit,
    };

    const requestMock = sinon.stub().resolves({
      item: {
        rendered: {
          sitecore: {
            context: { pageEditing: true, language: 'en' },
            route: null,
          },
        },
      },
      site: {
        siteInfo: {
          dictionary: {
            results: [],
            pageInfo: { hasNext: false, endCursor: '' },
          },
        },
      },
    });

    sinon.stub(GraphQLRequestClient.prototype, 'request').callsFake(requestMock);

    const service = new GraphQLEditingService({
      clientFactory,
    });

    await service.fetchEditingData(editingOptions, fetchOptions);

    expect(requestMock.calledOnce).to.be.true;
    expect(requestMock.firstCall.args[2]).to.deep.equal({
      ...fetchOptions,
      headers: {
        sc_editMode: 'true',
        sc_layoutKind: LayoutKind.Final,
      },
    });
  });
});
