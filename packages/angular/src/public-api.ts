/*
 * Public API Surface of @sitecore-content-sdk/angular
 */

// ─── Services ──────────────────────────────────────────────────────────────
export { SitecoreContextService } from './lib/services/sitecore-context.service';
export { ComponentMapService } from './lib/services/component-map.service';

// ─── Components ────────────────────────────────────────────────────────────
export { SitecoreProviderComponent } from './lib/components/sitecore-provider/sitecore-provider.component';
export { PlaceholderComponent } from './lib/components/placeholder/placeholder.component';
export { TextComponent } from './lib/components/text/text.component';
export { RichTextComponent } from './lib/components/rich-text/rich-text.component';
export { ImageComponent } from './lib/components/image/image.component';
export { LinkComponent } from './lib/components/link/link.component';
export { FileComponent } from './lib/components/file/file.component';
export { DateComponent } from './lib/components/date/date.component';
export { MissingComponent } from './lib/components/missing-component/missing-component.component';
export { FieldMetadataComponent } from './lib/components/field-metadata/field-metadata.component';

// ─── Directives ─────────────────────────────────────────────────────────────
export { ScTextDirective } from './lib/components/text/text.directive';
export { ScImageDirective } from './lib/components/image/image.directive';
export { ScLinkDirective } from './lib/components/link/link.directive';
export { ScPlaceholderDirective } from './lib/components/placeholder/placeholder.directive';

// ─── Types ─────────────────────────────────────────────────────────────────
export type { ComponentMap, AngularContentSdkComponent } from './lib/types';
export type {
  TextField,
  RichTextField,
  ImageField,
  ImageFieldValue,
  LinkField,
  LinkFieldValue,
  FileField,
  FileFieldValue,
  DateFieldType,
} from './lib/field-types';

// ─── Injection tokens ───────────────────────────────────────────────────────
export { COMPONENT_MAP_TOKEN } from './lib/tokens';

// ─── Providers ──────────────────────────────────────────────────────────────
export { provideSitecoreAngular } from './lib/providers';
export type { SitecoreAngularConfig } from './lib/providers';

// ─── Utilities ───────────────────────────────────────────────────────────────
export {
  isFieldValueEmpty,
  getLinkFieldValue,
  buildLinkHref,
  getImageFieldValue,
  getPlaceholderRenderings,
  hasPlaceholder,
} from './lib/utils/index';

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
