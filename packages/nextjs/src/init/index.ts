// Re-export core init utilities that are still useful
export {
  getInitState,
  isInitialized,
  getPlugin,
  resetInitState,
  triggerDeferredInit,
  createPlugin,
  Plugin,
  PluginContext,
  PluginDependency,
  InitState,
  EnvironmentHandlers,
  CookieOptions,
  CreatePluginOptions,
  InitErrorMessages,
} from '@sitecore-content-sdk/core';

// Next.js-specific initialization functions
export { initMiddleware, MiddlewareInitOptions } from './init-middleware';
export { initServer, ServerInitOptions } from './init-server';
export { initClient, ClientInitOptions } from './init-client';
export { createMiddlewareEnvironment } from './init-middleware';

// Simplified middleware initialization API
export {
  initSitecoreMiddleware,
  sitecoreMiddleware,
  SitecoreMiddlewareConfig,
  SitecoreMiddlewareOptions,
} from './sitecore-middleware';

