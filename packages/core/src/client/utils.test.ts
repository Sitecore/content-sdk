import { expect } from 'chai';
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
  });

  it('creates client with edge context when contextId is provided (server side)', () => {
    const factory = createGraphQLClientFactory({
      api: {
        edge: {
          contextId: 'test-context-id',
          edgeUrl: 'https://test.edge.url',
        },
      },
    });

    expect(factory).to.not.be.undefined;
  });

  it('creates client with clientContextId in a browser environment', () => {
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
  });

  it('creates client with local API settings when provided', () => {
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
});
