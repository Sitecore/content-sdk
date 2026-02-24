import { Directive, ElementRef, effect, inject, input } from '@angular/core';
import { isFieldValueEmpty } from '@sitecore-content-sdk/content/layout';
import { TextField } from '../../field-types';

/**
 * Directive alternative to `TextComponent`. Renders a Sitecore text field value
 * directly onto the host element via `innerHTML`.
 *
 * - When `scTextEncode` is `true` (default), the value is HTML-escaped and `\n`
 *   becomes `<br>`.
 * - When `scTextEncode` is `false`, the raw value is injected as HTML.
 * - Use `scTextTag` to wrap the output in an additional HTML tag.
 * - Clears the host element's content when the field is empty.
 * @example
 * <!-- plain span -->
 * <span [scText]="fields.title"></span>
 *
 * <!-- encode off (rich-inline) -->
 * <p [scText]="fields.body" [scTextEncode]="false"></p>
 *
 * <!-- wrap in h1 tag -->
 * <div [scText]="fields.heading" scTextTag="h1"></div>
 * @public
 */
@Directive({
  selector: '[scText]',
  standalone: true,
})
export class ScTextDirective {
  /**
   * The text field data to render.
   */
  readonly scText = input<TextField | undefined>(undefined);

  /**
   * HTML tag to wrap the output inside (e.g. `'h1'`, `'p'`).
   * When omitted, content is rendered directly into the host element.
   */
  readonly scTextTag = input<string | undefined>(undefined);

  /**
   * When `true` (default), HTML-encodes the value and converts `\n` to `<br>`.
   * When `false`, injects the raw value as HTML.
   */
  readonly scTextEncode = input<boolean>(true);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    effect(() => {
      const field = this.scText();
      const host = this.el.nativeElement;

      if (!field || isFieldValueEmpty(field)) {
        host.innerHTML = '';
        return;
      }

      const value = String(field.value ?? '');
      const tag = this.scTextTag();

      let content: string;
      if (this.scTextEncode()) {
        content = escapeHtml(value).replace(/\n/g, '<br />');
      } else {
        content = value;
      }

      host.innerHTML = tag ? `<${tag}>${content}</${tag}>` : content;
    });
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
