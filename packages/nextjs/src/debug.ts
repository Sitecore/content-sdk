import { debug as coreDebug } from '@sitecore-content-sdk/core';
import { debug as contentDebug } from '@sitecore-content-sdk/content';
import { debug as searchDebug } from '@sitecore-content-sdk/react/search';

/**
 * Unified debug object containing all debug namespaces from referenced content-sdk packages.
 * @public
 */
const debug: Record<string, debug.Debugger> = {
  ...coreDebug,
  ...contentDebug,
  search: searchDebug,
};

export default debug;
