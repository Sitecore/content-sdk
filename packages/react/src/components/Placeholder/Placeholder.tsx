'use client';
import React, { useEffect } from 'react';
import { PlaceholderProps } from './models';
import { withComponentMap } from '../../enhancers/withComponentMap';
import { PagesEditor } from '@sitecore-content-sdk/content/editing';
import { withSitecore } from '../../enhancers/withSitecore';
import {
  getComponentForRendering,
  getPlaceholderRenderings,
  getRenderedComponentProps,
  renderEmptyPlaceholder,
} from './placeholder-utils';
import ErrorBoundary from '../ErrorBoundary';
import { ComponentRendering } from '@sitecore-content-sdk/content/layout';
import { PlaceholderMetadata } from './PlaceholderMetadata';

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

  const renderPlhChildren = () => {
    const childProps = { ...props };
    // TODO: cleanup more props
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
  return <ErrorBoundary errorComponent={props.errorComponent}>{renderPlhChildren()}</ErrorBoundary>;
};

/**
 * Renders the components for the placeholder based on the provided rendering data.
 * @param {PlaceholderProps} props placeholder component props
 * @param {ComponentRendering[]} placeholderRenderings renderings within placeholder
 * @returns {React.ReactNode | React.ReactElement[]} rendered components
 */
export const getRenderedComponents = (
  props: PlaceholderProps,
  placeholderRenderings: ComponentRendering[]
) => {
  const { name, missingComponentComponent, hiddenRenderingComponent } = props;

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

      const renderedProps = getRenderedComponentProps(props, componentRendering, key);
      const finalRenderedProps = props.modifyComponentProps
        ? props.modifyComponentProps(renderedProps)
        : renderedProps;

      let rendered = React.createElement<{ [attr: string]: unknown }>(
        component.component as React.ComponentType,
        finalRenderedProps
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
      if (props.page.mode.isEditing) {
        return (
          <PlaceholderMetadata key={key} rendering={componentRendering}>
            {rendered}
          </PlaceholderMetadata>
        );
      }

      return rendered;
    })
    .filter((element) => element); // remove nulls

  if (props.page.mode.isEditing) {
    return [
      <PlaceholderMetadata
        key={(props.rendering as ComponentRendering).uid}
        placeholderName={name}
        rendering={props.rendering as ComponentRendering}
      >
        {transformedComponents}
      </PlaceholderMetadata>,
    ];
  }

  return transformedComponents;
};

/**
 * The Placeholder component.
 * @public
 */
export const Placeholder = withSitecore()(withComponentMap(PlaceholderComponent));
