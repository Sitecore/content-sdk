// ─── Angular SDK providers and tokens ──────────────────────────
export { type SitecoreAngularConfig } from './lib/providers';
export { SITECORE_CONFIG_TOKEN, SITECORE_CLIENT_TOKEN } from './lib/tokens';
export { resolvePage, type ResolvePageOptions } from './lib/resolve-page';

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
export * from './loaders/loader-data.service';
export * from './loaders/pre-loader-data.service';
export {
  NotFoundNavigationError,
  LoaderHttpError,
  type LoaderFn,
  type LoaderContext,
} from './loaders/models';
export { handleNavigationError } from './loaders/router-error-handling';
export { applyRedirect } from './loaders/utils';
export { provideSitecoreAngular } from './lib/providers';
export * from './server';

export const _coreVersionMarker = CORE_VERSION;
export const _routerTokenMarker = Router;
