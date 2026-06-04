import { Directive, ElementRef, inject, input, effect, Renderer2 } from '@angular/core';
import { isFieldValueEmpty, TextField } from '@sitecore-content-sdk/content/layout';

/**
 * Renders a Sitecore text field value into the host element's text content.
 * For simple string/number fields in published mode.
 *
 * Usage:
 * ```html
 * <h1 [scText]="fields.Title"></h1>
 * <span [scText]="fields.Subtitle" scTextEncode="false"></span>
 * ```
 * @public
 */
@Directive({
  selector: '[scText]',
})
export class ScTextDirective {
  /** The Sitecore text field. */
  readonly scText = input.required<TextField>();

  /** Whether to HTML-encode the value (default: true). When false, uses innerHTML. */
  readonly scTextEncode = input<boolean>(true);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      const field = this.scText();
      const encode = this.scTextEncode();
      const element = this.el.nativeElement;

      if (!field || isFieldValueEmpty(field)) {
        this.renderer.setProperty(element, 'textContent', '');
        return;
      }

      const value = String(field.value);

      if (encode) {
        this.renderer.setProperty(element, 'textContent', value);
      } else {
        this.renderer.setProperty(element, 'innerHTML', value);
      }
    });
  }
}
