import NextjsInitializer from './initializers/nextjs';
import NextjsAppRouterInitializer from './initializers/nextjs-app-router';
import NextjsAppRouterCacheComponentsInitializer from './initializers/nextjs-app-router-cache-components';
import { Initializer } from './scaffolding';

export * from './scaffolding';

/**
 * Registry of template name -> initializer instance provided by this package.
 * create-content-sdk-app discovers and lazily loads this map.
 */
export const initializers: { [template: string]: Initializer } = {
  nextjs: new NextjsInitializer(),
  'nextjs-app-router': new NextjsAppRouterInitializer(),
  'nextjs-app-router-cache-components': new NextjsAppRouterCacheComponentsInitializer(),
};
