import { expect } from 'chai';
import * as initSitecore from './init-sitecore';
import sinon from 'sinon';

describe('define-config', () => {
  const sandbox = sinon.createSandbox();
  const mockConfig = {
    api: {
      edge: {
        contextId: 'test',
        clientContextId: '',
        edgeUrl: '',
      },
    },
    defaultSite: '',
    defaultLanguage: '',
    multisite: {
      enabled: false,
      defaultHostname: undefined,
      useCookieResolution: undefined,
    },
    personalize: {
      enabled: false,
      scope: undefined,
      channel: undefined,
      currency: undefined,
      edgeTimeout: undefined,
      cdpTimeout: undefined,
    },
    redirects: {
      enabled: false,
      locales: undefined,
    },
  };

  const mockOptions = {
    components: new Map([['MyComponent', {}]]),
    sites: [
      {
        name: 'mySite',
        hostName: 'http://test',
        language: 'en',
      },
    ],
    sitecoreConfig: mockConfig,
  };

  afterEach(() => {
    sandbox.restore();
  });

  describe('initSitecore', () => {
    it('should populate and initialize sitecoreRuntimeConfig', () => {
      initSitecore.initSitecore(mockOptions);
      expect(initSitecore.sitecoreRuntimeConfig).to.deep.equal({
        ...mockOptions,
        initialized: true,
      });
    });
  });

  describe('getRuntimeConfig', () => {
    it('should throw when sitecoreRuntimeConfig not initialized', () => {
      initSitecore.setTestSitecoreRuntimeConfig({}, false);
      expect(() => initSitecore.getRuntimeConfig()).to.throw(
        'Sitecore runtime config not initialized. Ensure initSitecore() call was performed.'
      );
    });

    it('should return sitecoreRuntimeConfig when initialized', () => {
      initSitecore.setTestSitecoreRuntimeConfig(mockOptions, true);
      expect(initSitecore.getRuntimeConfig()).to.deep.equal({ ...mockOptions, initialized: true });
    });
  });
});
