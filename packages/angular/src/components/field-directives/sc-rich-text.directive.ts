import {
  Directive,
  PLATFORM_ID,
  SecurityContext,
  TemplateRef,
  Type,
  inject,
  input,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TextField } from '@sitecore-content-sdk/content/layout';
import { BaseFieldDirective } from './base-field.directive';
import { DefaultEmptyFieldEditingComponent } from '../default-empty-text-field.component';
import { EXTERNAL_HREF_PREFIXES } from './utils';
import { attachHoverPrefetch } from './link-hover-prefetch';
import { ClientPreLoaderDataService } from '../../loaders/pre-loader-data.service';
import { SITECORE_CONFIG_TOKEN } from '../../lib/tokens';
import { MetadataKind } from '@sitecore-content-sdk/content/editing';
import type { LinkPrefetchMode } from '../../config/define-config';

/** Ultimate fallback when no `SITECORE_CONFIG_TOKEN` is provided. Mirrors `DEFAULT_LINK_PREFETCH` in `config/define-config.ts`. */
const FALLBACK_PREFETCH_MODE: LinkPrefetchMode = true;
const FALLBACK_PREFETCH_DELAY_MS = 100;

/**
 * Structural directive that renders a Sitecore rich-text field value as the `innerHTML` of
 * the consumer-supplied wrapper element.
 *
 * Internal links inside the rendered HTML are intercepted and routed through
 * {@link Router.navigateByUrl} so CMS-authored in-app links behave like SPA navigation.
 * External URLs, `target="_blank"`, and links clicked while the page is in editing mode
 * are left to the browser.
 *
 * Internal links (browser only) prefetch the loaders that apply to them via
 * {@link ClientPreLoaderDataService.prefetchForUrl}, per `sitecore.config`'s
 * `angular.linkPrefetch.mode` (default `true` — eager; `'hover'` defers until the pointer
 * dwells on the link; `false` disables it). Override per field with `scRichTextPrefetch`.
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
  /** Per-field override for loader prefetch. See {@link LinkPrefetchMode}. Falls back to `angular.linkPrefetch.mode` when unset. */
  readonly prefetch = input<LinkPrefetchMode | undefined>(undefined, {
    alias: 'scRichTextPrefetch',
  });

  protected readonly defaultEmptyComponent: Type<unknown> = DefaultEmptyFieldEditingComponent;

  private readonly sanitizer = inject(DomSanitizer);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly preLoaderData = inject(ClientPreLoaderDataService);
  private readonly linkPrefetchConfig = inject(SITECORE_CONFIG_TOKEN, { optional: true })?.angular
    ?.linkPrefetch;
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
    for (const anchor of Array.from(anchors) as HTMLAnchorElement[]) {
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
      this.applyPrefetch(anchor, href);
    }
  }

  /**
   * Applies the resolved prefetch mode to `anchor` when running in the browser and the page
   * isn't in editing or preview mode (checked here directly rather than relied on from
   * {@link hookLinks}'s own editing-only gate, so this method's preconditions are self
   * contained). External/`target="_blank"`/empty hrefs are already filtered out by
   * {@link hookLinks} before this is called. `'hover'` attaches a debounced listener; `true`
   * prefetches immediately; `false` does nothing.
   * @param {HTMLAnchorElement} anchor - Anchor element to observe/prefetch.
   * @param {string} href - The anchor's already-validated internal href.
   */
  private applyPrefetch(anchor: HTMLAnchorElement, href: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.isEditing() || this.isPreview()) return;

    const mode = this.prefetch() ?? this.linkPrefetchConfig?.mode ?? FALLBACK_PREFETCH_MODE;
    if (mode === false) return;

    if (mode === 'hover') {
      const delayMs = this.linkPrefetchConfig?.delayMs ?? FALLBACK_PREFETCH_DELAY_MS;
      const unlisten = attachHoverPrefetch(this.renderer, anchor, {
        delayMs,
        onPrefetch: (h) => this.preLoaderData.prefetchForUrl(h, { force: true }),
      });
      this.linkUnlisteners.push(unlisten);
      return;
    }

    // mode === true: eager
    this.preLoaderData.prefetchForUrl(href);
  }

  private cleanupLinks(): void {
    for (const unlisten of this.linkUnlisteners) {
      unlisten();
    }
    this.linkUnlisteners.length = 0;
  }
}
