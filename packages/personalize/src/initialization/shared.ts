import { getCoreContext } from '@sitecore-content-sdk/core';
import { PERSONALIZE_PLUGIN_NAME } from './const';
import { PersonalizePlugin } from './types';

/**
 * Retrieves the personalize plugin instance from the core configuration.
 * @returns {PersonalizePlugin} The personalize plugin instance.
 * @public
 */
export function getPersonalizePlugin(): PersonalizePlugin {
  const plugin = getCoreContext().plugins.get(PERSONALIZE_PLUGIN_NAME) as
    | PersonalizePlugin
    | undefined;

  if (!plugin) throw new Error('Personalize plugin is not registered');

  return plugin;
}
