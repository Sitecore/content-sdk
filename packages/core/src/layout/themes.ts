import { ComponentRendering, LayoutServiceData, RouteData, getFieldValue } from '.';
import { HTMLLink } from '../models';
import { SITECORE_EDGE_URL_DEFAULT } from '../constants';
import { normalizeUrl } from '../utils/normalize-url';

/**
 * Pattern for library ids
 * @example -library--foo
 */
const STYLES_LIBRARY_ID_REGEX = /-library--([^\s]+)/;

/**
 * Walks through rendering tree and returns list of links of all FEAAS, BYOC or SXA Design Library Stylesheets that are used
 * @param {LayoutServiceData} layoutData Layout service data
 * @param {string} sitecoreEdgeContextId Sitecore Edge Context ID
 * @param {string} [sitecoreEdgeUrl] Sitecore Edge Platform URL. Default is https://edge-platform.sitecorecloud.io
 * @returns {HTMLLink[]} library stylesheet links
 */
export function getDesignLibraryStylesheetLinks(
  layoutData: LayoutServiceData,
  sitecoreEdgeContextId: string,
  sitecoreEdgeUrl = SITECORE_EDGE_URL_DEFAULT
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
  sitecoreEdgeUrl = SITECORE_EDGE_URL_DEFAULT
) => {
  return `${normalizeUrl(
    sitecoreEdgeUrl
  )}/v1/files/components/styles/${id}.css?sitecoreContextId=${sitecoreEdgeContextId}`;
};

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
 * Traverse component and children to add library ids
 * @param {RouteData | ComponentRendering | HtmlElementRendering} component component data
 * @param {Set<string>} ids library ids
 */
const traverseComponent = (component: RouteData | ComponentRendering, ids: Set<string>) => {
  let libraryId: string | undefined = undefined;
  if ('params' in component && component.params) {
    // LibraryID in css class name takes precedence over LibraryId attribute
    libraryId =
      component.params.CSSStyles?.match(STYLES_LIBRARY_ID_REGEX)?.[1] ||
      component.params.Styles?.match(STYLES_LIBRARY_ID_REGEX)?.[1] ||
      component.params.LibraryId ||
      undefined;
  }
  // if params are empty we try to fall back to data source
  if (!libraryId && 'fields' in component && component.fields) {
    libraryId =
      getFieldValue(component.fields, 'CSSStyles', '').match(STYLES_LIBRARY_ID_REGEX)?.[1] ||
      getFieldValue(component.fields, 'Styles', '').match(STYLES_LIBRARY_ID_REGEX)?.[1] ||
      getFieldValue(component.fields, 'LibraryId', '') ||
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
