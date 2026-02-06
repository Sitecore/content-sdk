import React from 'react';
import { ComponentRendering, RouteData } from '@sitecore-content-sdk/content/layout';
import { withComponentMap } from './withComponentMap';
import { withSitecore } from './withSitecore';
import {
  PlaceholderProps,
  getPlaceholderRenderings,
  getRenderedComponents,
} from '../components/Placeholder';
import ErrorBoundary from '../components/ErrorBoundary';

export interface WithPlaceholderOptions {
  /**
   * Function to map incoming placeholder props into rendering data to use for the placeholder data.
   * Normally in a Content SDK component, props.rendering is passed the component data, and that is the default.
   * However, if your component data is in a different prop, like say 'route' in a sample app,
   * this lets you map that.
   */
  resolvePlaceholderDataFromProps?: (props: unknown) => ComponentRendering | RouteData;
  /**
   * Function to alter the placeholder props from within the HOC. Enables the props to be
   * transformed before being used by the placeholder/HOC, for example to customize the
   * error or missing component display
   */
  propsTransformer?: (props: PlaceholderProps) => PlaceholderProps;
}

export interface PlaceholderToPropMapping {
  /**
   * The name of the placeholder this component will expose
   */
  placeholder: string;
  /**
   * The name of the prop on your wrapped component that you would like the placeholder data injected on
   */
  prop: string;
}

// TODO: this HOC and Placeholder are kinda doing the same thing. Could the be combined?
export type WithPlaceholderSpec =
  | (string | PlaceholderToPropMapping)
  | (string | PlaceholderToPropMapping)[];

/**
 * HOC to provide client-side placeholder functionality to a component.
 * @param {WithPlaceholderSpec} placeholders
 * @param {WithPlaceholderOptions} [options]
 * @public
 */
export function withPlaceholder(
  placeholders: WithPlaceholderSpec,
  options?: WithPlaceholderOptions
) {
  return (
    WrappedComponent:
      | React.ComponentClass<PlaceholderProps>
      | React.FunctionComponent<PlaceholderProps>
  ) => {
    const WithPlaceholder = (props: PlaceholderProps) => {
      let childProps: PlaceholderProps = { ...props };

      delete childProps.componentMap;

      if (options && options.propsTransformer) {
        childProps = options.propsTransformer(childProps);
      }

      const renderingData =
        options && options.resolvePlaceholderDataFromProps
          ? options.resolvePlaceholderDataFromProps(childProps)
          : childProps.rendering;

      const definitelyArrayPlacholders = !Array.isArray(placeholders)
        ? [placeholders]
        : placeholders;

      definitelyArrayPlacholders.forEach((placeholder: string | PlaceholderToPropMapping) => {
        let placeholderData: ComponentRendering[];

        if (typeof placeholder !== 'string' && placeholder.placeholder && placeholder.prop) {
          placeholderData = getPlaceholderRenderings(
            renderingData,
            placeholder.placeholder,
            childProps.page.mode.isEditing
          );
          if (placeholderData) {
            (childProps as PlaceholderProps & Record<string, unknown>)[placeholder.prop] =
              getRenderedComponents(props, placeholderData);
          }
        } else {
          placeholderData = getPlaceholderRenderings(
            renderingData,
            placeholder as string,
            childProps.page.mode.isEditing
          );
          if (placeholderData) {
            (childProps as PlaceholderProps & Record<string, unknown>)[placeholder as string] =
              getRenderedComponents(props, placeholderData);
          }
        }
      });

      return (
        <ErrorBoundary errorComponent={props.errorComponent}>
          <WrappedComponent {...childProps} />
        </ErrorBoundary>
      );
    };

    return withSitecore()(withComponentMap(WithPlaceholder));
  };
}
