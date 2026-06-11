import { Directive, TemplateRef, Type, input } from '@angular/core';
import { TextField } from '@sitecore-content-sdk/content/layout';
import { BaseFieldDirective } from './base-field.directive';
import { DefaultEmptyFieldEditingComponent } from '../default-empty-text-field.component';
import { MetadataKind } from '@sitecore-content-sdk/content/editing';

/**
 * Structural directive that renders a Sitecore text field value into the consumer-supplied
 * wrapper element.
 *
 * Editing flow:
 *   - field has a renderable value → emit `<code class="scpm" kind="open">`, embed the
 *     consumer's template (e.g. `<h1>`), write the value into it, then emit
 *     `<code class="scpm" kind="close">`.
 *   - field is empty + page is in editing mode + field carries `metadata` → emit chrome
 *     markers around either the consumer's `scTextEmptyFieldEditingTemplate` or the default
 *     {@link DefaultEmptyTextFieldPlaceholderComponent}.
 *   - field is empty otherwise → render nothing.
 *
 * Usage:
 * ```html
 * <h1 *scText="fields.Title"></h1>
 * <span *scText="fields.Subtitle; encode: false"></span>
 * <h1 *scText="fields.Title; emptyTemplate: customEmptyTpl"></h1>
 * ```
 * @public
 */
@Directive({
  selector: '[scText]',
})
export class ScTextDirective extends BaseFieldDirective<TextField | undefined> {
  /** The Sitecore text field. */
  readonly field = input.required<TextField | undefined>({ alias: 'scText' });

  /** Whether to HTML-encode the value (default: true). When false, uses innerHTML. */
  readonly encode = input<boolean>(true, { alias: 'scTextEncode' });

  /** Consumer-supplied template rendered between chrome markers when the field is empty in editing mode. */
  readonly emptyFieldEditingTemplate = input<TemplateRef<unknown> | undefined>(undefined, {
    alias: 'scTextEmptyFieldEditingTemplate',
  });

  protected readonly defaultEmptyComponent: Type<unknown> = DefaultEmptyFieldEditingComponent;

  protected updateView(): void {
    this.viewContainer.clear();
    this.viewRef = undefined;

    if (!this.shouldRender()) {
      this.renderEmpty();
      return;
    }

    this.renderEditingChrome(MetadataKind.Open);
    this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef);
    this.applyValue();
    this.renderEditingChrome(MetadataKind.Close);
  }

  private applyValue(): void {
    const field = this.field();
    if (!field || !this.viewRef) return;
    const value = field.value === null ? '' : String(field.value);
    const encode = this.encode();
    for (const node of this.viewRef.rootNodes) {
      if (!(node instanceof Element)) continue;
      if (encode) {
        this.renderer.setProperty(node, 'textContent', value);
      } else {
        this.renderer.setProperty(node, 'innerHTML', value);
      }
    }
  }
}
