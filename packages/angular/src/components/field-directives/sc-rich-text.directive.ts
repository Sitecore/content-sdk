import { Directive, SecurityContext, TemplateRef, Type, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TextField } from '@sitecore-content-sdk/content/layout';
import { BaseFieldDirective } from './base-field.directive';
import { DefaultEmptyFieldEditingComponent } from '../default-empty-text-field.component';
import { EXTERNAL_HREF_PREFIXES } from './utils';
import { MetadataKind } from '@sitecore-content-sdk/content/editing';

/**
 * Structural directive that renders a Sitecore rich-text field value as the `innerHTML` of
 * the consumer-supplied wrapper element.
 *
 * Internal links inside the rendered HTML are intercepted and routed through
 * {@link Router.navigateByUrl} so CMS-authored in-app links behave like SPA navigation.
 * External URLs, `target="_blank"`, and links clicked while the page is in editing mode
 * are left to the browser.
 * @public
 */
@Directive({
  selector: '[scRichText]',
})
export class ScRichTextDirective extends BaseFieldDirective<TextField | undefined> {
  /** The Sitecore rich-text field. */
  readonly field = input.required<TextField | undefined>({ alias: 'scRichText' });

  /** Consumer-supplied template rendered between chrome markers when the field is empty in editing mode. */
  readonly emptyFieldEditingTemplate = input<TemplateRef<unknown> | undefined>(undefined, {
    alias: 'scRichTextEmptyFieldEditingTemplate',
  });

  protected readonly defaultEmptyComponent: Type<unknown> = DefaultEmptyFieldEditingComponent;

  private readonly sanitizer = inject(DomSanitizer);
  private readonly router = inject(Router);
  private readonly linkUnlisteners: (() => void)[] = [];

  protected updateView(): void {
    this.cleanupLinks();
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
    this.cleanupLinks();
    const field = this.field();
    if (!field || !this.viewRef) return;
    const raw = (field.value as string) ?? '';
    const trusted = this.sanitizer.bypassSecurityTrustHtml(raw);
    const html = this.sanitizer.sanitize(SecurityContext.HTML, trusted) ?? '';
    for (const node of this.viewRef.rootNodes) {
      if (!(node instanceof Element)) continue;
      this.renderer.setProperty(node, 'innerHTML', html);
      this.hookLinks(node);
    }
  }

  private hookLinks(container: Element): void {
    if (this.isEditing()) {
      return;
    }
    const anchors = container.querySelectorAll('a[href]');
    for (const anchor of Array.from(anchors)) {
      const href = anchor.getAttribute('href')?.trim() ?? '';
      if (!href) continue;
      const lower = href.toLowerCase();
      if (EXTERNAL_HREF_PREFIXES.some((p) => lower.startsWith(p))) continue;
      const unlisten = this.renderer.listen(anchor, 'click', (event: MouseEvent) => {
        const currentHref = anchor.getAttribute('href')?.trim() ?? '';
        if (anchor.getAttribute('target') === '_blank') return;
        event.preventDefault();
        void this.router.navigateByUrl(currentHref);
      });
      this.linkUnlisteners.push(unlisten);
    }
  }

  private cleanupLinks(): void {
    for (const unlisten of this.linkUnlisteners) {
      unlisten();
    }
    this.linkUnlisteners.length = 0;
  }
}
