import React from 'react';
import { PlaceholderProps } from './models';
import { withComponentMap } from '../enhancers/withComponentMap';
import { PagesEditor } from '@sitecore-content-sdk/core/editing';
import { withSitecore } from '../enhancers/withSitecore';
import {
  getComponentsForRenderingData,
  getPlaceholderDataFromRenderingData,
  renderEmptyPlaceholder,
} from './PlaceholderCommon';

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

    const components = getComponentsForRenderingData(this.props, placeholderData);

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
