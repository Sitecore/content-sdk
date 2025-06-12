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

  it('should create client with edge context when contextId provided', () => {
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

  it('should create client with local API when provided', () => {
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

  it('should handle browser environment gracefully without throwing', () => {
    // Simulate browser environment
    (global as any).window = {};

    expect(() => {
      createGraphQLClientFactory({
        api: {
          edge: {
            contextId: '', // Provide empty contextId to satisfy type requirements
          },
          local: {
            apiKey: '', // Provide empty values to satisfy type requirements
            apiHost: '',
          },
        },
      });
    }).to.not.throw();
  });

  it('should throw error on server when no valid config provided', () => {
    // Ensure we're in server environment (no window)
    delete (global as any).window;

    expect(() => {
      createGraphQLClientFactory({
        api: {
          edge: {
            contextId: '', // Empty contextId
          },
          local: {
            apiKey: '', // Empty local config
            apiHost: '',
          },
        },
      });
    }).to.throw(
      'Please configure and use either your sitecoreEdgeContextId, or your graphQLEndpoint and sitecoreApiKey.'
    );
  });

  it('should work with minimal edge config', () => {
    const factory = createGraphQLClientFactory({
      api: {
        edge: {
          contextId: 'test-context',
        },
      },
    });

    expect(factory).to.not.be.undefined;
  });

  it('should work with minimal local config', () => {
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
