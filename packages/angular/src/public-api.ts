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
/**
 * Public API Surface of @sitecore-content-sdk/angular
 */

import { VERSION as CORE_VERSION } from '@angular/core';
import { Router } from '@angular/router';

export * from '@sitecore-content-sdk/content/client';
export * from '@sitecore-content-sdk/content/config';


// Angular-specific exports
export * from './loaders/loader-resolver';
export * from './loaders/loader-registry.token';
export * from './loaders/loader-prefetch.config';
export * from './loaders/loader-data.service';
export {
  handleNavigationError,
  type NavigationErrorOptions,
} from './loaders/router-error-handling';

export * from './server';

export const _coreVersionMarker = CORE_VERSION;
export const _routerTokenMarker = Router;
