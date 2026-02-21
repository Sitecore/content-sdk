import { Component, computed, input } from '@angular/core';
import { isFieldValueEmpty } from '@sitecore-content-sdk/content/layout';
import { RichTextField } from '../../field-types';

/**
 * Renders a Sitecore RichText field value as raw HTML.
 *
 * The HTML is injected via Angular's `[innerHTML]` binding which passes through the browser's
 * built-in sanitization. To bypass sanitization for fully trusted Sitecore-authored content use
 * Angular's `DomSanitizer.bypassSecurityTrustHtml()` and bind to `[innerHTML]` yourself.
 *
 * - Wraps the output in an optional HTML tag via the `tag` input (defaults to no wrapper).
 * - Returns nothing when the field value is empty.
 * @example
 * <sc-rich-text [field]="fields.body" />
 * <sc-rich-text [field]="fields.body" tag="section" />
 * @public
 */
@Component({
  selector: 'sc-rich-text',
  standalone: true,
  template: `
    @if (!isEmpty()) {
      <div [innerHTML]="renderedHtml()"></div>
    }
  `,
})
export class RichTextComponent {
  /**
   * The RichText field data to render.
   */
  readonly field = input<RichTextField | undefined>(undefined);

  /**
   * Optional HTML wrapper tag (e.g. `'section'`, `'article'`).
   * When omitted the HTML is rendered without an extra wrapper element.
   */
  readonly tag = input<string | undefined>(undefined);

  readonly isEmpty = computed(() => {
    const f = this.field();
    return !f || isFieldValueEmpty(f);
  });

  readonly renderedHtml = computed(() => {
    const value = this.field()?.value ?? '';
    const t = this.tag();
    return t ? `<${t}>${value}</${t}>` : value;
  });
}
