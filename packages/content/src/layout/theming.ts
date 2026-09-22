import { constants } from '@sitecore-content-sdk/core';
import { normalizeUrl } from '@sitecore-content-sdk/core/tools';
import { ThemingMode } from '../config/models';
import { HTMLLink } from '../models';

export type { ThemingMode };

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
 * @param {string} siteId Site identifier used in `/theming/<site-id>`. Source/format is pending confirmation.
 * @param {string} [sitecoreEdgeUrl] Sitecore Edge Platform URL. Defaults to the platform URL.
 * @returns {string} Theme stylesheet URL
 */
export const getThemingStylesheetUrl = (
  siteId: string,
  sitecoreEdgeUrl: string = constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT
): string => `${normalizeUrl(sitecoreEdgeUrl)}/theming/${encodeURIComponent(siteId)}`;

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
   * Site identifier for `/theming/<site-id>`.
   * Omitted until the identifier source is confirmed; no site link is emitted without it.
   */
  siteId?: string;
  /**
   * Sitecore Edge Platform URL used as the theme host.
   */
  sitecoreEdgeUrl?: string;
};

/**
 * Returns `<link>` elements for Sitecore design-token theming.
 * Independent from Design Library stylesheets (`getDesignLibraryStylesheetLinks`).
 * Emits the site-level stylesheet when mode is `site` and `siteId` is provided.
 * @param {ThemingStylesheetLinksOptions} options Theming options
 * @returns {HTMLLink[]} Theme stylesheet links
 * @public
 */
export const getThemingStylesheetLinks = ({
  mode,
  siteId,
  sitecoreEdgeUrl = constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT,
}: ThemingStylesheetLinksOptions): HTMLLink[] => {
  if (!isSiteThemingEnabled(mode) || !siteId) {
    return [];
  }

  return [
    {
      href: getThemingStylesheetUrl(siteId, sitecoreEdgeUrl),
      rel: 'stylesheet',
    },
  ];
};
