import {
  ComponentRendering,
  RouteData,
  isDynamicPlaceholder,
  getDynamicPlaceholderPattern,
} from '@sitecore-content-sdk/core/layout';
import { constants } from '@sitecore-content-sdk/core';

/**
 * Hidden rendering name constant
 * @internal
 */
export const HIDDEN_RENDERING_NAME = constants.HIDDEN_RENDERING_NAME;

/**
 * Get the renderings for the specified placeholder from the rendering data.
 * @param {ComponentRendering | RouteData} rendering rendering data
 * @param {string} name placeholder name
 * @param {boolean} isEditing whether components should be rendered in editing mode
 * @returns {ComponentRendering[]} array of component renderings
 */
export function getPlaceholderRenderings(
  rendering: ComponentRendering | RouteData,
  name: string,
  isEditing: boolean
): ComponentRendering[] {
  let result;
  let phName = name.slice();

  /**
   * Process (SXA) dynamic placeholders
   * Find and replace the matching dynamic placeholder e.g 'nameOfContainer-{*}' with the requested e.g. 'nameOfContainer-1'.
   * For Metadata EditMode, we need to keep the raw placeholder name in place.
   */
  if (rendering?.placeholders) {
    Object.entries(rendering.placeholders).forEach(([key, value]) => {
      const patternPlaceholder = isDynamicPlaceholder(key)
        ? getDynamicPlaceholderPattern(key)
        : null;

      if (patternPlaceholder && patternPlaceholder.test(phName)) {
        if (isEditing) {
          phName = key;
        } else {
          rendering.placeholders![phName] = value;
          delete rendering.placeholders![key];
        }
      }
    });
  }

  if (rendering && rendering.placeholders && Object.keys(rendering.placeholders).length > 0) {
    result = rendering.placeholders[phName];
  } else {
    result = null;
  }

  if (!result) {
    console.warn(
      `Placeholder '${phName}' was not found in the current rendering data`,
      JSON.stringify(rendering, null, 2)
    );

    return [];
  }

  return result;
}

/**
 * Get SXA specific params from Sitecore rendering params
 * @param {ComponentRendering} rendering rendering object
 * @returns {object} converted SXA params
 */
export function getSXAParams(rendering: ComponentRendering): { styles: string } {
  if (!rendering.params) return { styles: '' };

  const { GridParameters, Styles } = rendering.params;

  return (
    ((GridParameters || Styles) && {
      styles: `${GridParameters || ''} ${Styles || ''}`,
    }) || { styles: '' }
  );
}

/**
 * Props to be passed to rendered components
 * @public
 */
export interface ComponentProps {
  fields: { [name: string]: unknown };
  params: { [name: string]: string };
  rendering: ComponentRendering;
}

/**
 * Get component props to be passed to the rendered component.
 * Merges placeholder-level and component-level fields/params with SXA params.
 * @param {ComponentRendering} componentRendering rendering to be rendered
 * @param {Record<string, unknown>} placeholderFields fields from placeholder
 * @param {Record<string, string>} placeholderParams params from placeholder
 * @returns {ComponentProps} props to be passed to the rendered component
 */
export function getComponentProps(
  componentRendering: ComponentRendering,
  placeholderFields?: Record<string, unknown>,
  placeholderParams?: Record<string, string>
): ComponentProps {
  const fields = { ...(placeholderFields || {}), ...(componentRendering.fields || {}) };
  const params = { ...(placeholderParams || {}), ...(componentRendering.params || {}) };

  return {
    fields,
    params: {
      ...params,
      ...getSXAParams(componentRendering),
    },
    rendering: componentRendering,
  };
}
