// ─── Re-exports from core/content ─────────────────────────────
export * from '@sitecore-content-sdk/content/config';
export {
  getContentStylesheetLink,
  getDesignLibraryStylesheetLinks,
  LayoutServiceData,
  LayoutServicePageState,
  LayoutServiceContext,
  LayoutServiceContextData,
  LayoutService,
  RouteData,
  Field,
  Item,
  getChildPlaceholder,
  getFieldValue,
  ComponentRendering,
  ComponentFields,
  ComponentParams,
  EditMode,
} from '@sitecore-content-sdk/content/layout';
export { isEditorActive, resetEditorChromes } from '@sitecore-content-sdk/content/editing';
export {
  GraphQLClientError,
  RetryStrategy,
  DefaultRetryStrategy,
  GraphQLRequestClientFactoryConfig,
  GraphQLRequestClient,
  PageMode,
  ErrorPage,
  Page,
  SitecoreClient,
} from '@sitecore-content-sdk/content/client';
export { mediaApi } from '@sitecore-content-sdk/content/media';
export { SitePathService, SitePathServiceConfig } from '@sitecore-content-sdk/content/site';
export {
  constants,
  enableDebug,
  ClientError,
  CacheClient,
  CacheOptions,
  MemoryCacheClient,
  NativeDataFetcher,
  NativeDataFetcherResponse,
  NativeDataFetcherConfig,
} from '@sitecore-content-sdk/core';

// Angular SDK providers
export { provideSitecoreAngular, type SitecoreAngularConfig } from './lib/providers';

// Loader system for dynamic route rendering
export type { LoaderContext, LoaderFn } from './lib/types';
export { LOADER_REGISTRY } from './lib/loader-registry.token';
export {
  loaderResolver,
  LoaderRedirect,
  LoaderNotFound,
  LoaderHttpError,
  redirect,
  notFound,
  serverError,
  LOADER_ID,
  getLoaderId,
} from './lib/loader-resolver';
export {
  handleNavigationError,
  type NavigationErrorOptions,
} from './lib/router-error-handling';
