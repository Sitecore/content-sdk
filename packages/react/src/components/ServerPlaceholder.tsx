import React from 'react';
import { EmptyPlaceholder } from './BasePlaceholder';
import { PlaceholderComponentProps } from './Placeholder';
import { ComponentMap } from './sharedTypes';
import { SitecoreProviderPageContext } from './SitecoreProvider';
import {
  CompWrapper,
  getPlaceholderDataFromRenderingData,
  PaththroughPlaceholderProps,
  resolveComponent,
} from './PlaceholderCommon';
import { ComponentRendering } from '@sitecore-content-sdk/core/layout';
import { PlaceholderMetadata } from './PlaceholderMetadata';
import { knownPhProps } from './placeholder-utils';

export const ServerPlaceholder: React.FC<PlaceholderComponentProps &
  PaththroughPlaceholderProps & {
    componentMap: ComponentMap | undefined;
    pageContext: SitecoreProviderPageContext;
  }> = (props) => {
  const paththroughProps = knownPhProps.reduce(
    (acc, prop) => {
      delete acc[prop];
      return acc;
    },
    { ...props }
  );

  const componentRenderings = getPlaceholderDataFromRenderingData(
    props.rendering,
    props.name,
    props.pageContext?.pageEditing
  );

  const components = componentRenderings.map((componentRendering, index) => {
    const { component, isEmpty, isRsc } = resolveComponent(
      componentRendering,
      props.componentMap,
      props.hiddenRenderingComponent,
      props.missingComponentComponent
    );
    const compPaththroughProps = {
      ...paththroughProps,
    };

    if (!isRsc) {
      // Exclude non serializable props when rendering non RSC components
      delete compPaththroughProps.componentMap;
      delete compPaththroughProps.pageContext;
    }

    return (
      <CompWrapper
        component={component as React.ComponentType}
        isEmpty={isEmpty}
        isEditing={props.pageContext?.pageEditing}
        componentRendering={componentRendering}
        paththroughProps={compPaththroughProps}
        index={index}
        key={componentRendering.uid + index}
        modifyComponentProps={props.modifyComponentProps}
        errorComponent={props.errorComponent}
        componentLoadingMessage={props.componentLoadingMessage}
        skipErrorBoundary={true}
      />
    );
  });

  const isEmpty = !componentRenderings.length;
  let renderedComponents: React.ReactNode;

  if (isEmpty) {
    renderedComponents = (
      <EmptyPlaceholder addWrapper={props.pageContext?.pageEditing}>
        {props.renderEmpty?.([])}
      </EmptyPlaceholder>
    );
  } else if (props.render) {
    renderedComponents = props.render(components, componentRenderings, props);
  } else if (props.renderEach) {
    const renderEach = props.renderEach;
    renderedComponents = components.map((component, index) => {
      return renderEach(component, index);
    });
  } else {
    renderedComponents = components;
  }

  if (props.pageContext?.pageEditing) {
    return [
      <PlaceholderMetadata
        key={(props.rendering as ComponentRendering).uid}
        placeholderName={props.name}
        rendering={props.rendering as ComponentRendering}
      >
        {renderedComponents}
      </PlaceholderMetadata>,
    ];
  }
  return renderedComponents;
};
