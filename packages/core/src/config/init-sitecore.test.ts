import { expect } from 'chai';
import * as initSitecore from './init-sitecore';
import { SitecoreConfig } from '../../config';
import { DefaultRetryStrategy } from '..';
import globalConfig from '../test-data/config/sitecore.config';

describe('init-sitecore', () => {
  const mockConfig: SitecoreConfig = {
    api: {
      edge: {
        contextId: 'context-id',
        clientContextId: 'client-id',
        edgeUrl: '',
        path: '',
      },
      local: {
        apiHost: 'api-host.com',
        apiKey: 'api-key',
        path: '',
      },
    },
    defaultSite: 'unit-site',
    defaultLanguage: 'en',
    multisite: {
      enabled: true,
      defaultHostname: '',
      useCookieResolution: () => false,
    },
    personalize: {
      enabled: false,
      edgeTimeout: 1000,
      cdpTimeout: 1000,
      scope: 'unit-scope',
      channel: '',
      currency: '',
    },
    redirects: {
      enabled: true,
      locales: ['en'],
    },
    editingSecret: '',
    retries: { count: 0, retryStrategy: new DefaultRetryStrategy() },
    layout: {
      formatLayoutQuery: () => '',
    },
    dictionary: {
      caching: {
        enabled: false,
        timeout: 0,
      },
    },
  };

  after(() => {
    initSitecore.setTestSitecoreRuntimeConfig({ sites: [], ...globalConfig }, true);
  });

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
      initSitecore.setTestSitecoreRuntimeConfig({ sites: [], ...mockConfig }, false);
      expect(() => initSitecore.getSitecoreConfig()).to.throw(
        'Sitecore runtime config not initialized. Ensure initSitecore() call was performed.'
      );
    });

    it('should return sitecoreRuntimeConfig when initialized', () => {
      initSitecore.setTestSitecoreRuntimeConfig({ sites: mockOptions.sites, ...mockConfig }, true);
      expect(initSitecore.getSitecoreConfig()).to.deep.equal({
        ...mockOptions.sitecoreConfig,
        sites: mockOptions.sites,
        initialized: true,
      });
    });
  });
});
