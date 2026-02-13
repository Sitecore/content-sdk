'use client';
import React, { useEffect } from 'react';
import { ChildComponentProps, ComponentForRendering, PlaceholderProps } from './models';
import { withComponentMap } from '../../enhancers/withComponentMap';
import { PagesEditor } from '@sitecore-content-sdk/content/editing';
import { withSitecore } from '../../enhancers/withSitecore';
import {
  getPlaceholderRenderings,
  drawPlaceholderComponents,
  renderEmptyPlaceholder,
} from './placeholder-utils';
import ErrorBoundary from '../ErrorBoundary';

const PlaceholderComponent = (props: PlaceholderProps) => {
  const renderingData = props.rendering;
  const placeholderRenderings = getPlaceholderRenderings(
    renderingData,
    props.name,
    props.page.mode.isEditing
  );
  const isEmpty = !placeholderRenderings.length;

  useEffect(() => {
    if (isEmpty && PagesEditor.isActive()) {
      PagesEditor.resetChromes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array so it runs only once on mount

  const drawPlaceholderChildComponent = (
    componentForRendering: ComponentForRendering,
    renderedProps: ChildComponentProps,
    key?: string
  ) => {
    return (
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
    const childProps = { ...props };
    delete childProps.componentMap;
    const isEmpty = !placeholderRenderings.length;

    if (isEmpty) {
      const rendered = props.renderEmpty
        ? props.renderEmpty(renderedComponents)
        : renderedComponents;

      return props.page.mode.isEditing ? renderEmptyPlaceholder(rendered) : rendered;
    } else if (props.render) {
      return props.render(renderedComponents, placeholderRenderings, childProps);
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

  const components = drawPlaceholderComponents(
    props,
    placeholderRenderings,
    drawPlaceholderChildComponent
  );

  const finalOutput = applyConditionalTransform(components);
  // Using error boundary for errors that may happen within Placeholder itself
  return <ErrorBoundary errorComponent={props.errorComponent}>{finalOutput}</ErrorBoundary>;
};

/**
 * The Placeholder component.
 * @public
 */
export const Placeholder = withSitecore()(withComponentMap(PlaceholderComponent));

