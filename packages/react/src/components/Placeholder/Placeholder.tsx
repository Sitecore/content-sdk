import React from 'react';
import { PlaceholderProps } from './models';
import { withComponentMap } from '../../enhancers/withComponentMap';
import { PagesEditor } from '@sitecore-content-sdk/core/editing';
import { withSitecore } from '../../enhancers/withSitecore';
import {
  getComponentForRendering,
  getPlaceholderRenderings,
  getRenderedComponentProps,
  renderEmptyPlaceholder,
} from './placeholder-utils';
import { ComponentRendering } from '@sitecore-content-sdk/core/layout';
import { PlaceholderMetadata } from './PlaceholderMetadata';
import ErrorBoundary from '../ErrorBoundary';

export class PlaceholderComponent extends React.Component<PlaceholderProps> {
  isEmpty = false;
  state: Readonly<{ error?: Error }>;

  constructor(props: PlaceholderProps) {
    super(props);
    this.state = {};
  }

  /**
   * Renders the components for the placeholder based on the provided rendering data.
   * @param {PlaceholderProps} props placeholder component props
   * @param {ComponentRendering[]} placeholderRenderings renderings within placeholder
   * @returns {React.ReactNode | React.ReactElement[]} rendered components
   */
  static getRenderedComponents = (
    props: PlaceholderProps,
    placeholderRenderings: ComponentRendering[]
  ) => {
    const { name, missingComponentComponent, hiddenRenderingComponent } = props;

    const transformedComponents = placeholderRenderings
      .map((componentRendering: ComponentRendering, index: number) => {
        const key = componentRendering.uid || `component-${index}`;

        const renderedProps = getRenderedComponentProps(props, componentRendering, key);

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
          const errorBoundaryKey = rendered.type + '-' + index;

          const disableSuspense = props.disableSuspense || false;
          return (
            <ErrorBoundary
              data-testid="error-boundary"
              key={errorBoundaryKey}
              errorComponent={props.errorComponent}
              componentLoadingMessage={props.componentLoadingMessage}
              isDynamic={component.dynamic}
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

    const placeholderRenderings = getPlaceholderRenderings(
      renderingData,
      this.props.name,
      this.props.page.mode.isEditing
    );

    this.isEmpty = !placeholderRenderings.length;

    const components = PlaceholderComponent.getRenderedComponents(
      this.props,
      placeholderRenderings
    );

    if (this.isEmpty) {
      const rendered = this.props.renderEmpty ? this.props.renderEmpty(components) : components;

      return this.props.page.mode.isEditing ? renderEmptyPlaceholder(rendered) : rendered;
    } else if (this.props.render) {
      return this.props.render(components, placeholderRenderings, childProps);
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
