/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

describe('defineConfig', () => {
  let defineConfigCoreStub: sinon.SinonStub;
  let defineConfigModule: any;
  const sandbox = sinon.createSandbox();
  const defaultConfig = () => ({
    api: {
      edge: { contextId: 'contextId' },
    },
    defaultLanguage: 'en',
  });

  beforeEach(() => {
    defineConfigCoreStub = sandbox.stub();
    defineConfigModule = proxyquire('./define-config', {
      '@sitecore-content-sdk/content/config': { defineConfig: defineConfigCoreStub },
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('config.api.edge.contextid', () => {
    describe('environment variable is not set', () => {
      it('should default to empty string', () => {
        defineConfigModule.defineConfig({
          api: {
            local: { apiHost: 'apihost', apiKey: 'apikey' },
          },
          defaultLanguage: 'en',
        });
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.api?.edge?.contextId).to.equal('');
      });

      it('should use the value from the config', () => {
        defineConfigModule.defineConfig({
          api: {
            edge: { contextId: 'custom-context-id' },
          },
          defaultLanguage: 'en',
        });
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.api?.edge?.contextId).to.equal('custom-context-id');
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
        defineConfigModule.defineConfig({
          api: {
            edge: { contextId: 'custom-context-id' },
          },
          defaultLanguage: 'en',
        });
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.api?.edge?.contextId).to.equal('custom-context-id');
      });

      it('should NOT use the env var for server-side contextId', () => {
        defineConfigModule.defineConfig({
          api: {
            local: { apiHost: 'apihost', apiKey: 'apikey' },
          },
          defaultLanguage: 'en',
        });
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.api?.edge?.contextId).to.equal('');
      });
    });
  });

  describe('config.api.edge.clientContextId', () => {
    describe('environment variable is not set', () => {
      it('should default to undefined', () => {
        defineConfigModule.defineConfig(defaultConfig());
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.api?.edge?.clientContextId).to.be.undefined;
      });

      it('should use the value from the config', () => {
        defineConfigModule.defineConfig({
          ...defaultConfig(),
          api: { edge: { contextId: 'context-id', clientContextId: 'clien-context-id' } },
        });
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.api?.edge?.clientContextId).to.equal('clien-context-id');
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
        defineConfigModule.defineConfig({
          api: {
            edge: { contextId: 'custom-context-id', clientContextId: 'custom-client-context-id' },
          },
          defaultLanguage: 'en',
        });
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.api?.edge?.clientContextId).to.equal('custom-client-context-id');
      });

      it('should use the env var for client-side contextId only', () => {
        defineConfigModule.defineConfig({
          api: {
            local: { apiHost: 'apihost', apiKey: 'apikey' },
          },
          defaultLanguage: 'en',
        });
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        // Server-side contextId should be empty
        expect(resultConfig.api?.edge?.contextId).to.equal('');
        // Client-side contextId should use env var
        expect(resultConfig.api?.edge?.clientContextId).to.equal(
          'next-public-sitecore-edge-context-id'
        );
      });
    });
  });

  describe('config.api.edge.edgeUrl', () => {
    describe('environment variable is not set', () => {
      it('should default to Edge Platform URL', () => {
        defineConfigModule.defineConfig(defaultConfig());
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.api?.edge?.edgeUrl).to.equal('https://edge-platform.sitecorecloud.io');
      });

      it('should use the value from the config', () => {
        defineConfigModule.defineConfig({
          ...defaultConfig(),
          api: { edge: { contextId: 'context-id', edgeUrl: 'edgeUrl' } },
        });
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.api?.edge?.edgeUrl).to.equal('edgeUrl');
      });
    });
    describe('environment variable is set', () => {
      before(() => {
        process.env.NEXT_PUBLIC_SITECORE_EDGE_PLATFORM_HOSTNAME = 'next-public-sitecore-edgeUrl';
      });

      after(() => {
        delete process.env.NEXT_PUBLIC_SITECORE_EDGE_PLATFORM_HOSTNAME;
      });

      it('should use the value from the config if present', () => {
        defineConfigModule.defineConfig({
          api: {
            edge: { contextId: 'custom-context-id', edgeUrl: 'custom-edgeUrl' },
          },
          defaultLanguage: 'en',
        });
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.api?.edge?.edgeUrl).to.equal('custom-edgeUrl');
      });

      it('should use the env var if present', () => {
        defineConfigModule.defineConfig({
          api: {
            local: { apiHost: 'apihost', apiKey: 'apikey' },
          },
          defaultLanguage: 'en',
        });
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.api?.edge?.edgeUrl).to.equal('next-public-sitecore-edgeUrl');
      });
    });
  });

  describe('config.api.local', () => {
    describe('environment variables are not set', () => {
      it('should default to empty string', () => {
        defineConfigModule.defineConfig(defaultConfig());
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.api?.local?.apiKey).to.be.equal('');
        expect(resultConfig.api?.local?.apiHost).to.be.equal('');
      });

      it('should use the value from the config', () => {
        defineConfigModule.defineConfig({
          ...defaultConfig(),
          api: { local: { apiKey: 'apiKey', apiHost: 'apiHost' } },
        });
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.api?.local?.apiKey).to.equal('apiKey');
        expect(resultConfig.api?.local?.apiHost).to.equal('apiHost');
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
        defineConfigModule.defineConfig({
          ...defaultConfig(),
          api: { local: { apiKey: 'apiKey', apiHost: 'apiHost' } },
        });
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.api?.local?.apiKey).to.equal('apiKey');
        expect(resultConfig.api?.local?.apiHost).to.equal('apiHost');
      });

      it('should use the env vars if present', () => {
        defineConfigModule.defineConfig(defaultConfig());
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.api?.local?.apiKey).to.equal('next-public-sitecore-api-key');
        expect(resultConfig.api?.local?.apiHost).to.equal('next-public-sitecore-api-host');
      });
    });
  });

  describe('config.defaultSite', () => {
    describe('environment variable is not set', () => {
      it('should default to undefined', () => {
        defineConfigModule.defineConfig(defaultConfig());
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.defaultSite).to.equal('');
      });

      it('should use the value from the config', () => {
        defineConfigModule.defineConfig({
          ...defaultConfig(),
          defaultSite: 'skate-park',
        });
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.defaultSite).to.equal('skate-park');
      });
    });

    describe('environment variable is set', () => {
      before(() => {
        process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME = 'next-public-sitecore-site-name';
      });

      after(() => {
        delete process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME;
      });

      it('should use the value from the config if present', () => {
        defineConfigModule.defineConfig({
          ...defaultConfig(),
          defaultSite: 'skate-park',
        });
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.defaultSite).to.equal('skate-park');
      });

      it('should use the env var if config value not present', () => {
        defineConfigModule.defineConfig(defaultConfig());
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.defaultSite).to.equal('next-public-sitecore-site-name');
      });
    });
  });

  describe('config.defaultLanguage', () => {
    describe('environment variable is not set', () => {
      it('should default to undefined', () => {
        defineConfigModule.defineConfig({
          api: {
            edge: { contextId: 'contextId' },
          },
        });
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.defaultLanguage).to.equal('en');
      });

      it('should use the value from the config', () => {
        defineConfigModule.defineConfig(defaultConfig());
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.defaultLanguage).to.equal('en');
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
        defineConfigModule.defineConfig(defaultConfig());
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.defaultLanguage).to.equal('en');
      });

      it('should use the env var if config value not present', () => {
        defineConfigModule.defineConfig({
          api: {
            edge: { contextId: 'contextId' },
          },
        });
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.defaultLanguage).to.equal('de');
      });
    });
  });

  describe('config.multisite', () => {
    describe('enabled', () => {
      it('should default to undefined', () => {
        defineConfigModule.defineConfig(defaultConfig());
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.multisite?.enabled).to.be.undefined;
      });

      it('should be able to override default value of enabled', () => {
        defineConfigModule.defineConfig({ ...defaultConfig(), multisite: { enabled: false } });
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.multisite?.enabled).to.be.false;
      });
    });

    describe('useCookieResolution', () => {
      it('cookie resolution should return default function', () => {
        defineConfigModule.defineConfig(defaultConfig());
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.multisite?.useCookieResolution).to.be.a('function');

        if (resultConfig.multisite?.useCookieResolution) {
          process.env.VERCEL_ENV = 'preview';
          expect(resultConfig.multisite.useCookieResolution()).to.be.true;
          delete process.env.VERCEL_ENV;
          expect(resultConfig.multisite.useCookieResolution()).to.be.false;
        }
      });

      it('it should be able to override cookie resolution function', () => {
        defineConfigModule.defineConfig({
          ...defaultConfig(),
          multisite: { useCookieResolution: () => true },
        });
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.multisite?.useCookieResolution).to.be.a('function');
        if (resultConfig.multisite?.useCookieResolution) {
          expect(resultConfig.multisite.useCookieResolution()).to.be.true;
        }
      });
    });
  });

  describe('config.personalize', () => {
    describe('scope', () => {
      describe('environment variable is not set', () => {
        it('should default to undefined', () => {
          defineConfigModule.defineConfig(defaultConfig());
          const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
          expect(resultConfig.personalize?.scope).to.be.undefined;
        });

        it('should use the value from the config', () => {
          defineConfigModule.defineConfig({
            ...defaultConfig(),
            personalize: { scope: 'custom-scope' },
          });
          const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
          expect(resultConfig.personalize?.scope).to.equal('custom-scope');
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
          defineConfigModule.defineConfig({
            ...defaultConfig(),
            personalize: { scope: 'custom-scope' },
          });
          const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
          expect(resultConfig.personalize?.scope).to.equal('custom-scope');
        });

        it('should use the env var if config value not present', () => {
          defineConfigModule.defineConfig(defaultConfig());
          const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
          expect(resultConfig.personalize?.scope).to.equal('custom-env-scope');
        });
      });
    });
  });

  describe('config.generateStaticPaths', () => {
    describe('environment variable is not set', () => {
      it('should default to true', () => {
        defineConfigModule.defineConfig(defaultConfig());
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.generateStaticPaths).to.equal(true);
      });

      it('should use the value from the config', () => {
        defineConfigModule.defineConfig({
          generateStaticPaths: false,
          ...defaultConfig(),
        });
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.generateStaticPaths).to.equal(false);
      });
    });

    describe('environment variable is set', () => {
      afterEach(() => {
        delete process.env.GENERATE_STATIC_PATHS;
      });

      it('should return false when GENERATE_STATIC_PATHS is set to false', () => {
        process.env.GENERATE_STATIC_PATHS = 'false';

        defineConfigModule.defineConfig({
          generateStaticPaths: true,
          ...defaultConfig(),
        });
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.generateStaticPaths).to.equal(false);
      });

      it('should return true when GENERATE_STATIC_PATHS is set to true', () => {
        process.env.GENERATE_STATIC_PATHS = 'true';

        defineConfigModule.defineConfig({
          generateStaticPaths: false,
          ...defaultConfig(),
        });
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.generateStaticPaths).to.equal(true);
      });

      it('should return false when GENERATE_STATIC_PATHS is set to any other value', () => {
        process.env.GENERATE_STATIC_PATHS = 'some-other-value';

        defineConfigModule.defineConfig({
          generateStaticPaths: true,
          ...defaultConfig(),
        });
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.generateStaticPaths).to.equal(false);
      });
    });
  });

  describe('sitecoreInternalEditingHostUrl', () => {
    describe('environment variable is not set', () => {
      it('should default to undefined', () => {
        defineConfigModule.defineConfig(defaultConfig());
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.sitecoreInternalEditingHostUrl).to.be.undefined;
      });

      it('should use the value from the config', () => {
        defineConfigModule.defineConfig({
          sitecoreInternalEditingHostUrl: 'http://localhost:3000',
          ...defaultConfig(),
        });
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.sitecoreInternalEditingHostUrl).to.equal('http://localhost:3000');
      });
    });

    describe('environment variable is set', () => {
      afterEach(() => {
        delete process.env.SITECORE_INTERNAL_EDITING_HOST_URL;
      });

      it('should return set value', () => {
        process.env.SITECORE_INTERNAL_EDITING_HOST_URL = 'http://localhost:3000';

        defineConfigModule.defineConfig({
          generateStaticPaths: true,
          ...defaultConfig(),
        });
        const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
        expect(resultConfig.sitecoreInternalEditingHostUrl).to.equal('http://localhost:3000');
      });
    });
  });

  describe('config.redirects.appLocalePrefix', () => {
    it('should default to undefined', () => {
      defineConfigModule.defineConfig(defaultConfig());
      const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
      expect(resultConfig.redirects?.appLocalePrefix).to.equal(undefined);
    });

    it('should use the value from the config', () => {
      defineConfigModule.defineConfig({
        ...defaultConfig(),
        redirects: { appLocalePrefix: 'always' },
      });
      const resultConfig = defineConfigCoreStub.getCalls()[0].args[0];
      expect(resultConfig.redirects?.appLocalePrefix).to.equal('always');
    });
  });
});
