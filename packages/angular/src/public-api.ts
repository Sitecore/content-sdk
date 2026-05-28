// ─── Angular SDK providers and tokens ──────────────────────────
export { type AngularCSDKAppInit } from './lib/providers';
export { SITECORE_CONFIG_TOKEN, SITECORE_CLIENT_TOKEN } from './lib/tokens';
export { resolveSitecorePage } from './lib/sitecore-page-resolver';

export {
  defineConfig,
  type AngularSitecoreConfigInput,
  type AngularSitecoreConfig,
} from './config/define-config';
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
  type PerRouteLoaderCacheConfig,
  type LoaderCacheConfig,
} from './loaders/models';
export { handleNavigationError } from './loaders/router-error-handling';
export { applyRedirect } from './loaders/utils';
export { provideSitecoreAngular } from './lib/providers';
export * from './server';

// ─── Sitecore Context ──────────────────────────────────────────
export { SitecoreContextService } from './lib/sitecore-context.service';

export { SitecoreTranslateLoader } from './i18n/sitecore-translate-loader';

// ─── Localized routing ────────────────────────────────────────
export {
  splitLocaleFromPath,
  scLocaleMatcher,
  type LocaleExtractionResult,
} from './i18n/locale-utils';
export { LocaleUrlSerializer } from './i18n/locale-url-serializer';

// ─── Placeholder ───────────────────────────────────────────────
export { ScPlaceholderComponent } from './placeholder/sc-placeholder.component';
export { ScMissingComponentComponent } from './placeholder/sc-missing-component.component';
export { ScHiddenRenderingComponent } from './placeholder/sc-hidden-rendering.component';
export { SITECORE_COMPONENT_MAP } from './placeholder/tokens';
export {
  DEFAULT_EXPORT_NAME,
  type AngularContentSdkComponent,
  type ComponentMap,
} from './components/types';
export {
  type ChildComponentProps,
  type ComponentForRendering,
  type PassThroughProps,
  getPlaceholderRenderings,
  getSXAParams,
  getChildComponentProps,
  resolveComponentForRendering,
} from './placeholder/placeholder-utils';

// ─── Field directives ──────────────────────────────────────────
export { ScTextDirective } from './field-directives/sc-text.directive';
export { ScImageDirective } from './field-directives/sc-image.directive';
export { ScLinkDirective } from './field-directives/sc-link.directive';
export { ScRouterLinkDirective } from './field-directives/sc-router-link.directive';
export { ScRichTextDirective } from './field-directives/sc-rich-text.directive';

// ─── Form ──────────────────────────────────────────────────────
export { ScFormComponent } from './components/sc-form.component';

export const _coreVersionMarker = CORE_VERSION;
export const _routerTokenMarker = Router;
