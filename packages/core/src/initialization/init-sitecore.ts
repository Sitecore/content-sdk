import debug from '../debug';
import type { CoreSettings, InitSitecoreOptions } from './types';
import { initPlugins, constructCoreConfigSettings } from './helpers';
import { Plugin } from './types';
import { ERROR_MESSAGES } from './consts';

let coreSettings: CoreSettings | undefined;

/**
 * Retrieves the current core configuration.
 * @returns {CoreSettings} The current core configuration object.
 * @internal
 */
export function getCoreSettings(): CoreSettings {
  if (!coreSettings) throw new Error(ERROR_MESSAGES.IE_0002);

  return coreSettings;
}

/**
 * Initializes the Content SDK with the provided options.
 * @param {InitSitecoreOptions} options - The initialization options including settings and plugins.
 * @returns A promise that resolves when initialization is complete.
 * @public
 */
export async function initSitecore(options: InitSitecoreOptions): Promise<void> {
  debug.init('Initializing Content SDK with options:', options);
  const { settings, plugins } = options;

  const constructedSettings = constructCoreConfigSettings(settings);

  if (plugins.length === 0) debug.init('No plugins provided to the plugins array');

  coreSettings = {
    settings: constructedSettings,
    plugins: new Map<string, Plugin>(),
    readyPromise: null,
  };

  for (const plugin of plugins) {
    coreSettings.plugins.set(plugin.name, plugin);
  }

  debug.init(`Registered ${coreSettings.plugins.size} plugins`);
  coreSettings.readyPromise = initPlugins(coreSettings.plugins);

  await coreSettings.readyPromise;

  debug.init('SDK initialization complete');
}
