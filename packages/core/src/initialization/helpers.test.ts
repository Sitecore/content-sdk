/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { checkPluginDependencies, initPlugins, constructCoreConfigSettings } from './helpers';
import { Plugin } from './types';
import { ERROR_MESSAGES } from './consts';

describe('helpers', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('checkPluginDependencies', () => {
    it('should not throw when plugin has no dependencies', () => {
      const plugin: Plugin = { name: 'test-plugin' };
      const plugins = new Map<string, Plugin>();

      expect(() => checkPluginDependencies(plugin, plugins)).to.not.throw();
    });

    it('should not throw when all dependencies are satisfied', () => {
      const basePlugin: Plugin = { name: 'base-plugin' };
      const dependentPlugin: Plugin = {
        name: 'dependent-plugin',
        dependencies: ['base-plugin'],
      };

      const plugins = new Map<string, Plugin>();
      plugins.set('base-plugin', basePlugin);
      plugins.set('dependent-plugin', dependentPlugin);

      expect(() => checkPluginDependencies(dependentPlugin, plugins)).to.not.throw();
    });

    it('should throw when a dependency is missing', () => {
      const plugin: Plugin = {
        name: 'dependent-plugin',
        dependencies: ['missing-plugin'],
      };

      const plugins = new Map<string, Plugin>();
      plugins.set('dependent-plugin', plugin);

      expect(() => checkPluginDependencies(plugin, plugins)).to.throw(
        '[IE-0001] - "dependent-plugin" also requires "missing-plugin"'
      );
    });

    it('should throw for first missing dependency when multiple are missing', () => {
      const plugin: Plugin = {
        name: 'dependent-plugin',
        dependencies: ['missing-plugin-1', 'missing-plugin-2'],
      };

      const plugins = new Map<string, Plugin>();
      plugins.set('dependent-plugin', plugin);

      expect(() => checkPluginDependencies(plugin, plugins)).to.throw(
        '[IE-0001] - "dependent-plugin" also requires "missing-plugin-1"'
      );
    });

    it('should not throw when empty dependencies array is provided', () => {
      const plugin: Plugin = {
        name: 'test-plugin',
        dependencies: [],
      };

      const plugins = new Map<string, Plugin>();
      plugins.set('test-plugin', plugin);

      expect(() => checkPluginDependencies(plugin, plugins)).to.not.throw();
    });

    it('should check multiple dependencies correctly', () => {
      const plugin1: Plugin = { name: 'plugin-1' };
      const plugin2: Plugin = { name: 'plugin-2' };
      const dependentPlugin: Plugin = {
        name: 'dependent-plugin',
        dependencies: ['plugin-1', 'plugin-2'],
      };

      const plugins = new Map<string, Plugin>();
      plugins.set('plugin-1', plugin1);
      plugins.set('plugin-2', plugin2);
      plugins.set('dependent-plugin', dependentPlugin);

      expect(() => checkPluginDependencies(dependentPlugin, plugins)).to.not.throw();
    });
  });

  describe('initPlugins', () => {
    it('should call init on each plugin', async () => {
      const initStub1 = sandbox.stub().resolves();
      const initStub2 = sandbox.stub().resolves();

      const plugin1: Plugin = { name: 'plugin-1', init: initStub1 };
      const plugin2: Plugin = { name: 'plugin-2', init: initStub2 };

      const plugins = new Map<string, Plugin>();
      plugins.set('plugin-1', plugin1);
      plugins.set('plugin-2', plugin2);

      await initPlugins(plugins);

      expect(initStub1.calledOnce).to.be.true;
      expect(initStub2.calledOnce).to.be.true;
    });

    it('should handle plugins without init method', async () => {
      const plugin1: Plugin = { name: 'plugin-1' };
      const plugin2: Plugin = { name: 'plugin-2' };

      const plugins = new Map<string, Plugin>();
      plugins.set('plugin-1', plugin1);
      plugins.set('plugin-2', plugin2);

      // Should not throw
      await initPlugins(plugins);
    });

    it('should handle mix of plugins with and without init', async () => {
      const initStub = sandbox.stub().resolves();

      const plugin1: Plugin = { name: 'plugin-1', init: initStub };
      const plugin2: Plugin = { name: 'plugin-2' };

      const plugins = new Map<string, Plugin>();
      plugins.set('plugin-1', plugin1);
      plugins.set('plugin-2', plugin2);

      await initPlugins(plugins);

      expect(initStub.calledOnce).to.be.true;
    });

    it('should await async init functions', async () => {
      let initCompleted = false;
      const asyncInit = sandbox.stub().callsFake(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        initCompleted = true;
      });

      const plugin: Plugin = { name: 'async-plugin', init: asyncInit };

      const plugins = new Map<string, Plugin>();
      plugins.set('async-plugin', plugin);

      await initPlugins(plugins);

      expect(initCompleted).to.be.true;
    });

    it('should initialize plugins in order', async () => {
      const initOrder: string[] = [];

      const plugin1: Plugin = {
        name: 'plugin-1',
        init: () => {
          initOrder.push('plugin-1');
        },
      };
      const plugin2: Plugin = {
        name: 'plugin-2',
        init: () => {
          initOrder.push('plugin-2');
        },
      };
      const plugin3: Plugin = {
        name: 'plugin-3',
        init: () => {
          initOrder.push('plugin-3');
        },
      };

      const plugins = new Map<string, Plugin>();
      plugins.set('plugin-1', plugin1);
      plugins.set('plugin-2', plugin2);
      plugins.set('plugin-3', plugin3);

      await initPlugins(plugins);

      expect(initOrder).to.deep.equal(['plugin-1', 'plugin-2', 'plugin-3']);
    });

    it('should check dependencies before initializing each plugin', async () => {
      const basePlugin: Plugin = { name: 'base-plugin' };
      const dependentPlugin: Plugin = {
        name: 'dependent-plugin',
        dependencies: ['base-plugin'],
      };

      const plugins = new Map<string, Plugin>();
      plugins.set('base-plugin', basePlugin);
      plugins.set('dependent-plugin', dependentPlugin);

      // Should not throw
      await initPlugins(plugins);
    });

    it('should throw when plugin has missing dependency', async () => {
      const dependentPlugin: Plugin = {
        name: 'dependent-plugin',
        dependencies: ['missing-plugin'],
      };

      const plugins = new Map<string, Plugin>();
      plugins.set('dependent-plugin', dependentPlugin);

      try {
        await initPlugins(plugins);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.equal(
          '[IE-0001] - "dependent-plugin" also requires "missing-plugin"'
        );
      }
    });

    it('should handle empty plugins map', async () => {
      const plugins = new Map<string, Plugin>();

      // Should not throw
      await initPlugins(plugins);
    });

    it('should propagate errors from plugin init', async () => {
      const initError = new Error('Init failed');
      const plugin: Plugin = {
        name: 'failing-plugin',
        init: sandbox.stub().rejects(initError),
      };

      const plugins = new Map<string, Plugin>();
      plugins.set('failing-plugin', plugin);

      try {
        await initPlugins(plugins);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.equal(initError);
      }
    });
  });

  describe('constructCoreConfigSettings', () => {
    let debugInitStub: sinon.SinonStub;
    let constructCoreConfigSettingsMocked: typeof import('./helpers').constructCoreConfigSettings;

    beforeEach(() => {
      debugInitStub = sandbox.stub();
      const module = proxyquire('./helpers', {
        '../debug': {
          default: {
            init: debugInitStub,
          },
        },
      });
      constructCoreConfigSettingsMocked = module.constructCoreConfigSettings;
    });

    it('should return settings object for valid configuration and log debug message', () => {
      const config = {
        contextId: 'test-context-id',
        sitecoreEdgeUrl: 'https://edge.example.com',
        siteName: 'test-site',
      };

      const result = constructCoreConfigSettingsMocked(config);

      expect(result).to.deep.equal({
        contextId: 'test-context-id',
        sitecoreEdgeUrl: 'https://edge.example.com',
        siteName: 'test-site',
      });

      const configValidCall = debugInitStub
        .getCalls()
        .find((call) => (call.args[0] as string).includes('Configuration is valid'));
      expect(configValidCall?.args[0]).to.equal('Configuration is valid');
    });

    describe('contextId validation', () => {
      it('should throw when contextId is missing', () => {
        const config = {
          contextId: '',
          sitecoreEdgeUrl: 'https://edge.example.com',
          siteName: 'test-site',
        };

        expect(() => constructCoreConfigSettings(config)).to.throw(ERROR_MESSAGES.MV_0001);
      });

      it('should throw when contextId is only whitespace', () => {
        const config = {
          contextId: '   ',
          sitecoreEdgeUrl: 'https://edge.example.com',
          siteName: 'test-site',
        };

        expect(() => constructCoreConfigSettings(config)).to.throw(ERROR_MESSAGES.MV_0001);
      });

      it('should throw when contextId is undefined', () => {
        const config = {
          contextId: undefined as unknown as string,
          sitecoreEdgeUrl: 'https://edge.example.com',
          siteName: 'test-site',
        };

        expect(() => constructCoreConfigSettings(config)).to.throw(ERROR_MESSAGES.MV_0001);
      });

      it('should throw when contextId is null', () => {
        const config = {
          contextId: null as unknown as string,
          sitecoreEdgeUrl: 'https://edge.example.com',
          siteName: 'test-site',
        };

        expect(() => constructCoreConfigSettings(config)).to.throw(ERROR_MESSAGES.MV_0001);
      });
    });

    describe('siteName validation', () => {
      it('should throw when siteName is missing', () => {
        const config = {
          contextId: 'test-context-id',
          sitecoreEdgeUrl: 'https://edge.example.com',
          siteName: '',
        };

        expect(() => constructCoreConfigSettings(config)).to.throw(ERROR_MESSAGES.MV_0002);
      });

      it('should throw when siteName is only whitespace', () => {
        const config = {
          contextId: 'test-context-id',
          sitecoreEdgeUrl: 'https://edge.example.com',
          siteName: '   ',
        };

        expect(() => constructCoreConfigSettings(config)).to.throw(ERROR_MESSAGES.MV_0002);
      });

      it('should throw when siteName is undefined', () => {
        const config = {
          contextId: 'test-context-id',
          sitecoreEdgeUrl: 'https://edge.example.com',
          siteName: undefined as unknown as string,
        };

        expect(() => constructCoreConfigSettings(config)).to.throw(ERROR_MESSAGES.MV_0002);
      });

      it('should throw when siteName is null', () => {
        const config = {
          contextId: 'test-context-id',
          sitecoreEdgeUrl: 'https://edge.example.com',
          siteName: null as unknown as string,
        };

        expect(() => constructCoreConfigSettings(config)).to.throw(ERROR_MESSAGES.MV_0002);
      });
    });

    describe('sitecoreEdgeUrl validation', () => {
      it('should use default sitecoreEdgeUrl when undefined', () => {
        const config = {
          contextId: 'test-context-id',
          siteName: 'test-site',
        };

        const result = constructCoreConfigSettings(config);

        expect(result.sitecoreEdgeUrl).to.equal('https://edge-platform.sitecorecloud.io');
        expect(result.contextId).to.equal('test-context-id');
        expect(result.siteName).to.equal('test-site');
      });

      it('should throw when sitecoreEdgeUrl is invalid URL', () => {
        const config = {
          contextId: 'test-context-id',
          sitecoreEdgeUrl: 'not-a-valid-url',
          siteName: 'test-site',
        };

        expect(() => constructCoreConfigSettings(config)).to.throw(ERROR_MESSAGES.IV_0001);
      });

      it('should accept valid http URL', () => {
        const config = {
          contextId: 'test-context-id',
          sitecoreEdgeUrl: 'http://edge.example.com',
          siteName: 'test-site',
        };

        const result = constructCoreConfigSettings(config);

        expect(result.sitecoreEdgeUrl).to.equal('http://edge.example.com');
      });

      it('should accept valid https URL', () => {
        const config = {
          contextId: 'test-context-id',
          sitecoreEdgeUrl: 'https://edge.example.com',
          siteName: 'test-site',
        };

        const result = constructCoreConfigSettings(config);

        expect(result.sitecoreEdgeUrl).to.equal('https://edge.example.com');
      });

      it('should accept URL with path', () => {
        const config = {
          contextId: 'test-context-id',
          sitecoreEdgeUrl: 'https://edge.example.com/api/v1',
          siteName: 'test-site',
        };

        const result = constructCoreConfigSettings(config);

        expect(result.sitecoreEdgeUrl).to.equal('https://edge.example.com/api/v1');
      });

      it('should accept URL with port', () => {
        const config = {
          contextId: 'test-context-id',
          sitecoreEdgeUrl: 'https://edge.example.com:8080',
          siteName: 'test-site',
        };

        const result = constructCoreConfigSettings(config);

        expect(result.sitecoreEdgeUrl).to.equal('https://edge.example.com:8080');
      });

      it('should throw for empty string URL', () => {
        const config = {
          contextId: 'test-context-id',
          sitecoreEdgeUrl: '',
          siteName: 'test-site',
        };

        expect(() => constructCoreConfigSettings(config)).to.throw(ERROR_MESSAGES.IV_0001);
      });

      it('should throw for URL without protocol', () => {
        const config = {
          contextId: 'test-context-id',
          sitecoreEdgeUrl: 'edge.example.com',
          siteName: 'test-site',
        };

        expect(() => constructCoreConfigSettings(config)).to.throw(ERROR_MESSAGES.IV_0001);
      });
    });
  });
});
