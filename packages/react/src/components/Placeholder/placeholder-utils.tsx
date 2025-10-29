import React, { ComponentType } from 'react';
import { MissingComponent } from '../MissingComponent';
import { ComponentMap, DEFAULT_EXPORT_NAME, LazyComponentType, ReactModule } from '../sharedTypes';
import {
  ComponentRendering,
  RouteData,
  isDynamicPlaceholder,
  getDynamicPlaceholderPattern,
} from '@sitecore-content-sdk/core/layout';
import { constants } from '@sitecore-content-sdk/core';
import { HiddenRendering } from '../HiddenRendering';
import {
  FEaaSComponent,
  FEaaSWrapper,
  BYOCComponent,
  BYOCWrapper,
  BYOC_COMPONENT_RENDERING_NAME,
  BYOC_WRAPPER_RENDERING_NAME,
  FEAAS_COMPONENT_RENDERING_NAME,
  FEAAS_WRAPPER_RENDERING_NAME,
} from '../FEaaS';
import {
  AppComponentProps,
  BasePlaceholderProps,
  ComponentForRendering,
  PlaceholderProps,
  RenderedProps,
} from './models';

/**
 * Get the renderings for the specified placeholder from the rendering data.
 * @param {ComponentRendering | RouteData } rendering rendering data
 * @param {string} name placeholder name
 * @param {boolean} isEditing whether components should be rendered in editing mode
 * @returns {ComponentRendering[]} array of component renderings
 */
