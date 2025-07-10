import { ComponentRendering } from '@sitecore-content-sdk/core/layout';
import React from 'react';
import { PlaceholderComponentProps } from './Placeholder';
import {
  getComponentsForRenderingData,
  getPlaceholderDataFromRenderingData,
  PaththroughPlaceholderProps,
} from './PlaceholderCommon';
import { PlaceholderMetadata } from './PlaceholderMetadata';

export const EmptyPlaceholder = ({
  children,
  addWrapper,
}: {
  children?: React.ReactNode;
  addWrapper: boolean;
}) => {
  if (addWrapper) {
    return <div className="sc-jss-empty-placeholder">{children}</div>;
  }
  return children;
};

export const BasePlaceholder: React.FC<{
  placeholderProps: PlaceholderComponentProps;
  paththroughProps: PaththroughPlaceholderProps;
}> = ({ placeholderProps, paththroughProps }) => {
  const childProps: PlaceholderComponentProps = { ...placeholderProps };
  const renderingData = childProps.rendering;

  const placeholderData = getPlaceholderDataFromRenderingData(
    renderingData,
    placeholderProps.name,
    placeholderProps.pageContext?.pageEditing
  );

  const isEmpty = !placeholderData.length;

  const components = isEmpty
    ? []
    : getComponentsForRenderingData(placeholderData, placeholderProps, paththroughProps);
  let renderedComponents: React.ReactNode;

  if (isEmpty) {
    renderedComponents = (
      <EmptyPlaceholder addWrapper={placeholderProps.pageContext?.pageEditing}>
        {placeholderProps?.renderEmpty([])}
      </EmptyPlaceholder>
    );
  } else if (placeholderProps.render) {
    renderedComponents = placeholderProps.render(components, placeholderData, childProps);
  } else if (placeholderProps.renderEach) {
    const renderEach = placeholderProps.renderEach;
    renderedComponents = components.map((component, index) => {
      return renderEach(component, index);
    });
  } else {
    renderedComponents = components;
  }

  if (placeholderProps.pageContext?.pageEditing) {
    return [
      <PlaceholderMetadata
        key={(placeholderProps.rendering as ComponentRendering).uid}
        placeholderName={placeholderProps.name}
        rendering={placeholderProps.rendering as ComponentRendering}
      >
        {renderedComponents}
      </PlaceholderMetadata>,
    ];
  }
  return renderedComponents;
};
