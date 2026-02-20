// ─── Services ──────────────────────────────────────────────────────────────
export { SitecoreContextService } from './services/sitecore-context.service';
export { ComponentMapService } from './services/component-map.service';

// ─── Components ────────────────────────────────────────────────────────────
export { SitecoreProviderComponent } from './components/sitecore-provider/sitecore-provider.component';
export { PlaceholderComponent } from './components/placeholder/placeholder.component';
export { TextComponent } from './components/text/text.component';
export { RichTextComponent } from './components/rich-text/rich-text.component';
export { ImageComponent } from './components/image/image.component';
export { LinkComponent } from './components/link/link.component';
export { FileComponent } from './components/file/file.component';
export { DateComponent } from './components/date/date.component';
export { MissingComponent } from './components/missing-component/missing-component.component';
export { FieldMetadataComponent } from './components/field-metadata/field-metadata.component';

// ─── Types ─────────────────────────────────────────────────────────────────
export type { ComponentMap, AngularContentSdkComponent } from './types';
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
} from './field-types';

// ─── Injection tokens ───────────────────────────────────────────────────────
export { SITECORE_CONFIG_TOKEN, COMPONENT_MAP_TOKEN } from './tokens';

// ─── Providers ──────────────────────────────────────────────────────────────
export { provideSitecoreAngular } from './providers';
export type { SitecoreAngularConfig } from './providers';

// ─── Utilities ───────────────────────────────────────────────────────────────
export {
  isFieldValueEmpty,
  getLinkFieldValue,
  buildLinkHref,
  getImageFieldValue,
  getPlaceholderRenderings,
  hasPlaceholder,
} from './utils';

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
