import { CoreContext, InitContentSdkOptions } from './types';
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
      throw new Error(`[IE-001] "${plugin.name}" also requires "${dependency}"`);
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
 * Validates and constructs the core context settings.
 * @param {InitContentSdkOptions['settings']} config - The core context settings object.
 * @internal
 */
export function constructCoreContextSettings(
  config: InitContentSdkOptions['settings']
): CoreContext['settings'] {
  const { contextId, siteName, edgeUrl } = config;
  if (!contextId || contextId.trim().length === 0) throw new Error(ERROR_MESSAGES.MV_001);

  if (!siteName || siteName.trim().length === 0) throw new Error(ERROR_MESSAGES.MV_002);

  if (edgeUrl !== undefined)
    try {
      new URL(edgeUrl);
    } catch {
      throw new Error(ERROR_MESSAGES.IV_001);
    }

  debugInit('Configuration is valid');

  return {
    ...config,
    edgeUrl: edgeUrl?.trim() ?? SITECORE_EDGE_URL_DEFAULT,
  };
}
