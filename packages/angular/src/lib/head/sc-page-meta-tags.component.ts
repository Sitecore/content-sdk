import { Component, DestroyRef, effect, inject, input } from '@angular/core';
import type { PageMetadataRouteFields, RouteData } from '@sitecore-content-sdk/content/layout';
import { PageMetadataService } from './page-metadata.service';

/**
 * Applies `<title>` and the metadata/Open Graph `<meta>` tags for a Sitecore route to the document
 * `<head>` via {@link PageMetadataService}. Re-applies whenever `route` changes and removes the managed tags when destroyed.
 * @example
 * ```html
 * <sc-page-meta-tags [route]="page().layout.sitecore.route" />
 * ```
 * @public
 */
@Component({
  selector: 'sc-page-meta-tags',
  template: '',
})
export class ScPageMetaTagsComponent {
  readonly route = input<RouteData<PageMetadataRouteFields> | null | undefined>();
  /** Fallback for `<title>` when the route has no `Title` field. Defaults to `'Page'`. */
  readonly defaultTitle = input('Page');

  private readonly metadata = inject(PageMetadataService);

  constructor() {
    effect(() => this.metadata.apply(this.route(), this.defaultTitle()));
    inject(DestroyRef).onDestroy(() => this.metadata.clear());
  }
}
