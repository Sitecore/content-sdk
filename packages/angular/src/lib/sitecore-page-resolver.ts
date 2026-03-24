import { Inject, Injectable } from '@angular/core';
import type { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import type { Page, PageOptions, SitecoreClient } from '@sitecore-content-sdk/content/client';
import { SITECORE_CLIENT_TOKEN, SITECORE_CONFIG_TOKEN } from './tokens';

/**
 * Central place for resolving Sitecore page data and related request concerns in Angular.
 *
 * Injects {@link SITECORE_CONFIG_TOKEN} and {@link SITECORE_CLIENT_TOKEN} from
 * {@link provideSitecoreAngular}. Use {@link SitecorePageResolver#resolvePage} from route loaders
 * via `inject(SitecorePageResolver)` (loaders run in an injection context).
 *
 * Future: add methods for personalization and multisite resolution alongside {@link resolvePage}.
 *
 * @public
 */
@Injectable({ providedIn: 'root' })
export class SitecorePageResolver {
  constructor(
    @Inject(SITECORE_CONFIG_TOKEN) private readonly scConfig: SitecoreConfig,
    @Inject(SITECORE_CLIENT_TOKEN) private readonly scClient: SitecoreClient
  ) {}

  /**
   * Config provided via {@link provideSitecoreAngular}; same object as {@link SITECORE_CONFIG_TOKEN}.
   * Exposed for extendability (multisite, personalization); {@link resolvePage} uses {@link SitecoreClient} defaults when options omit site/locale.
   */
  get sitecoreConfig(): SitecoreConfig {
    return this.scConfig;
  }

  /**
   * Resolves layout/page data for a route path using the configured {@link SitecoreClient}.
   * Delegates to `scClient.getPage`; site/locale fall back to client init options when omitted.
   *
   * @param path - Route path (e.g. `'/'` or `'/about'`).
   * @param options - Optional `locale` / `site` overrides.
   */
  async resolvePage(
    path: string,
    options?: { locale?: string; site?: string }
  ): Promise<Page | null> {
    const pageOptions: PageOptions = {};
    if (options?.locale) {
      pageOptions.locale = options.locale || this.scConfig.defaultLanguage;
    }
    if (options?.site) {
      pageOptions.site = options.site || this.scConfig.defaultSite;
    }
    return this.scClient.getPage(path, pageOptions);
  }

  // Future (names TBD):
  // resolvePersonalization(...)
  // resolveMultisite(...)
}
