/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { Plugin } from './types';
import { ERROR_MESSAGES } from './consts';

describe('init-content-sdk', () => {
  let sandbox: sinon.SinonSandbox;
  let initPluginsStub: sinon.SinonStub;
  let resolveCoreContextConfigStub: sinon.SinonStub;
  let debugInitStub: sinon.SinonStub;

  let initContentSdk: typeof import('./init-content-sdk').initContentSdk;
  let getCoreContext: typeof import('./init-content-sdk').getCoreContext;

  const validConfig = {
    contextId: 'test-context-id',
    edgeUrl: 'https://edge.example.com',
    siteName: 'test-site',
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    initPluginsStub = sandbox.stub().resolves();
    resolveCoreContextConfigStub = sandbox.stub().callsFake((config) => config);
    debugInitStub = sandbox.stub();

    const module = proxyquire('./init-content-sdk', {
      './helpers': {
        initPlugins: initPluginsStub,
        resolveCoreContextConfig: resolveCoreContextConfigStub,
      },
      '../debug': {
        default: {
          init: debugInitStub,
        },
      },
    });

    initContentSdk = module.initContentSdk;
    getCoreContext = module.getCoreContext;
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getCoreContext', () => {
    it('should throw error when SDK is not initialized', () => {
      expect(() => getCoreContext()).to.throw(ERROR_MESSAGES.IE_002);
    });

    it('should return core settings after initialization', async () => {
      const mockPlugin: Plugin = {
        name: 'test-plugin',
        init: sandbox.stub().resolves(),
      };

      await initContentSdk({
        config: validConfig,
        plugins: [mockPlugin],
      });

      const coreContext = getCoreContext();

      expect(coreContext).to.exist;
      expect(coreContext.config).to.deep.equal(validConfig);
      expect(coreContext.plugins.size).to.equal(1);
      expect(coreContext.plugins.has('test-plugin')).to.be.true;
    });
  });

  describe('initContentSdk', () => {
    it('should initialize without error when no plugins are provided and log a warning', async () => {
      await initContentSdk({
        config: validConfig,
        plugins: [],
      });

      expect(resolveCoreContextConfigStub.calledOnceWith(validConfig)).to.be.true;
      expect(debugInitStub.calledWith('No plugins provided to the plugins array')).to.be.true;

      const coreContext = getCoreContext();
      expect(coreContext.plugins.size).to.equal(0);
    });

    it('should register all provided plugins', async () => {
      const plugin1: Plugin = { name: 'plugin-1' };
      const plugin2: Plugin = { name: 'plugin-2' };
      const plugin3: Plugin = { name: 'plugin-3' };

      await initContentSdk({
        config: validConfig,
        plugins: [plugin1, plugin2, plugin3],
      });

      const coreContext = getCoreContext();
      expect(coreContext.plugins.size).to.equal(3);
      expect(coreContext.plugins.has('plugin-1')).to.be.true;
      expect(coreContext.plugins.has('plugin-2')).to.be.true;
      expect(coreContext.plugins.has('plugin-3')).to.be.true;

      expect(debugInitStub.firstCall.args[0]).to.equal('Initializing Content SDK with params:');
      const registeredPluginsCall = debugInitStub
        .getCalls()
        .find((call) => (call.args[0] as string).includes('Registered'));
      expect(registeredPluginsCall?.args[0]).to.equal('Registered 3 plugins');

      expect(initPluginsStub.calledOnce).to.be.true;
      const pluginsArg = initPluginsStub.firstCall.args[0] as Map<string, Plugin>;
      expect(pluginsArg).to.be.instanceOf(Map);
      expect(pluginsArg.size).to.equal(3);
    });

    it('should store plugins with their options', async () => {
      const pluginOptions = { option1: 'value1', option2: true };
      const mockPlugin: Plugin = {
        name: 'test-plugin',
        options: pluginOptions,
      };

      await initContentSdk({
        config: validConfig,
        plugins: [mockPlugin],
      });

      const coreContext = getCoreContext();
      const storedPlugin = coreContext.plugins.get('test-plugin');
      expect(storedPlugin?.options).to.deep.equal(pluginOptions);
    });

    it('should store plugins with their dependencies', async () => {
      const mockPlugin: Plugin = {
        name: 'dependent-plugin',
        dependencies: ['base-plugin'],
      };

      const basePlugin: Plugin = {
        name: 'base-plugin',
      };

      await initContentSdk({
        config: validConfig,
        plugins: [basePlugin, mockPlugin],
      });

      const coreContext = getCoreContext();
      const storedPlugin = coreContext.plugins.get('dependent-plugin');
      expect(storedPlugin?.dependencies).to.deep.equal(['base-plugin']);
    });

    it('should await readyPromise after initialization', async () => {
      let initPluginsResolved = false;
      initPluginsStub.callsFake(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        initPluginsResolved = true;
      });

      const mockPlugin: Plugin = { name: 'test-plugin' };

      await initContentSdk({
        config: validConfig,
        plugins: [mockPlugin],
      });

      expect(initPluginsResolved).to.be.true;
    });

    it('should store readyPromise in coreContext', async () => {
      const mockPlugin: Plugin = { name: 'test-plugin' };

      await initContentSdk({
        config: validConfig,
        plugins: [mockPlugin],
      });

      const coreContext = getCoreContext();
      expect(coreContext.readyPromise).to.exist;

      const lastCall = debugInitStub.lastCall;
      expect(lastCall?.args[0]).to.equal('SDK initialization complete');
    });

    it('should overwrite previous initialization when called again', async () => {
      const plugin1: Plugin = { name: 'plugin-1' };
      const plugin2: Plugin = { name: 'plugin-2' };

      await initContentSdk({
        config: validConfig,
        plugins: [plugin1],
      });

      const newConfig = {
        ...validConfig,
        siteName: 'new-site',
      };

      await initContentSdk({
        config: newConfig,
        plugins: [plugin2],
      });

      const coreContext = getCoreContext();
      expect(coreContext.config.siteName).to.equal('new-site');
      expect(coreContext.plugins.size).to.equal(1);
      expect(coreContext.plugins.has('plugin-2')).to.be.true;
      expect(coreContext.plugins.has('plugin-1')).to.be.false;
    });
  });
});
