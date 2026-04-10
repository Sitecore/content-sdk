import {
  Directive,
  ElementRef,
  inject,
  input,
  effect,
  Renderer2,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { isFieldValueEmpty, TextField } from '@sitecore-content-sdk/content/layout';

/**
 * Renders a Sitecore rich text field value as innerHTML of the host element.
 * Content is marked trusted for Angular sanitization (typical for CMS-authored HTML).
 *
 * Usage:
 * ```html
 * <div [scRichText]="fields.Content"></div>
 * ```
 *
 * @public
 */
@Directive({
  selector: '[scRichText]',
})
export class ScRichTextDirective {
  /** The Sitecore rich text field. */
  readonly scRichText = input.required<TextField>();

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly sanitizer = inject(DomSanitizer);

  constructor() {
    effect(() => {
      const field = this.scRichText();
      const element = this.el.nativeElement;

      if (!field || isFieldValueEmpty(field)) {
        this.renderer.setProperty(element, 'innerHTML', '');
        return;
      }

      const raw = (field.value as string) ?? '';
      const trusted = this.sanitizer.bypassSecurityTrustHtml(raw);
      const html = this.sanitizer.sanitize(SecurityContext.HTML, trusted) ?? '';
      this.renderer.setProperty(element, 'innerHTML', html);
    });
  }
}
