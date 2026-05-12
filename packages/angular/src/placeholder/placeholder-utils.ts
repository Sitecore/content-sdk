import { Type } from '@angular/core';
import {
  ComponentRendering,
  RouteData,
  isDynamicPlaceholder,
  getDynamicPlaceholderPattern,
} from '@sitecore-content-sdk/content/layout';
import { HIDDEN_RENDERING_NAME } from '@sitecore-content-sdk/content';
import {
  AngularCsdkComponent,
  ComponentMap,
  DEFAULT_EXPORT_NAME,
} from '../components/types';

/**
 * Result of resolving a component for a rendering definition.
 */
export interface ComponentForRendering {
  component: Type<unknown> | null;
  isEmpty: boolean;
}

/**
 * Merged props passed to each child component rendered by a placeholder.
 */
export interface ChildComponentProps {
  fields: { [key: string]: unknown };
  params: { [key: string]: string };
  rendering: ComponentRendering;
}

/**
 * Get the renderings for the specified placeholder from the rendering layout data.
 * Includes dynamic placeholder handling aligned with React's implementation.
 * @param {ComponentRendering | RouteData} rendering - rendering data
 * @param {string} name - placeholder name
 * @param {boolean} isEditing - whether editing mode is active
 * @returns array of component renderings
 */
export const getPlaceholderRenderings = (
  rendering: ComponentRendering | RouteData,
  name: string,
  isEditing: boolean
): ComponentRendering[] => {
  let phName = name.slice();
  let placeholdersForRead: Record<string, ComponentRendering[]> | undefined;

  if (rendering?.placeholders) {
    if (isEditing) {
      Object.keys(rendering.placeholders).forEach((key) => {
        const patternPlaceholder = isDynamicPlaceholder(key)
          ? getDynamicPlaceholderPattern(key)
          : null;

        if (patternPlaceholder && patternPlaceholder.test(phName)) {
          phName = key;
        }
      });
      placeholdersForRead = rendering.placeholders;
    } else {
      placeholdersForRead = { ...rendering.placeholders };
      Object.entries(rendering.placeholders).forEach(([key, value]) => {
        const patternPlaceholder = isDynamicPlaceholder(key)
          ? getDynamicPlaceholderPattern(key)
          : null;

        if (patternPlaceholder && patternPlaceholder.test(phName)) {
          placeholdersForRead![phName] = value;
          delete placeholdersForRead![key];
        }
      });
    }
  }

  let result: ComponentRendering[] | null = null;
  if (rendering && placeholdersForRead && Object.keys(placeholdersForRead).length > 0) {
    result = placeholdersForRead[phName] ?? null;
  }

  if (!result) {
    console.warn(
      `Placeholder '${phName}' was not found in the current rendering data`,
      JSON.stringify(rendering, null, 2)
    );
    return [];
  }

  return result;
};

/**
 * Extra inputs to set on each dynamically rendered component (in addition to `fields`, `params`, `rendering`).
 * Keys are Angular `input()` names on the host component.
 * @public
 */
export type PassThroughProps = Readonly<Record<string, unknown>>;

/**
 * Get SXA specific params from Sitecore rendering params.
 * @param {ComponentRendering} rendering - rendering object
 * @returns converted SXA params
 */
export const getSXAParams = (rendering: ComponentRendering): { styles: string } | undefined => {
  if (!rendering.params) return { styles: '' };

  const { GridParameters, Styles } = rendering.params;

  if (GridParameters || Styles) {
    return { styles: `${GridParameters || ''} ${Styles || ''}` };
  }

  return undefined;
};

/**
 * Merge placeholder-level fields/params with per-component fields/params.
 * @param {{ [key: string]: unknown } | undefined} placeholderFields - placeholder-level fields
 * @param {{ [key: string]: string } | undefined} placeholderParams - placeholder-level params
 * @param {ComponentRendering} componentRendering - the component rendering data
 * @returns merged child component props
 */
export function getChildComponentProps(
  placeholderFields: { [key: string]: unknown } | undefined,
  placeholderParams: { [key: string]: string } | undefined,
  componentRendering: ComponentRendering
): ChildComponentProps {
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

/**
 * Resolve a component type for a rendering definition.
 * Handles hidden renderings, missing components, variant selection, and map lookup.
 * FEaaS/BYOC are intentionally not handled; they fall through to missingComponent.
 * @param {ComponentRendering} renderingDefinition - the rendering to resolve
 * @param {string} placeholderName - current placeholder name (for logging)
 * @param {ComponentMap | undefined} componentMap - the app component map
 * @param {Type<unknown> | undefined} hiddenRenderingComponent - optional override for hidden renderings
 * @param {Type<unknown> | undefined} missingComponentComponent - optional override for missing/unknown components
 * @returns resolved component info
 */
export const resolveComponentForRendering = (
  renderingDefinition: ComponentRendering,
  placeholderName: string,
  componentMap?: ComponentMap,
  hiddenRenderingComponent?: Type<unknown>,
  missingComponentComponent?: Type<unknown>
): ComponentForRendering => {
  if (renderingDefinition.componentName === HIDDEN_RENDERING_NAME) {
    return {
      component: hiddenRenderingComponent ?? null,
      isEmpty: true,
    };
  }

  if (!renderingDefinition.componentName) {
    return {
      component: null,
      isEmpty: true,
    };
  }

  let entry: Type<unknown> | AngularCsdkComponent | undefined;
  const hasComponentMap = !!(componentMap && componentMap.size > 0);
  if (!hasComponentMap) {
    console.warn(
      `No components were available in component map to service request for component ${renderingDefinition.componentName}`
    );
  } else {
    entry = componentMap!.get(renderingDefinition.componentName);
  }

  if (!entry) {
    console.error(
      `Placeholder ${placeholderName} contains unknown component ${renderingDefinition.componentName}. Ensure that an Angular component exists for it, and that it is registered in your component map.`
    );
    return {
      component: missingComponentComponent ?? null,
      isEmpty: true,
    };
  }

  // If entry is a direct component class (function / class constructor), return it
  if (typeof entry === 'function') {
    return { component: entry, isEmpty: false };
  }

  // AngularCsdkComponent (SXA variants): pick export by FieldNames
  const exportName = renderingDefinition.params?.FieldNames;
  const resolved =
    exportName && exportName !== DEFAULT_EXPORT_NAME
      ? (entry[exportName] as Type<unknown> | undefined)
      : entry.default || entry.Default;

  if (!resolved || typeof resolved !== 'function') {
    const variantLabel = exportName && exportName !== DEFAULT_EXPORT_NAME ? ` (${exportName})` : '';
    console.error(
      `Placeholder ${placeholderName} contains unknown component ${renderingDefinition.componentName}${variantLabel}. Ensure that an Angular component exists for it, and that it is registered in your component map.`
    );
    return {
      component: missingComponentComponent ?? null,
      isEmpty: true,
    };
  }

  return { component: resolved, isEmpty: false };
};
