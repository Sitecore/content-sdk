import debug from '../debug';
import type { CoreContext, InitContentSdkOptions } from './types';
import { initPlugins, constructCoreContextSettings } from './helpers';
import { Plugin } from './types';
import { ERROR_MESSAGES } from './consts';

let coreContext: CoreContext | undefined;

/**
 * Retrieves the current core context.
 * @returns {CoreContext} The current core context object.
 * @internal
 */
export function getCoreContext(): CoreContext {
  if (!coreContext) throw new Error(ERROR_MESSAGES.IE_002);

  return coreContext;
}

/**
 * Initializes the Content SDK with the provided options.
 * @param {InitContentSdkOptions} options - The initialization options including settings and plugins.
 * @returns A promise that resolves when initialization is complete.
 * @public
 */
export async function initContentSdk(options: InitContentSdkOptions): Promise<void> {
  debug.init('Initializing Content SDK with options:', options);
  const { settings, plugins } = options;

  const resolvedSettings = constructCoreContextSettings(settings);

  if (plugins.length === 0) debug.init('No plugins provided to the plugins array');

  coreContext = {
    settings: resolvedSettings,
    plugins: new Map<string, Plugin>(),
    readyPromise: null,
  };

  for (const plugin of plugins) {
    coreContext.plugins.set(plugin.name, plugin);
  }

  debug.init(`Registered ${coreContext.plugins.size} plugins`);
  coreContext.readyPromise = initPlugins(coreContext.plugins);

  await coreContext.readyPromise;

  debug.init('SDK initialization complete');
}
