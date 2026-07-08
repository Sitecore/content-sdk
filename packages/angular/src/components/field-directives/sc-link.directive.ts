import { Directive, TemplateRef, Type, inject, input } from '@angular/core';
import { LinkField, LinkFieldValue } from '@sitecore-content-sdk/content/layout';
import { getLocaleRewrite } from '@sitecore-content-sdk/content/i18n';
import { BaseFieldDirective } from './base-field.directive';
import { DefaultEmptyFieldEditingComponent } from '../default-empty-text-field.component';
import { applyLinkFieldToAnchor, resolveLinkFromField } from './link-field-utils';
import { SitecoreContextService } from '../../lib/sitecore-context.service';
import { SITECORE_CONFIG_TOKEN } from '../../lib/tokens';
import { splitLocaleFromPath } from '../../i18n/locale-utils';
import { MetadataKind } from '@sitecore-content-sdk/content/editing';
import { EXTERNAL_HREF_PREFIXES } from './utils';

type OriginalAnchorAttrs = {
  class: string | undefined;
  title: string | undefined;
  target: string | undefined;
  rel: string | null;
};

/**
 * Returns true when the href should be written to the DOM unchanged
 * (external scheme, protocol-relative, fragment-only, or empty/whitespace).
 * @param {string} href - Raw href string from the Sitecore link field.
 * @returns {boolean} Whether the href is non-internal and must be left alone.
 */
function isNonInternalHref(href: string): boolean {
  if (!href) return true;
  const trimmed = href.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith('#')) return true;
  const lower = trimmed.toLowerCase();
  return EXTERNAL_HREF_PREFIXES.some((p) => lower.startsWith(p));
}

/**
 * Structural directive that renders a Sitecore link field onto a consumer-supplied `<a>`.
 *
 * Editing flow:
 *   - field has a renderable href/text → emit opening chrome marker, embed the consumer's
 *     `<a>` template, write `href/title/target/class/text` onto it (locale-aware), emit
 *     closing chrome marker.
 *   - field is empty in editing mode + has `metadata` → render the empty-link placeholder
 *     between markers (overridable via `scLinkEmptyFieldEditingTemplate`).
 *
 * Locale-awareness: when a configured locale list is provided via `sitecore.config`,
 * internal hrefs are prefixed with the current URL locale (read from
 * {@link SitecoreContextService}). Hrefs that already contain a configured-locale segment
 * are written as-is, which respects author-intent cross-locale links and keeps the
 * directive idempotent under repeated change detection.
 *
 * Usage:
 * ```html
 * <a *scLink="fields.Link"></a>
 * <a *scLink="fields.Link">Optional child content</a>
 * ```
 * @public
 */
@Directive({
  selector: '[scLink]',
})
export class ScLinkDirective extends BaseFieldDirective<LinkField | LinkFieldValue | undefined> {
  /** The Sitecore link field. */
  readonly field = input.required<LinkField | LinkFieldValue | undefined>({ alias: 'scLink' });
  /** Whether to override existing anchor text with the field's text value. */
  readonly preferTextFromField = input<boolean>(false, { alias: 'scLinkPreferTextFromField' });
  /** Consumer-supplied template rendered between chrome markers when the field is empty in editing mode. */
  readonly emptyFieldEditingTemplate = input<TemplateRef<unknown> | undefined>(undefined, {
    alias: 'scLinkEmptyFieldEditingTemplate',
  });

  protected readonly defaultEmptyComponent: Type<unknown> = DefaultEmptyFieldEditingComponent;
  protected readonly sitecoreContext = inject(SitecoreContextService);
  private readonly locales =
    inject(SITECORE_CONFIG_TOKEN, { optional: true })?.angular?.locales ?? [];
  private readonly originalAttrs = new WeakMap<HTMLAnchorElement, OriginalAnchorAttrs>();

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

  protected shouldRender(): boolean {
    const field = this.field();
    if (!field) return false;
    if (resolveLinkFromField(field as LinkField | LinkFieldValue | undefined)) {
      return true;
    }
    const text = (field as LinkFieldValue).text ?? (field as LinkField).value?.text;
    return !!text && !this.fieldMetadata;
  }

  protected applyValue(): void {
    const field = this.field();
    if (!field || !this.viewRef) return;

    const link = resolveLinkFromField(field);
    const localizedLink = link ? this.localizeLink(link) : link;

    for (const node of this.viewRef.rootNodes) {
      if (!(node instanceof Element)) continue;
      const anchor = node as HTMLAnchorElement;
      const originals = this.getOriginals(anchor);
      applyLinkFieldToAnchor(this.renderer, anchor, localizedLink, {
        preferTextFromField: this.preferTextFromField(),
        originalClass: originals.class,
        originalTitle: originals.title,
        originalTarget: originals.target,
        originalRel: originals.rel,
      });
    }
  }

  private getOriginals(anchor: HTMLAnchorElement): OriginalAnchorAttrs {
    let cached = this.originalAttrs.get(anchor);
    if (!cached) {
      cached = {
        class: anchor.className || undefined,
        title: anchor.getAttribute('title') ?? undefined,
        target: anchor.getAttribute('target') ?? undefined,
        rel: anchor.getAttribute('rel'),
      };
      this.originalAttrs.set(anchor, cached);
    }
    return cached;
  }

  /**
   * Returns a copy of the link with `href` prefixed by the current URL locale when applicable.
   * Internal hrefs are prefixed only when:
   *   1. There is a current URL locale (page itself has a locale prefix), and
   *   2. The href does not already start with a configured locale segment.
   * External, fragment-only, and locale-prefixed hrefs are returned unchanged.
   * @param {LinkFieldValue} link - Resolved link value from layout data.
   * @returns {LinkFieldValue} Link value with locale-aware href.
   */
  private localizeLink(link: LinkFieldValue): LinkFieldValue {
    const href = link.href ?? '';
    if (isNonInternalHref(href)) {
      return link;
    }
    if (this.locales.length > 0) {
      const { locale } = splitLocaleFromPath(href, this.locales);
      if (locale) {
        return link;
      }
    }
    const currentLocale = this.sitecoreContext.urlLocale();
    if (!currentLocale) {
      return link;
    }
    return { ...link, href: getLocaleRewrite(href, currentLocale) };
  }
}
