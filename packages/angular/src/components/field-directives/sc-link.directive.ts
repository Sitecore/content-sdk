import { Directive, ElementRef, inject, input, effect, Renderer2 } from '@angular/core';
import { LinkFieldValue, LinkField } from '@sitecore-content-sdk/content/layout';
import { applyLinkFieldToAnchor, resolveLinkFromField } from './link-field-utils';
import { SitecoreContextService } from '../../lib/sitecore-context.service';
import { SITECORE_CONFIG_TOKEN } from '../../lib/tokens';
import { splitLocaleFromPath } from '../../i18n/locale-utils';
import { getLocaleRewrite } from '@sitecore-content-sdk/content/i18n';

const EXTERNAL_HREF_PREFIXES = [
  'http://',
  'https://',
  'mailto:',
  'tel:',
  'sms:',
  'javascript:',
  'data:',
  'ftp:',
  '//',
];

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
 * Renders a Sitecore link field onto a host `<a>` element.
 * Sets `href`, `title`, `target`, `class`, and text content from the field data.
 *
 * Locale-awareness: when a configured locale list is provided via `sitecore.config`,
 * internal hrefs are prefixed with the current URL locale (read from
 * {@link SitecoreContextService}). Hrefs that already contain a configured-locale segment
 * are written as-is, which respects author-intent cross-locale links and keeps the
 * directive idempotent under repeated change detection.
 *
 * Usage:
 * ```html
 * <a [scLink]="fields.Link">Optional child content</a>
 * ```
 * @public
 */
@Directive({
  selector: 'a[scLink]',
})
export class ScLinkDirective {
  /** The Sitecore link field. */
  readonly scLink = input.required<LinkField | LinkFieldValue>();

  /** Whether to show link text alongside existing child content. */
  readonly preferTextFromField = input<boolean>(false);

  protected readonly el = inject(ElementRef<HTMLAnchorElement>);
  private readonly renderer = inject(Renderer2);
  private readonly context = inject(SitecoreContextService);
  private readonly locales =
    inject(SITECORE_CONFIG_TOKEN, { optional: true })?.angular?.locales ?? [];
  private readonly originalClass: string | undefined;
  private readonly originalTitle: string | undefined;
  private readonly originalTarget: string | undefined;
  private readonly originalRel: string | null;

  constructor() {
    this.originalClass = (this.el.nativeElement as HTMLAnchorElement).className;
    this.originalTitle = (this.el.nativeElement as HTMLAnchorElement).title;
    this.originalTarget = (this.el.nativeElement as HTMLAnchorElement).target;
    this.originalRel = (this.el.nativeElement as HTMLAnchorElement).rel;
    effect(() => {
      const field = this.scLink();
      const element = this.el.nativeElement;

      const link = resolveLinkFromField(field);
      const localizedLink = link ? this.localizeLink(link) : link;

      applyLinkFieldToAnchor(this.renderer, element, localizedLink, {
        preferTextFromField: this.preferTextFromField(),
        originalClass: this.originalClass,
        originalTitle: this.originalTitle,
        originalTarget: this.originalTarget,
        originalRel: this.originalRel,
      });
    });
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
    const currentLocale = this.context.urlLocale();
    if (!currentLocale) {
      return link;
    }
    return { ...link, href: getLocaleRewrite(href, currentLocale) };
  }
}
