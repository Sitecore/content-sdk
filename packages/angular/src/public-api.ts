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
export { SITECORE_CONFIG_TOKEN, COMPONENT_MAP_TOKEN } from './lib/tokens';

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

// ─── Re-exports from upstream SDK packages ──────────────────────────────────
export type {
  ComponentRendering,
  ComponentFields,
  ComponentParams,
  RouteData,
  LayoutServiceData,
  LayoutServiceContext,
  Field,
  GenericFieldValue,
  Item,
  PlaceholdersData,
} from '@sitecore-content-sdk/content/layout';

export type { Page } from '@sitecore-content-sdk/content/client';
export type { SitecoreConfig } from '@sitecore-content-sdk/content/config';
