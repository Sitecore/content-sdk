/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import { GraphQLRequestClient } from '../graphql-request-client';
import { createGraphQLClientFactory } from './utils';

describe('createGraphQLClientFactory', () => {
  const originalWindow = global.window;

  beforeEach(() => {
    // Reset window state
    delete (global as any).window;
  });

  afterEach(() => {
    // Restore window
    global.window = originalWindow;
    sinon.restore();
  });

  it('creates client with edge context when contextId is provided (server side)', () => {
    const createClientFactorySpy = sinon.spy(GraphQLRequestClient, 'createClientFactory');

    const factory = createGraphQLClientFactory({
      api: {
        edge: {
          contextId: 'test-context-id',
          edgeUrl: 'https://test.edge.url',
        },
      },
    });

    expect(factory).to.not.be.undefined;
    expect(createClientFactorySpy.calledOnce).to.be.true;
    expect(createClientFactorySpy.firstCall.args[0]).to.deep.include({
      endpoint: 'https://test.edge.url/v1/content/api/graphql/v1',
      contextId: 'test-context-id',
    });
  });

  it('creates client with clientContextId in a browser environment', () => {
    const createClientFactorySpy = sinon.spy(GraphQLRequestClient, 'createClientFactory');

    // Simulate browser
    (global as any).window = {};

    const factory = createGraphQLClientFactory({
      api: {
        edge: {
          clientContextId: 'browser-id',
          edgeUrl: 'https://test.edge.url',
        },
      },
    });

    expect(factory).to.not.be.undefined;
    expect(createClientFactorySpy.calledOnce).to.be.true;
    expect(createClientFactorySpy.firstCall.args[0]).to.deep.include({
      endpoint: 'https://test.edge.url/v1/content/api/graphql/v1',
      contextId: 'browser-id',
    });
  });

  it('creates client with local API settings when provided', () => {
    const createClientFactorySpy = sinon.spy(GraphQLRequestClient, 'createClientFactory');

    const factory = createGraphQLClientFactory({
      api: {
        local: {
          apiKey: 'test-key',
          apiHost: 'https://test.host',
          path: '/api/graphql',
        },
      },
    });

    expect(factory).to.not.be.undefined;
    expect(createClientFactorySpy.calledOnce).to.be.true;
    expect(createClientFactorySpy.firstCall.args[0]).to.not.have.property('contextId');
  });

  it('handles browser environment with no valid IDs by falling back (does not throw)', () => {
    // Browser
    (global as any).window = {};

    expect(() =>
      createGraphQLClientFactory({
        api: {
          // empty configs trigger the warning branch
        },
      })
    ).to.not.throw();
  });

  it('throws error on server when no valid configuration is provided', () => {
    // Server (no window)
    delete (global as any).window;

    expect(() =>
      createGraphQLClientFactory({
        api: {
          // empty configs
        },
      })
    ).to.throw('GraphQL client misconfigured.');
  });

  it('works with minimal edge config (contextId only)', () => {
    const factory = createGraphQLClientFactory({
      api: {
        edge: { contextId: 'test-context' },
      },
    });

    expect(factory).to.not.be.undefined;
  });

  it('works with minimal local config', () => {
    const factory = createGraphQLClientFactory({
      api: {
        local: {
          apiKey: 'test-key',
          apiHost: 'https://test.host',
        },
      },
    });

    expect(factory).to.not.be.undefined;
  });

  it('prioritizes Edge over Local when both are provided', () => {
    // When both Edge and Local configs are provided, Edge should take priority
    const factory = createGraphQLClientFactory({
      api: {
        edge: {
          contextId: 'edge-context-id',
          edgeUrl: 'https://test.edge.url',
        },
        local: {
          apiKey: 'local-key',
          apiHost: 'https://local.host',
          path: '/api/graphql',
        },
      },
    });

    // Factory should be created successfully (using Edge, not Local)
    expect(factory).to.not.be.undefined;
  });

  it('falls back to Local when Edge contextId is missing', () => {
    // When Edge contextId is missing but Local config is provided, should use Local
    const factory = createGraphQLClientFactory({
      api: {
        edge: {
          // No contextId - Edge config incomplete
          edgeUrl: 'https://test.edge.url',
        },
        local: {
          apiKey: 'local-key',
          apiHost: 'https://local.host',
          path: '/api/graphql',
        },
      },
    });

    // Factory should be created successfully (falling back to Local)
    expect(factory).to.not.be.undefined;
  });
});
