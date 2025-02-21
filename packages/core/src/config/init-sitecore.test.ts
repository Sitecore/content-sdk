import { expect } from 'chai';
import * as initSitecore from './init-sitecore';

describe('define-config', () => {
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

  describe('initSitecore', () => {
    it('should populate and initialize sitecoreRuntimeConfig', () => {
      initSitecore.initSitecore(mockOptions);
      expect(initSitecore.sitecoreRuntimeConfig).to.deep.equal({
        ...mockOptions.sitecoreConfig,
        sites: mockOptions.sites,
        components: mockOptions.components,
        initialized: true,
      });
    });
  });

  describe('getSitecoreConfig', () => {
    it('should throw when sitecoreRuntimeConfig not initialized', () => {
      initSitecore.setTestSitecoreRuntimeConfig({}, false);
      expect(() => initSitecore.getSitecoreConfig()).to.throw(
        'Sitecore runtime config not initialized. Ensure initSitecore() call was performed.'
      );
    });

    it('should return sitecoreRuntimeConfig when initialized', () => {
      initSitecore.setTestSitecoreRuntimeConfig(mockOptions, true);
      expect(initSitecore.getSitecoreConfig()).to.deep.equal({
        ...mockOptions.sitecoreConfig,
        sites: mockOptions.sites,
        components: mockOptions.components,
        initialized: true,
      });
    });
  });
});
