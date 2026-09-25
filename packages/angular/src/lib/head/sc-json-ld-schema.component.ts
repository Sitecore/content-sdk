import { Component, DestroyRef, effect, inject, input } from '@angular/core';
import type { Page } from '@sitecore-content-sdk/content/client';
import { JsonLdSchemaService } from './json-ld-schema.service';

/**
 * Renders the JSON-LD structured data schemas from a Sitecore route
 * into a single `<script type="application/ld+json">` tag in the document `<head>` via
 * {@link JsonLdSchemaService}. Renders nothing if there are no schemas, or if the page isn't in
 * normal (rendering) mode. Re-applies whenever `page` changes and removes
 * the script when destroyed.
 * @example
 * ```html
 * <sc-json-ld-schema [page]="page()" />
 * ```
 * @public
 */
@Component({
  selector: 'sc-json-ld-schema',
  template: '',
})
export class ScJsonLdSchemaComponent {
  /** Sitecore page (for example the `page` route data). */
  readonly page = input<Page | null | undefined>();

  private readonly jsonLd = inject(JsonLdSchemaService);

  constructor() {
    effect(() => this.jsonLd.apply(this.page()));
    inject(DestroyRef).onDestroy(() => this.jsonLd.clear());
  }
}
