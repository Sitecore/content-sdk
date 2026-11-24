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
 * Name of the data attribute set on the `<html>` element when site-level design-token theming
 * is enabled. Generated theme CSS is scoped to this attribute (`[data-sc-theme]`) to avoid
 * overriding variables defined by the application.
 * @public
 */
export const THEMING_HTML_ATTRIBUTE_NAME = 'data-sc-theme';

/**
 * Attributes to spread onto the `<html>` element for site-level design-token theming.
 * @public
 */
export type ThemingHtmlAttributes = {
  [THEMING_HTML_ATTRIBUTE_NAME]?: string;
};

/**
 * Returns the attributes to apply to the `<html>` element so that the injected theme stylesheet
 * takes effect. Returns an empty object when site-level theming is disabled.
 * @example
 * <html lang="en" {...getThemingHtmlAttributes(scConfig.theming.mode)}>
 * @param {ThemingMode} mode Theming mode from `sitecore.config`
 * @returns {ThemingHtmlAttributes} Attributes for the `<html>` element
 * @public
 */
export const getThemingHtmlAttributes = (mode: ThemingMode): ThemingHtmlAttributes =>
  isSiteThemingEnabled(mode) ? { [THEMING_HTML_ATTRIBUTE_NAME]: '' } : {};

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
