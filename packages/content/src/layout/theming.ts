import { constants } from '@sitecore-content-sdk/core';
import { normalizeUrl } from '@sitecore-content-sdk/core/tools';
import { ThemingMode } from '../config/models';
import { HTMLLink } from '../models';

export type { ThemingMode };

/**
 * Canonical environment variable that controls design-token theming depth.
 * Values: `none`/`0` (off), `site`/`1` (site stylesheet), `page`/`2` (reserved; treated as site).
 * Next.js apps should also set `NEXT_PUBLIC_CSDK_FEATURE_THEMING` so client-rendered head links
 * can read the same value.
 * @public
 */
export const CSDK_FEATURE_THEMING_ENV = 'CSDK_FEATURE_THEMING';

/**
 * Next.js public alias for {@link CSDK_FEATURE_THEMING_ENV}.
 * @public
 */
export const NEXT_PUBLIC_CSDK_FEATURE_THEMING_ENV = 'NEXT_PUBLIC_CSDK_FEATURE_THEMING';

/**
 * Parses a theming environment/config value into a {@link ThemingMode}.
 * Unknown or empty values resolve to `none`.
 * @param {string} [value] Raw environment or config value
 * @returns {ThemingMode} Normalized theming mode
 * @public
 */
export const parseThemingMode = (value?: string): ThemingMode => {
  if (!value) {
    return 'none';
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === 'site' || normalized === '1') {
    return 'site';
  }

  if (normalized === 'page' || normalized === '2') {
    return 'page';
  }

  return 'none';
};

/**
 * Resolves theming mode from an env-like record.
 * Preference: `CSDK_FEATURE_THEMING`, then `NEXT_PUBLIC_CSDK_FEATURE_THEMING`, then `FEATURE_THEMING`.
 * @param {Record<string, string | undefined>} [env] Env map; defaults to `process.env`
 * @returns {ThemingMode} Normalized theming mode
 * @public
 */
export const resolveThemingModeFromEnv = (
  env: { [key: string]: string | undefined } = process.env
): ThemingMode =>
  parseThemingMode(
    env[CSDK_FEATURE_THEMING_ENV] || env[NEXT_PUBLIC_CSDK_FEATURE_THEMING_ENV] || env.FEATURE_THEMING
  );

/**
 * Returns whether site-level design-token theming should emit a stylesheet link.
 * `page` is treated as site-level until page theming is implemented.
 * @param {ThemingMode} mode Theming mode
 * @returns {boolean} Whether the site theme stylesheet should be included
 */
const isSiteThemingEnabled = (mode: ThemingMode): boolean => mode === 'site' || mode === 'page';

/**
 * CSS class applied to `<body>` when site-level design-token theming is enabled.
 * @public
 */
export const THEMING_BODY_CLASS_NAME = 'sc-ds-theme';

/**
 * Returns the body class name for site-level design-token theming, or `undefined` when theming is off.
 * `page` is treated as site-level until page theming is implemented.
 * @param {ThemingMode} mode Theming mode
 * @returns {string | undefined} Body class name when site theming is enabled
 * @public
 */
export const getThemingBodyClassName = (mode: ThemingMode): string | undefined =>
  isSiteThemingEnabled(mode) ? THEMING_BODY_CLASS_NAME : undefined;

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
   * Theming depth from config / `CSDK_FEATURE_THEMING`.
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
 * Phase 1 emits only the site-level stylesheet when mode is `site` or `page` and `siteId` is provided.
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
