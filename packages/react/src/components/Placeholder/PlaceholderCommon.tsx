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
import { FEaaSComponent, FEAAS_COMPONENT_RENDERING_NAME } from '../FEaaSComponent';
import { FEaaSWrapper, FEAAS_WRAPPER_RENDERING_NAME } from '../FEaaSWrapper';
import { BYOCComponent, BYOC_COMPONENT_RENDERING_NAME } from '../BYOCComponent';
import { BYOCWrapper, BYOC_WRAPPER_RENDERING_NAME } from '../BYOCWrapper';

export const getSXAParams = (rendering: ComponentRendering) => {
  if (!rendering.params) return {};

  const { GridParameters, Styles } = rendering.params;

  return (
    (GridParameters || Styles) && {
      styles: `${GridParameters || ''} ${Styles || ''}`,
    }
  );
};

export const getPlaceholderDataFromRenderingData = (
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
 * Renders the placeholder when it is empty. The required CSS styles are applied to the placeholder in edit mode.
 * @param {React.ReactNode | React.ReactElement[]} node react node
 * @returns react node
 */
export const renderEmptyPlaceholder = (node: React.ReactNode | React.ReactElement[]) => {
  return <div className="sc-jss-empty-placeholder">{node}</div>;
};

export const getComponentForRendering = (
  renderingDefinition: ComponentRendering,
  placeholderName: string,
  componentMap?: ComponentMap,
  hiddenRenderingComponent?: React.ComponentClass | React.FC,
  missingComponentComponent?: React.ComponentClass | React.FC
) => {
  if (renderingDefinition.componentName === constants.HIDDEN_RENDERING_NAME) {
    return {
      component: hiddenRenderingComponent ?? HiddenRendering,
      isEmpty: true,
    };
  } else if (!renderingDefinition.componentName) {
    console.error(
      `Placeholder ${placeholderName} contains unknown component ${renderingDefinition.componentName}. Ensure that a React component exists for it, and that it is registered in your component-map file.`
    );
    return {
      component: () => <></>,
      isEmpty: true,
    };
  }

  if (!componentMap || componentMap.size === 0) {
    console.warn(
      `No components were available in component map to service request for component ${renderingDefinition}`
    );
    return null;
  }

  // Render SXA Rendering Variant if available
  const exportName = renderingDefinition.params?.FieldNames;

  let component = componentMap.get(renderingDefinition.componentName);

  if (!component) {
    // Fallback/defaults for Sitecore Component renderings (in case not defined in component map)
    if (renderingDefinition.componentName === FEAAS_COMPONENT_RENDERING_NAME) {
      return {
        component: FEaaSComponent,
      };
    } else if (renderingDefinition.componentName === FEAAS_WRAPPER_RENDERING_NAME) {
      return {
        component: FEaaSWrapper,
      };
    } else if (renderingDefinition.componentName === BYOC_COMPONENT_RENDERING_NAME) {
      return {
        component: BYOCComponent,
      };
    } else if (renderingDefinition.componentName === BYOC_WRAPPER_RENDERING_NAME) {
      // wrapping with error boundary could cause problems in case where parent component uses withPlaceholder HOC and tries to access its children props
      // that's why we need to mark BYOC wrapper dynamic
      return {
        component: BYOCWrapper,
        dynamic: true,
      };
    }
    return {
      component: missingComponentComponent ?? MissingComponent,
      isEmpty: true,
    };
  }

  const renderedComponent =
    exportName && exportName !== DEFAULT_EXPORT_NAME
      ? ((component as ReactModule)[exportName] as ComponentType)
      : (component as ReactModule).default ||
        (component as ReactModule).Default ||
        (component as ComponentType);

  // all dynamic elements will have a separate render prop
  return {
    component: renderedComponent,
    dynamic: !!(renderedComponent as LazyComponentType).render?.preload,
    isClient: !!(component as ReactModule).isClient,
  };
};
