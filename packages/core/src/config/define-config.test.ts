import { expect } from 'chai';
import { deepMerge, defineConfig, getFallbackConfig } from './define-config.js';
import { SitecoreConfigInput } from './models.js';
import { DefaultRetryStrategy } from '../retries.js';
import { SITECORE_EDGE_URL_DEFAULT } from '../constants.js';

describe('define-config', () => {
  const mockConfig: SitecoreConfigInput = {
    api: {
      edge: {
        contextId: 'context-id',
        clientContextId: 'client-id',
      },
      local: {
        apiHost: 'api-host.com',
        apiKey: 'api-key',
      },
    },
    defaultSite: 'unit-site',
    defaultLanguage: 'en',
    multisite: {
      enabled: true,
    },
    personalize: {
      enabled: false,
      edgeTimeout: 1000,
      cdpTimeout: 1000,
      scope: 'unit-scope',
    },
    redirects: {
      enabled: true,
      locales: ['en'],
    },
  };

  it('should merge config from sitecore.config with default values', () => {
    const config = defineConfig(mockConfig);
    const fallbackConfig = getFallbackConfig();
    // api.edge
    expect(config.api.edge.contextId).to.equal(mockConfig.api?.edge?.contextId);
    expect(config.api.edge.clientContextId).to.equal(mockConfig.api?.edge?.clientContextId);
    expect(config.api.edge.edgeUrl).to.equal(fallbackConfig.api.edge.edgeUrl);

    // api.local
    expect(config.api.local.apiHost).to.equal(mockConfig.api?.local?.apiHost);
    expect(config.api.local.apiKey).to.equal(mockConfig.api?.local?.apiKey);

    // defaultSite
    expect(config.defaultSite).to.equal(mockConfig.defaultSite);

    // defaultLanguage
    expect(config.defaultLanguage).to.equal(mockConfig.defaultLanguage);

    // multisite
    expect(config.multisite.enabled).to.equal(mockConfig.multisite?.enabled);
    expect(config.multisite.useCookieResolution()).to.equal(false);

    // personalize
    expect(config.personalize.enabled).to.equal(mockConfig.personalize?.enabled);
    expect(config.personalize.edgeTimeout).to.equal(mockConfig.personalize?.edgeTimeout);
    expect(config.personalize.cdpTimeout).to.equal(mockConfig.personalize?.cdpTimeout);
    expect(config.personalize.scope).to.equal(mockConfig.personalize?.scope);
    expect(config.personalize.currency).to.equal(fallbackConfig.personalize.currency);
    expect(config.personalize.channel).to.equal(fallbackConfig.personalize.channel);

    // redirects
    expect(config.redirects.enabled).to.equal(mockConfig.redirects?.enabled);
    expect(config.redirects.locales).to.deep.equal(mockConfig.redirects?.locales);

    // retries (fallback config values)
    expect(config.retries?.count).to.equal(fallbackConfig.retries.count);
    expect(config.retries?.retryStrategy).to.not.be.undefined;

    // dictionary caching
    expect(config.dictionary.caching.enabled).to.equal(fallbackConfig.dictionary.caching.enabled);
    expect(config.dictionary.caching.timeout).to.equal(fallbackConfig.dictionary.caching.timeout);
  });

  it('should throw when both api.edge and api.local sets are missing', () => {
    const failingConfig: SitecoreConfigInput = {
      ...mockConfig,
      api: {
        edge: undefined,
        local: undefined,
      },
    };
    expect(() => defineConfig(failingConfig)).to.throw(
      'Configuration error: at least one API configuration must be specified: contextId (server-side), clientContextId (client-side), or local API settings (apiHost + apiKey)'
    );
  });

  it('should apply default config values when personalize timeouts are falsy', () => {
    const zeroTimeoutConfig = {
      ...mockConfig,
      personalize: {
        cdpTimeout: 0,
        edgeTimeout: 0,
      },
    };
    const fallbackConfig = getFallbackConfig();

    let config = defineConfig(zeroTimeoutConfig);

    expect(config.personalize.edgeTimeout).to.equal(fallbackConfig.personalize.edgeTimeout);
    expect(config.personalize.cdpTimeout).to.equal(fallbackConfig.personalize.cdpTimeout);

    const undefinedTimeoutConfig = {
      ...mockConfig,
      personalize: {
        cdpTimeout: undefined,
        edgeTimeout: undefined,
      },
    };

    config = defineConfig(undefinedTimeoutConfig);

    expect(config.personalize.edgeTimeout).to.equal(fallbackConfig.personalize.edgeTimeout);
    expect(config.personalize.cdpTimeout).to.equal(fallbackConfig.personalize.cdpTimeout);
  });

  it('should throw when api.edge is empty and api.local is partially empty', () => {
    const failingConfig: SitecoreConfigInput = {
      ...mockConfig,
      api: {
        edge: undefined,
        local: {
          apiKey: 'not-empty',
          apiHost: undefined as any,
        },
      },
    };
    expect(() => defineConfig(failingConfig)).to.throw(
      'Configuration error: at least one API configuration must be specified: contextId (server-side), clientContextId (client-side), or local API settings (apiHost + apiKey)'
    );
  });

  it('should use DefaultRetryStrategy with correct error codes', () => {
    const config = defineConfig(mockConfig);
    // eslint-disable-next-line
    expect((config.retries.retryStrategy as DefaultRetryStrategy)['statusCodes']).to.deep.equal([
      429, 502, 503, 504, 520, 521, 522, 523, 524,
    ]);
  });

  describe('getFallbackConfig', () => {
    it('should use populate env variables when present in fallback config', () => {
      const contextId = 'env-context-id';
      const edgeUrl = 'env-edge-url';
      const jssEditingSecret = 'env-editing-secret';
      const personalizeMiddlewareEdgeTimeout = 111;
      const personalizeMiddlewareCdpTimeout = 222;

      process.env.SITECORE_EDGE_CONTEXT_ID = contextId;
      process.env.SITECORE_EDGE_URL = edgeUrl;
      process.env.JSS_EDITING_SECRET = jssEditingSecret;
      process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT = personalizeMiddlewareEdgeTimeout.toString();
      process.env.PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT = personalizeMiddlewareCdpTimeout.toString();

      const fallbackConfig = getFallbackConfig();
      expect(fallbackConfig.api.edge.contextId).to.equal(contextId);
      expect(fallbackConfig.api.edge.edgeUrl).to.equal(edgeUrl);
      expect(fallbackConfig.editingSecret).to.equal(jssEditingSecret);
      expect(fallbackConfig.personalize.edgeTimeout).to.equal(personalizeMiddlewareEdgeTimeout);
      expect(fallbackConfig.personalize.cdpTimeout).to.equal(personalizeMiddlewareCdpTimeout);
    });

    it('should use falback values when env variables are not present', () => {
      delete process.env.SITECORE_EDGE_CONTEXT_ID;
      delete process.env.SITECORE_EDGE_URL;
      delete process.env.JSS_EDITING_SECRET;
      delete process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT;
      delete process.env.PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT;

      const fallbackConfig = getFallbackConfig();
      expect(fallbackConfig.api.edge.contextId).to.equal('');
      expect(fallbackConfig.api.edge.edgeUrl).to.equal(SITECORE_EDGE_URL_DEFAULT);
      expect(fallbackConfig.editingSecret).to.equal('editing-secret-missing');
      expect(fallbackConfig.personalize.edgeTimeout).to.equal(400);
      expect(fallbackConfig.personalize.cdpTimeout).to.equal(400);
    });
  });

  describe('deepMerge', () => {
    it('should fallback to base when override value is empty', () => {
      expect(
        deepMerge(
          {
            deep: {
              test: 'base',
            },
          },
          {
            deep: {
              test: '',
            },
          }
        )
      ).to.deep.equal({ deep: { test: 'base' } });

      expect(
        deepMerge(
          {
            deep: {
              test: 'base',
            },
          },
          {
            deep: {
              test: undefined,
            },
          }
        )
      ).to.deep.equal({ deep: { test: 'base' } });
    });

    it('should traverse nested objects and merge', () => {
      class Test {
        a = true;
      }

      class BaseTest extends Test {
        b = true;
      }

      const base = {
        deep: {
          fn: () => {
            return false;
          },
          class: new BaseTest(),
          array: [4, 5, 6],
          number: 5,
          string: '5',
        },
        boolean: true,
      };

      const override = {
        deep: {
          fn: () => {
            return true;
          },
          class: new Test(),
          nullValue: null,
          array: [1, 2, 3],
          number: 10,
          string: '10',
        },
        boolean: false,
      };

      console.log(override);

      expect(deepMerge(base, override)).to.deep.equal(override);
    });
  });

  it('should allow missing clientContextId when contextId is provided', () => {
    const configWithServerSideOnly = {
      api: {
        edge: {
          contextId: 'server-context-id',
          // clientContextId intentionally omitted
        },
      },
    };

    // This should not throw an error
    expect(() => defineConfig(configWithServerSideOnly)).to.not.throw();

    const config = defineConfig(configWithServerSideOnly);
    expect(config.api.edge.contextId).to.equal('server-context-id');
    expect(config.api.edge.clientContextId).to.equal(''); // Should use fallback
  });

  it('should allow empty clientContextId for client-side execution', () => {
    const configWithoutClientContextId = {
      api: {
        edge: {
          contextId: 'server-context-id',
          clientContextId: undefined, // or empty string
        },
      },
    };

    expect(() => defineConfig(configWithoutClientContextId)).to.not.throw();
  });

  it('should allow client-only context configuration', () => {
    const clientOnlyConfig: SitecoreConfigInput = {
      api: {
        edge: {
          contextId: '',
          clientContextId: 'client-context-id',
        },
      },
    };

    expect(() => defineConfig(clientOnlyConfig)).to.not.throw();

    const config = defineConfig(clientOnlyConfig);
    expect(config.api.edge.clientContextId).to.equal('client-context-id');
    // Should fallback from clientContextId to contextId
    expect(config.api.edge.contextId).to.equal('client-context-id');
  });

  it('should allow local API configuration without edge context', () => {
    const localApiConfig: SitecoreConfigInput = {
      api: {
        edge: undefined,
        local: {
          apiKey: 'test-api-key',
          apiHost: 'test-api-host',
        },
      },
    };

    expect(() => defineConfig(localApiConfig)).to.not.throw();

    const config = defineConfig(localApiConfig);
    expect(config.api.local.apiKey).to.equal('test-api-key');
    expect(config.api.local.apiHost).to.equal('test-api-host');
  });

  it('should throw when no valid API configuration is provided', () => {
    const noValidConfig: SitecoreConfigInput = {
      api: {
        edge: {
          contextId: '',
        },
        local: {
          apiKey: '',
          apiHost: '',
        } as any,
      },
    };

    expect(() => defineConfig(noValidConfig)).to.throw(
      'Configuration error: at least one API configuration must be specified: contextId (server-side), clientContextId (client-side), or local API settings (apiHost + apiKey)'
    );
  });

  it('should throw when completely empty API configuration is provided', () => {
    // Use type assertion to bypass TypeScript validation for testing invalid configs
    const noValidConfig = {
      api: {},
    } as SitecoreConfigInput;

    expect(() => defineConfig(noValidConfig)).to.throw(
      'Configuration error: at least one API configuration must be specified: contextId (server-side), clientContextId (client-side), or local API settings (apiHost + apiKey)'
    );
  });
});
