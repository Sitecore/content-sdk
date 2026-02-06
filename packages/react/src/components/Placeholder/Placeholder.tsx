'use client';
import React, { useEffect } from 'react';
import { PlaceholderProps } from './models';
import { withComponentMap } from '../../enhancers/withComponentMap';
import { PagesEditor } from '@sitecore-content-sdk/content/editing';
import { withSitecore } from '../../enhancers/withSitecore';
import {
  getPlaceholderRenderings,
  getRenderedComponents,
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

  // componentDidMount equivalent: Reset chromes when placeholder is empty
  useEffect(() => {
    if (isEmpty && PagesEditor.isActive()) {
      PagesEditor.resetChromes();
    }
  }, [isEmpty]); // Empty array = runs once on mount

  const renderChildren = () => {
    const childProps: PlaceholderProps = { ...props };

    delete childProps.componentMap;

    const components = getRenderedComponents(props, placeholderRenderings);

    if (isEmpty) {
      const rendered = props.renderEmpty ? props.renderEmpty(components) : components;

      return props.page.mode.isEditing ? renderEmptyPlaceholder(rendered) : rendered;
    } else if (props.render) {
      return props.render(components, placeholderRenderings, childProps);
    } else if (props.renderEach) {
      const renderEach = props.renderEach;

      return components.map((component, index) => {
        if (component && component.props && component.props.type === 'text/sitecore') {
          return component;
        }

        return renderEach(component, index);
      });
    } else {
      return components;
    }
  };

  // Using error boundary for errors that may happen within Placeholder itself
  return <ErrorBoundary errorComponent={props.errorComponent}>{renderChildren()}</ErrorBoundary>;
};

const PlaceholderWithComponentMap = withComponentMap(PlaceholderComponent);

/**
 * The Placeholder component.
 * @public
 */
export const Placeholder = withSitecore()(PlaceholderWithComponentMap);
