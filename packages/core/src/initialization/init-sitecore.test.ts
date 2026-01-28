/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { Plugin } from './types';
import { ERROR_MESSAGES } from './consts';

describe('init-sitecore', () => {
  let sandbox: sinon.SinonSandbox;
  let initPluginsStub: sinon.SinonStub;
  let validateCoreConfigStub: sinon.SinonStub;
  let debugInitStub: sinon.SinonStub;
  let initSitecore: typeof import('./init-sitecore').initSitecore;
  let getCoreSettings: typeof import('./init-sitecore').getCoreSettings;

  const validConfig = {
    contextId: 'test-context-id',
    sitecoreEdgeUrl: 'https://edge.example.com',
    siteName: 'test-site',
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    initPluginsStub = sandbox.stub().resolves();
    validateCoreConfigStub = sandbox.stub();
    debugInitStub = sandbox.stub();

    const module = proxyquire.noCallThru()('./init-sitecore', {
      './helpers': {
        initPlugins: initPluginsStub,
        validateCoreConfig: validateCoreConfigStub,
      },
      './debug': {
        default: {
          init: debugInitStub,
        },
      },
    });

    initSitecore = module.initSitecore;
    getCoreSettings = module.getCoreSettings;
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getCoreSettings', () => {
    it('should throw error when SDK is not initialized', () => {
      expect(() => getCoreSettings()).to.throw(ERROR_MESSAGES.IE_0002);
    });

    it('should return core settings after initialization', async () => {
      const mockPlugin: Plugin = {
        name: 'test-plugin',
        init: sandbox.stub().resolves(),
      };

      await initSitecore({
        settings: validConfig,
        plugins: [mockPlugin],
      });

      const settings = getCoreSettings();

      expect(settings).to.exist;
      expect(settings.settings).to.deep.equal(validConfig);
      expect(settings.plugins.size).to.equal(1);
      expect(settings.plugins.has('test-plugin')).to.be.true;
    });
  });

  describe('initSitecore', () => {
    it('should validate configuration', async () => {
      const mockPlugin: Plugin = {
        name: 'test-plugin',
      };

      await initSitecore({
        settings: validConfig,
        plugins: [mockPlugin],
      });

      expect(validateCoreConfigStub.calledOnceWith(validConfig)).to.be.true;
    });

    it('should initialize without error when no plugins are provided and log a warning', async () => {
      await initSitecore({
        settings: validConfig,
        plugins: [],
      });

      expect(debugInitStub.calledWith('No plugins provided to the plugins array')).to.be.true;

      const settings = getCoreSettings();
      expect(settings.plugins.size).to.equal(0);
    });

    it('should register all provided plugins', async () => {
      const plugin1: Plugin = { name: 'plugin-1' };
      const plugin2: Plugin = { name: 'plugin-2' };
      const plugin3: Plugin = { name: 'plugin-3' };

      await initSitecore({
        settings: validConfig,
        plugins: [plugin1, plugin2, plugin3],
      });

      const settings = getCoreSettings();
      expect(settings.plugins.size).to.equal(3);
      expect(settings.plugins.has('plugin-1')).to.be.true;
      expect(settings.plugins.has('plugin-2')).to.be.true;
      expect(settings.plugins.has('plugin-3')).to.be.true;
    });

    it('should call initPlugins with registered plugins', async () => {
      const mockPlugin: Plugin = {
        name: 'test-plugin',
      };

      await initSitecore({
        settings: validConfig,
        plugins: [mockPlugin],
      });

      expect(initPluginsStub.calledOnce).to.be.true;
      const pluginsArg = initPluginsStub.firstCall.args[0] as Map<string, Plugin>;
      expect(pluginsArg).to.be.instanceOf(Map);
      expect(pluginsArg.size).to.equal(1);
    });

    it('should store plugins with their settings', async () => {
      const pluginSettings = { option1: 'value1', option2: true };
      const mockPlugin: Plugin = {
        name: 'test-plugin',
        settings: pluginSettings,
      };

      await initSitecore({
        settings: validConfig,
        plugins: [mockPlugin],
      });

      const settings = getCoreSettings();
      const storedPlugin = settings.plugins.get('test-plugin');
      expect(storedPlugin?.settings).to.deep.equal(pluginSettings);
    });

    it('should store plugins with their dependencies', async () => {
      const mockPlugin: Plugin = {
        name: 'dependent-plugin',
        dependencies: ['base-plugin'],
      };

      const basePlugin: Plugin = {
        name: 'base-plugin',
      };

      await initSitecore({
        settings: validConfig,
        plugins: [basePlugin, mockPlugin],
      });

      const settings = getCoreSettings();
      const storedPlugin = settings.plugins.get('dependent-plugin');
      expect(storedPlugin?.dependencies).to.deep.equal(['base-plugin']);
    });

    it('should await readyPromise after initialization', async () => {
      let initPluginsResolved = false;
      initPluginsStub.callsFake(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        initPluginsResolved = true;
      });

      const mockPlugin: Plugin = { name: 'test-plugin' };

      await initSitecore({
        settings: validConfig,
        plugins: [mockPlugin],
      });

      expect(initPluginsResolved).to.be.true;
    });

    it('should store readyPromise in coreSettings', async () => {
      const mockPlugin: Plugin = { name: 'test-plugin' };

      await initSitecore({
        settings: validConfig,
        plugins: [mockPlugin],
      });

      const settings = getCoreSettings();
      expect(settings.readyPromise).to.exist;
    });

    it('should overwrite previous initialization when called again', async () => {
      const plugin1: Plugin = { name: 'plugin-1' };
      const plugin2: Plugin = { name: 'plugin-2' };

      await initSitecore({
        settings: validConfig,
        plugins: [plugin1],
      });

      const newConfig = {
        ...validConfig,
        siteName: 'new-site',
      };

      await initSitecore({
        settings: newConfig,
        plugins: [plugin2],
      });

      const settings = getCoreSettings();
      expect(settings.settings.siteName).to.equal('new-site');
      expect(settings.plugins.size).to.equal(1);
      expect(settings.plugins.has('plugin-2')).to.be.true;
      expect(settings.plugins.has('plugin-1')).to.be.false;
    });
  });
});

