import { Type } from '@angular/core';
import {
  ComponentRendering,
  RouteData,
  isDynamicPlaceholder,
  getDynamicPlaceholderPattern,
} from '@sitecore-content-sdk/content/layout';
import { HIDDEN_RENDERING_NAME } from '@sitecore-content-sdk/content';
import { DEFAULT_PLACEHOLDER_UID } from '@sitecore-content-sdk/content/editing';
import { AngularContentSdkComponent, ComponentMap, DEFAULT_EXPORT_NAME } from '../types';

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
 * Includes dynamic placeholder handling
 * @param {ComponentRendering | RouteData} rendering - rendering data
 * @param {string} name - placeholder name
 * @param {boolean} isEditing - whether editing mode is active
 * @returns {ComponentRendering[]} Child renderings for the placeholder.
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
 * Extra inputs to set on each dynamically rendered component (in addition to `fields`, `params`, and `rendering`).
 * Keys are Angular `input()` names on the host component.
 * @public
 */
export type PassThroughProps = Readonly<Record<string, unknown>>;

/**
 * Get SXA specific params from Sitecore rendering params.
 * @param {ComponentRendering} rendering - Rendering object.
 * @returns {{ Styles: string } | undefined} Converted SXA params, or `undefined` when none apply.
 */
export const getSXAParams = (rendering: ComponentRendering) => {
  if (!rendering.params) return { Styles: '' };

  const { GridParameters, Styles } = rendering.params;

  if (GridParameters || Styles) {
    return { Styles: `${GridParameters || ''} ${Styles || ''}` };
  }

  return undefined;
};

/**
 * Merge placeholder-level fields/params with per-component fields/params.
 * @param {{ [key: string]: unknown } | undefined} placeholderFields - Placeholder-level fields.
 * @param {{ [key: string]: string } | undefined} placeholderParams - Placeholder-level params.
 * @param {ComponentRendering} componentRendering - The component rendering data.
 * @returns {ChildComponentProps} Merged child component props.
 */
export function getChildComponentProps(
  placeholderFields: { [key: string]: unknown } | undefined,
  placeholderParams: { [key: string]: string } | undefined,
  componentRendering: ComponentRendering
): ChildComponentProps {
  const fields = { ...(placeholderFields || {}), ...(componentRendering.fields || {}) };
  const params = { ...(placeholderParams || {}), ...(componentRendering.params || {}) };
  const sxa = getSXAParams(componentRendering);
  return {
    fields,
    params: {
      ...params,
      ...(sxa || {}),
    },
    rendering: componentRendering,
  };
}

/**
 * Resolve a component type for a rendering definition.
 * Handles hidden renderings, missing components, variant selection, and map lookup.
 * FEaaS/BYOC are intentionally not handled; they fall through to missingComponent.
 * @param {object} args - The arguments object.
 * @param {ComponentRendering} args.renderingDefinition - The rendering to resolve.
 * @param {string} args.placeholderName - Current placeholder name (for logging).
 * @param {ComponentMap} args.componentMap - The app component map.
 * @param {object} args.hiddenRenderingComponent - Optional override for hidden renderings.
 * @param {object} args.missingComponentComponent - Optional override for missing/unknown components.
 * @returns {ComponentForRendering} Resolved component info.
 */
export const resolveComponentForRendering = ({
  renderingDefinition,
  placeholderName,
  componentMap,
  hiddenRenderingComponent,
  missingComponentComponent,
}: {
  renderingDefinition: ComponentRendering;
  placeholderName: string;
  componentMap: ComponentMap;
  hiddenRenderingComponent?: Type<unknown>;
  missingComponentComponent?: Type<unknown>;
}): ComponentForRendering => {
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

  let entry: Type<unknown> | AngularContentSdkComponent | undefined;
  const hasComponentMap = !!(componentMap && componentMap.size > 0);
  if (!hasComponentMap) {
    console.warn(
      `No components were available in component map to service request for component ${renderingDefinition.componentName}`
    );
  } else {
    entry = componentMap.get(renderingDefinition.componentName);
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

/**
 * Compute the placeholder chrome `id` attribute
 * lookup: matches a static placeholder name when present in the parent rendering, else
 * resolves a dynamic-placeholder pattern, else falls back to
 * `<placeholderName>_<DEFAULT_PLACEHOLDER_UID>`.
 * @param {ComponentRendering} rendering - The parent rendering object.
 * @param {string} placeholderName - Current placeholder name.
 * @param {string} [renderingUid] - Optional rendering uid to append (parent rendering uid for
 * the outer placeholder marker, omitted for the root route).
 * @returns {string} Computed placeholder chrome id.
 * @internal
 */
export function computePlaceholderChromeId(
  rendering: ComponentRendering,
  placeholderName: string,
  renderingUid?: string
): string {
  const placeholders = rendering.placeholders ?? {};
  for (const placeholder of Object.keys(placeholders)) {
    if (placeholderName === placeholder) {
      return renderingUid
        ? `${placeholderName}_${renderingUid}`
        : `${placeholderName}_${DEFAULT_PLACEHOLDER_UID}`;
    }
    if (isDynamicPlaceholder(placeholder)) {
      const pattern = getDynamicPlaceholderPattern(placeholder);
      if (pattern.test(placeholderName)) {
        return renderingUid
          ? `${placeholder}_${renderingUid}`
          : `${placeholder}_${DEFAULT_PLACEHOLDER_UID}`;
      }
    }
  }
  return '';
}
