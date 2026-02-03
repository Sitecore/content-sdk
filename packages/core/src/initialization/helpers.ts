import { CoreSettings, InitSitecoreOptions } from './types';
import debug from '../debug';
import { Plugin } from './types';
import { ERROR_MESSAGES } from './consts';
import { SITECORE_EDGE_URL_DEFAULT } from '../constants';

const debugInit = debug.init;

/**
 * Checks if the plugin's dependencies are present in the state.
 * @param {Plugin} plugin - The plugin to check dependencies for.
 * @param {Map<string, Plugin>} plugins - The map of available plugins.
 * @internal
 */
export function checkPluginDependencies(plugin: Plugin, plugins: Map<string, Plugin>): void {
  if (!plugin.dependencies) return;

  for (const dependency of plugin.dependencies) {
    if (!plugins.has(dependency))
      throw new Error(`[IE-0001] - "${plugin.name}" also requires "${dependency}"`);
  }

  debugInit(`All required dependencies for "${plugin.name}" are present`);
}

/**
 * Initializes all registered plugins by calling their `init` function.
 * @param {Map<string, Plugin>} plugins - The array of plugins to initialize.
 * @returns A promise that resolves when all plugins have been initialized.
 * @internal
 */
export async function initPlugins(plugins: Map<string, Plugin>): Promise<void> {
  debugInit(`Initializing ${plugins.size} plugins`);

  for (const plugin of plugins.values()) {
    checkPluginDependencies(plugin, plugins);

    await plugin.init?.();
    debugInit(`Successfully initialized "${plugin.name}"`);
  }

  debugInit(`Successfully initialized ${plugins.size} plugins`);
}

/**
 * Validates and constructs the core configuration.
 * @param {InitSitecoreOptions['settings']} config - The core configuration object.
 * @internal
 */
export function constructCoreConfigSettings(
  config: InitSitecoreOptions['settings']
): CoreSettings['settings'] {
  const { contextId, siteName, sitecoreEdgeUrl } = config;
  if (!contextId || contextId.trim().length === 0) throw new Error(ERROR_MESSAGES.MV_0001);

  if (!siteName || siteName.trim().length === 0) throw new Error(ERROR_MESSAGES.MV_0002);

  if (sitecoreEdgeUrl !== undefined)
    try {
      new URL(sitecoreEdgeUrl);
    } catch {
      throw new Error(ERROR_MESSAGES.IV_0001);
    }

  debugInit('Configuration is valid');

  return {
    ...config,
    sitecoreEdgeUrl: sitecoreEdgeUrl?.trim() ?? SITECORE_EDGE_URL_DEFAULT,
  };
}
