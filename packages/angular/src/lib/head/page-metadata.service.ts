import { Injectable, inject } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import {
  OG_CREATION_TIME_TAG,
  OG_MODIFIED_TIME_TAG,
  resolvePageMetadataFields,
} from '@sitecore-content-sdk/content/layout';
import type { PageMetadataRouteFields, RouteData } from '@sitecore-content-sdk/content/layout';

/** A `<meta>` tag to render; skipped when its `content`, or its `name`/`property`, has no value. */
type MetaTag = { name?: string; property?: string; content?: string };

/** Selectors of every `<meta>` tag managed by {@link PageMetadataService}. */
const MANAGED_SELECTORS = [
  ...['title', 'description', 'keywords', 'author'].map((name) => `name="${name}"`),
  ...[
    'og:title',
    'og:description',
    'og:image',
    'og:image:width',
    'og:image:height',
    'og:image:alt',
    'og:type',
    ...Object.values(OG_CREATION_TIME_TAG),
    ...Object.values(OG_MODIFIED_TIME_TAG),
  ].map((property) => `property="${property}"`),
];

/**
 * Applies `<title>` and the metadata/Open Graph `<meta>` tags for a Sitecore route to the document
 * `<head>`, using Angular's `Title` and `Meta` services.
 * `<title>` always comes from the route's `Title` field; `baseMetadataTitle` renders its
 * own `<meta name="title">` instead; every other field independently maps to exactly one tag with no
 * cross-field fallback, and a tag whose field has no value is removed, so tags from a previously
 * applied route never leak into the next one.
 *
 * Most apps should use the `<sc-page-meta-tags>` component, which calls this service and cleans up
 * on destroy. Use the service directly to apply metadata outside of a component template.
 * @public
 */
@Injectable({ providedIn: 'root' })
export class PageMetadataService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  /**
   * Sets `<title>` and replaces the managed metadata/Open Graph tags with the ones for the route.
   * @param {RouteData<PageMetadataRouteFields> | null} [route] - Route node from a Sitecore layout
   * response (for example `page.layout.sitecore.route`).
   * @param {string} [defaultTitle] - Fallback for `<title>` when the route has no `Title` field.
   */
  apply(route?: RouteData<PageMetadataRouteFields> | null, defaultTitle = 'Page'): void {
    const metadata = resolvePageMetadataFields(route, defaultTitle);
    // og:image dimensions/alt are only meaningful alongside og:image itself
    const ogImage = metadata.ogImageSrc ? metadata.ogImage : undefined;

    this.title.setTitle(metadata.title);
    this.clear();

    const tags: MetaTag[] = [
      { name: 'title', content: metadata.metaTitle },
      { name: 'description', content: metadata.description },
      { name: 'keywords', content: metadata.keywords },
      { name: 'author', content: metadata.author },
      { property: 'og:title', content: metadata.ogTitle },
      { property: 'og:description', content: metadata.ogDescription },
      { property: 'og:image', content: metadata.ogImageSrc },
      { property: 'og:image:width', content: ogImage?.width },
      { property: 'og:image:height', content: ogImage?.height },
      { property: 'og:image:alt', content: ogImage?.alt },
      { property: 'og:type', content: metadata.ogType },
      { property: metadata.creationTimeTag, content: metadata.creationTime },
      { property: metadata.modifiedTimeTag, content: metadata.modifiedTime },
    ];

    this.meta.addTags(
      tags.filter((tag): tag is MetaDefinition => !!tag.content && !!(tag.name || tag.property))
    );
  }

  /**
   * Removes every managed metadata/Open Graph tag. `<title>` is left unchanged.
   */
  clear(): void {
    for (const selector of MANAGED_SELECTORS) {
      this.meta.removeTag(selector);
    }
  }
}
