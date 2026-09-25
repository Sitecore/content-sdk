import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { getJsonLdSchemas } from '@sitecore-content-sdk/content/layout';
import type { Page } from '@sitecore-content-sdk/content/client';

/** Attribute marking the JSON-LD `<script>` managed by {@link JsonLdSchemaService}. */
const JSON_LD_MARKER_ATTRIBUTE = 'data-sc-json-ld';

/**
 * Renders the JSON-LD structured data schemas from a Sitecore route
 * into a single `<script type="application/ld+json">` tag in the document `<head>`, serialized as a
 * JSON array. Renders nothing if there are no schemas, or if the page isn't in normal
 * (rendering) mode.
 *
 * Most apps should use the `<sc-json-ld-schema>` component, which calls this service and cleans up
 * on destroy. Use the service directly to apply structured data outside of a component template.
 * @public
 */
@Injectable({ providedIn: 'root' })
export class JsonLdSchemaService {
  private readonly document = inject(DOCUMENT);

  /**
   * Adds, updates or removes the managed JSON-LD script for the page.
   * @param {Page | null} [page] - Sitecore page (for example the `page` route data).
   */
  apply(page?: Page | null): void {
    const schema = page?.mode.isNormal
      ? getJsonLdSchemas(page.layout?.sitecore?.context?.schemas)
      : null;

    if (!schema) {
      this.clear();
      return;
    }

    let script = this.findScript();
    if (!script) {
      script = this.document.createElement('script');
      script.setAttribute(JSON_LD_MARKER_ATTRIBUTE, '');
      script.type = schema.type;
      this.document.head.appendChild(script);
    }
    // `schema.innerHTML` is JSON escaped for safe embedding in a script tag
    script.textContent = schema.innerHTML;
  }

  /**
   * Removes the managed JSON-LD script, if present.
   */
  clear(): void {
    this.findScript()?.remove();
  }

  private findScript(): HTMLScriptElement | null {
    return this.document.head.querySelector<HTMLScriptElement>(
      `script[${JSON_LD_MARKER_ATTRIBUTE}]`
    );
  }
}
