/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import { deepMerge, defineConfig, getFallbackConfig } from './define-config';
import { SitecoreConfigInput } from './models';
import { DefaultRetryStrategy } from '..';
import { SITECORE_EDGE_URL_DEFAULT } from '../constants';

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
    multisite: { enabled: true },
    personalize: {
      enabled: false,
      edgeTimeout: 1000,
      cdpTimeout: 1000,
      scope: 'unit-scope',
    },
    redirects: { enabled: true, locales: ['en'] },
  };

  it('merges config from sitecore.config with default values', () => {
    const config = defineConfig(mockConfig);
    const fallback = getFallbackConfig();

    // api.edge
    expect(config.api.edge.contextId).to.equal(mockConfig.api?.edge?.contextId);
    expect(config.api.edge.clientContextId).to.equal(mockConfig.api?.edge?.clientContextId);
    expect(config.api.edge.edgeUrl).to.equal(fallback.api.edge.edgeUrl);

    // api.local
    expect(config.api.local.apiHost).to.equal(mockConfig.api?.local?.apiHost);
    expect(config.api.local.apiKey).to.equal(mockConfig.api?.local?.apiKey);

    // misc root settings
    expect(config.defaultSite).to.equal(mockConfig.defaultSite);
    expect(config.defaultLanguage).to.equal(mockConfig.defaultLanguage);
    expect(config.multisite.enabled).to.equal(mockConfig.multisite?.enabled);
    expect(config.multisite.useCookieResolution()).to.equal(false);

    // personalize
    expect(config.personalize.enabled).to.equal(mockConfig.personalize?.enabled);
    expect(config.personalize.edgeTimeout).to.equal(mockConfig.personalize?.edgeTimeout);
    expect(config.personalize.cdpTimeout).to.equal(mockConfig.personalize?.cdpTimeout);
    expect(config.personalize.scope).to.equal(mockConfig.personalize?.scope);
    expect(config.personalize.currency).to.equal(fallback.personalize.currency);
    expect(config.personalize.channel).to.equal(fallback.personalize.channel);

    // redirects
    expect(config.redirects.enabled).to.equal(mockConfig.redirects?.enabled);
    expect(config.redirects.locales).to.deep.equal(mockConfig.redirects?.locales);

    // retries (fallback values)
    expect(config.retries?.count).to.equal(fallback.retries.count);
    expect(config.retries?.retryStrategy).to.not.be.undefined;

    // dictionary caching
    expect(config.dictionary.caching.enabled).to.equal(fallback.dictionary.caching.enabled);
    expect(config.dictionary.caching.timeout).to.equal(fallback.dictionary.caching.timeout);
  });

  it('throws when server-side has neither Edge contextId nor Local credentials', () => {
    const badConfig: SitecoreConfigInput = {
      api: {
        edge: {
          contextId: '',
          clientContextId: 'client-id', // client-only is NOT sufficient on the server
        },
        // no local creds provided
      },
    };

    expect(() => defineConfig(badConfig)).to.throw(
      'Configuration error: provide either Edge contextId'
    );
  });

  it('applies fallback personalize timeouts when values are falsy', () => {
    const zeroTimeout = { ...mockConfig, personalize: { cdpTimeout: 0, edgeTimeout: 0 } };
    const fallback = getFallbackConfig();

    let cfg = defineConfig(zeroTimeout);
    expect(cfg.personalize.edgeTimeout).to.equal(fallback.personalize.edgeTimeout);
    expect(cfg.personalize.cdpTimeout).to.equal(fallback.personalize.cdpTimeout);

    const undefinedTimeout = {
      ...mockConfig,
      personalize: { cdpTimeout: undefined, edgeTimeout: undefined },
    };
    cfg = defineConfig(undefinedTimeout);
    expect(cfg.personalize.edgeTimeout).to.equal(fallback.personalize.edgeTimeout);
    expect(cfg.personalize.cdpTimeout).to.equal(fallback.personalize.cdpTimeout);
  });

  it('uses DefaultRetryStrategy with correct status codes', () => {
    const cfg = defineConfig(mockConfig);
    // eslint-disable-next-line
    expect((cfg.retries.retryStrategy as DefaultRetryStrategy)['statusCodes']).to.deep.equal([
      429, 502, 503, 504, 520, 521, 522, 523, 524,
    ]);
  });

  describe('getFallbackConfig', () => {
    it('populates env variables in fallback config', () => {
      process.env.SITECORE_EDGE_CONTEXT_ID = 'env-context';
      process.env.SITECORE_EDGE_URL = 'env-edge-url';
      process.env.SITECORE_EDITING_SECRET = 'env-secret';
      process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT = '111';
      process.env.PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT = '222';
      process.env.NEXT_PUBLIC_SITECORE_API_KEY = 'env-local-key';
      process.env.NEXT_PUBLIC_SITECORE_API_HOST = 'https://env-local-host';

      const cfg = getFallbackConfig();
      expect(cfg.api.edge.contextId).to.equal('env-context');
      expect(cfg.api.edge.edgeUrl).to.equal('env-edge-url');
      expect(cfg.editingSecret).to.equal('env-secret');
      expect(cfg.personalize.edgeTimeout).to.equal(111);
      expect(cfg.personalize.cdpTimeout).to.equal(222);
      expect(cfg.api.local.apiKey).to.equal('env-local-key');
      expect(cfg.api.local.apiHost).to.equal('https://env-local-host');
    });

    it('falls back to defaults when env variables are absent', () => {
      delete process.env.SITECORE_EDGE_CONTEXT_ID;
      delete process.env.SITECORE_EDGE_URL;
      delete process.env.SITECORE_EDITING_SECRET;
      delete process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT;
      delete process.env.PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT;
      delete process.env.NEXT_PUBLIC_SITECORE_API_KEY;
      delete process.env.NEXT_PUBLIC_SITECORE_API_HOST;

      const cfg = getFallbackConfig();
      expect(cfg.api.edge.contextId).to.equal('');
      expect(cfg.api.edge.edgeUrl).to.equal(SITECORE_EDGE_URL_DEFAULT);
      expect(cfg.editingSecret).to.equal('editing-secret-missing');
      expect(cfg.personalize.edgeTimeout).to.equal(400);
      expect(cfg.personalize.cdpTimeout).to.equal(400);
      expect(cfg.api.local.apiKey).to.equal('');
      expect(cfg.api.local.apiHost).to.equal('');
    });
  });

  describe('deepMerge', () => {
    it('keeps base value when override is empty or undefined', () => {
      expect(deepMerge({ deep: { test: 'base' } }, { deep: { test: '' } })).to.deep.equal({
        deep: { test: 'base' },
      });

      expect(deepMerge({ deep: { test: 'base' } }, { deep: { test: undefined } })).to.deep.equal({
        deep: { test: 'base' },
      });
    });

    it('merges nested objects correctly', () => {
      class Test {
        a = true;
      }
      class BaseTest extends Test {
        b = true;
      }

      const base = {
        deep: {
          fn: () => false,
          class: new BaseTest(),
          array: [4, 5, 6],
          number: 5,
          string: '5',
        },
        boolean: true,
      };

      const override = {
        deep: {
          fn: () => true,
          class: new Test(),
          nullValue: null,
          array: [1, 2, 3],
          number: 10,
          string: '10',
        },
        boolean: false,
      };

      expect(deepMerge(base, override)).to.deep.equal(override);
    });
  });

  it('allows missing clientContextId when contextId is provided', () => {
    const cfg = { api: { edge: { contextId: 'server-id' } } };
    expect(() => defineConfig(cfg)).to.not.throw();
    expect(defineConfig(cfg).api.edge.clientContextId).to.equal('');
  });

  it('allows empty clientContextId in browser builds', () => {
    const cfg = { api: { edge: { contextId: 'server-id', clientContextId: '' } } };
    expect(() => defineConfig(cfg)).to.not.throw();
  });

  it('fails when only clientContextId is provided (no local creds)', () => {
    const cfg: SitecoreConfigInput = {
      api: { edge: { contextId: '', clientContextId: 'client-id' } },
    };
    expect(() => defineConfig(cfg)).to.throw('Configuration error: provide either Edge contextId');
  });

  it('allows local-only when contextId is missing', () => {
    const cfg: SitecoreConfigInput = {
      api: {
        edge: { contextId: '' },
        local: { apiKey: 'key', apiHost: 'host' },
      },
    };
    expect(() => defineConfig(cfg)).to.not.throw();
  });

  it('fails when API configuration is empty', () => {
    const cfg = { api: {} } as SitecoreConfigInput;
    expect(() => defineConfig(cfg)).to.throw('Configuration error: provide either Edge contextId');
  });

  describe('validateConfig server-side behaviour', () => {
    let originalWindow: any;

    beforeEach(() => {
      originalWindow = (global as any).window;
      delete (global as any).window; // simulate server
    });
    afterEach(() => {
      if (originalWindow !== undefined) (global as any).window = originalWindow;
    });

    it('logs warning but does not throw when clientContextId is missing (Edge server-only)', () => {
      const cfg = { api: { edge: { contextId: 'server-id' } } };
      expect(() => defineConfig(cfg)).to.not.throw();
      expect(defineConfig(cfg).api.edge.clientContextId).to.equal('');
    });

    it('requires Edge or Local; clientContextId alone is insufficient', () => {
      const cfg = { api: { edge: { contextId: '', clientContextId: 'client-id' } } };
      expect(() => defineConfig(cfg)).to.throw(
        'Configuration error: provide either Edge contextId'
      );
    });

    it('accepts local-only on the server', () => {
      const cfg = { api: { edge: { contextId: '' }, local: { apiKey: 'k', apiHost: 'h' } } };
      expect(() => defineConfig(cfg as any)).to.not.throw();
    });
  });
});
