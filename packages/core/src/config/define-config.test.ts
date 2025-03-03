import { expect } from 'chai';
import { defineConfig, getFallbackConfig } from './define-config';
import { SitecoreConfigInput } from './models';
import { DefaultRetryStrategy } from '..';

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
    expect(config.api.edge.contextId).to.equal(mockConfig.api.edge?.contextId);
    expect(config.api.edge.clientContextId).to.equal(mockConfig.api.edge?.clientContextId);
    expect(config.api.edge.edgeUrl).to.equal(fallbackConfig.api.edge.edgeUrl);

    // api.local
    expect(config.api.local.apiHost).to.equal(mockConfig.api.local?.apiHost);
    expect(config.api.local.apiKey).to.equal(mockConfig.api.local?.apiKey);

    // defaultSite
    expect(config.defaultSite).to.equal(mockConfig.defaultSite);

    // defaultLanguage
    expect(config.defaultLanguage).to.equal(mockConfig.defaultLanguage);

    // multisite
    expect(config.multisite.enabled).to.equal(mockConfig.multisite.enabled);
    expect(config.multisite.useCookieResolution()).to.equal(false);
    expect(config.multisite.defaultHostname).to.equal(fallbackConfig.multisite.defaultHostname);

    // personalize
    expect(config.personalize.enabled).to.equal(mockConfig.personalize.enabled);
    expect(config.personalize.edgeTimeout).to.equal(mockConfig.personalize.edgeTimeout);
    expect(config.personalize.cdpTimeout).to.equal(mockConfig.personalize.cdpTimeout);
    expect(config.personalize.scope).to.equal(mockConfig.personalize.scope);
    expect(config.personalize.currency).to.equal(fallbackConfig.personalize.currency);
    expect(config.personalize.channel).to.equal(fallbackConfig.personalize.channel);

    // redirects
    expect(config.redirects.enabled).to.equal(mockConfig.redirects.enabled);
    expect(config.redirects.locales).to.deep.equal(mockConfig.redirects.locales);

    // retries (fallback config values)
    expect(config.retries?.count).to.equal(fallbackConfig.retries.count);
    expect(config.retries?.retryStrategy).to.not.be.undefined;

    // dictionary caching
    expect(config.dictionary.caching.enabled).to.equal(fallbackConfig.dictionary.caching.enabled);
    expect(config.dictionary.caching.timeout).to.equal(fallbackConfig.dictionary.caching.timeout);
  });

  it('should throw when both api.edge and api.local sets are missing', () => {
    const failingConfig = {
      ...mockConfig,
      api: {
        edge: undefined,
        local: undefined,
      },
    };
    expect(() => defineConfig(failingConfig)).to.throw(
      'Configuration error: either context ID or API key and host must be specified in sitecore.config'
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
    const failingConfig = {
      ...mockConfig,
      api: {
        edge: undefined,
        local: {
          apiKey: 'not-empty',
          apiHost: undefined,
        },
      },
    };
    expect(() => defineConfig(failingConfig)).to.throw(
      'Configuration error: either context ID or API key and host must be specified in sitecore.config'
    );
  });

  it('should use DefaultRetryStrategy with correct error codes', () => {
    const config = defineConfig(mockConfig);
    // eslint-disable-next-line
    expect((config.retries.retryStrategy as DefaultRetryStrategy)['statusCodes']).to.deep.equal([
      429,
      502,
      503,
      504,
      520,
      521,
      522,
      523,
      524,
    ]);
  });
});
