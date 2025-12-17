import { expect } from 'chai';
import sinon from 'sinon';
import {
  initSitecore,
  getInitState,
  isInitialized,
  getPlugin,
  resetInitState,
  triggerDeferredInit,
  updatePluginSettings,
  isPluginEnabled,
  getGroupSettings,
  updateGroupSettings,
  updateEnvironment,
} from './initializer';
import { createPlugin } from './create-plugin';
import { defineGroup } from './create-group';
import { InitConfig, PluginSettingsBase, GroupContext } from './models';

describe('initSitecore', () => {
  let mockConfig: InitConfig;

  beforeEach(() => {
    resetInitState();
    mockConfig = {
      sitecoreContextId: 'test-context-id',
      sitecoreEdgeUrl: 'https://edge.example.com',
    };
  });

  afterEach(() => {
    resetInitState();
    sinon.restore();
  });

  describe('initialization', () => {
    it('should initialize successfully with valid config', async () => {
      await initSitecore({ config: mockConfig });

      expect(isInitialized()).to.be.true;
    });

    it('should throw error if config is not provided', async () => {
      try {
        await initSitecore({ config: null as unknown as InitConfig });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.include('INIT-001');
      }
    });

    it('should not throw error if already initialized (runs onRequest hooks instead)', async () => {
      await initSitecore({ config: mockConfig });

      // Second call should not throw, should just run onRequest hooks
      await initSitecore({ config: mockConfig });

      expect(isInitialized()).to.be.true;
    });

    it('should throw error for invalid edge URL', async () => {
      mockConfig.sitecoreEdgeUrl = 'invalid-url';

      try {
        await initSitecore({ config: mockConfig });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.include('INIT-009');
      }
    });
  });

  describe('plugins', () => {
    it('should register plugins during initialization', async () => {
      const plugin = createPlugin({
        name: 'test-plugin',
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      const registered = getPlugin('test-plugin');
      expect(registered).to.exist;
      expect(registered?.name).to.equal('test-plugin');
    });

    it('should throw error for duplicate plugins', async () => {
      const plugin = createPlugin({ name: 'test-plugin' });

      try {
        await initSitecore({ config: mockConfig, plugins: [plugin, plugin] });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.include('INIT-006');
      }
    });

    it('should run plugin validate function', async () => {
      const validateSpy = sinon.spy();
      const plugin = createPlugin({
        name: 'test-plugin',
        validate: validateSpy,
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should throw error if plugin validation fails', async () => {
      const plugin = createPlugin({
        name: 'test-plugin',
        validate: () => {
          throw new Error('Validation failed');
        },
      });

      try {
        await initSitecore({ config: mockConfig, plugins: [plugin] });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.include('INIT-005');
        expect((error as Error).message).to.include('Validation failed');
      }
    });

    it('should run plugin init function', async () => {
      const initSpy = sinon.spy();
      const plugin = createPlugin({
        name: 'test-plugin',
        init: initSpy,
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      expect(initSpy.calledOnce).to.be.true;
    });

    it('should handle async plugin init', async () => {
      let initCompleted = false;
      const plugin = createPlugin({
        name: 'test-plugin',
        init: async () => {
          await new Promise((resolve) => setTimeout(resolve, 10));
          initCompleted = true;
        },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      expect(initCompleted).to.be.true;
    });

    it('should pass correct context to plugins', async () => {
      let receivedContext: unknown;
      const plugin = createPlugin({
        name: 'test-plugin',
        validate: (ctx) => {
          receivedContext = ctx;
        },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      expect(receivedContext).to.exist;
      expect((receivedContext as { config: InitConfig }).config).to.equal(mockConfig);
    });

    it('should store plugin settings', async () => {
      interface MySettings {
        foo: string;
        bar: number;
      }
      const plugin = createPlugin<MySettings>({
        name: 'test-plugin',
        settings: { foo: 'hello', bar: 42 },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      const registered = getPlugin<MySettings>('test-plugin');
      expect(registered?.settings?.foo).to.equal('hello');
      expect(registered?.settings?.bar).to.equal(42);
    });
  });

  describe('dependencies', () => {
    it('should validate plugin dependencies', async () => {
      const dependencyPlugin = createPlugin({ name: 'dependency-plugin' });
      const dependentPlugin = createPlugin({
        name: 'dependent-plugin',
        dependencies: [{ name: 'dependency-plugin' }],
      });

      await initSitecore({
        config: mockConfig,
        plugins: [dependencyPlugin, dependentPlugin],
      });

      expect(isInitialized()).to.be.true;
    });

    it('should throw error if dependency is missing', async () => {
      const plugin = createPlugin({
        name: 'test-plugin',
        dependencies: [{ name: 'missing-plugin' }],
      });

      try {
        await initSitecore({ config: mockConfig, plugins: [plugin] });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.include('INIT-004');
        expect((error as Error).message).to.include('missing-plugin');
      }
    });

    it('should allow plugins to access dependencies via context', async () => {
      const depPlugin = createPlugin({ name: 'dep-plugin' });
      let foundDep = false;

      const mainPlugin = createPlugin({
        name: 'main-plugin',
        dependencies: [{ name: 'dep-plugin' }],
        init: (ctx) => {
          const dep = ctx.getPlugin('dep-plugin');
          foundDep = !!dep;
        },
      });

      await initSitecore({
        config: mockConfig,
        plugins: [depPlugin, mainPlugin],
      });

      expect(foundDep).to.be.true;
    });
  });

  describe('deferred initialization', () => {
    it('should not run deferredInit during initial setup', async () => {
      const deferredSpy = sinon.spy();
      const plugin = createPlugin({
        name: 'test-plugin',
        deferredInit: deferredSpy,
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      expect(deferredSpy.called).to.be.false;
    });

    it('should run deferredInit when triggered', async () => {
      const deferredSpy = sinon.spy();
      const plugin = createPlugin({
        name: 'test-plugin',
        deferredInit: deferredSpy,
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });
      await triggerDeferredInit('test-plugin');

      expect(deferredSpy.calledOnce).to.be.true;
    });

    it('should only run deferredInit once', async () => {
      const deferredSpy = sinon.spy();
      const plugin = createPlugin({
        name: 'test-plugin',
        deferredInit: deferredSpy,
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });
      await triggerDeferredInit('test-plugin');
      await triggerDeferredInit('test-plugin');

      expect(deferredSpy.calledOnce).to.be.true;
    });

    it('should handle async deferred init', async () => {
      let deferredCompleted = false;
      const plugin = createPlugin({
        name: 'test-plugin',
        deferredInit: async () => {
          await new Promise((resolve) => setTimeout(resolve, 10));
          deferredCompleted = true;
        },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });
      expect(deferredCompleted).to.be.false;

      await triggerDeferredInit('test-plugin');
      expect(deferredCompleted).to.be.true;
    });

    it('should throw error when triggering deferred init for non-existent plugin', async () => {
      await initSitecore({ config: mockConfig, plugins: [] });
      try {
        await triggerDeferredInit('non-existent-plugin');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.include('INIT-011');
      }
    });

    it('should throw error when plugin has no deferredInit function', async () => {
      const plugin = createPlugin({
        name: 'test-plugin',
        // No deferredInit defined
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });
      try {
        await triggerDeferredInit('test-plugin');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.include('INIT-012');
      }
    });

    it('should trigger multiple plugins with array', async () => {
      const deferred1Spy = sinon.spy();
      const deferred2Spy = sinon.spy();
      const plugin1 = createPlugin({
        name: 'plugin-1',
        deferredInit: deferred1Spy,
      });
      const plugin2 = createPlugin({
        name: 'plugin-2',
        deferredInit: deferred2Spy,
      });

      await initSitecore({ config: mockConfig, plugins: [plugin1, plugin2] });
      await triggerDeferredInit(['plugin-1', 'plugin-2']);

      expect(deferred1Spy.calledOnce).to.be.true;
      expect(deferred2Spy.calledOnce).to.be.true;
    });

    it('should trigger all plugins with wildcard "*"', async () => {
      const deferred1Spy = sinon.spy();
      const deferred2Spy = sinon.spy();
      const plugin1 = createPlugin({
        name: 'plugin-1',
        deferredInit: deferred1Spy,
      });
      const plugin2 = createPlugin({
        name: 'plugin-2',
        deferredInit: deferred2Spy,
      });
      const pluginWithoutDeferred = createPlugin({
        name: 'plugin-3',
        // No deferredInit
      });

      await initSitecore({
        config: mockConfig,
        plugins: [plugin1, plugin2, pluginWithoutDeferred],
      });
      await triggerDeferredInit('*');

      expect(deferred1Spy.calledOnce).to.be.true;
      expect(deferred2Spy.calledOnce).to.be.true;
    });

    it('should handle empty array gracefully', async () => {
      await initSitecore({ config: mockConfig, plugins: [] });
      await triggerDeferredInit([]); // Should not throw
    });

    it('should handle wildcard with no plugins having deferredInit', async () => {
      const plugin = createPlugin({
        name: 'plugin-1',
        // No deferredInit
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });
      await triggerDeferredInit('*'); // Should not throw
    });
  });

  describe('getInitState', () => {
    it('should throw error if not initialized', () => {
      try {
        getInitState();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.include('INIT-003');
      }
    });

    it('should return state after initialization', async () => {
      await initSitecore({ config: mockConfig });

      const state = getInitState();
      expect(state.initialized).to.be.true;
      expect(state.config).to.equal(mockConfig);
    });

    it('should return readonly state', async () => {
      await initSitecore({ config: mockConfig });

      const state = getInitState();
      expect(state.plugins).to.be.instanceOf(Map);
    });
  });

  describe('isInitialized', () => {
    it('should return false before initialization', () => {
      expect(isInitialized()).to.be.false;
    });

    it('should return true after initialization', async () => {
      await initSitecore({ config: mockConfig });
      expect(isInitialized()).to.be.true;
    });
  });

  describe('getPlugin', () => {
    it('should return undefined for non-existent plugin', async () => {
      await initSitecore({ config: mockConfig, plugins: [] });
      expect(getPlugin('non-existent')).to.be.undefined;
    });

    it('should return plugin by name', async () => {
      const plugin = createPlugin({ name: 'my-plugin' });
      await initSitecore({ config: mockConfig, plugins: [plugin] });

      const result = getPlugin('my-plugin');
      expect(result).to.equal(plugin);
    });
  });

  describe('context methods', () => {
    it('context.isReady should return correct state', async () => {
      let isReadyDuringInit = false;

      const plugin = createPlugin({
        name: 'test-plugin',
        init: (ctx) => {
          isReadyDuringInit = ctx.isReady();
        },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      // During init, isReady should be false
      expect(isReadyDuringInit).to.be.false;
    });

    it('context.ready should resolve after initialization', async () => {
      let readyResolved = false;

      const plugin = createPlugin({
        name: 'test-plugin',
        init: async (ctx) => {
          ctx.ready().then(() => {
            readyResolved = true;
          });
        },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      // Wait a tick for the promise to resolve
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(readyResolved).to.be.true;
    });
  });

  describe('environment handlers', () => {
    it('should pass environment handlers to plugins via context', async () => {
      const getCookieSpy = sinon.spy(() => 'cookie-value');
      let receivedEnvironment: unknown;

      const plugin = createPlugin({
        name: 'test-plugin',
        init: (ctx) => {
          receivedEnvironment = ctx.environment;
        },
      });

      await initSitecore({
        config: mockConfig,
        plugins: [plugin],
        environment: {
          getCookie: getCookieSpy,
        },
      });

      expect(receivedEnvironment).to.exist;
      expect((receivedEnvironment as { getCookie: unknown }).getCookie).to.equal(getCookieSpy);
    });

    it('should allow plugins to use environment handlers', async () => {
      const getCookieSpy = sinon.stub().returns('test-cookie-value');

      const plugin = createPlugin({
        name: 'test-plugin',
        init: (ctx) => {
          // Plugin uses the environment handler
          const value = ctx.environment.getCookie?.('my-cookie');
          expect(value).to.equal('test-cookie-value');
        },
      });

      await initSitecore({
        config: mockConfig,
        plugins: [plugin],
        environment: {
          getCookie: getCookieSpy,
        },
      });

      expect(getCookieSpy.calledOnce).to.be.true;
      expect(getCookieSpy.calledWith('my-cookie')).to.be.true;
    });

    it('should default to empty environment when not provided', async () => {
      let receivedEnvironment: unknown;

      const plugin = createPlugin({
        name: 'test-plugin',
        init: (ctx) => {
          receivedEnvironment = ctx.environment;
        },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      expect(receivedEnvironment).to.deep.equal({});
    });

    it('should store environment in state', async () => {
      const environment = {
        getCookie: () => 'value',
        setCookie: () => {},
        getHeader: () => 'header-value',
      };

      await initSitecore({ config: mockConfig, environment });

      const state = getInitState();
      // Use deep.equal since initSitecore merges environment with existing state
      expect(state.environment).to.deep.equal(environment);
    });

    it('should support custom environment handlers', async () => {
      const customHandler = sinon.spy(() => 'custom-result');

      const plugin = createPlugin({
        name: 'test-plugin',
        init: (ctx) => {
          const result = (ctx.environment as { customHandler: () => string }).customHandler();
          expect(result).to.equal('custom-result');
        },
      });

      await initSitecore({
        config: mockConfig,
        plugins: [plugin],
        environment: {
          customHandler,
        },
      });

      expect(customHandler.calledOnce).to.be.true;
    });
  });

  describe('onRequest hooks', () => {
    it('should run onRequest hook on subsequent init calls', async () => {
      const onRequestSpy = sinon.spy();
      const initSpy = sinon.spy();

      const plugin = createPlugin({
        name: 'test-plugin',
        init: initSpy,
        onRequest: onRequestSpy,
      });

      // First init - runs init but not onRequest
      await initSitecore({ config: mockConfig, plugins: [plugin] });
      expect(initSpy.calledOnce).to.be.true;
      expect(onRequestSpy.called).to.be.false;

      // Second init - runs onRequest but not init
      await initSitecore({ config: mockConfig });
      expect(initSpy.calledOnce).to.be.true; // Still only once
      expect(onRequestSpy.calledOnce).to.be.true;

      // Third init - runs onRequest again
      await initSitecore({ config: mockConfig });
      expect(initSpy.calledOnce).to.be.true; // Still only once
      expect(onRequestSpy.calledTwice).to.be.true;
    });

    it('should pass fresh environment to onRequest hook', async () => {
      let onRequestEnvironment: unknown;

      const plugin = createPlugin({
        name: 'test-plugin',
        onRequest: (ctx) => {
          onRequestEnvironment = ctx.environment;
        },
      });

      const env1 = { getCookie: () => 'value1' };
      const env2 = { getCookie: () => 'value2' };

      // First init
      await initSitecore({ config: mockConfig, plugins: [plugin], environment: env1 });

      // Second init with different environment
      await initSitecore({ config: mockConfig, environment: env2 });

      // Use deep.equal since environment is merged with state
      expect(onRequestEnvironment).to.deep.equal(env2);
    });

    it('should handle async onRequest hooks', async () => {
      let hookCompleted = false;

      const plugin = createPlugin({
        name: 'test-plugin',
        onRequest: async () => {
          await new Promise((resolve) => setTimeout(resolve, 10));
          hookCompleted = true;
        },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });
      expect(hookCompleted).to.be.false; // Not called on first init

      await initSitecore({ config: mockConfig });
      expect(hookCompleted).to.be.true;
    });

    it('should run multiple plugin onRequest hooks in parallel', async () => {
      const order: string[] = [];

      const plugin1 = createPlugin({
        name: 'plugin-1',
        onRequest: async () => {
          await new Promise((resolve) => setTimeout(resolve, 20));
          order.push('plugin-1');
        },
      });

      const plugin2 = createPlugin({
        name: 'plugin-2',
        onRequest: async () => {
          await new Promise((resolve) => setTimeout(resolve, 10));
          order.push('plugin-2');
        },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin1, plugin2] });

      // Trigger onRequest hooks
      await initSitecore({ config: mockConfig });

      // Both should have run (order depends on timing since parallel)
      expect(order).to.have.length(2);
      expect(order).to.include('plugin-1');
      expect(order).to.include('plugin-2');
    });

    it('should update state environment on subsequent calls', async () => {
      const env1 = { getCookie: () => 'value1' };
      const env2 = { getCookie: () => 'value2' };

      await initSitecore({ config: mockConfig, environment: env1 });
      // Use deep.equal since environment is merged with state
      expect(getInitState().environment).to.deep.equal(env1);

      await initSitecore({ config: mockConfig, environment: env2 });
      expect(getInitState().environment).to.deep.equal(env2);
    });

    it('should allow onRequest to modify cookies (typical use case)', async () => {
      const setCookieSpy = sinon.spy();

      const cookieRefreshPlugin = createPlugin({
        name: 'cookie-refresh',
        onRequest: (ctx) => {
          // Typical use: refresh visitor cookie TTL
          const visitorId = ctx.environment.getCookie?.('visitor_id');
          if (visitorId) {
            ctx.environment.setCookie?.('visitor_id', visitorId, { maxAge: 86400 * 365 });
          }
        },
      });

      await initSitecore({ config: mockConfig, plugins: [cookieRefreshPlugin] });

      // Simulate second request with environment that has visitor cookie
      await initSitecore({
        config: mockConfig,
        environment: {
          getCookie: (name) => (name === 'visitor_id' ? 'abc123' : undefined),
          setCookie: setCookieSpy,
        },
      });

      expect(setCookieSpy.calledOnce).to.be.true;
      expect(setCookieSpy.calledWith('visitor_id', 'abc123', { maxAge: 86400 * 365 })).to.be.true;
    });
  });

  describe('updatePluginSettings', () => {
    interface TestSettings extends PluginSettingsBase {
      apiKey?: string;
      debug?: boolean;
    }

    it('should update plugin settings after initialization', async () => {
      const plugin = createPlugin<TestSettings>({
        name: 'test-plugin',
        settings: { apiKey: 'initial', debug: false },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      await updatePluginSettings<TestSettings>('test-plugin', { debug: true });

      const registered = getPlugin<TestSettings>('test-plugin');
      expect(registered?.settings?.apiKey).to.equal('initial');
      expect(registered?.settings?.debug).to.equal(true);
    });

    it('should update the enabled flag', async () => {
      const plugin = createPlugin<TestSettings>({
        name: 'test-plugin',
        settings: { enabled: true },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      expect(isPluginEnabled('test-plugin')).to.be.true;

      await updatePluginSettings('test-plugin', { enabled: false });

      expect(isPluginEnabled('test-plugin')).to.be.false;
    });

    it('should throw error if SDK is not initialized', async () => {
      try {
        await updatePluginSettings('test-plugin', { enabled: true });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.include('INIT-003');
      }
    });

    it('should throw error if plugin is not registered', async () => {
      await initSitecore({ config: mockConfig, plugins: [] });

      try {
        await updatePluginSettings('non-existent-plugin', { enabled: true });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.include('INIT-011');
      }
    });

    it('should merge settings without overwriting unrelated fields', async () => {
      const plugin = createPlugin<TestSettings>({
        name: 'test-plugin',
        settings: { apiKey: 'secret', debug: false, enabled: true },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      // Only update enabled
      await updatePluginSettings('test-plugin', { enabled: false });

      const registered = getPlugin<TestSettings>('test-plugin');
      expect(registered?.settings?.apiKey).to.equal('secret');
      expect(registered?.settings?.debug).to.equal(false);
      expect(registered?.settings?.enabled).to.equal(false);
    });

    it('should automatically trigger deferred init when plugin is enabled', async () => {
      let deferredInitCalled = false;

      const plugin = createPlugin({
        name: 'test-plugin',
        settings: { enabled: false }, // Initially disabled
        deferredInit: () => {
          deferredInitCalled = true;
        },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      // Deferred init should not have been called for disabled plugin
      expect(deferredInitCalled).to.be.false;

      // Enable the plugin - should automatically trigger deferred init
      await updatePluginSettings('test-plugin', { enabled: true });

      expect(deferredInitCalled).to.be.true;
    });

    it('should trigger group deferred init when enabling plugin', async () => {
      let groupDeferredCalled = false;
      let pluginDeferredCalled = false;

      const testGroup = defineGroup({
        name: 'test-group',
        deferredInit: () => {
          groupDeferredCalled = true;
        },
      });

      const plugin = createPlugin({
        name: 'test-plugin',
        settings: { enabled: false },
        groups: [testGroup],
        deferredInit: () => {
          pluginDeferredCalled = true;
        },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      expect(groupDeferredCalled).to.be.false;
      expect(pluginDeferredCalled).to.be.false;

      // Enable plugin - should trigger both group and plugin deferred inits
      await updatePluginSettings('test-plugin', { enabled: true });

      expect(groupDeferredCalled).to.be.true;
      expect(pluginDeferredCalled).to.be.true;
    });

    it('should not re-trigger deferred init if already run', async () => {
      let deferredInitCount = 0;

      const plugin = createPlugin({
        name: 'test-plugin',
        settings: { enabled: true }, // Initially enabled
        deferredInit: () => {
          deferredInitCount++;
        },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      // Manually trigger deferred init
      await triggerDeferredInit('test-plugin');
      expect(deferredInitCount).to.equal(1);

      // Disable and re-enable - should NOT re-trigger since it already ran
      await updatePluginSettings('test-plugin', { enabled: false });
      await updatePluginSettings('test-plugin', { enabled: true });

      expect(deferredInitCount).to.equal(1); // Still 1, not re-triggered
    });
  });

  describe('isPluginEnabled', () => {
    it('should return true for plugin with no enabled setting (default)', async () => {
      const plugin = createPlugin({
        name: 'test-plugin',
        settings: {},
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      expect(isPluginEnabled('test-plugin')).to.be.true;
    });

    it('should return true for plugin with enabled: true', async () => {
      const plugin = createPlugin({
        name: 'test-plugin',
        settings: { enabled: true },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      expect(isPluginEnabled('test-plugin')).to.be.true;
    });

    it('should return false for plugin with enabled: false', async () => {
      const plugin = createPlugin({
        name: 'test-plugin',
        settings: { enabled: false },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      expect(isPluginEnabled('test-plugin')).to.be.false;
    });

    it('should return false for non-existent plugin', async () => {
      await initSitecore({ config: mockConfig, plugins: [] });

      expect(isPluginEnabled('non-existent-plugin')).to.be.false;
    });

    it('should return false before initialization', () => {
      expect(isPluginEnabled('any-plugin')).to.be.false;
    });

    it('should track changes after updatePluginSettings', async () => {
      const plugin = createPlugin({
        name: 'test-plugin',
        settings: { enabled: true },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      expect(isPluginEnabled('test-plugin')).to.be.true;

      await updatePluginSettings('test-plugin', { enabled: false });
      expect(isPluginEnabled('test-plugin')).to.be.false;

      await updatePluginSettings('test-plugin', { enabled: true });
      expect(isPluginEnabled('test-plugin')).to.be.true;
    });
  });

  describe('groups', () => {
    interface TestGroupSettings {
      cookieName: string;
      maxAge: number;
    }

    it('should register groups from plugins', async () => {
      const testGroup = defineGroup<TestGroupSettings>({
        name: 'test-group',
        defaultSettings: { cookieName: 'test', maxAge: 3600 },
      });

      const plugin = createPlugin({
        name: 'test-plugin',
        groups: [testGroup],
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      const settings = getGroupSettings<TestGroupSettings>('test-group');
      expect(settings).to.deep.equal({ cookieName: 'test', maxAge: 3600 });
    });

    it('should update group settings with updateGroupSettings', async () => {
      const testGroup = defineGroup<TestGroupSettings>({
        name: 'test-group',
        defaultSettings: { cookieName: 'default', maxAge: 3600 },
      });

      const plugin = createPlugin({
        name: 'test-plugin',
        groups: [testGroup],
      });

      await initSitecore({
        config: mockConfig,
        plugins: [plugin],
      });

      // Update settings after initialization
      updateGroupSettings<TestGroupSettings>('test-group', { cookieName: 'custom' });

      const settings = getGroupSettings<TestGroupSettings>('test-group');
      expect(settings).to.deep.equal({ cookieName: 'custom', maxAge: 3600 });
    });

    it('should run group init before plugin init', async () => {
      const order: string[] = [];

      const testGroup = defineGroup({
        name: 'test-group',
        defaultSettings: {},
        init: () => {
          order.push('group-init');
        },
      });

      const plugin = createPlugin({
        name: 'test-plugin',
        groups: [testGroup],
        init: () => {
          order.push('plugin-init');
        },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      expect(order).to.deep.equal(['group-init', 'plugin-init']);
    });

    it('should only run group init once for multiple plugins in same group', async () => {
      let groupInitCount = 0;

      const testGroup = defineGroup({
        name: 'shared-group',
        defaultSettings: {},
        init: () => {
          groupInitCount++;
        },
      });

      const plugin1 = createPlugin({
        name: 'plugin-1',
        groups: [testGroup],
      });

      const plugin2 = createPlugin({
        name: 'plugin-2',
        groups: [testGroup],
      });

      await initSitecore({ config: mockConfig, plugins: [plugin1, plugin2] });

      expect(groupInitCount).to.equal(1);
    });

    it('should run group validation before plugin validation', async () => {
      const order: string[] = [];

      const testGroup = defineGroup({
        name: 'test-group',
        defaultSettings: {},
        validate: () => {
          order.push('group-validate');
        },
      });

      const plugin = createPlugin({
        name: 'test-plugin',
        groups: [testGroup],
        validate: () => {
          order.push('plugin-validate');
        },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      expect(order).to.deep.equal(['group-validate', 'plugin-validate']);
    });

    it('should throw error if group validation fails', async () => {
      const testGroup = defineGroup({
        name: 'failing-group',
        defaultSettings: {},
        validate: () => {
          throw new Error('Group validation error');
        },
      });

      const plugin = createPlugin({
        name: 'test-plugin',
        groups: [testGroup],
      });

      try {
        await initSitecore({ config: mockConfig, plugins: [plugin] });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.include('INIT-013');
        expect((error as Error).message).to.include('failing-group');
      }
    });

    it('should provide group settings in group context', async () => {
      let capturedSettings: TestGroupSettings | undefined;

      const testGroup = defineGroup<TestGroupSettings>({
        name: 'test-group',
        defaultSettings: { cookieName: 'default', maxAge: 3600 },
        init: (ctx: GroupContext<TestGroupSettings>) => {
          capturedSettings = ctx.settings;
        },
      });

      const plugin = createPlugin({
        name: 'test-plugin',
        groups: [testGroup],
      });

      await initSitecore({
        config: mockConfig,
        plugins: [plugin],
      });

      expect(capturedSettings).to.deep.equal({ cookieName: 'default', maxAge: 3600 });
    });

    it('should run group deferredInit before plugin deferredInit', async () => {
      const order: string[] = [];

      const testGroup = defineGroup({
        name: 'test-group',
        defaultSettings: {},
        deferredInit: () => {
          order.push('group-deferred');
        },
      });

      const plugin = createPlugin({
        name: 'test-plugin',
        groups: [testGroup],
        deferredInit: () => {
          order.push('plugin-deferred');
        },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });
      await triggerDeferredInit('test-plugin');

      expect(order).to.deep.equal(['group-deferred', 'plugin-deferred']);
    });

    it('should only run group deferredInit once for multiple plugins in same group', async () => {
      let groupDeferredCount = 0;

      const testGroup = defineGroup({
        name: 'shared-group',
        defaultSettings: {},
        deferredInit: () => {
          groupDeferredCount++;
        },
      });

      const plugin1 = createPlugin({
        name: 'plugin-1',
        groups: [testGroup],
        deferredInit: () => {},
      });

      const plugin2 = createPlugin({
        name: 'plugin-2',
        groups: [testGroup],
        deferredInit: () => {},
      });

      await initSitecore({ config: mockConfig, plugins: [plugin1, plugin2] });
      await triggerDeferredInit(['plugin-1', 'plugin-2']);

      expect(groupDeferredCount).to.equal(1);
    });

    it('should handle async group init', async () => {
      const order: string[] = [];

      const testGroup = defineGroup({
        name: 'async-group',
        defaultSettings: {},
        init: async () => {
          await new Promise((resolve) => setTimeout(resolve, 10));
          order.push('group-init');
        },
      });

      const plugin = createPlugin({
        name: 'test-plugin',
        groups: [testGroup],
        init: () => {
          order.push('plugin-init');
        },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      expect(order).to.include('group-init');
    });

    it('should handle async group deferredInit', async () => {
      const order: string[] = [];

      const testGroup = defineGroup({
        name: 'async-group',
        defaultSettings: {},
        deferredInit: async () => {
          await new Promise((resolve) => setTimeout(resolve, 10));
          order.push('group-deferred');
        },
      });

      const plugin = createPlugin({
        name: 'test-plugin',
        groups: [testGroup],
        deferredInit: () => {
          order.push('plugin-deferred');
        },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });
      await triggerDeferredInit('test-plugin');

      expect(order).to.deep.equal(['group-deferred', 'plugin-deferred']);
    });

    it('should return undefined for non-existent group settings', async () => {
      await initSitecore({ config: mockConfig, plugins: [] });

      const settings = getGroupSettings('non-existent');
      expect(settings).to.be.undefined;
    });

    it('should provide environment handlers in group context', async () => {
      let capturedCookieValue: string | undefined;

      const testGroup = defineGroup({
        name: 'test-group',
        defaultSettings: {},
        init: (ctx) => {
          capturedCookieValue = ctx.environment.getCookie?.('test-cookie');
        },
      });

      const plugin = createPlugin({
        name: 'test-plugin',
        groups: [testGroup],
      });

      await initSitecore({
        config: mockConfig,
        plugins: [plugin],
        environment: {
          getCookie: (name) => (name === 'test-cookie' ? 'cookie-value' : undefined),
        },
      });

      expect(capturedCookieValue).to.equal('cookie-value');
    });

    it('should support plugins belonging to multiple groups', async () => {
      const initOrder: string[] = [];

      const group1 = defineGroup({
        name: 'group-1',
        defaultSettings: {},
        init: () => {
          initOrder.push('group-1');
        },
      });

      const group2 = defineGroup({
        name: 'group-2',
        defaultSettings: {},
        init: () => {
          initOrder.push('group-2');
        },
      });

      const plugin = createPlugin({
        name: 'multi-group-plugin',
        groups: [group1, group2],
        init: () => {
          initOrder.push('plugin');
        },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      expect(initOrder).to.include('group-1');
      expect(initOrder).to.include('group-2');
      expect(initOrder).to.include('plugin');
    });

    it('should throw error when updateGroupSettings is called before initialization', () => {
      expect(() => updateGroupSettings('test-group', { foo: 'bar' })).to.throw('INIT-003');
    });

    it('should throw error when updateGroupSettings is called for non-existent group', async () => {
      const testGroup = defineGroup({
        name: 'test-group',
        defaultSettings: {},
      });

      const plugin = createPlugin({
        name: 'test-plugin',
        groups: [testGroup],
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      expect(() => updateGroupSettings('non-existent', { foo: 'bar' })).to.throw('INIT-016');
    });

    it('should preserve existing settings when updating with partial settings', async () => {
      const testGroup = defineGroup<TestGroupSettings>({
        name: 'test-group',
        defaultSettings: { cookieName: 'default', maxAge: 3600 },
      });

      const plugin = createPlugin({
        name: 'test-plugin',
        groups: [testGroup],
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      updateGroupSettings<TestGroupSettings>('test-group', { cookieName: 'updated' });
      let settings = getGroupSettings<TestGroupSettings>('test-group');
      expect(settings).to.deep.equal({ cookieName: 'updated', maxAge: 3600 });

      updateGroupSettings<TestGroupSettings>('test-group', { maxAge: 7200 });
      settings = getGroupSettings<TestGroupSettings>('test-group');
      expect(settings).to.deep.equal({ cookieName: 'updated', maxAge: 7200 });
    });
  });

  describe('updateEnvironment', () => {
    it('should update environment handlers', async () => {
      await initSitecore({ config: mockConfig });

      const getCookieMock = sinon.stub().returns('test-value');
      await updateEnvironment({ getCookie: getCookieMock }, { triggerDeferredInit: false });

      const state = getInitState();
      expect(state.environment.getCookie).to.equal(getCookieMock);
      expect(state.environment.getCookie?.('test')).to.equal('test-value');
    });

    it('should merge handlers by default', async () => {
      const setCookieMock = sinon.stub();
      await initSitecore({
        config: mockConfig,
        environment: { setCookie: setCookieMock },
      });

      const getCookieMock = sinon.stub().returns('value');
      await updateEnvironment({ getCookie: getCookieMock }, { triggerDeferredInit: false });

      const state = getInitState();
      expect(state.environment.getCookie).to.equal(getCookieMock);
      expect(state.environment.setCookie).to.equal(setCookieMock);
    });

    it('should replace all handlers when merge is false', async () => {
      const setCookieMock = sinon.stub();
      await initSitecore({
        config: mockConfig,
        environment: { setCookie: setCookieMock },
      });

      const getCookieMock = sinon.stub().returns('value');
      await updateEnvironment(
        { getCookie: getCookieMock },
        { merge: false, triggerDeferredInit: false }
      );

      const state = getInitState();
      expect(state.environment.getCookie).to.equal(getCookieMock);
      expect(state.environment.setCookie).to.be.undefined;
    });

    it('should allow updating environment before initialization', async () => {
      const getCookieMock = sinon.stub().returns('value');
      await updateEnvironment({ getCookie: getCookieMock });

      // Now initialize - the environment should be available
      await initSitecore({ config: mockConfig });

      const state = getInitState();
      expect(state.environment.getCookie).to.equal(getCookieMock);
    });

    it('should allow overriding existing handlers', async () => {
      const originalGetCookie = sinon.stub().returns('original');
      await initSitecore({
        config: mockConfig,
        environment: { getCookie: originalGetCookie },
      });

      const newGetCookie = sinon.stub().returns('new');
      await updateEnvironment({ getCookie: newGetCookie }, { triggerDeferredInit: false });

      const state = getInitState();
      expect(state.environment.getCookie?.('test')).to.equal('new');
    });

    it('should trigger deferred inits by default after environment update', async () => {
      let capturedCookie: string | undefined;

      const plugin = createPlugin({
        name: 'test-plugin',
        deferredInit: (ctx) => {
          capturedCookie = ctx.environment.getCookie?.('bid');
        },
      });

      // Initialize without environment
      await initSitecore({ config: mockConfig, plugins: [plugin] });

      // Update environment - should automatically trigger deferred inits
      await updateEnvironment({
        getCookie: () => 'browser-id-123',
      });

      // Deferred init should have been called automatically
      expect(capturedCookie).to.equal('browser-id-123');
    });

    it('should not trigger deferred inits when triggerDeferredInit is false', async () => {
      let deferredInitCalled = false;

      const plugin = createPlugin({
        name: 'test-plugin',
        deferredInit: () => {
          deferredInitCalled = true;
        },
      });

      // Initialize without environment
      await initSitecore({ config: mockConfig, plugins: [plugin] });

      // Update environment with triggerDeferredInit: false
      await updateEnvironment({ getCookie: () => 'value' }, { triggerDeferredInit: false });

      // Deferred init should NOT have been called
      expect(deferredInitCalled).to.be.false;
    });

    it('should not trigger deferred inits before initialization', async () => {
      let deferredInitCalled = false;

      const plugin = createPlugin({
        name: 'test-plugin',
        deferredInit: () => {
          deferredInitCalled = true;
        },
      });

      // Update environment before init - should not trigger deferred inits
      await updateEnvironment({ getCookie: () => 'value' });

      expect(deferredInitCalled).to.be.false;

      // Now initialize - deferred init still not auto-triggered
      await initSitecore({ config: mockConfig, plugins: [plugin] });

      expect(deferredInitCalled).to.be.false;

      // Manual trigger works
      await triggerDeferredInit('test-plugin');
      expect(deferredInitCalled).to.be.true;
    });

    it('should trigger group deferred inits when updating environment', async () => {
      let groupDeferredCalled = false;
      let pluginDeferredCalled = false;

      const testGroup = defineGroup({
        name: 'test-group',
        deferredInit: () => {
          groupDeferredCalled = true;
        },
      });

      const plugin = createPlugin({
        name: 'test-plugin',
        groups: [testGroup],
        deferredInit: () => {
          pluginDeferredCalled = true;
        },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      // Update environment - should trigger both group and plugin deferred inits
      await updateEnvironment({ getCookie: () => 'value' });

      expect(groupDeferredCalled).to.be.true;
      expect(pluginDeferredCalled).to.be.true;
    });

    it('should NOT trigger deferred inits for disabled plugins when updating environment', async () => {
      let deferredInitCalled = false;

      const plugin = createPlugin({
        name: 'test-plugin',
        settings: { enabled: false }, // Plugin is disabled (e.g., no cookie consent)
        deferredInit: () => {
          deferredInitCalled = true;
        },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      // Update environment - should NOT trigger deferred init for disabled plugin
      await updateEnvironment({ getCookie: () => 'value' });

      expect(deferredInitCalled).to.be.false;
    });

    it('should NOT trigger group deferred inits for disabled plugins', async () => {
      let groupDeferredCalled = false;

      const testGroup = defineGroup({
        name: 'test-group',
        deferredInit: () => {
          groupDeferredCalled = true;
        },
      });

      const plugin = createPlugin({
        name: 'test-plugin',
        settings: { enabled: false }, // Plugin is disabled
        groups: [testGroup],
        deferredInit: () => {},
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      // Update environment - group deferred init should NOT be called
      // because the only plugin using it is disabled
      await updateEnvironment({ getCookie: () => 'value' });

      expect(groupDeferredCalled).to.be.false;
    });

    it('should auto-trigger deferred init when plugin is enabled via updatePluginSettings', async () => {
      let deferredInitCalled = false;

      const plugin = createPlugin({
        name: 'test-plugin',
        settings: { enabled: false }, // Initially disabled
        deferredInit: () => {
          deferredInitCalled = true;
        },
      });

      await initSitecore({ config: mockConfig, plugins: [plugin] });

      // Update environment while plugin is disabled - should NOT trigger
      await updateEnvironment(
        { getCookie: () => 'value' },
        { triggerDeferredInit: false } // Don't auto-trigger
      );

      expect(deferredInitCalled).to.be.false;

      // Enable the plugin (e.g., user accepts cookies) - now auto-triggers deferred init
      await updatePluginSettings('test-plugin', { enabled: true });

      // Deferred init should have been triggered automatically
      expect(deferredInitCalled).to.be.true;
    });
  });
});

