import React, { ComponentType } from 'react';
import PropTypes, { Requireable } from 'prop-types';
import { MissingComponent } from './MissingComponent';
import {
  ReactJssModule,
  DEFAULT_EXPORT_NAME,
  ExtendedComponentType,
  ReactJssComponent,
  ComponentMap,
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
import { SitecoreContextValue } from './SitecoreContext';
import { PlaceholderMetadata } from './PlaceholderMetadata';
import ErrorBoundary from './ErrorBoundary';

type ErrorComponentProps = {
  [prop: string]: unknown;
};

/** Provided for the component which represents rendering data */
export type ComponentProps = {
  [key: string]: unknown;
  rendering: ComponentRendering;
};

export interface PlaceholderProps {
  [key: string]: unknown;
  /** Name of the placeholder to render. */
  name: string;
  /** Rendering data to be used when rendering the placeholder. */
  rendering: ComponentRendering | RouteData;
  /**
   * Component Map will be used to map Sitecore component names to app implementation
   * When rendered within a <SitecoreContext> component, defaults to the context componentMap.
   */
  componentMap?: ComponentMap;
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
   *  Context data from the Sitecore Layout Service
   */
  sitecoreContext: SitecoreContextValue;
  /**
   * The message that gets displayed while component is loading
   */
  componentLoadingMessage?: string;
}

export class PlaceholderCommon<T extends PlaceholderProps> extends React.Component<T> {
  static propTypes = {
    rendering: PropTypes.oneOfType([
      PropTypes.object as Requireable<RouteData>,
      PropTypes.object as Requireable<ComponentRendering>,
    ]).isRequired,
    fields: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.object as Requireable<Field>,
        PropTypes.object as Requireable<Item[]>,
      ]).isRequired
    ),
    params: PropTypes.objectOf(PropTypes.string.isRequired),
    missingComponentComponent: PropTypes.oneOfType([
      PropTypes.object as Requireable<React.ComponentClass<unknown>>,
      PropTypes.func as Requireable<React.FC<unknown>>,
    ]),
    hiddenRenderingComponent: PropTypes.oneOfType([
      PropTypes.object as Requireable<React.ComponentClass<unknown>>,
      PropTypes.func as Requireable<React.FC<unknown>>,
    ]),
    errorComponent: PropTypes.oneOfType([
      PropTypes.object as Requireable<React.ComponentClass<unknown>>,
      PropTypes.func as Requireable<React.FC<unknown>>,
    ]),
    modifyComponentProps: PropTypes.func,
    sitecoreContext: PropTypes.object as Requireable<SitecoreContextValue>,
  };

  state: Readonly<{ error?: Error }>;

  constructor(props: T) {
    super(props);
    this.state = {};
  }

  static getPlaceholderDataFromRenderingData(
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

  componentDidCatch(error: Error) {
    this.setState({ error });
  }

  getSXAParams(rendering: ComponentRendering) {
    if (!rendering.params) return {};
    return (
      rendering.params.FieldNames && {
        styles: `${rendering.params.GridParameters || ''} ${rendering.params.Styles || ''}`,
      }
    );
  }

  getComponentsForRenderingData(placeholderData: ComponentRendering[]) {
    const {
      name,
      fields: placeholderFields,
      params: placeholderParams,
      missingComponentComponent,
      hiddenRenderingComponent,
      ...placeholderProps
    } = this.props;

    const transformedComponents = placeholderData
      .map((rendering: ComponentRendering, index: number) => {
        const key = (rendering as ComponentRendering).uid
          ? (rendering as ComponentRendering).uid
          : `component-${index}`;
        const commonProps = { key };
        let isEmpty = false;

        const componentRendering = rendering as ComponentRendering;

        let component;

        if (componentRendering.componentName === constants.HIDDEN_RENDERING_NAME) {
          component = hiddenRenderingComponent ?? HiddenRendering;
          isEmpty = true;
        } else if (!componentRendering.componentName) {
          component = () => <></>;
          isEmpty = true;
        } else {
          component = this.getComponentForRendering(componentRendering);
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
            `Placeholder ${name} contains unknown component ${componentRendering.componentName}. Ensure that a React component exists for it, and that it is registered in your lib/component-map.ts.`
          );

          component = missingComponentComponent ?? MissingComponent;
          isEmpty = true;
        }

        const finalProps = {
          ...commonProps,
          ...placeholderProps,
          ...((placeholderFields || componentRendering.fields) && {
            fields: { ...placeholderFields, ...componentRendering.fields },
          }),
          ...((placeholderParams || componentRendering.params) && {
            params: {
              ...placeholderParams,
              ...componentRendering.params,
              // Provide SXA styles
              ...this.getSXAParams(componentRendering),
            },
          }),
          rendering: componentRendering,
        };

        let rendered = React.createElement<{ [attr: string]: unknown }>(
          component as React.ComponentType,
          this.props.modifyComponentProps ? this.props.modifyComponentProps(finalProps) : finalProps
        );

        if (!isEmpty) {
          // assign type based on passed element - type='text/sitecore' should be ignored when renderEach Placeholder prop function is being used
          const type = rendered.props.type === 'text/sitecore' ? rendered.props.type : '';
          // wrapping with error boundary could cause problems in case where parent component uses withPlaceholder HOC and tries to access its children props
          // that's why we need to expose element's props here
          rendered = (
            <ErrorBoundary
              key={rendered.type + '-' + index}
              errorComponent={this.props.errorComponent}
              componentLoadingMessage={this.props.componentLoadingMessage}
              type={type}
              isDynamic={(component as ExtendedComponentType).render?.preload ? true : false}
              {...rendered.props}
            >
              {rendered}
            </ErrorBoundary>
          );
        }

        // if in edit mode then emit shallow chromes for hydration in Pages
        if (this.props.sitecoreContext?.pageEditing) {
          return (
            <PlaceholderMetadata key={key} rendering={rendering as ComponentRendering}>
              {rendered}
            </PlaceholderMetadata>
          );
        }

        return rendered;
      })
      .filter((element) => element); // remove nulls

    if (this.props.sitecoreContext?.pageEditing) {
      return [
        <PlaceholderMetadata
          key={(this.props.rendering as ComponentRendering).uid}
          placeholderName={name}
          rendering={this.props.rendering as ComponentRendering}
        >
          {transformedComponents}
        </PlaceholderMetadata>,
      ];
    }

    return transformedComponents;
  }

  getComponentForRendering(renderingDefinition: ComponentRendering): ComponentType | null {
    const componentMap = this.props.componentMap;

    if (!componentMap || componentMap.size === 0) {
      console.warn(
        `No components were available in component map to service request for component ${renderingDefinition}`
      );
      return null;
    }

    // Render SXA Rendering Variant if available
    const exportName = renderingDefinition.params?.FieldNames;

    const component = componentMap.get(renderingDefinition.componentName);

    if (!component) return null;

    if (exportName && exportName !== DEFAULT_EXPORT_NAME) {
      return (component as ReactJssModule)[exportName];
    }

    return (
      (component as ReactJssModule).Default ||
      (component as ReactJssModule).default ||
      (component as ExtendedComponentType)
    );
  }
}
