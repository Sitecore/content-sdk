import { expect } from 'chai';
import { defineConfig, getNextFallbackConfig } from './define-config';

describe('defineConfig', () => {
  const defaultConfig = () => ({
    api: {
      edge: { contextId: 'contextId' },
    },
    defaultLanguage: 'en',
  });

  describe('getNextFallbackConfig', () => {
    describe('config.api.edge.contextid', () => {
      describe('environment variable is not set', () => {
        it('should default to empty string', () => {
          const config = getNextFallbackConfig({
            api: {
              local: { apiHost: 'apihost', apiKey: 'apikey' },
            },
            defaultLanguage: 'en',
          });
          expect(config.api?.edge?.contextId).to.equal('');
        });

        it('should use the value from the config', () => {
          const config = getNextFallbackConfig({
            api: {
              edge: { contextId: 'custom-context-id' },
            },
            defaultLanguage: 'en',
          });
          expect(config.api?.edge?.contextId).to.equal('custom-context-id');
        });
      });

      describe('environment variable is set', () => {
        before(() => {
          process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID = 'next-public-sitecore-edge-context-id';
        });

        after(() => {
          delete process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID;
        });

        it('should use the value from the config if present', () => {
          const config = getNextFallbackConfig({
            api: {
              edge: { contextId: 'custom-context-id' },
            },
            defaultLanguage: 'en',
          });
          expect(config.api?.edge?.contextId).to.equal('custom-context-id');
        });

        it('should use the env var if present', () => {
          const config = getNextFallbackConfig({
            api: {
              local: { apiHost: 'apihost', apiKey: 'apikey' },
            },
            defaultLanguage: 'en',
          });
          expect(config.api?.edge?.contextId).to.equal('next-public-sitecore-edge-context-id');
        });
      });
    });

    describe('config.api.edge.clientContextId', () => {
      describe('environment variable is not set', () => {
        it('should default to undefined', () => {
          const config = getNextFallbackConfig(getNextFallbackConfig());
          expect(config.api?.edge?.clientContextId).to.be.undefined;
        });

        it('should use the value from the config', () => {
          const config = getNextFallbackConfig({
            ...defaultConfig(),
            api: { edge: { contextId: 'context-id', clientContextId: 'clien-context-id' } },
          });
          expect(config.api?.edge?.clientContextId).to.equal('clien-context-id');
        });
      });
      describe('environment variable is set', () => {
        before(() => {
          process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID = 'next-public-sitecore-edge-context-id';
        });

        after(() => {
          delete process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID;
        });

        it('should use the value from the config if present', () => {
          const config = getNextFallbackConfig({
            api: {
              edge: { contextId: 'custom-context-id', clientContextId: 'custom-client-context-id' },
            },
            defaultLanguage: 'en',
          });
          expect(config.api?.edge?.clientContextId).to.equal('custom-client-context-id');
        });

        it('should use the env var if present', () => {
          const config = getNextFallbackConfig({
            api: {
              local: { apiHost: 'apihost', apiKey: 'apikey' },
            },
            defaultLanguage: 'en',
          });
          expect(config.api?.edge?.contextId).to.equal('next-public-sitecore-edge-context-id');
        });
      });
    });

    describe('config.api.local', () => {
      describe('environment variables are not set', () => {
        it('should default to empty string', () => {
          const config = getNextFallbackConfig(defaultConfig());
          expect(config.api?.local?.apiKey).to.be.equal('');
          expect(config.api?.local?.apiHost).to.be.equal('');
        });

        it('should use the value from the config', () => {
          const config = getNextFallbackConfig({
            ...defaultConfig(),
            api: { local: { apiKey: 'apiKey', apiHost: 'apiHost' } },
          });
          expect(config.api?.local?.apiKey).to.equal('apiKey');
          expect(config.api?.local?.apiHost).to.equal('apiHost');
        });
      });

      describe('environment variables are set', () => {
        before(() => {
          process.env.NEXT_PUBLIC_SITECORE_API_KEY = 'next-public-sitecore-api-key';
          process.env.NEXT_PUBLIC_SITECORE_API_HOST = 'next-public-sitecore-api-host';
        });

        after(() => {
          delete process.env.NEXT_PUBLIC_SITECORE_API_KEY;
          delete process.env.NEXT_PUBLIC_SITECORE_API_HOST;
        });

        it('should use the values from the config if present', () => {
          const config = getNextFallbackConfig({
            ...defaultConfig(),
            api: { local: { apiKey: 'apiKey', apiHost: 'apiHost' } },
          });
          expect(config.api?.local?.apiKey).to.equal('apiKey');
          expect(config.api?.local?.apiHost).to.equal('apiHost');
        });

        it('should use the env vars if present', () => {
          const config = getNextFallbackConfig(defaultConfig());
          expect(config.api?.local?.apiKey).to.equal('next-public-sitecore-api-key');
          expect(config.api?.local?.apiHost).to.equal('next-public-sitecore-api-host');
        });
      });
    });

    describe('config.defaultSite', () => {
      describe('environment variable is not set', () => {
        it('should default to undefined', () => {
          const config = getNextFallbackConfig(defaultConfig());
          expect(config.defaultSite).to.be.undefined;
        });

        it('should use the value from the config', () => {
          const config = getNextFallbackConfig({
            ...defaultConfig(),
            defaultSite: 'skate-park',
          });
          expect(config.defaultSite).to.equal('skate-park');
        });
      });

      describe('environment variable is set', () => {
        before(() => {
          process.env.NEXT_PUBLIC_SITECORE_SITE_NAME = 'next-public-sitecore-site-name';
        });

        after(() => {
          delete process.env.NEXT_PUBLIC_SITECORE_SITE_NAME;
        });

        it('should use the value from the config if present', () => {
          const config = getNextFallbackConfig({
            ...defaultConfig(),
            defaultSite: 'skate-park',
          });
          expect(config.defaultSite).to.equal('skate-park');
        });

        it('should use the env var if config value not present', () => {
          const config = getNextFallbackConfig(defaultConfig());
          expect(config.defaultSite).to.equal('next-public-sitecore-site-name');
        });
      });
    });

    describe('config.defaultLanguage', () => {
      describe('environment variable is not set', () => {
        it('should default to undefined', () => {
          const config = getNextFallbackConfig({
            api: {
              edge: { contextId: 'contextId' },
            },
          });
          expect(config.defaultLanguage).to.be.undefined;
        });

        it('should use the value from the config', () => {
          const config = getNextFallbackConfig(defaultConfig());
          expect(config.defaultLanguage).to.equal('en');
        });
      });

      describe('environment variable is set', () => {
        before(() => {
          process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE = 'de';
        });

        after(() => {
          delete process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE;
        });

        it('should use the value from the config if present', () => {
          const config = getNextFallbackConfig(defaultConfig());
          expect(config.defaultLanguage).to.equal('en');
        });

        it('should use the env var if config value not present', () => {
          const config = getNextFallbackConfig({
            api: {
              edge: { contextId: 'contextId' },
            },
          });
          expect(config.defaultLanguage).to.equal('de');
        });
      });
    });

    describe('config.multisite', () => {
      it('should default to undefined', () => {
        const config = getNextFallbackConfig(defaultConfig());
        expect(config.multisite?.enabled).to.be.undefined;
      });

      it('should be able to override default value of enabled', () => {
        const config = getNextFallbackConfig({ ...defaultConfig(), multisite: { enabled: false } });
        expect(config.multisite?.enabled).to.be.false;
      });

      it('cookie resolution should return default function', () => {
        const config = getNextFallbackConfig(defaultConfig());
        expect(config.multisite?.useCookieResolution).to.be.a('function');

        if (config.multisite?.useCookieResolution) {
          process.env.VERCEL_ENV = 'preview';
          expect(config.multisite.useCookieResolution()).to.be.true;
          delete process.env.VERCEL_ENV;
          expect(config.multisite.useCookieResolution()).to.be.false;
        }
      });

      it('it should be able to override cookie resolution function', () => {
        const config = getNextFallbackConfig({
          ...defaultConfig(),
          multisite: { useCookieResolution: () => true },
        });
        expect(config.multisite?.useCookieResolution).to.be.a('function');
        if (config.multisite?.useCookieResolution) {
          expect(config.multisite.useCookieResolution()).to.be.true;
        }
      });
    });

    describe('config.personalize', () => {
      describe('environment variable is not set', () => {
        it('should default to undefined', () => {
          const config = getNextFallbackConfig(defaultConfig());
          expect(config.personalize?.scope).to.be.undefined;
        });

        it('should use the value from the config', () => {
          const config = getNextFallbackConfig({
            ...defaultConfig(),
            personalize: { scope: 'custom-scope' },
          });
          expect(config.personalize?.scope).to.equal('custom-scope');
        });
      });

      describe('environment variable is set', () => {
        before(() => {
          process.env.NEXT_PUBLIC_PERSONALIZE_SCOPE = 'custom-env-scope';
        });

        after(() => {
          delete process.env.NEXT_PUBLIC_PERSONALIZE_SCOPE;
        });

        it('should use the value from the config if present', () => {
          const config = getNextFallbackConfig({
            ...defaultConfig(),
            personalize: { scope: 'custom-scope' },
          });
          expect(config.personalize?.scope).to.equal('custom-scope');
        });

        it('should use the env var if config value not present', () => {
          const config = getNextFallbackConfig(defaultConfig());
          expect(config.personalize?.scope).to.equal('custom-env-scope');
        });
      });
    });

    describe('config.disableStaticPaths', () => {
      describe('environment variable is not set', () => {
        it('should default to false', () => {
          const config = defineConfig(defaultConfig());
          expect(config.disableStaticPaths).to.equal(false);
        });

        it('should use the value from the config', () => {
          const config = defineConfig({
            disableStaticPaths: false,
            ...defaultConfig(),
          });
          expect(config.disableStaticPaths).to.equal(false);
        });
      });

      describe('environment variable is set', () => {
        afterEach(() => {
          delete process.env.DISABLE_SSG_FETCH;
        });

        it('should return true when DISABLE_SSG_FETCH is set to true', () => {
          process.env.DISABLE_SSG_FETCH = 'true';

          const config = defineConfig({
            disableStaticPaths: false,
            ...defaultConfig(),
          });

          expect(config.disableStaticPaths).to.equal(true);
        });

        it('should return false when DISABLE_SSG_FETCH is set to false', () => {
          process.env.DISABLE_SSG_FETCH = 'false';

          const config = defineConfig({
            disableStaticPaths: true,
            ...defaultConfig(),
          });

          expect(config.disableStaticPaths).to.equal(false);
        });

        it('should return false when DISABLE_SSG_FETCH is set to any other value', () => {
          process.env.DISABLE_SSG_FETCH = 'some-other-value';

          const config = defineConfig({
            disableStaticPaths: true,
            ...defaultConfig(),
          });

          expect(config.disableStaticPaths).to.equal(false);
        });
      });
    });
  });
});
