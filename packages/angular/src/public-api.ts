// ─── Angular SDK providers and tokens ──────────────────────────
export type { SitecoreAngularConfig, SitecoreAngularConfigInput } from './config/models';
export { defineConfig, parseLocalesEnv, normalizeLocales } from './config/define-config';
export { type SitecoreAngularProviderConfig } from './lib/providers';
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
export {
  SITECORE_CONFIG_TOKEN,
  SITECORE_CLIENT_TOKEN,
  ERROR_ROUTE_TOKEN,
  NOT_FOUND_ROUTE_TOKEN,
} from './lib/tokens';
export * from './server';

// ─── Sitecore Context ──────────────────────────────────────────
export { SitecoreContextService } from './lib/sitecore-context.service';
export { ScPageContextComponent } from './lib/sc-page-context.component';
export { resolveSitecorePage } from './lib/sitecore-page-resolver';

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

export {
  createLocaleMatcher,
  createLocaleErrorMatcher,
} from './i18n/locale-matcher';
export {
  stripLocalePrefix,
  resolveLocale,
  prependLocale,
  stripConfiguredRouteLocalePrefix,
  extractLocaleFromUrl,
} from './i18n/locale-url';
export { LocalePathPipe } from './i18n/locale-path.pipe';
export { SitecoreTranslateLoader } from './i18n/sitecore-translate-loader';
export { loaderDataCacheKey } from './loaders/loader-cache-key';

// ─── Form ──────────────────────────────────────────────────────
export { ScFormComponent } from './components/sc-form.component';

export const _coreVersionMarker = CORE_VERSION;
export const _routerTokenMarker = Router;
