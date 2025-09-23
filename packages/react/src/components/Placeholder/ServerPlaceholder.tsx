import { nonSerializedProps, PlaceholderProps } from './models';
import {
  getComponentForRendering,
  getPlaceholderRenderings,
  getRenderedComponentProps,
  renderEmptyPlaceholder,
  wrapErrorBoundary,
} from './placeholder-utils';
import React from 'react';
import { PlaceholderMetadata } from './PlaceholderMetadata';
import { ComponentRendering } from '@sitecore-content-sdk/core/layout';

/**
 * React Server Component implementation for Placeholder.
 * Renders components from the layout data for the given placeholder name, with consideration for page edit mode.
 * Pulls components from the provided component map.
 * @param {PlaceholderProps} props Placeholder props
 * @returns {React.ReactNode | React.ReactElement[]} rendered component(s)
 */
export const ServerPlaceholder = (props: PlaceholderProps) => {
  if (!props.componentMap) {
    throw new Error('Component map is required for ServerPlaceholder');
  }

  // get serializable props for client rendering
  const serializableProps = nonSerializedProps.reduce(
    (finalProps, prop) => {
      delete finalProps[prop];
      return finalProps;
    },
    { ...props }
  );

  const placeholderRenderings = getPlaceholderRenderings(
    props.rendering,
    props.name,
    props.page?.mode.isEditing
  );

  const components = placeholderRenderings
    .map((rendering, index) => {
      const { component, isEmpty, componentType, dynamic } = getComponentForRendering(
        rendering,
        props.name,
        props.componentMap,
        props.hiddenRenderingComponent,
        props.missingComponentComponent
      );
      const isClient = componentType === 'client';
      const key = rendering.uid || `component-${index}`;
      const finalPhProps = isClient ? serializableProps : props;

      const renderedProps = getRenderedComponentProps(finalPhProps, rendering, key);

      let rendered = React.createElement<{ [attr: string]: unknown }>(
        component as React.ComponentType,
        props.modifyComponentProps ? props.modifyComponentProps(renderedProps) : renderedProps
      );

      if (!isEmpty) {
        const errorBoundaryKey = rendered.type + '-' + index;

        rendered = wrapErrorBoundary({
          rendered,
          placeholderProps: props,
          renderingKey: errorBoundaryKey,
          isDynamic: dynamic,
          isServer: true,
        });
      }

      // if in edit mode then emit shallow chromes for hydration in Pages
      if (props.page.mode.isEditing) {
        const key = (rendering.uid as string) || `component-${index}`;
        return (
          <PlaceholderMetadata key={key} rendering={rendering}>
            {rendered}
          </PlaceholderMetadata>
        );
      }
      return rendered;
    })
    .filter((element) => element);

  const finalRendering = props.page.mode.isEditing
    ? [
        <PlaceholderMetadata
          key={(props.rendering as ComponentRendering).uid}
          placeholderName={props.name}
          rendering={props.rendering as ComponentRendering}
        >
          {components}
        </PlaceholderMetadata>,
      ]
    : components;

  const placeholderEmpty = !placeholderRenderings.length;

  if (placeholderEmpty) {
    const rendered = props.renderEmpty ? props.renderEmpty(finalRendering) : finalRendering;

    return props.page.mode.isEditing ? renderEmptyPlaceholder(rendered) : rendered;
  }

  if (props.render) {
    return props.render(components, placeholderRenderings, serializableProps);
  } else if (props.renderEach) {
    const renderEach = props.renderEach;

    return finalRendering.map((component, index) => {
      if (component && component.props && component.props.type === 'text/sitecore') {
        return component;
      }

      return renderEach(component, index);
    });
  } else {
    return finalRendering;
  }
};
