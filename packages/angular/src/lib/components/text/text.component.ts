import { Component, computed, input } from '@angular/core';
import { isFieldValueEmpty } from '@sitecore-content-sdk/content/layout';
import { TextField } from '../../field-types';

/**
 * Renders a Sitecore text field value.
 *
 * - When `encode` is `true` (default), the value is HTML-escaped (XSS-safe) and `\n`
 * characters become `<br>` elements.
 * - When `encode` is `false`, the raw value is injected via `innerHTML`.
 * - Wraps the output in an optional HTML tag; defaults to `<span>`.
 * - Renders nothing when the field value is empty.
 * @example
 * <sc-text [field]="fields.title" tag="h1" />
 * @public
 */
@Component({
  selector: 'sc-text',
  standalone: true,
  template: `
    @if (!isEmpty()) {
      <span [innerHTML]="innerHtml()"></span>
    }
  `,
})
export class TextComponent {
  /**
   * The text field data to render.
   */
  readonly field = input<TextField | undefined>(undefined);

  /**
   * HTML tag to wrap the output (e.g. `'h1'`, `'p'`). When `undefined`, no wrapping element
   * is added and the output is rendered as a plain `<span>` when encode is false, or as
   * adjacent text nodes / `<br>` when encode is true.
   */
  readonly tag = input<string | undefined>(undefined);

  /**
   * When `true` (default), HTML-encodes the value and converts `\n` to `<br>`.
   * When `false`, injects the value as raw HTML.
   */
  readonly encode = input<boolean>(true);

  readonly isEmpty = computed(() => {
    const f = this.field();
    return !f || isFieldValueEmpty(f);
  });

  readonly innerHtml = computed(() => {
    const value = String(this.field()?.value ?? '');
    const tag = this.tag();

    let content: string;
    if (this.encode()) {
      content = escapeHtml(value).replace(/\n/g, '<br />');
    } else {
      content = value;
    }

    return tag ? `<${tag}>${content}</${tag}>` : content;
  });
}

/**
 *
 * @param text
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
