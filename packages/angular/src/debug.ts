import {
  debug as coreDebug,
  debugModule,
  debugNamespace,
  Debugger,
} from '@sitecore-content-sdk/core';
import { debug as contentDebug } from '@sitecore-content-sdk/content';

/**
 * Unified debug object containing all debug namespaces from referenced content-sdk packages.
 * @public
 */
const debug: Record<string, Debugger> = {
  ...coreDebug,
  ...contentDebug,
  revalidate: debugModule(`${debugNamespace}:revalidate`),
};

export default debug;
