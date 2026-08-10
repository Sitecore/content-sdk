/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import { Agent } from 'undici';
import { GraphQLRequestClient } from '@sitecore-content-sdk/core';
import { createGraphQLClientFactory, createCliGraphQLClientFactory } from './utils';

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

  it('passes custom fetch through to client factory config', () => {
    const createClientFactorySpy = sinon.spy(GraphQLRequestClient, 'createClientFactory');
    const customFetch = sinon.stub();

    createGraphQLClientFactory({
      api: {
        edge: {
          contextId: 'test-context-id',
          edgeUrl: 'https://test.edge.url',
        },
      },
      fetch: customFetch as unknown as typeof fetch,
    });

    expect(createClientFactorySpy.calledOnce).to.be.true;
    expect(createClientFactorySpy.firstCall.args[0]).to.deep.include({
      endpoint: 'https://test.edge.url/v1/content/api/graphql/v1',
      contextId: 'test-context-id',
      fetch: customFetch,
    });
  });
});

describe('createCliGraphQLClientFactory', () => {
  const originalWindow = global.window;
  const edgeApi = { edge: { contextId: 'test-context-id', edgeUrl: 'https://test.edge.url' } };

  // Track and neutralize Agent#destroy so tests never tear down real sockets,
  // while still asserting the CLI factory cleans up its dispatcher.
  let destroyCalls: number;
  let originalDestroy: typeof Agent.prototype.destroy;

  beforeEach(() => {
    delete (global as any).window;
    destroyCalls = 0;
    originalDestroy = Agent.prototype.destroy;
    // Own-property assignment shadows the inherited Dispatcher#destroy regardless
    // of where it lives on the prototype chain.
    (Agent.prototype as any).destroy = function () {
      destroyCalls++;
      return Promise.resolve();
    };
  });

  afterEach(() => {
    global.window = originalWindow;
    (Agent.prototype as any).destroy = originalDestroy;
    sinon.restore();
  });

  // Pulls the wrapped `nonHangingFetch` back out of the client factory config so we
  // can exercise it directly without a real GraphQL request.
  const getWrappedFetch = (options: Parameters<typeof createCliGraphQLClientFactory>[0]) => {
    const spy = sinon.spy(GraphQLRequestClient, 'createClientFactory');
    createCliGraphQLClientFactory(options);
    expect(spy.calledOnce).to.be.true;
    return spy.firstCall.args[0].fetch as (input: any, init?: any) => Promise<any>;
  };

  it('returns a client factory (delegates to createGraphQLClientFactory)', () => {
    const spy = sinon.spy(GraphQLRequestClient, 'createClientFactory');

    const factory = createCliGraphQLClientFactory({ api: edgeApi });

    expect(factory).to.not.be.undefined;
    expect(spy.calledOnce).to.be.true;
    expect(spy.firstCall.args[0]).to.deep.include({
      endpoint: 'https://test.edge.url/v1/content/api/graphql/v1',
      contextId: 'test-context-id',
    });
  });

  it('wraps fetch: the fetch handed to the factory is not the raw fetch', () => {
    const spy = sinon.spy(GraphQLRequestClient, 'createClientFactory');
    const customFetch = sinon.stub();

    createCliGraphQLClientFactory({ api: edgeApi, fetch: customFetch as unknown as typeof fetch });

    const passedFetch = spy.firstCall.args[0].fetch;
    expect(passedFetch).to.be.a('function');
    expect(passedFetch).to.not.equal(customFetch);
  });

  it('propagates the misconfiguration error from the underlying factory', () => {
    // Server (no window) + empty api → createGraphQLClientFactory throws.
    expect(() => createCliGraphQLClientFactory({ api: {} })).to.throw(
      'GraphQL client misconfigured.'
    );
  });

  describe('wrapped fetch (nonHangingFetch)', () => {
    it('calls the provided fetch with a fresh undici Agent merged into init', async () => {
      const response = { ok: true };
      const customFetch = sinon.stub().resolves(response);
      const wrapped = getWrappedFetch({
        api: edgeApi,
        fetch: customFetch as unknown as typeof fetch,
      });

      const result = await wrapped('https://example.test/graphql', { method: 'POST' });

      expect(customFetch.calledOnce).to.be.true;
      const [calledInput, calledInit] = customFetch.firstCall.args;
      expect(calledInput).to.equal('https://example.test/graphql');
      // original init is preserved
      expect(calledInit.method).to.equal('POST');
      // dispatcher is injected as an undici Agent
      expect(calledInit.dispatcher).to.be.instanceOf(Agent);
      expect(result).to.equal(response);
    });

    it('destroys the dispatcher after the fetch resolves', async () => {
      const customFetch = sinon.stub().resolves({});
      const wrapped = getWrappedFetch({
        api: edgeApi,
        fetch: customFetch as unknown as typeof fetch,
      });

      await wrapped('https://example.test/graphql');

      expect(customFetch.calledOnce).to.be.true;
      expect(destroyCalls).to.equal(1);
    });

    it('falls back to globalThis.fetch when no fetch option is provided', async () => {
      const globalFetchStub = sinon.stub(globalThis, 'fetch').resolves({} as Response);
      const wrapped = getWrappedFetch({ api: edgeApi });

      await wrapped('https://example.test/graphql');

      expect(globalFetchStub.calledOnce).to.be.true;
      expect(globalFetchStub.firstCall.args[1]?.dispatcher).to.be.instanceOf(Agent);
      expect(destroyCalls).to.equal(1);
    });

    it('uses a fresh dispatcher and cleans it up on every call', async () => {
      const customFetch = sinon.stub().resolves({});
      const wrapped = getWrappedFetch({
        api: edgeApi,
        fetch: customFetch as unknown as typeof fetch,
      });

      await wrapped('https://example.test/a');
      await wrapped('https://example.test/b');

      const firstDispatcher = customFetch.firstCall.args[1].dispatcher;
      const secondDispatcher = customFetch.secondCall.args[1].dispatcher;
      expect(firstDispatcher).to.be.instanceOf(Agent);
      expect(secondDispatcher).to.be.instanceOf(Agent);
      expect(firstDispatcher).to.not.equal(secondDispatcher);
      expect(destroyCalls).to.equal(2);
    });

    it('does not overwrite a caller-supplied dispatcher key silently (CLI dispatcher wins)', async () => {
      const customFetch = sinon.stub().resolves({});
      const wrapped = getWrappedFetch({
        api: edgeApi,
        fetch: customFetch as unknown as typeof fetch,
      });

      const callerDispatcher = { marker: 'caller' };
      await wrapped('https://example.test/graphql', { dispatcher: callerDispatcher });

      // The CLI wrapper appends its own dispatcher last, so it replaces the caller's.
      expect(customFetch.firstCall.args[1].dispatcher).to.be.instanceOf(Agent);
      expect(customFetch.firstCall.args[1].dispatcher).to.not.equal(callerDispatcher);
    });

    it('propagates errors from the underlying fetch', async () => {
      const failure = new Error('network boom');
      const customFetch = sinon.stub().rejects(failure);
      const wrapped = getWrappedFetch({
        api: edgeApi,
        fetch: customFetch as unknown as typeof fetch,
      });

      let caught: unknown;
      try {
        await wrapped('https://example.test/graphql');
      } catch (error) {
        caught = error;
      }

      expect(caught).to.equal(failure);
    });

    it('destroys the dispatcher even when the underlying fetch rejects', async () => {
      const customFetch = sinon.stub().rejects(new Error('network boom'));
      const wrapped = getWrappedFetch({
        api: edgeApi,
        fetch: customFetch as unknown as typeof fetch,
      });

      // The rejection must not skip the finally-block cleanup.
      await wrapped('https://example.test/graphql').catch(() => undefined);

      expect(customFetch.calledOnce).to.be.true;
      expect(destroyCalls).to.equal(1);
    });
  });
});
