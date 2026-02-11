import debug from '../debug';
import type { CoreContext, InitContentSdkParams } from './types';
import { initPlugins, resolveCoreContextConfig } from './helpers';
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
 * Initializes the Content SDK with the provided params.
 * @param {InitContentSdkParams} params - The initialization params including config and plugins.
 * @returns A promise that resolves when initialization is complete.
 * @public
 */
export async function initContentSdk(params: InitContentSdkParams): Promise<void> {
  debug.init('Initializing Content SDK with params:', params);
  const { config, plugins } = params;

  const resolvedConfig = resolveCoreContextConfig(config);

  if (plugins.length === 0) debug.init('No plugins provided to the plugins array');

  coreContext = {
    config: resolvedConfig,
    plugins: new Map<string, Plugin>(),
    readyPromise: null,
  };

  for (const plugin of plugins) {
    coreContext.plugins.set(plugin.name, plugin);
  }

  debug.init(`Registered ${coreContext.plugins.size} plugins`);
  coreContext.readyPromise = initPlugins(coreContext.plugins);

  await coreContext.readyPromise;

  debug.init('Content SDK initialization complete');
}
