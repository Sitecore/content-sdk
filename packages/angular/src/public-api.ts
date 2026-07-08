// ─── Angular SDK providers and tokens ──────────────────────────
export { type AngularCSDKAppInit } from './lib/providers';
export { SITECORE_CONFIG_TOKEN, SITECORE_CLIENT_TOKEN } from './lib/tokens';

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
export type {
  ImageField,
  ImageFieldValue,
  ImageSizeParameters,
  LinkField,
  LinkFieldValue,
  RichTextField,
  TextField,
} from '@sitecore-content-sdk/content/layout';
export {
  isEditorActive,
  resetEditorChromes,
  EditingPreviewData,
  PAGES_EDITING_MARKER,
} from '@sitecore-content-sdk/content/editing';
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
export { getLocaleRewrite } from '@sitecore-content-sdk/content/i18n';
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

// Angular-specific exports
export * from './loaders/loader-resolver';
export * from './loaders/loader-registry.token';
export * from './loaders/client-loader-data.service';
export * from './loaders/pre-loader-data.service';
export {
  SERVER_LOADER_RUNNER,
  type ServerLoaderRunnerPort,
} from './loaders/server-loader-runner.token';
export { type LoaderRegistry } from './loaders/loader-registry.token';
export {
  NotFoundNavigationError,
  LoaderHttpError,
  type LoaderFn,
  type LoaderContext,
  type LoaderDataResult,
  type LoaderPayload,
  type LoaderRunnerInit,
  type CsdkRequestData,
  type CsdkRequestParams,
  type PerRouteLoaderCacheConfig,
  type LoaderCacheConfig,
} from './loaders/models';
export { handleNavigationError } from './loaders/router-error-handling';
export { applyRedirect } from './loaders/utils';
export {
  getSiteName,
  getVariantId,
  getComponentVariantIds,
  getLanguage,
} from './loaders/context-helpers';
export { SC_PARAMS_HEADER } from './loaders/constants';
export { provideSitecoreAngular } from './lib/providers';
export {
  SITECORE_ANALYTICS,
  normalizeCookieDomain,
  type SitecoreAnalyticsWrapper,
} from './lib/analytics/sitecore-analytics';
export { CdpHelper } from '@sitecore-content-sdk/content/personalize';
export * from './server';

// ─── Sitecore Context ──────────────────────────────────────────
export { SitecoreContextService } from './lib/sitecore-context.service';
export { ScEditingScriptsComponent } from './lib/sc-editing-scripts.component';

export { SitecoreTranslateLoader } from './i18n/sitecore-translate-loader';

// ─── Localized routing ────────────────────────────────────────
export {
  splitLocaleFromPath,
  scLocaleMatcher,
  type LocaleExtractionResult,
} from './i18n/locale-utils';
export { LocaleUrlSerializer } from './i18n/locale-url-serializer';

// ─── Placeholders, components and field directives ───────────────────────────────────────────────
export {
  DEFAULT_EXPORT_NAME,
  type AngularContentSdkComponent,
  type ComponentMap,
} from './components/types';
export { SITECORE_COMPONENT_MAP } from './components/tokens';
export {
  type ChildComponentProps,
  type ComponentForRendering,
  type PassThroughProps,
  getPlaceholderRenderings,
  getSXAParams,
  getChildComponentProps,
  resolveComponentForRendering,
} from './components/placeholder/placeholder-utils';
export { ScPlaceholderComponent } from './components/placeholder/sc-placeholder.component';
export {
  PLACEHOLDER_GUARD_RESOLVER,
  PLACEHOLDER_DATA_RESOLVER,
  type PlaceholderGuardResolver,
  type PlaceholderDataResolver,
  type PlaceholderResolverContext,
} from './components/placeholder/placeholder-tokens';
export {
  BaseFieldDirective,
  ScTextDirective,
  ScImageDirective,
  ScLinkDirective,
  ScRouterLinkDirective,
  ScRichTextDirective,
  ScHiddenRenderingComponent,
  ScMissingComponentComponent,
  FieldMetadataMarkerComponent,
  DefaultEmptyFieldEditingComponent,
  DefaultEmptyImageFieldEditingComponent,
  type FieldLike,
} from './components';
export { ScFormComponent } from './components/sc-form.component';

export const _coreVersionMarker = CORE_VERSION;
export const _routerTokenMarker = Router;
