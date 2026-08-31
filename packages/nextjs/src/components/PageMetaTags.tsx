import React, { JSX } from 'react';
import Head from 'next/head';
import type { RouteData } from '@sitecore-content-sdk/content/layout';
import { resolvePageMetadataFields } from '../metadata/resolve-page-metadata-fields';
import type { PageMetadataRouteFields } from '../metadata/resolve-page-metadata-fields';

/**
 * Props for {@link PageMetaTags}.
 * @public
 */
export interface PageMetaTagsProps {
  /** Route node from a Sitecore layout response (for example `page.layout.sitecore.route`). */
  route?: RouteData<PageMetadataRouteFields> | null;
  /** Fallback for `<title>` when the route has no `Title` field. Defaults to `'Page'`. */
  defaultTitle?: string;
}

/**
 * Renders `<title>` and the metadata/Open Graph `<meta>` tags for a Sitecore route via `next/head`,
 * for use in Pages Router layouts. Field-mapping/omission rules match `getPageMetadata` (the App
 * Router equivalent): `<title>` always comes from the route's `Title` field; `baseMetadataTitle`
 * renders its own `<meta name="title">` instead; every other field independently maps to exactly
 * one tag with no cross-field fallback.
 * @param {PageMetaTagsProps} props - Component props.
 * @public
 */
export const PageMetaTags = ({ route, defaultTitle = 'Page' }: PageMetaTagsProps): JSX.Element => {
  const {
    title,
    metaTitle,
    description,
    keywords,
    author,
    ogTitle,
    ogDescription,
    ogImage,
    ogImageSrc,
    ogType,
    creationTimeTag,
    creationTime,
    modifiedTimeTag,
    modifiedTime,
  } = resolvePageMetadataFields(route, defaultTitle);

  return (
    <Head>
      <title>{title}</title>
      {metaTitle && <meta name="title" content={metaTitle} />}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      {ogTitle && <meta property="og:title" content={ogTitle} />}
      {ogDescription && <meta property="og:description" content={ogDescription} />}
      {ogImageSrc && <meta property="og:image" content={ogImageSrc} />}
      {ogImageSrc && ogImage?.width && <meta property="og:image:width" content={ogImage.width} />}
      {ogImageSrc && ogImage?.height && <meta property="og:image:height" content={ogImage.height} />}
      {ogImageSrc && ogImage?.alt && <meta property="og:image:alt" content={ogImage.alt} />}
      {ogType && <meta property="og:type" content={ogType} />}
      {creationTimeTag && creationTime && <meta property={creationTimeTag} content={creationTime} />}
      {modifiedTimeTag && modifiedTime && <meta property={modifiedTimeTag} content={modifiedTime} />}
    </Head>
  );
};
