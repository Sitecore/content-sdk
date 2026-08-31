import type { Metadata as NextMetadata } from 'next';
import type { RouteData } from '@sitecore-content-sdk/content/layout';
import { resolvePageMetadataFields } from './resolve-page-metadata-fields';
import type { PageMetadataRouteFields } from './resolve-page-metadata-fields';

export type { PageMetadataRouteFields };

/** Official Open Graph time tag names mapped to their Next.js `Metadata.openGraph` key. */
const OG_TIME_METADATA_KEY: Record<string, 'publishedTime' | 'releaseDate' | 'modifiedTime'> = {
  'article:published_time': 'publishedTime',
  'book:release_date': 'releaseDate',
  'music:release_date': 'releaseDate',
  'video:release_date': 'releaseDate',
  'article:modified_time': 'modifiedTime',
};

/**
 * Builds a Next.js `Metadata` object (`<title>`, description/keywords/author meta, and Open Graph
 * tags) from a Sitecore route, for direct use as the return value of a page's `generateMetadata`.
 *
 * `<title>` always comes from the route's `Title` field (falling back to `defaultTitle`);
 * `baseMetadataTitle` never feeds `<title>` and instead renders its own `<meta name="title">`
 * (via `other.title`). Every other field independently maps to exactly one tag with no
 * cross-field fallback: a field with no value simply omits its tag.
 * @param {RouteData<PageMetadataRouteFields> | null} [route] - Route node from a Sitecore layout
 * response (for example `page?.layout.sitecore.route`).
 * @param {string} [defaultTitle] - Fallback for `<title>` when the route has no `Title` field.
 * @public
 */
export function getPageMetadata(
  route?: RouteData<PageMetadataRouteFields> | null,
  defaultTitle = 'Page'
): NextMetadata {
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
  const creationTimeField = creationTimeTag ? OG_TIME_METADATA_KEY[creationTimeTag] : undefined;
  const modifiedTimeField = modifiedTimeTag ? OG_TIME_METADATA_KEY[modifiedTimeTag] : undefined;

  return {
    title,
    ...(metaTitle && { other: { title: metaTitle } }),
    ...(description && { description }),
    ...(keywords && { keywords }),
    ...(author && { authors: [{ name: author }] }),
    ...((ogTitle || ogDescription || ogImageSrc || ogType) && {
      openGraph: {
        ...(ogTitle && { title: ogTitle }),
        ...(ogDescription && { description: ogDescription }),
        ...(ogImageSrc && {
          images: [
            {
              url: ogImageSrc,
              ...(ogImage?.width && { width: ogImage.width }),
              ...(ogImage?.height && { height: ogImage.height }),
              ...(ogImage?.alt && { alt: ogImage.alt }),
            },
          ],
        }),
        ...(ogType && { type: ogType }),
        ...(creationTimeField && creationTime && { [creationTimeField]: creationTime }),
        ...(modifiedTimeField && modifiedTime && { [modifiedTimeField]: modifiedTime }),
      } as NextMetadata['openGraph'],
    }),
  };
}
