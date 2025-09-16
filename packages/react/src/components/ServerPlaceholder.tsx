import { Page } from '@sitecore-content-sdk/core/client';
import { nonSerializedProps, PlaceholderProps } from './models';
import { ComponentMap } from './sharedTypes';
import {
  getComponentForRendering,
  getPlaceholderDataFromRenderingData,
  getSXAParams,
  renderEmptyPlaceholder,
} from './PlaceholderCommon';
import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import { PlaceholderMetadata } from './PlaceholderMetadata';
import { ComponentRendering } from '@sitecore-content-sdk/core/layout';

export type ServerPlaceholderProps = PlaceholderProps & {
  pageContext: Page;
  componentMap: ComponentMap;
};

export const ServerPlaceholder = (props: ServerPlaceholderProps) => {
  if (!props.componentMap) {
    // better error handling needed
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

  const componentRenderings = getPlaceholderDataFromRenderingData(
    props.rendering,
    props.name,
    props.page.mode.isEditing
  );

  const components = componentRenderings
    .map((rendering, index) => {
      const { component, isEmpty, isClient, dynamic } = getComponentForRendering(
        rendering,
        props.name,
        props.componentMap,
        props.hiddenRenderingComponent,
        props.missingComponentComponent
      );

      const finalPhProps = isClient ? serializableProps : props;

      const renderedProps = {
        key: finalPhProps.name,
        ...finalPhProps,
        fields: { ...(finalPhProps.fields || {}), ...(rendering.fields || {}) },
        params: {
          ...(finalPhProps.params || {}),
          ...(rendering.params || {}),
          // Provide SXA styles
          ...getSXAParams(rendering),
        },
        rendering,
      };

      let rendered = React.createElement<{ [attr: string]: unknown }>(
        component as React.ComponentType,
        props.modifyComponentProps ? props.modifyComponentProps(renderedProps) : renderedProps
      );

      if (!isEmpty) {
        // assign type based on passed element - type='text/sitecore' should be ignored when renderEach Placeholder prop function is being used
        const type = rendered.props.type === 'text/sitecore' ? rendered.props.type : '';

        const disableSuspense = props.disableSuspense || false;

        rendered = (
          <ErrorBoundary
            data-testid="error-boundary"
            key={rendered.type + '-' + index}
            errorComponent={props.errorComponent}
            componentLoadingMessage={props.componentLoadingMessage}
            type={type}
            isDynamic={!dynamic}
            disableSuspense={disableSuspense}
            {...rendered.props}
          >
            {rendered}
          </ErrorBoundary>
        );
      }

      // if in edit mode then emit shallow chromes for hydration in Pages
      if (props.page.mode.isEditing) {
        return (
          <PlaceholderMetadata key={finalPhProps.name} rendering={rendering}>
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

  const placeholderData = getPlaceholderDataFromRenderingData(
    props.rendering,
    props.name,
    props.page.mode.isEditing
  );

  if (props.isEmpty) {
    const rendered = props.renderEmpty ? props.renderEmpty(finalRendering) : finalRendering;

    return props.page.mode.isEditing ? renderEmptyPlaceholder(rendered) : rendered;
  } else if (props.render) {
    return props.render(components, placeholderData, serializableProps);
  } else if (props.renderEach) {
    const renderEach = props.renderEach;

    return finalRendering.map((component, index) => {
      if (component && component.props && component.props.type === 'text/sitecore') {
        return component;
      }

      return renderEach(component, index);
    });
  } else {
    return components;
  }
};
