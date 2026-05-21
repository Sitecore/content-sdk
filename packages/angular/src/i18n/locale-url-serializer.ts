import { Injectable, inject } from '@angular/core';
import { DefaultUrlSerializer, type UrlTree } from '@angular/router';
import { SitecoreContextService } from '../lib/sitecore-context.service';
import { SITECORE_CONFIG_TOKEN } from '../lib/tokens';
import { splitLocaleFromPath } from './locale-utils';
import { getLocaleRewrite } from '@sitecore-content-sdk/content/i18n';

/**
 * Locale-aware {@link UrlSerializer} replacement. Extends {@link DefaultUrlSerializer} and
 * prepends the current URL locale (from {@link SitecoreContextService}) to every serialized
 * URL. Angular's built-in `[routerLink]` computes hrefs via `router.serializeUrl()`, which
 * delegates to the DI-injected `UrlSerializer.serialize()` — so replacing the binding makes
 * every routerLink href locale-aware with no directive changes.
 *
 * Behavior:
 * - When `currentLocale` is `null` (URL has no configured locale prefix), serialization is
 *   unchanged.
 * - When the serialized URL already starts with a configured locale segment, serialization
 *   is unchanged (mirrors {@link ScLinkDirective} idempotency under repeated cycles).
 * - Otherwise the locale segment is prepended to the serialized URL.
 *
 * Parsing is inherited from the default — this serializer does **not** strip locale on
 * parse. The locale matcher (`scLocaleMatcher`) consumes the locale segment from the
 * route tree instead.
 * @public
 */
@Injectable()
export class LocaleUrlSerializer extends DefaultUrlSerializer {
  private readonly context = inject(SitecoreContextService);
  private readonly locales =
    inject(SITECORE_CONFIG_TOKEN, { optional: true })?.angular?.locales ?? [];

  override serialize(tree: UrlTree): string {
    const base = super.serialize(tree);
    if (this.locales.length > 0 && splitLocaleFromPath(base, this.locales).locale) {
      return base;
    }
    const currentLocale = this.context.urlLocale();
    if (!currentLocale) {
      return base;
    }
    return getLocaleRewrite(base, currentLocale);
  }
}
