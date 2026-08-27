import type { Metadata as NextMetadata } from 'next';
import type { Field, PageMetadataFields, RouteData } from '@sitecore-content-sdk/content/layout';

/** Open Graph types that define a creation-time field, and which `Metadata.openGraph` key it maps to. */
const OG_CREATION_TIME_FIELD: Record<string, 'publishedTime' | 'releaseDate'> = {
  article: 'publishedTime',
  book: 'releaseDate',
  'music.album': 'releaseDate',
  'video.movie': 'releaseDate',
  'video.episode': 'releaseDate',
};

/**
 * Route fields consumed by {@link getPageMetadata}: the page's `Title` plus the metadata/Open
 * Graph fields Sitecore returns as siblings of `Title` in the route's `fields`.
 * @public
 */
export type PageMetadataRouteFields = PageMetadataFields & { Title?: Field };

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
  const fields = route?.fields;

  const title = fields?.Title?.value?.toString() || defaultTitle;
  const metaTitle = fields?.baseMetadataTitle?.value;
  const description = fields?.baseMetadataDescription?.value;
  const keywords = fields?.baseMetadataKeywords?.value;
  const author = fields?.baseMetadataAuthor?.value;
  const ogTitle = fields?.baseOgTitle?.value;
  const ogDescription = fields?.baseOgDescription?.value;
  const ogImage = fields?.baseOgImage?.value;
  const ogImageSrc = ogImage?.src;
  const ogType = fields?.baseOgType?.value;
  const creationTimeField = ogType ? OG_CREATION_TIME_FIELD[ogType] : undefined;
  const creationTime = creationTimeField ? route?.published : undefined;
  // article is the only Open Graph type with a distinct update-time field
  const modifiedTime = ogType === 'article' ? route?.updated : undefined;

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
        ...(modifiedTime && { modifiedTime }),
      } as NextMetadata['openGraph'],
    }),
  };
}