export const getPlaceholderRenderings = (
  rendering: ComponentRendering | RouteData,
  name: string,
  isEditing: boolean
) => {
  let result;
  let phName = name.slice();

  /**
   * Process (SXA) dynamic placeholders
   * Find and replace the matching dynamic placeholder e.g 'nameOfContainer-{*}' with the requested e.g. 'nameOfContainer-1'.
   * For Metadata EditMode, we need to keep the raw placeholder name in place.
   */
  if (rendering?.placeholders) {
    Object.keys(rendering.placeholders).forEach((placeholder) => {
      const patternPlaceholder = isDynamicPlaceholder(placeholder)
        ? getDynamicPlaceholderPattern(placeholder)
        : null;

      if (patternPlaceholder && patternPlaceholder.test(phName)) {
        if (isEditing) {
          phName = placeholder;
        } else {
          rendering.placeholders[phName] = rendering.placeholders[placeholder];
          delete rendering.placeholders[placeholder];
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
};

/**
 * Get SXA specific params from Sitecore rendering params
 * @param {ComponentRendering} rendering rendering object
 * @returns {object} converted SXA params
 */
export const getSXAParams = (rendering: ComponentRendering) => {
  if (!rendering.params) return {};

  const { GridParameters, Styles } = rendering.params;

  return (
    (GridParameters || Styles) && {
      styles: `${GridParameters || ''} ${Styles || ''}`,
    }
  );
};

/**
 * Renders the placeholder when it is empty. The required CSS styles are applied to the placeholder in edit mode.
 * @param {React.ReactNode | React.ReactElement[]} node react node
 * @returns react node
 */
export const renderEmptyPlaceholder = (node: React.ReactNode | React.ReactElement[]) => {
  return <div className="sc-jss-empty-placeholder">{node}</div>;
};

/**
 * Get component props to be passed to the rendered component.
 * @param {PlaceholderProps} placeholderProps current placeholder props
 * @param {ComponentRendering} componentRendering rendering to be rendered
 * @param {string} renderingKey unique key to pass over to rendering props
 * @returns {RenderedProps} props to be passed to the rendered component
 */
export const getRenderedComponentProps = (
  placeholderProps: PlaceholderProps,
  componentRendering: ComponentRendering,
  renderingKey: string
): RenderedProps => {
  // eslint-disable-next-line no-unused-vars
  const { fields, params: placeholderParams, ...passThroughProps } = placeholderProps;
  delete passThroughProps.missingComponentComponent;
  delete passThroughProps.hiddenRenderingComponent;
  delete passThroughProps.name;
  const mergedContentProps = getAppComponentProps(placeholderProps, componentRendering);

  return {
    key: renderingKey,
    ...passThroughProps,
    ...mergedContentProps,
    rendering: componentRendering,
  };
};

/**
 * Merge placeholder and component field and params content props.
 * @param {BasePlaceholderProps} placeholderProps placeholder props
 * @param {ComponentRendering} componentRendering component rendering
 * @returns {ComponentProps} merged props
 */
export function getAppComponentProps<T extends BasePlaceholderProps>(
  placeholderProps: T,
  componentRendering: ComponentRendering
): AppComponentProps {
  const fields = { ...(placeholderProps.fields || {}), ...(componentRendering.fields || {}) };
  const params = { ...(placeholderProps.params || {}), ...(componentRendering.params || {}) };
  return {
    fields,
    params: {
      ...params,
      // Provide SXA styles
      ...getSXAParams(componentRendering),
    },
    rendering: componentRendering,
  };
}

/**
 * Get component implemenation from the component map based on the rendering definition.
 * @param {ComponentRendering} renderingDefinition rendering data
 * @param {string} placeholderName name of current placeholder
 * @param {ComponentMap} componentMap component map for the current app
 * @param {React.ComponentClass} [hiddenRenderingComponent] fallback implementation in to be rendered if the rendering is hidden
 * @param {React.ComponentClass} [missingComponentComponent] fallback implementation in case no component is found in the component map
 * @returns {ContentSDKComponet | null} component implementation or null if no component map is provided
 */
export const getComponentForRendering = (
  renderingDefinition: ComponentRendering,
  placeholderName: string,
  componentMap?: ComponentMap,
  hiddenRenderingComponent?: React.ComponentClass | React.FC,
  missingComponentComponent?: React.ComponentClass | React.FC
): ComponentForRendering => {
  if (renderingDefinition.componentName === constants.HIDDEN_RENDERING_NAME) {
    return {
      component: hiddenRenderingComponent ?? HiddenRendering,
      isEmpty: true,
      componentType: 'universal',
    };
  } else if (!renderingDefinition.componentName) {
    console.error(
      `Placeholder ${placeholderName} contains unknown component ${renderingDefinition.componentName}. Ensure that a React component exists for it, and that it is registered in your component-map file.`
    );
    return {
      component: () => <></>,
      isEmpty: true,
      componentType: 'universal',
    };
  }

  let component = null;
  if (!componentMap || componentMap.size === 0) {
    console.warn(
      `No components were available in component map to service request for component ${renderingDefinition}`
    );
  } else {
    component = componentMap.get(renderingDefinition.componentName);
  }

  if (!component) {
    // Fallback/defaults for Sitecore Component renderings (in case not defined in component map)
    if (renderingDefinition.componentName === FEAAS_COMPONENT_RENDERING_NAME) {
      return {
        component: FEaaSComponent,
        isEmpty: false,
        componentType: 'universal',
      };
    } else if (renderingDefinition.componentName === FEAAS_WRAPPER_RENDERING_NAME) {
      return {
        component: FEaaSWrapper,
        isEmpty: false,
        componentType: 'universal',
      };
    } else if (renderingDefinition.componentName === BYOC_COMPONENT_RENDERING_NAME) {
      return {
        component: BYOCComponent,
        isEmpty: false,
        componentType: 'universal',
      };
    } else if (renderingDefinition.componentName === BYOC_WRAPPER_RENDERING_NAME) {
      // wrapping with error boundary could cause problems in case where parent component uses withPlaceholder HOC and tries to access its children props
      // that's why we need to mark BYOC wrapper dynamic
      return {
        component: BYOCWrapper,
        dynamic: true,
        componentType: 'universal',
        isEmpty: false,
      };
    }
    return {
      component: missingComponentComponent ?? MissingComponent,
      isEmpty: true,
      componentType: 'universal',
    };
  }

  // Render SXA Rendering Variant if available
  const exportName = renderingDefinition.params?.FieldNames;

  const renderedComponent =
    exportName && exportName !== DEFAULT_EXPORT_NAME
      ? ((component as ReactModule)[exportName] as ComponentType)
      : (component as ReactModule).default ||
        (component as ReactModule).Default ||
        (component as ComponentType);

  const dynamic =
    !!(renderedComponent as LazyComponentType).render?.preload ||
    renderingDefinition.componentName === BYOC_WRAPPER_RENDERING_NAME;

  // all dynamic elements will have a separate render prop
  return {
    component: renderedComponent,
    dynamic,
    componentType: (component as ReactModule)
      .componentType as ComponentForRendering['componentType'],
    isEmpty: false,
  };
};
