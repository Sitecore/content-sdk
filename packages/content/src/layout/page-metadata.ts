import { OG_CREATION_TIME_TAG, OG_MODIFIED_TIME_TAG } from './field-types';
import type { OpenGraphImageFieldValue, PageMetadataFields } from './field-types';
import type { Field, RouteData } from './models';

/**
 * Route fields consumed when resolving page metadata: the page's `Title` plus the metadata/Open
 * Graph fields Sitecore returns as siblings of `Title` in the route's `fields`.
 * @public
 */
export type PageMetadataRouteFields = PageMetadataFields & { Title?: Field };

/**
 * Field values shared by every metadata/Open Graph output shape (Next.js `Metadata`, `<head>`
 * tags, Angular `Meta` service, etc).
 * @public
 */
export interface ResolvedPageMetadataFields {
  /** Value for `<title>`, from the route's `Title` field or the provided default title. */
  title: string;
  /** Value for `<meta name="title">`, from `baseMetadataTitle`. */
  metaTitle?: string;
  /** Value for `<meta name="description">`, from `baseMetadataDescription`. */
  description?: string;
  /** Value for `<meta name="keywords">`, from `baseMetadataKeywords`. */
  keywords?: string;
  /** Value for `<meta name="author">`, from `baseMetadataAuthor`. */
  author?: string;
  /** Value for `og:title`, from `baseOgTitle`. */
  ogTitle?: string;
  /** Value for `og:description`, from `baseOgDescription`. */
  ogDescription?: string;
  /** Full `baseOgImage` field value (`src`, `width`, `height`, `alt`). */
  ogImage?: OpenGraphImageFieldValue;
  /** Value for `og:image`, from `baseOgImage.src`. */
  ogImageSrc?: string;
  /** Value for `og:type`, from `baseOgType`. */
  ogType?: string;
  /** Official Open Graph creation-time tag name (e.g. `article:published_time`), if `ogType` defines one. */
  creationTimeTag?: string;
  /** Creation time (route `published`), only when `creationTimeTag` is defined. */
  creationTime?: string;
  /** Official Open Graph update-time tag name (e.g. `article:modified_time`), if `ogType` defines one. */
  modifiedTimeTag?: string;
  /** Update time (route `updated`), only when `modifiedTimeTag` is defined. */
  modifiedTime?: string;
}

/**
 * Derives the metadata/Open Graph field values for a Sitecore route, for consumption by any
 * rendering layer (Next.js, React, Angular, etc). No cross-field fallback: a field with no value
 * simply resolves to `undefined`. `title` always comes from the route's `Title` field (falling
 * back to `defaultTitle`) — `baseMetadataTitle` never feeds it and resolves to `metaTitle` instead.
 * @param {RouteData<PageMetadataRouteFields> | null} [route] - Route node from a Sitecore layout response.
 * @param {string} defaultTitle - Fallback for `title` when the route has no `Title` field.
 * @returns {ResolvedPageMetadataFields} resolved metadata/Open Graph field values
 * @public
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
