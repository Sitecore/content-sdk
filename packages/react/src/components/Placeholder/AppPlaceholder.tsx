import { AppPlaceholderProps } from './models';
import {
  getChildComponentProps,
  getComponentForRendering,
  getPlaceholderRenderings,
  renderEmptyPlaceholder,
} from './placeholder-utils';
import React from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { ClientComponentWrapper } from './ClientComponentWrapper';
import { rsc } from '#rsc-env';
import { ComponentRendering } from '@sitecore-content-sdk/content/layout';
import { PlaceholderMetadata } from './PlaceholderMetadata';

const AppPlaceholderComponent = (props: AppPlaceholderProps) => {
  const renderingData = props.rendering;
  const isEditing = props.page.mode.isEditing;
  const placeholderRenderings = getPlaceholderRenderings(renderingData, props.name, isEditing);
  const isEmpty = !placeholderRenderings.length;

  const components = getPlaceholderComponents(props, placeholderRenderings);
  if (isEmpty) {
    let renderedOutput: React.ReactNode = components;
    if (props.renderEmpty) {
      renderedOutput = props.renderEmpty(components);
    }
    return isEditing ? renderEmptyPlaceholder(renderedOutput) : renderedOutput;
  } else if (props.render) {
    return props.render(components, placeholderRenderings, props);
  }
  return components;
};

const getPlaceholderComponents = (
  placeholderProps: AppPlaceholderProps,
  placeholderRenderings: ComponentRendering[]
) => {
  const {
    name,
    rendering,
    passThroughComponentProps,
    missingComponentComponent,
    hiddenRenderingComponent,
    errorComponent,
    componentLoadingMessage,
    renderEach,
    modifyComponentProps,
    componentMap,
    page,
  } = placeholderProps;
  const isEditing = page.mode.isEditing;
  const componentRuntime = rsc ? 'server' : 'client';

  const transformedComponents = placeholderRenderings
    .map((componentRendering: ComponentRendering, index: number) => {
      const {
        component: ChildComponent,
        isEmpty: componentEmpty,
        componentType,
        dynamic,
      } = getComponentForRendering(
        componentRendering,
        name,
        componentMap,
        hiddenRenderingComponent,
        missingComponentComponent
      );
      const key = componentRendering.uid || `component-${index}`;

      const renderedProps = modifyComponentProps
        ? modifyComponentProps(getChildComponentProps(placeholderProps, componentRendering))
        : getChildComponentProps(placeholderProps, componentRendering);

      // Client wrapper is required only when component crosses boundary from server to client.
      // It happens when component is marker as client and rendered in RSC context.
      // Also, it is not required when component is hidden or empty, as it will be rendered whthout boundary crossing.
      const useClientWrapper = componentType === 'client' && rsc && !componentEmpty;
      let rendered = useClientWrapper ? (
        <ClientComponentWrapper
          rendering={renderedProps.rendering}
          componentProps={{ ...renderedProps, ...passThroughComponentProps }}
          placeholderName={name}
          key={key}
        />
      ) : (
        <ChildComponent
          key={key}
          {...renderedProps}
          {...passThroughComponentProps}
          page={page}
          componentMap={componentMap}
        />
      );

      if (renderEach) {
        rendered = renderEach(rendered, index) as React.ReactElement<{
          [attr: string]: unknown;
        }>;
      }

      if (!componentEmpty) {
        const errorBoundaryKey = rendered.type + '-' + index;

        const disableSuspense = placeholderProps.disableSuspense || false;
        rendered = (
          <ErrorBoundary
            data-testid="error-boundary"
            key={errorBoundaryKey}
            errorComponent={errorComponent}
            componentLoadingMessage={componentLoadingMessage}
            isDynamic={dynamic}
            disableSuspense={disableSuspense}
            rendering={rendered.props.rendering as ComponentRendering}
          >
            {rendered}
          </ErrorBoundary>
        );
      }
      // if in edit mode then emit shallow chromes for hydration in Pages
      return isEditing ? (
        <PlaceholderMetadata
          key={key}
          rendering={componentRendering}
          componentRuntime={componentRuntime}
        >
          {rendered}
        </PlaceholderMetadata>
      ) : (
        rendered
      );
    })
    .filter((element) => element); // remove nulls

  if (!isEditing) {
    return transformedComponents;
  }

  return [
    <PlaceholderMetadata
      key={(rendering as ComponentRendering).uid}
      placeholderName={name}
      rendering={rendering as ComponentRendering}
    >
      {transformedComponents}
    </PlaceholderMetadata>,
  ];
};

/**
 * The implemention of placeholder compatible with React Server Components.
 * Renders components from the layout data for the given placeholder name, with consideration for page edit mode.
 * Pulls components from the provided component map.
 * @param {AppPlaceholderProps} props Placeholder props
 * @returns {React.ReactNode | React.ReactElement[]} rendered component(s)
 * @public
 */
export const AppPlaceholder = (props: AppPlaceholderProps) => (
  // Using error boundary for errors that may happen within Placeholder itself
  <ErrorBoundary errorComponent={props.errorComponent}>
    <AppPlaceholderComponent {...props} />
  </ErrorBoundary>
);

