import path from 'path';
import { expect } from 'chai';
import { loadConfig } from './sitecore-config';
import testConfig from '../test-data/config/sitecore.config.js';

describe('sitecore-config', () => {
  const setEnv = () => {
    process.env.SITECORE_EDGE_CONTEXT_ID = 'custom-context-id';
    process.env.SITECORE_EDGE_URL = 'https://custom-edge-url';
    process.env.SITECORE_SITE_NAME = 'custom-site';
    process.env.JSS_EDITING_SECRET = 'custom-secret';
    process.env.SITECORE_PERSONALIZE_SCOPE = 'custom-scope';
    process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT = '200';
    process.env.PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT = '200';
  };

  const clearEnv = () => {
    delete process.env.SITECORE_EDGE_CONTEXT_ID;
    delete process.env.SITECORE_EDGE_URL;
    delete process.env.SITECORE_SITE_NAME;
    delete process.env.JSS_EDITING_SECRET;
    delete process.env.SITECORE_PERSONALIZE_SCOPE;
    delete process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT;
    delete process.env.PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT;
  };

  afterEach(() => {
    clearEnv();
  });

  it('should return default config values when env is set', () => {
    setEnv();
    const config = loadConfig(undefined, path.resolve(__dirname, '../test-data/config/empty'));
    expect(config.api.edge.contextId).to.equal(process.env.SITECORE_EDGE_CONTEXT_ID);
    expect(config.api.edge.edgeUrl).to.equal(process.env.SITECORE_EDGE_URL);
    expect(config.defaultSite).to.equal(process.env.SITECORE_SITE_NAME);
    expect(config.defaultLanguage).to.equal('en');
    expect(config.editingSecret).to.equal(process.env.JSS_EDITING_SECRET);
    expect(config.retries.count).to.equal(3);
    expect(config.redirects.enabled).to.equal(true);
    expect(config.redirects.locales).to.deep.equal(['en']);
    expect(config.multisite.enabled).to.be.true;
    expect(config.personalize.enabled).to.be.true;
    expect(config.personalize.scope).to.equal('');
    expect(config.personalize.edgeTimeout).to.equal(200);
    expect(config.personalize.cdpTimeout).to.equal(200);
  });

  it('should return default fallback values when env is empty', () => {
    const config = loadConfig(undefined, path.resolve(__dirname, '../test-data/config/empty'));
    expect(config.api.edge.contextId).to.equal('');
    expect(config.defaultSite).to.equal('jss');
    expect(config.defaultLanguage).to.equal('en');
    expect(config.editingSecret).to.equal('editing-secret-missing');
    expect(config.retries.count).to.equal(3);
    expect(config.redirects.enabled).to.equal(true);
    expect(config.redirects.locales).to.deep.equal(['en']);
    expect(config.multisite.enabled).to.be.true;
    expect(config.personalize.enabled).to.be.true;
    expect(config.personalize.scope).to.equal('');
    expect(config.personalize.edgeTimeout).to.equal(100);
    expect(config.personalize.cdpTimeout).to.equal(100);
  });

  it('should load config from sitecore.config module', () => {
    const config = loadConfig(undefined, path.resolve(__dirname, '../test-data/config'));
    expect(config.api.edge.contextId).to.equal('');
    expect(config.api.edge.edgeUrl).to.equal(testConfig.api.edge.edgeUrl);
    expect(config.defaultSite).to.equal(testConfig.defaultSite);
    expect(config.defaultLanguage).to.equal('en');
    expect(config.editingSecret).to.equal('editing-secret-missing');
    expect(config.retries.count).to.equal(testConfig.retries.count);
    expect(config.retries.retryStrategy).to.not.be.undefined;
    expect(config.redirects.enabled).to.equal(testConfig.redirects.enabled);
    expect(config.redirects.locales).to.deep.equal(['en']);
    expect(config.multisite.enabled).to.be.true;
    expect(config.personalize.enabled).to.equal(testConfig.personalize.enabled);
    expect(config.personalize.scope).to.equal(testConfig.personalize.scope);
  });
});
