import { AppPlaceholderProps, ChildComponentProps, ComponentForRendering } from './models';
import {
  drawPlaceholderComponents,
  getPlaceholderRenderings,
  renderEmptyPlaceholder,
} from './placeholder-utils';
import React from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { ClientComponentWrapper } from './ClientComponentWrapper';
import { rsc } from '#rsc-env';

/**
 * The implemention of placeholder compatible with React Server Components.
 * Renders components from the layout data for the given placeholder name, with consideration for page edit mode.
 * Pulls components from the provided component map.
 * @param {AppPlaceholderProps} props Placeholder props
 * @returns {React.ReactNode | React.ReactElement[]} rendered component(s)
 * @public
 */
export const AppPlaceholder = (props: AppPlaceholderProps) => {
  const renderingData = props.rendering;
  const placeholderRenderings = getPlaceholderRenderings(
    renderingData,
    props.name,
    props.page.mode.isEditing
  );

  const drawAppPlaceholderChildComponent = (
    componentForRendering: ComponentForRendering,
    renderedProps: ChildComponentProps,
    key?: string
  ) => {
    // Client wrapper is required only when component crosses boundary from server to client.
    // It happens when component is marker as client and rendered in RSC context.
    // Also, it is not required when component is hidden or empty, as it will be rendered whthout boundary crossing.
    const useClientWrapper =
      componentForRendering.componentType === 'client' && rsc && !componentForRendering.isEmpty;
    return useClientWrapper ? (
      <ClientComponentWrapper
        rendering={renderedProps.rendering}
        componentProps={{ ...renderedProps, ...props.passThroughComponentProps }}
        placeholderName={props.name}
        key={key}
      />
    ) : (
      <componentForRendering.component
        key={key}
        {...renderedProps}
        {...props.passThroughComponentProps}
        page={props.page}
        componentMap={props.componentMap}
      />
    );
  };

  const applyConditionalTransform = (renderedComponents: React.JSX.Element[]) => {
    const isEmpty = !placeholderRenderings.length;

    if (isEmpty) {
      const rendered = props.renderEmpty
        ? props.renderEmpty(renderedComponents)
        : renderedComponents;

      return props.page.mode.isEditing ? renderEmptyPlaceholder(rendered) : rendered;
    } else if (props.render) {
      return props.render(renderedComponents, placeholderRenderings, props);
    } else if (props.renderEach) {
      const renderEach = props.renderEach;

      return renderedComponents.map((component, index) => {
        if (component && component.props && component.props.type === 'text/sitecore') {
          return component;
        }

        return renderEach(component, index);
      });
    } else {
      return renderedComponents;
    }
  };

  const componentRuntime = rsc ? 'server' : 'client';
  const components = drawPlaceholderComponents(
    props,
    placeholderRenderings,
    drawAppPlaceholderChildComponent,
    componentRuntime
  );

  const finalOutput = applyConditionalTransform(components);
  // Using error boundary for errors that may happen within Placeholder itself
  return <ErrorBoundary errorComponent={props.errorComponent}>{finalOutput}</ErrorBoundary>;
};