describe('init-sitecore integration', () => {
  // These tests use the real implementation (not mocked) to ensure full code coverage
  let initSitecore: typeof import('./init-sitecore').initSitecore;
  let getCoreSettings: typeof import('./init-sitecore').getCoreSettings;

  const validConfig = {
    contextId: 'test-context-id',
    sitecoreEdgeUrl: 'https://edge.example.com',
    siteName: 'test-site',
  };

  beforeEach(() => {
    // Get a fresh module instance for each test using proxyquire without mocks
    const module = proxyquire.noCallThru().noPreserveCache()('./init-sitecore', {});
    initSitecore = module.initSitecore;
    getCoreSettings = module.getCoreSettings;
  });

  it('should initialize with real validation and plugin initialization', async () => {
    const mockPlugin: Plugin = {
      name: 'test-plugin',
      init: () => {},
    };

    await initSitecore({
      settings: validConfig,
      plugins: [mockPlugin],
    });

    const settings = getCoreSettings();
    expect(settings).to.exist;
    expect(settings.settings).to.deep.equal(validConfig);
    expect(settings.plugins.size).to.equal(1);
  });

  it('should execute debug logging during initialization', async () => {
    const mockPlugin: Plugin = {
      name: 'debug-test-plugin',
    };

    // This test ensures the debugInit calls are executed
    await initSitecore({
      settings: validConfig,
      plugins: [mockPlugin],
    });

    const settings = getCoreSettings();
    expect(settings.readyPromise).to.exist;
  });
});

