/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-expressions */
import { expect, use, spy } from 'chai';
import sinon from 'sinon';
import nock from 'nock';
import spies from 'chai-spies';
import { GraphQLRequestClient } from '@sitecore-content-sdk/core';
import { EditingService, EditingServiceConfig, query } from './editing-service';
import { mockEditingServiceResponse } from '../test-data/mockEditingServiceResponse';
import { LayoutKind } from './models';
import debug from '../debug';
import { LayoutServicePageState } from '../layout';

use(spies);

describe('EditingService', () => {
  const hostname = 'http://site';
  const clientFactory = GraphQLRequestClient.createClientFactory({
    endpoint: hostname,
    contextId: 'test-context-id',
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
    nock(hostname, {
      reqheaders: { sc_editMode: 'true', 'x-sitecore-contextid': 'test-context-id' },
    })
      .post('/', /EditingQuery/gi)
      .reply(200, editingData);

    const clientFactorySpy = sinon.spy(clientFactory);

    const service = new EditingService({
      clientFactory: clientFactorySpy,
    });

    spy.on(clientFactorySpy.returnValues[0], 'request');

    const result = await service.fetchEditingData({
      language,
      version,
      itemId,
      mode: LayoutServicePageState.Edit,
    });

    expect(clientFactorySpy.calledOnce).to.be.true;
    expect(
      clientFactorySpy.calledWith({
        debugger: debug.editing,
      })
    ).to.be.true;
    expect(clientFactorySpy.returnValues[0].request).to.be.called.exactly(1);
    expect(clientFactorySpy.returnValues[0].request).to.be.called.with(
      query,
      {
        language,
        version,
        itemId,
      },
      {
        headers: {
          sc_layoutKind: 'final',
          sc_editMode: 'true',
        },
      }
    );

    expect(result).to.deep.equal({
      layoutData: layoutDataResponse,
    });

    spy.restore(clientFactorySpy);
  });

  it('should fetch preview data', async () => {
    nock(hostname, { reqheaders: { sc_editMode: 'false' } })
      .post('/', /EditingQuery/gi)
      .reply(200, editingData);

    const clientFactorySpy = sinon.spy(clientFactory);

    const service = new EditingService({
      clientFactory: clientFactorySpy,
    });

    spy.on(clientFactorySpy.returnValues[0], 'request');

    const result = await service.fetchEditingData({
      language,
      version,
      itemId,
      mode: LayoutServicePageState.Preview,
    });

    expect(clientFactorySpy.calledOnce).to.be.true;
    expect(
      clientFactorySpy.calledWith({
        debugger: debug.editing,
      })
    ).to.be.true;
    expect(clientFactorySpy.returnValues[0].request).to.be.called.exactly(1);
    expect(clientFactorySpy.returnValues[0].request).to.be.called.with(
      query,
      {
        language,
        version,
        itemId,
      },
      {
        headers: {
          sc_layoutKind: 'final',
          sc_editMode: 'false',
        },
      }
    );

    expect(result).to.deep.equal({
      layoutData: layoutDataResponse,
    });

    spy.restore(clientFactorySpy);
  });

  it('should return empty layout', async () => {
    nock(hostname, { reqheaders: { sc_editMode: 'true' } })
      .post('/', /EditingQuery/gi)
      .reply(200, {
        data: {
          item: null,
        },
      });

    const clientFactorySpy = sinon.spy(clientFactory);

    const service = new EditingService({
      clientFactory: clientFactorySpy,
    });

    spy.on(clientFactorySpy.returnValues[0], 'request');

    const result = await service.fetchEditingData({
      language,
      version,
      itemId,
      mode: LayoutServicePageState.Edit,
    });

    expect(clientFactorySpy.calledOnce).to.be.true;
    expect(
      clientFactorySpy.calledWith({
        debugger: debug.editing,
      })
    ).to.be.true;
    expect(clientFactorySpy.returnValues[0].request).to.be.called.exactly(1);
    expect(clientFactorySpy.returnValues[0].request).to.be.called.with(
      query,
      {
        language,
        version,
        itemId,
      },
      {
        headers: {
          sc_layoutKind: 'final',
          sc_editMode: 'true',
        },
      }
    );

    expect(result).to.deep.equal({
      layoutData: {
        sitecore: {
          context: { pageEditing: true, language },
          route: null,
        },
      },
    });

    spy.restore(clientFactorySpy);
  });

  it('should fetch editing data with missing optional params', async () => {
    nock(hostname, { reqheaders: { sc_editMode: 'true' } })
      .post('/', /EditingQuery/gi)
      .reply(200, editingData);

    const clientFactorySpy = sinon.spy(clientFactory);

    const service = new EditingService({
      clientFactory: clientFactorySpy,
    });

    spy.on(clientFactorySpy.returnValues[0], 'request');

    const result = await service.fetchEditingData({
      language,
      itemId,
      mode: LayoutServicePageState.Edit,
    });

    expect(clientFactorySpy.calledOnce).to.be.true;
    expect(
      clientFactorySpy.calledWith({
        debugger: debug.editing,
      })
    ).to.be.true;
    expect(clientFactorySpy.returnValues[0].request).to.be.called.exactly(1);
    expect(clientFactorySpy.returnValues[0].request).to.be.called.with(
      query,
      {
        language,
        itemId,
        version: undefined,
      },
      {
        headers: {
          sc_layoutKind: 'final',
          sc_editMode: 'true',
        },
      }
    );

    expect(result).to.deep.equal({
      layoutData: layoutDataResponse,
    });

    spy.restore(clientFactorySpy);
  });

  it('should fetch shared layout editing data', async () => {
    nock(hostname, { reqheaders: { sc_editMode: 'true', sc_layoutKind: 'shared' } })
      .post('/', /EditingQuery/gi)
      .reply(200, editingData);

    const clientFactorySpy = sinon.spy(clientFactory);

    const service = new EditingService({
      clientFactory: clientFactorySpy,
    });

    spy.on(clientFactorySpy.returnValues[0], 'request');

    const result = await service.fetchEditingData({
      language,
      version,
      itemId,
      layoutKind: LayoutKind.Shared,
      mode: LayoutServicePageState.Edit,
    });

    expect(clientFactorySpy.calledOnce).to.be.true;
    expect(clientFactorySpy.returnValues[0].request).to.be.called.exactly(1);
    expect(clientFactorySpy.returnValues[0].request).to.be.called.with(
      query,
      {
        language,
        version,
        itemId,
      },
      {
        headers: {
          sc_layoutKind: 'shared',
          sc_editMode: 'true',
        },
      }
    );

    expect(result).to.deep.equal({
      layoutData: layoutDataResponse,
    });

    spy.restore(clientFactorySpy);
  });

  it('should throw an error when client factory is not provided', async () => {
    try {
      const service = new EditingService({} as EditingServiceConfig);

      await service.fetchEditingData({
        language,
        version,
        itemId,
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
      .post('/', /EditingQuery/gi)
      .reply(500, 'Internal server error');

    const service = new EditingService({
      clientFactory,
    });

    try {
      await service.fetchEditingData({
        language,
        version,
        itemId,
        mode: LayoutServicePageState.Edit,
      });
    } catch (error) {
      expect(error.response.error).to.equal('Internal server error');
    }
  });

  it('should throw an error when language is not provided', async () => {
    const service = new EditingService({
      clientFactory,
    });

    try {
      await service.fetchEditingData({
        language: '',
        version,
        itemId,
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
    });

    sinon.stub(GraphQLRequestClient.prototype, 'request').callsFake(requestMock);

    const service = new EditingService({
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
