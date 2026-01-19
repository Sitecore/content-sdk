/**
 * Public API Surface of @sitecore-content-sdk/angular
 */

import { VERSION as CORE_VERSION } from '@angular/core';
import { Router } from '@angular/router';

// Core exports from @sitecore-content-sdk/core
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

export {
  GraphQLClientError,
  RetryStrategy,
  DefaultRetryStrategy,
  GraphQLRequestClientFactoryConfig,
  GraphQLRequestClient,
} from '@sitecore-content-sdk/core/client';

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
} from '@sitecore-content-sdk/core/layout';

export * from '@sitecore-content-sdk/core/client';
export * from '@sitecore-content-sdk/core/config';

export { DictionaryPhrases, DictionaryService } from '@sitecore-content-sdk/core/i18n';

export { mediaApi } from '@sitecore-content-sdk/core/media';

export {
  isEditorActive,
  resetEditorChromes,
  EditingPreviewData,
  DesignLibraryRenderPreviewData,
  DesignLibraryMode,
  LayoutKind,
  isDesignLibraryMode,
} from '@sitecore-content-sdk/core/editing';

// Angular-specific exports
export * from './lib/loader-resolver';
export * from './lib/loader-registry.token';
export * from './lib/loader-prefetch.config';
export * from './lib/api';
export * from './lib/types';
export * from './lib/component-map.token';
export * from './lib/sitecore-context.service';
export * from './lib/loader-data.service';
export * from './lib/placeholder';
export * from './lib/server';
export * from './lib/router-error-handling';
export * from './lib/editing-utils';

// Field components
export * from './components';

export const _coreVersionMarker = CORE_VERSION;
export const _routerTokenMarker = Router;
