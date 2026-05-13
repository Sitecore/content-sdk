import { getCoreContext, constants } from '@sitecore-content-sdk/core';
import { PERSONALIZE_PLUGIN_NAME } from './const';
import { PersonalizePlugin } from './types';

const { ERROR_MESSAGES } = constants;

/**
 * Retrieves the personalize plugin instance from the core context.
 * @returns {PersonalizePlugin} The personalize plugin instance.
 * @internal
 */
export function getPersonalizePlugin(): PersonalizePlugin {
  const plugin = getCoreContext().plugins.get(PERSONALIZE_PLUGIN_NAME) as
    | PersonalizePlugin
    | undefined;

  if (!plugin) throw new Error(ERROR_MESSAGES.IE_004(PERSONALIZE_PLUGIN_NAME));

  return plugin;
}
