import { debug as coreDebug } from '@sitecore-content-sdk/core';
import { debug as contentDebug } from '@sitecore-content-sdk/content';

/**
 * Unified debug object containing all debug namespaces from referenced content-sdk packages.
 * @public
 */
const debug: Record<string, unknown> = {
  ...coreDebug,
  ...contentDebug,
};

export default debug;
