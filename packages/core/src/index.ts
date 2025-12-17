// NOTE: all imports are now named as to not make breaking changes
// and to keep react-native working with cjs modules.

import * as constants from './constants';
import * as form from './form';

export { default as debug, Debugger, enableDebug } from './debug';
export {
  GraphQLClient,
  GraphQLRequestClient,
  GraphQLRequestClientConfig,
  GraphQLRequestClientFactory,
  GraphQLRequestClientFactoryConfig,
} from './graphql-request-client';
export { DefaultRetryStrategy } from './retries';
export { CacheClient, CacheOptions, MemoryCacheClient } from './cache-client';
export { ClientError } from 'graphql-request';
export {
  NativeDataFetcher,
  NativeDataFetcherConfig,
  NativeDataFetcherError,
  NativeDataFetcherResponse,
} from './native-fetcher';
export { HTMLLink, RetryStrategy, GenericGraphQLClientError, StaticPath } from './models';
export { constants };
export { form };
export { defineConfig } from './config';

// Init functionality
export {
  initSitecore,
  getInitState,
  isInitialized,
  getPlugin,
  triggerDeferredInit,
  resetInitState,
  updatePluginSettings,
  isPluginEnabled,
  getGroupSettings,
  updateGroupSettings,
  updateEnvironment,
  Plugin,
  PluginContext,
  PluginDependency,
  InitOptions,
  InitState,
  InitConfig,
  createPlugin,
  CreatePluginOptions,
  defineGroup,
  DefineGroupOptions,
  GroupDefinition,
  GroupContext,
  trackingGroup,
  TrackingGroupSettings,
  InitErrorMessages,
  EnvironmentHandlers,
  CookieOptions,
  PluginSettingsBase,
  PluginSettingsUpdate,
  createBrowserEnvironment,
  createServerEnvironment,
  createNextJsAppRouterEnvironment,
  createNextJsMiddlewareEnvironment,
  mergeEnvironments,
  NextJsAppRouterEnvironmentOptions,
  NextJsMiddlewareEnvironmentOptions,
} from './init';
