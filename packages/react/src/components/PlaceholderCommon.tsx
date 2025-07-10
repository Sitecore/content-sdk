import React, { ComponentType } from 'react';
import { MissingComponent } from './MissingComponent';
import {
  DEFAULT_EXPORT_NAME,
  ComponentMap,
  LazyComponentType,
  ReactModule,
  ReactJssComponent,
} from './sharedTypes';
import {
  ComponentRendering,
  RouteData,
  Field,
  Item,
  isDynamicPlaceholder,
  getDynamicPlaceholderPattern,
} from '@sitecore-content-sdk/core/layout';
import { constants } from '@sitecore-content-sdk/core';
import { HiddenRendering } from './HiddenRendering';
import { FEaaSComponent, FEAAS_COMPONENT_RENDERING_NAME } from './FEaaSComponent';
import { FEaaSWrapper, FEAAS_WRAPPER_RENDERING_NAME } from './FEaaSWrapper';
import { BYOCComponent, BYOC_COMPONENT_RENDERING_NAME } from './BYOCComponent';
import { BYOCWrapper, BYOC_WRAPPER_RENDERING_NAME } from './BYOCWrapper';
import { SitecoreProviderPageContext } from './SitecoreProvider';
import { PlaceholderMetadata } from './PlaceholderMetadata';
import ErrorBoundary from './ErrorBoundary';

/**
 *
 * @param {ComponentRendering} rendering
 */
export function getSXAParams(rendering: ComponentRendering) {
  if (!rendering.params) return {};

  const { GridParameters, Styles } = rendering.params;

  return (
    (GridParameters || Styles) && {
      styles: `${GridParameters || ''} ${Styles || ''}`,
    }
  );
}

/**
 *
 * @param {ComponentRendering} rendering
 * @param {string} name
 * @param {boolean} isEditing
 * @returns {PlaceholderData | null} placeholder data
 */
export function getPlaceholderDataFromRenderingData(
  rendering: ComponentRendering | RouteData,
  name: string,
  isEditing: boolean
) {
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
}

/**
 * @param {ComponentRendering} renderingDefinition
 * @param {ReactJssComponent} component
 */
function extractComponentExport(
  renderingDefinition: ComponentRendering,
  component: ReactJssComponent | null
): ComponentType | null {
  if (!component) return null;
  // Render SXA Rendering Variant if available
  const exportName = renderingDefinition.params?.FieldNames;

  if (exportName && exportName !== DEFAULT_EXPORT_NAME) {
    return (component as ReactModule)[exportName] as ComponentType;
  }

  return (
    (component as ReactModule).default ||
    (component as ReactModule).Default ||
    (component as ComponentType)
  );
}

/**
 * Resolves the appropriate React component for a given component rendering.
 * @param {ComponentRendering} componentRendering - The component rendering data
 * @param {ComponentMap} componentMap - Map of component names to React components
 * @param {ComponentType} hiddenRenderingComponent - Optional component for hidden renderings
 * @param {ComponentType} missingComponentComponent - Optional component for missing components
 * @returns {object} Object containing the resolved component and isEmpty flag
 */
export function resolveComponent(
  componentRendering: ComponentRendering,
  componentMap: ComponentMap,
  hiddenRenderingComponent?: ComponentType,
  missingComponentComponent?: ComponentType
) {
  let isEmpty = false;

  if (!componentMap || componentMap.size === 0) {
    console.warn(
      `No components were available in component map to service request for component ${componentRendering}`
    );
    return null;
  }
  const componentEntry = componentMap.get(componentRendering.componentName);
  let component;

  if (componentRendering.componentName === constants.HIDDEN_RENDERING_NAME) {
    component = hiddenRenderingComponent ?? HiddenRendering;
    isEmpty = true;
  } else if (!componentRendering.componentName) {
    component = () => <></>;
    isEmpty = true;
  } else {
    component = extractComponentExport(componentRendering, componentEntry);
  }

  // Fallback/defaults for Sitecore Component renderings (in case not defined in component map)
  if (!component) {
    if (componentRendering.componentName === FEAAS_COMPONENT_RENDERING_NAME) {
      component = FEaaSComponent;
    } else if (componentRendering.componentName === FEAAS_WRAPPER_RENDERING_NAME) {
      component = FEaaSWrapper;
    } else if (componentRendering.componentName === BYOC_COMPONENT_RENDERING_NAME) {
      component = BYOCComponent;
    } else if (componentRendering.componentName === BYOC_WRAPPER_RENDERING_NAME) {
      component = BYOCWrapper;
    }
  }

  if (!component) {
    console.error(
      `Placeholder ${name} contains unknown component ${componentRendering.componentName}. Ensure that a React component exists for it, and that it is registered in your component-map file.`
    );

    component = missingComponentComponent ?? MissingComponent;
    isEmpty = true;
  }
  return {
    component,
    isEmpty,
    isRsc: componentEntry?.isRsc,
  };
}

function mergeProps(
  componentRendering: ComponentRendering,
  key: string,
  placeholderProps: PaththroughPlaceholderProps = {}
) {
  const { fields, params, ...rest } = placeholderProps;
  const finalProps = {
    key,
    ...rest,
    ...((fields || componentRendering.fields) && {
      fields: { ...fields, ...componentRendering.fields },
    }),
    ...((params || componentRendering.params) && {
      params: {
        ...params,
        ...componentRendering.params,
        // Provide SXA styles
        ...getSXAParams(componentRendering),
      },
    }),
    rendering: componentRendering,
  };

  return finalProps;
}

