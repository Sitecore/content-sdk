import { constants } from '@sitecore-content-sdk/core';
import { normalizeUrl } from '@sitecore-content-sdk/core/tools';
import { ThemingMode } from '../config/models';
import { HTMLLink } from '../models';

export type { ThemingMode };

/**
 * Channel segment for the site theme delivery stylesheet.
 * @public
 */
export const THEMING_DELIVERY_CHANNEL = 'web-css';

/**
 * Returns whether site-level design-token theming is enabled.
 * @param {ThemingMode} mode Theming mode from `sitecore.config`
 * @returns {boolean} Whether site-level theming is enabled
 * @public
 */
export const isSiteThemingEnabled = (mode: ThemingMode): boolean => mode === 'site';

/**
 * CSS class applied to `<body>` when site-level design-token theming is enabled.
 * @public
 */
export const THEMING_BODY_CLASS_NAME = 'sc-ds-theme';

/**
 * Builds the design-token theme stylesheet URL for a site.
 * `{edge}/authoring/api/v1/themes/delivery/{siteName}/web-css?contextID={clientContextId}`
 * @param {string} siteName Site name from the layout response
 * @param {string} clientContextId Client Edge context ID
 * @param {string} [sitecoreEdgeUrl] Sitecore Edge Platform URL. Defaults to the platform URL.
 * @returns {string} Theme stylesheet URL
 */
export const getThemingStylesheetUrl = (
  siteName: string,
  clientContextId: string,
  sitecoreEdgeUrl: string = constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT
): string =>
  `${normalizeUrl(sitecoreEdgeUrl)}/authoring/api/v1/themes/delivery/${encodeURIComponent(
    siteName
  )}/${THEMING_DELIVERY_CHANNEL}?contextID=${encodeURIComponent(clientContextId)}`;

/**
 * Options for {@link getThemingStylesheetLinks}.
 * @public
 */
export type ThemingStylesheetLinksOptions = {
  /**
   * Theming mode from `sitecore.config` `theming.mode`.
   */
  mode: ThemingMode;
  /**
   * Site name from the layout response (`context.site.name`).
   * No site link is emitted without it.
   */
  siteName?: string;
  /**
   * Client Edge context ID used as `contextID` on the theme URL.
   * No site link is emitted without it.
   */
  clientContextId?: string;
  /**
   * Sitecore Edge Platform URL used as the theme host.
   */
  sitecoreEdgeUrl?: string;
};

/**
 * Returns `<link>` elements for Sitecore design-token theming.
 * Independent from Design Library stylesheets (`getDesignLibraryStylesheetLinks`).
 * Emits the site-level stylesheet when mode is `site` and `siteName` plus `clientContextId` are provided.
 * @param {ThemingStylesheetLinksOptions} options Theming options
 * @returns {HTMLLink[]} Theme stylesheet links
 * @public
 */
export const getThemingStylesheetLinks = ({
  mode,
  siteName,
  clientContextId,
  sitecoreEdgeUrl = constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT,
}: ThemingStylesheetLinksOptions): HTMLLink[] => {
  if (!isSiteThemingEnabled(mode) || !siteName || !clientContextId) {
    return [];
  }

  return [
    {
      href: getThemingStylesheetUrl(siteName, clientContextId, sitecoreEdgeUrl),
      rel: 'stylesheet',
    },
  ];
};
