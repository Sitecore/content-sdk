import { OG_CREATION_TIME_TAG, OG_MODIFIED_TIME_TAG } from '@sitecore-content-sdk/content/layout';
import type {
  Field,
  OpenGraphImageFieldValue,
  PageMetadataFields,
  RouteData,
} from '@sitecore-content-sdk/content/layout';

/**
 * Route fields consumed when resolving page metadata: the page's `Title` plus the metadata/Open
 * Graph fields Sitecore returns as siblings of `Title` in the route's `fields`.
 * @public
 */
export type PageMetadataRouteFields = PageMetadataFields & { Title?: Field };

/** Field values shared by every metadata/Open Graph output shape (Next.js `Metadata` and `<head>` tags alike). */
export interface ResolvedPageMetadataFields {
  title: string;
  metaTitle?: string;
  description?: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: OpenGraphImageFieldValue;
  ogImageSrc?: string;
  ogType?: string;
  /** Official Open Graph creation-time tag name (e.g. `article:published_time`), if `ogType` defines one. */
  creationTimeTag?: string;
  creationTime?: string;
  /** Official Open Graph update-time tag name (e.g. `article:modified_time`), if `ogType` defines one. */
  modifiedTimeTag?: string;
  modifiedTime?: string;
}

/**
 * Derives the metadata/Open Graph field values for a Sitecore route, shared by both
 * `getPageMetadata` (Next.js `Metadata` object, App Router) and `PageMetaTags` (`<head>` tags,
 * Pages Router). No cross-field fallback: a field with no value simply resolves to `undefined`.
 * @param {RouteData<PageMetadataRouteFields> | null} [route] - Route node from a Sitecore layout response.
 * @param {string} defaultTitle - Fallback for `title` when the route has no `Title` field.
 */
export function resolvePageMetadataFields(
  route: RouteData<PageMetadataRouteFields> | null | undefined,
  defaultTitle: string
): ResolvedPageMetadataFields {
  const fields = route?.fields;
  const ogImage = fields?.baseOgImage?.value;
  const ogImageSrc = ogImage?.src;
  const ogType = fields?.baseOgType?.value;
  const creationTimeTag = ogType ? OG_CREATION_TIME_TAG[ogType] : undefined;
  const modifiedTimeTag = ogType ? OG_MODIFIED_TIME_TAG[ogType] : undefined;

  return {
    title: fields?.Title?.value?.toString() || defaultTitle,
    metaTitle: fields?.baseMetadataTitle?.value,
    description: fields?.baseMetadataDescription?.value,
    keywords: fields?.baseMetadataKeywords?.value,
    author: fields?.baseMetadataAuthor?.value,
    ogTitle: fields?.baseOgTitle?.value,
    ogDescription: fields?.baseOgDescription?.value,
    ogImage,
    ogImageSrc,
    ogType,
    creationTimeTag,
    creationTime: creationTimeTag ? route?.published : undefined,
    modifiedTimeTag,
    modifiedTime: modifiedTimeTag ? route?.updated : undefined,
  };
}
