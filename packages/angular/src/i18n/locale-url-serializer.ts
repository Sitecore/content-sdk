import { Injectable, PLATFORM_ID, REQUEST, inject } from '@angular/core';
import { DefaultUrlSerializer, type UrlTree } from '@angular/router';
import type { UrlSerializer } from '@angular/router';
import { SITECORE_CONFIG_TOKEN } from '../lib/tokens';
import { resolveCurrentPath, splitLocaleFromPath } from './locale-utils';
import { getLocaleRewrite } from '@sitecore-content-sdk/content/i18n';
import { isPlatformBrowser } from '@angular/common';

/**
 * Locale-aware {@link UrlSerializer} replacement. Extends {@link DefaultUrlSerializer} and
 * prepends the current URL locale (from the request pathname) to every serialized
 * URL. Angular's built-in `[routerLink]` computes hrefs via `router.serializeUrl()`, which
 * delegates to the DI-injected `UrlSerializer.serialize()` — so replacing the binding makes
 * every routerLink href locale-aware with no directive changes.
 *
 * Behavior:
 * - When `currentLocale` is `null` (URL has no configured locale prefix), serialization is
 *   unchanged.
 * - When the serialized URL already starts with a configured locale segment, serialization
 *   is unchanged (mirrors ScLinkDirective idempotency under repeated cycles).
 * - Otherwise the locale segment is prepended to the serialized URL.
 *
 * Parsing is inherited from the default — this serializer does **not** strip locale on
 * parse. The locale matcher (`scLocaleMatcher`) consumes the locale segment from the
 * route tree instead.
 * @public
 */
@Injectable()
export class LocaleUrlSerializer extends DefaultUrlSerializer {
  private readonly locales =
    inject(SITECORE_CONFIG_TOKEN, { optional: true })?.angular?.locales ?? [];
  private readonly req = inject(REQUEST, { optional: true });
  private readonly platformId = inject(PLATFORM_ID);

  override serialize(tree: UrlTree): string {
    const base = super.serialize(tree);
    if (this.locales.length > 0 && splitLocaleFromPath(base, this.locales).locale) {
      return base;
    }
    const isBrowser = isPlatformBrowser(this.platformId);
    const currentLocale = splitLocaleFromPath(
      resolveCurrentPath(this.req, isBrowser),
      this.locales
    ).locale;

    if (!currentLocale) {
      return base;
    }
    return getLocaleRewrite(base, currentLocale);
  }
}
