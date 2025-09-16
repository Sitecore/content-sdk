import React from 'react';
import { PlaceholderProps } from './models';
import { withComponentMap } from '../../enhancers/withComponentMap';
import { PagesEditor } from '@sitecore-content-sdk/core/editing';
import { withSitecore } from '../../enhancers/withSitecore';
import {
  getComponentForRendering,
  getComponentsForRenderingData,
  getPlaceholderDataFromRenderingData,
  getSXAParams,
  renderEmptyPlaceholder,
} from './PlaceholderCommon';
import { ComponentRendering } from '@sitecore-content-sdk/core/layout';
import ErrorBoundary from '../ErrorBoundary';
import { PlaceholderMetadata } from './PlaceholderMetadata';

export class PlaceholderComponent extends React.Component<PlaceholderProps> {
  isEmpty = false;
  state: Readonly<{ error?: Error }>;

  constructor(props: PlaceholderProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.isEmpty && PagesEditor.isActive()) {
      PagesEditor.resetChromes();
    }
  }

  componentDidCatch(error: Error) {
    this.setState({ error });
  }

  /**
   * Renders the placeholder when it is empty. The required CSS styles are applied to the placeholder in edit mode.
   * @param {React.ReactNode | React.ReactElement[]} node react node
   * @returns react node
   * @deprecated use renderEmptyPlaceholder from react/nextjs import instead
   */
  renderEmptyPlaceholder(node: React.ReactNode | React.ReactElement[]) {
    return renderEmptyPlaceholder(node);
  }

  getRenderedComponents = (props: PlaceholderProps, placeholderData: ComponentRendering[]) => {
    const {
      name,
      fields: placeholderFields,
      params: placeholderParams,
      missingComponentComponent,
      hiddenRenderingComponent,
      ...placeholderProps
    } = props;

    const transformedComponents = placeholderData
      .map((componentRendering: ComponentRendering, index: number) => {
        const key = componentRendering.uid || `component-${index}`;

        const renderedProps = {
          key,
          ...placeholderProps,
          fields: { ...(placeholderFields || {}), ...(componentRendering.fields || {}) },
          params: {
            ...(placeholderParams || {}),
            ...(componentRendering.params || {}),
            // Provide SXA styles
            ...getSXAParams(componentRendering),
          },
          rendering: componentRendering,
        };

        const component = getComponentForRendering(
          componentRendering,
          name,
          props.componentMap,
          hiddenRenderingComponent,
          missingComponentComponent
        );

        let rendered = React.createElement<{ [attr: string]: unknown }>(
          component.component as React.ComponentType,
          props.modifyComponentProps ? props.modifyComponentProps(renderedProps) : renderedProps
        );

        if (!component.isEmpty) {
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
              isDynamic={!!component.dynamic}
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

  render() {
    const childProps: PlaceholderProps = { ...this.props };

    delete childProps.componentMap;

    if (this.state.error) {
      if (childProps.errorComponent) {
        return <childProps.errorComponent error={this.state.error} />;
      }

      return (
        <div className="sc-content-sdk-placeholder-error">
          A rendering error occurred: {this.state.error.message}.
        </div>
      );
    }

    const renderingData = childProps.rendering;

    const placeholderData = getPlaceholderDataFromRenderingData(
      renderingData,
      this.props.name,
      this.props.page.mode.isEditing
    );

    this.isEmpty = !placeholderData.length;

    const components = this.getRenderedComponents(this.props, placeholderData);

    if (this.isEmpty) {
      const rendered = this.props.renderEmpty ? this.props.renderEmpty(components) : components;

      return this.props.page.mode.isEditing ? renderEmptyPlaceholder(rendered) : rendered;
    } else if (this.props.render) {
      return this.props.render(components, placeholderData, childProps);
    } else if (this.props.renderEach) {
      const renderEach = this.props.renderEach;

      return components.map((component, index) => {
        if (component && component.props && component.props.type === 'text/sitecore') {
          return component;
        }

        return renderEach(component, index);
      });
    } else {
      return components;
    }
  }
}

const PlaceholderWithComponentMap = withComponentMap(PlaceholderComponent);

export const Placeholder = withSitecore()(PlaceholderWithComponentMap);
