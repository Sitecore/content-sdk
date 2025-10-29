import { AppPlaceholderProps } from './models';
import {
  getAppComponentProps,
  getComponentForRendering,
  getPlaceholderRenderings,
  renderEmptyPlaceholder,
} from './placeholder-utils';
import React from 'react';
import { PlaceholderMetadata } from './PlaceholderMetadata';
import { ComponentRendering } from '@sitecore-content-sdk/core/layout';
import ErrorBoundary from '../ErrorBoundary';
import { ClientComponentWrapper } from './ClientComponentWrapper';
import { rsc } from '#rsc-env';

/**
 * The implemention of placeholder compatible with React Server Components.
 * Renders components from the layout data for the given placeholder name, with consideration for page edit mode.
 * Pulls components from the provided component map.
 * @param {AppPlaceholderProps} props Placeholder props
 * @returns {React.ReactNode | React.ReactElement[]} rendered component(s)
 */
export const AppPlaceholder = (props: AppPlaceholderProps) => {
  const { rendering: parentRendering, componentMap, page } = props;
  const placeholderRenderings = getPlaceholderRenderings(
    parentRendering,
    props.name,
    page.mode.isEditing
  );

  const components = placeholderRenderings
    .map((rendering, index) => {
      const {
        component: Component,
        isEmpty,
        componentType,
        dynamic,
      } = getComponentForRendering(
        rendering,
        props.name,
        componentMap,
        props.hiddenRenderingComponent,
        props.missingComponentComponent
      );
      const isClient = componentType === 'client';
      const key = rendering.uid || `component-${index}`;

      const renderedProps = getAppComponentProps(props, rendering);

      const finalRenderedProps = props.modifyComponentProps
        ? props.modifyComponentProps(renderedProps)
        : renderedProps;

      // Client wrapper is required only when component crosses boundary from server to client.
      // It happens when component is marker as client and rendered in RSC context.
      // Also, it is not required when component is hidden or empty, as it will be rendered whthout boundary crossing.
      const useClientWrapper = isClient && rsc && !isEmpty;
      let rendered = useClientWrapper ? (
        <ClientComponentWrapper
          rendering={rendering}
          componentProps={finalRenderedProps}
          placeholderName={props.name}
          key={key}
        />
      ) : (
        <Component
          key={key}
          {...finalRenderedProps}
          rendering={rendering}
          page={page}
          componentMap={componentMap}
        />
      );

      if (!isEmpty) {
        const errorBoundaryKey = rendered.type + '-' + index;
        const disableSuspense = props.disableSuspense || false;
        rendered = (
          <ErrorBoundary
            data-testid="error-boundary"
            key={errorBoundaryKey}
            errorComponent={props.errorComponent}
            componentLoadingMessage={props.componentLoadingMessage}
            isDynamic={dynamic}
            disableSuspense={disableSuspense}
            rendering={rendered.props.rendering as ComponentRendering}
          >
            {rendered}
          </ErrorBoundary>
        );
      }

      // if in edit mode then emit shallow chromes for hydration in Pages
      if (page.mode.isEditing) {
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

  const finalRendering = page.mode.isEditing
    ? [
        <PlaceholderMetadata
          key={(parentRendering as ComponentRendering).uid}
          placeholderName={props.name}
          rendering={parentRendering as ComponentRendering}
        >
          {components}
        </PlaceholderMetadata>,
      ]
    : components;

  const placeholderEmpty = !placeholderRenderings.length;

  if (placeholderEmpty) {
    const rendered = props.renderEmpty ? props.renderEmpty(finalRendering) : finalRendering;

    return page.mode.isEditing ? renderEmptyPlaceholder(rendered) : rendered;
  }

  if (props.render) {
    return props.render(components, placeholderRenderings, props);
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
