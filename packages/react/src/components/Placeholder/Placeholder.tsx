'use client';
import React, { useEffect } from 'react';
import { ChildComponentProps, ComponentForRendering, PlaceholderProps } from './models';
import { PagesEditor } from '@sitecore-content-sdk/content/editing';
import {
  getPlaceholderRenderings,
  drawPlaceholderComponents,
  renderEmptyPlaceholder,
} from './placeholder-utils';
import ErrorBoundary from '../ErrorBoundary';
import { useComponentMap, useSitecore } from '../SitecoreProvider';

const PlaceholderComponent = (props: PlaceholderProps) => {
  const renderingData = props.rendering;
  let { page } = useSitecore();
  let componentMap = useComponentMap();
  page = props.page ?? page;
  componentMap = props.componentMap || componentMap || undefined;
  const modProps = { ...props, page, componentMap };
  const isEditing = page.mode.isEditing;
  const placeholderRenderings = getPlaceholderRenderings(renderingData, modProps.name, isEditing);
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
        page={page}
        componentMap={componentMap}
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

      return isEditing ? renderEmptyPlaceholder(rendered) : rendered;
    } else if (props.render) {
      return props.render(renderedComponents, placeholderRenderings, childProps);
    } else {
      return renderedComponents;
    }
  };

  const components = drawPlaceholderComponents(
    modProps,
    placeholderRenderings,
    drawPlaceholderChildComponent,
    undefined,
    isEditing
  );

  const finalOutput = applyConditionalTransform(components);
  // Using error boundary for errors that may happen within Placeholder itself
  return <ErrorBoundary errorComponent={props.errorComponent}>{finalOutput}</ErrorBoundary>;
};

/**
 * The Placeholder component.
 * @public
 */
export const Placeholder = PlaceholderComponent;

