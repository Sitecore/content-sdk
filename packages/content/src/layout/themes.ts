import { constants } from '@sitecore-content-sdk/core';
import { normalizeUrl } from '@sitecore-content-sdk/core/tools';
import { ComponentRendering, LayoutServiceData, RouteData, getFieldValue } from '.';
import { HTMLLink } from '../models';

/**
 * Pattern for library ids
 * @example -library--foo
 */
const STYLES_LIBRARY_ID_REGEX = /-library--([^\s]+)/;

/**
 * Walks through rendering tree and returns list of links of all FEAAS, BYOC or SXA Design Library Stylesheets that are used
 * @param {LayoutServiceData} layoutData Layout service data
 * @param {string} sitecoreEdgeContextId Sitecore Edge Context ID
 * @param {string} [sitecoreEdgeUrl] Sitecore Edge Platform URL (resolved at config level). Defaults to platform URL.
 * @returns {HTMLLink[]} library stylesheet links
 * @public
 */
export function getDesignLibraryStylesheetLinks(
  layoutData: LayoutServiceData,
  sitecoreEdgeContextId: string,
  sitecoreEdgeUrl: string = constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT
): HTMLLink[] {
  const ids = new Set<string>();

  if (!layoutData.sitecore.route) return [];

  traverseComponent(layoutData.sitecore.route, ids);

  return [...ids].map((id) => ({
    href: getStylesheetUrl(id, sitecoreEdgeContextId, sitecoreEdgeUrl),
    rel: 'stylesheet',
  }));
}

export const getStylesheetUrl = (
  id: string,
  sitecoreEdgeContextId: string,
  sitecoreEdgeUrl: string = constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT
) =>
  `${normalizeUrl(sitecoreEdgeUrl)}/v1/files/components/styles/${id}.css?sitecoreContextId=${sitecoreEdgeContextId}`;

/**
 * Traverse placeholder and components to add library ids
 * @param {ComponentRendering[]} components
 * @param {Set<string>} ids library ids
 */
const traversePlaceholder = (components: ComponentRendering[], ids: Set<string>) => {
  components.map((component) => {
    return traverseComponent(component, ids);
  });
};

/**
 * Returns the value if it is a string, otherwise undefined.
 * @param {unknown} value value to check
 * @returns {string | undefined} the string value, or undefined
 */
const asString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

/**
 * Traverse component and children to add library ids
 * @param {RouteData | ComponentRendering | HtmlElementRendering} component component data
 * @param {Set<string>} ids library ids
 */
const traverseComponent = (component: RouteData | ComponentRendering, ids: Set<string>) => {
  let libraryId: string | undefined = undefined;
  if ('params' in component && component.params) {
    const cssStylesParam = asString(component.params.CSSStyles);
    const stylesParam = asString(component.params.Styles);
    const libraryIdParam = asString(component.params.LibraryId);
    // LibraryID in css class name takes precedence over LibraryId attribute
    libraryId =
      cssStylesParam?.match(STYLES_LIBRARY_ID_REGEX)?.[1] ||
      stylesParam?.match(STYLES_LIBRARY_ID_REGEX)?.[1] ||
      libraryIdParam ||
      undefined;
  }
  // if params are empty we try to fall back to data source
  if (!libraryId && 'fields' in component && component.fields) {
    const cssStylesField = asString(getFieldValue(component.fields, 'CSSStyles', ''));
    const stylesField = asString(getFieldValue(component.fields, 'Styles', ''));
    const libraryIdField = asString(getFieldValue(component.fields, 'LibraryId', ''));
    libraryId =
      cssStylesField?.match(STYLES_LIBRARY_ID_REGEX)?.[1] ||
      stylesField?.match(STYLES_LIBRARY_ID_REGEX)?.[1] ||
      libraryIdField ||
      undefined;
  }

  if (libraryId) {
    ids.add(libraryId);
  }

  const placeholders = (component as ComponentRendering).placeholders || {};

  Object.keys(placeholders).forEach((placeholder) => {
    traversePlaceholder(placeholders[placeholder], ids);
  });
};
