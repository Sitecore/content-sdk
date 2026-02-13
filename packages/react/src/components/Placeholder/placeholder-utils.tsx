import React, { ComponentType } from 'react';
import { MissingComponent } from '../MissingComponent';
import { ComponentMap, DEFAULT_EXPORT_NAME, LazyComponentType, ReactModule } from '../sharedTypes';
import {
  ComponentRendering,
  RouteData,
  isDynamicPlaceholder,
  getDynamicPlaceholderPattern,
} from '@sitecore-content-sdk/content/layout';
import { HIDDEN_RENDERING_NAME } from '@sitecore-content-sdk/content';
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
  ChildComponentProps,
  BasePlaceholderProps,
  ComponentForRendering,
  PlaceholderProps,
  AppPlaceholderProps,
} from './models';
import { PlaceholderMetadata } from './PlaceholderMetadata';
import ErrorBoundary from '../ErrorBoundary';

/**
 * Get the renderings for the specified placeholder from the rendering layout data.
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
};

/**
 * Get SXA specific params from Sitecore rendering params
 * @param {ComponentRendering} rendering rendering object
 * @returns {object} converted SXA params
 */
export const getSXAParams = (rendering: ComponentRendering) => {
  if (!rendering.params) return { styles: '' };

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
 * @public
 */
export const renderEmptyPlaceholder = (node: React.ReactNode | React.ReactElement[]) => {
  return <div className="sc-jss-empty-placeholder">{node}</div>;
};

/**
 * Merge specific placeholder props with component field and params content props.
 * @param {BasePlaceholderProps} placeholderProps placeholder props
 * @param {ComponentRendering} componentRendering component rendering
 * @returns {ComponentProps} merged props
 */
export function getChildComponentProps<T extends BasePlaceholderProps>(
  placeholderProps: T,
  componentRendering: ComponentRendering
): ChildComponentProps {
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
  const logUnknownComponentError = (variant?: string) => {
    console.error(
      `Placeholder ${placeholderName} contains unknown component ${
        renderingDefinition.componentName
      }${
        variant ? ` (${variant})` : ''
      }. Ensure that a React component exists for it, and that it is registered in your component-map file.`
    );
  };

  if (renderingDefinition.componentName === HIDDEN_RENDERING_NAME) {
    return {
      component: hiddenRenderingComponent ?? HiddenRendering,
      isEmpty: true,
      componentType: 'universal',
    };
  } else if (!renderingDefinition.componentName) {
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

    logUnknownComponentError();

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

  if (!renderedComponent) {
    logUnknownComponentError(exportName !== DEFAULT_EXPORT_NAME ? exportName : undefined);

    return {
      component: missingComponentComponent ?? MissingComponent,
      isEmpty: true,
      componentType: 'universal',
    };
  }

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

export const drawPlaceholderComponents = (
  props: PlaceholderProps | AppPlaceholderProps,
  placeholderRenderings: ComponentRendering[],
  drawPlaceholderChildComponent: (
    componentForRendering: ComponentForRendering,
    renderedProps: ChildComponentProps,
    key?: string
  ) => React.JSX.Element,
  componentRuntime?: 'server' | 'client' | undefined
) => {
  const { name, missingComponentComponent, hiddenRenderingComponent } = props;
  const isEditing = props.page.mode.isEditing;

  const transformedComponents = placeholderRenderings
    .map((componentRendering: ComponentRendering, index: number) => {
      const component = getComponentForRendering(
        componentRendering,
        name,
        props.componentMap,
        hiddenRenderingComponent,
        missingComponentComponent
      );
      const key = componentRendering.uid || `component-${index}`;

      const renderedProps = props.modifyComponentProps
        ? props.modifyComponentProps(getChildComponentProps(props, componentRendering))
        : getChildComponentProps(props, componentRendering);

      let rendered = drawPlaceholderChildComponent(
        component,
        {
          ...renderedProps,
          ...props.passThroughComponentProps,
        },
        key
      );

      if (!component.isEmpty) {
        const errorBoundaryKey = rendered.type + '-' + index;

        const disableSuspense = props.disableSuspense || false;
        rendered = (
          <ErrorBoundary
            data-testid="error-boundary"
            key={errorBoundaryKey}
            errorComponent={props.errorComponent}
            componentLoadingMessage={props.componentLoadingMessage}
            isDynamic={component.dynamic}
            disableSuspense={disableSuspense}
            rendering={rendered.props.rendering as ComponentRendering}
          >
            {rendered}
          </ErrorBoundary>
        );
      }
      // if in edit mode then emit shallow chromes for hydration in Pages
      return isEditing ? (
        <PlaceholderMetadata
          key={key}
          rendering={componentRendering}
          componentRuntime={componentRuntime}
        >
          {rendered}
        </PlaceholderMetadata>
      ) : (
        rendered
      );
    })
    .filter((element) => element); // remove nulls

  if (!props.page.mode.isEditing) {
    return transformedComponents;
  }

  return [
    <PlaceholderMetadata
      key={(props.rendering as ComponentRendering).uid}
      placeholderName={name}
      rendering={props.rendering as ComponentRendering}
    >
      {transformedComponents}
    </PlaceholderMetadata>,
  ];
};

