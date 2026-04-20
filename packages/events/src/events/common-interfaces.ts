import type { NestedObject } from '@sitecore-content-sdk/analytics-core/utils';

/**
 * Event data that is sent to Sitecore Edge Proxy.
 * @public
 */
export interface EventAttributesInput {
  /**
   * The language the site visitor interacts with your brand in.
   *
   * For example, if the site visitor selects the Japanese language in your app, the language is "JA".
   *
   * Format: uppercase ISO 639.
   *
   * Default for browser-side events: inferred from the HTML lang attribute. If lang is not specified, the default is an empty string.
   *
   * Default for server-side events: empty string.
   */
  language?: string;
  /**
   * The name of the webpage where the interaction with your brand takes place.
   *
   * Default for browser-side events: for the website root page, "Home Page". For other webpages, inferred from the URL pathname.
   *
   * Default for server-side events: empty string.
   */
  page?: string;
  /**
   * The touchpoint where the user interacts with your brand.
   *
   * For example, for webpages, the channel is "WEB". For mobile app screens, the channel is "MOBILE_APP".
   *
   * Format: uppercase.
   *
   * If unset, this property will not be part of the payload.
   */
  channel?: string;
  /**
   * The alphabetic currency code of the currency the site visitor uses in your app.
   *
   * For example, if the site visitor selects Australian dollars as the currency, the currency is "AUD".
   *
   * Format: uppercase ISO 4217.
   *
   * If unset, this property will not be part of the payload.
   */
  currency?: string;
}

/**
 * Type of the extension data that the developer can pass to events.
 * @public
 */
export type ExtensionData = NestedObject;