type ErrorComponentProps = {
  [prop: string]: unknown;
};

/** Provided for the component which represents rendering data */
export type ComponentProps = {
  [key: string]: unknown;
  rendering: ComponentRendering;
};

export interface PaththroughPlaceholderProps {
  [key: string]: unknown;

  /**
   * An object of field names/values that are aggregated and propagated through the component tree created by a placeholder.
   * Any component or placeholder rendered by a placeholder will have access to this data via `props.fields`.
   */
  fields?: {
    [name: string]: Field | Item | Item[];
  };

  /**
   * An object of rendering parameter names/values that are aggregated and propagated through the component tree created by a placeholder.
   * Any component or placeholder rendered by a placeholder will have access to this data via `props.params`.
   */
  params?: {
    [name: string]: string;
  };
}

export interface PlaceholderProps {
  /** Name of the placeholder to render. */
  name: string;
  /** Rendering data to be used when rendering the placeholder. */
  rendering: ComponentRendering | RouteData;
  /**
   * Component Map will be used to map Sitecore component names to app implementation
   * When rendered within a <SitecoreProvider> component, defaults to the context componentMap.
   */
  componentMap?: ComponentMap;

  /**
   * Modify final props of component (before render) provided by rendering data.
   * Can be used in case when you need to insert additional data into the component.
   * @param {ComponentProps} componentProps component props to be modified
   * @returns {ComponentProps} modified or initial props
   */
  modifyComponentProps?: (componentProps: ComponentProps) => ComponentProps;
  /**
   * A component that is rendered in place of any components that are in this placeholder,
   * but do not have a definition in the componentMap (i.e. don't have a React implementation)
   */
  missingComponentComponent?: React.ComponentClass<unknown> | React.FC<unknown>;

  /**
   * A component that is rendered in place of any components that are hidden
   */
  hiddenRenderingComponent?: React.ComponentClass<unknown> | React.FC<unknown>;

  /**
   * A component that is rendered in place of the placeholder when an error occurs rendering
   * the placeholder
   */
  errorComponent?: React.ComponentClass<ErrorComponentProps> | React.FC<ErrorComponentProps>;
  /**
   * Page context data.
   * This data is passed by the SitecoreProvider.
   */
  pageContext: SitecoreProviderPageContext;
  /**
   * The message that gets displayed while component is loading
   */
  componentLoadingMessage?: string;
}

export function getComponentsForRenderingData(
  componentRenderings: ComponentRendering[],
  placeholderProps: PlaceholderProps,
  paththroughProps: PaththroughPlaceholderProps
) {
  const { missingComponentComponent, hiddenRenderingComponent } = placeholderProps;

  const transformedComponents = componentRenderings
    .map((rendering: ComponentRendering, index: number) => {
      const componentRendering = rendering as ComponentRendering;

      const { component, isEmpty } = resolveComponent(
        componentRendering,
        placeholderProps.componentMap,
        hiddenRenderingComponent,
        missingComponentComponent
      );

      const rendered = (
        <CompWrapper
          component={component as React.ComponentType}
          isEmpty={isEmpty}
          isEditing={placeholderProps.pageContext?.pageEditing}
          componentRendering={componentRendering}
          paththroughProps={paththroughProps}
          index={index}
          modifyComponentProps={placeholderProps.modifyComponentProps}
          errorComponent={placeholderProps.errorComponent}
          componentLoadingMessage={placeholderProps.componentLoadingMessage}
        />
      );

      return rendered;
    })
    .filter((element) => element); // remove nulls
  return transformedComponents;
}

export const CompWrapper = ({
  component,
  isEmpty,
  isEditing,
  skipErrorBoundary,
  componentRendering,
  paththroughProps,
  index,
  modifyComponentProps,
  errorComponent,
  componentLoadingMessage,
}: {
  component: React.ComponentType;
  isEmpty: boolean;
  isEditing: boolean;
  skipErrorBoundary?: boolean;
  componentRendering: ComponentRendering;
  paththroughProps: PaththroughPlaceholderProps;
  index: number;
  modifyComponentProps?: (componentProps: ComponentProps) => ComponentProps;
  errorComponent?: React.ComponentClass<ErrorComponentProps> | React.FC<ErrorComponentProps>;
  componentLoadingMessage?: string;
}) => {
  const key = (componentRendering as ComponentRendering).uid
    ? (componentRendering as ComponentRendering).uid
    : `component-${index}`;
  const finalProps = mergeProps(componentRendering, key, paththroughProps);
  const finalFinalProps = modifyComponentProps ? modifyComponentProps(finalProps) : finalProps;

  let rendered = React.createElement<{ [attr: string]: unknown }>(
    component as React.ComponentType,
    finalFinalProps
  );

  if (!isEmpty && !skipErrorBoundary) {
    rendered = (
      <ErrorBoundary
        key={rendered.type + '-' + key}
        errorComponent={errorComponent}
        componentLoadingMessage={componentLoadingMessage}
        isDynamic={(component as LazyComponentType).render?.preload ? true : false}
        {...rendered.props}
      >
        {rendered}
      </ErrorBoundary>
    );
  }

  // if in edit mode then emit shallow chromes for hydration in Pages
  if (isEditing) {
    return (
      <PlaceholderMetadata key={key} rendering={componentRendering}>
        {rendered}
      </PlaceholderMetadata>
    );
  }

  return rendered;
};
