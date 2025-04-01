import React from 'react';
import { PlaceholderCommon, PlaceholderProps } from './PlaceholderCommon';
import { withComponentMap } from '../enhancers/withComponentMap';
import { ComponentRendering } from '@sitecore-content-sdk/core/layout';
import { PagesEditor } from '@sitecore-content-sdk/core/editing';
import { withSitecoreContext } from '../enhancers/withSitecoreContext';

export interface PlaceholderComponentProps extends PlaceholderProps {
  /**
   * Render props function that is called when the placeholder contains no content components.
   */
  renderEmpty?: (components: React.ReactNode[]) => React.ReactNode;
  /**
   * Render props function that enables control over the rendering of the components in the placeholder.
   * Useful for techniques like wrapping each child in a wrapper component.
   */
  render?: (
    components: React.ReactNode[],
    data: ComponentRendering[],
    props: PlaceholderProps
  ) => React.ReactNode;

  /**
   * Render props function that is called for each non-system component added to the placeholder.
   * Mutually exclusive with `render`.
   */
  renderEach?: (component: React.ReactNode, index: number) => React.ReactNode;
}

class PlaceholderComponent extends PlaceholderCommon<PlaceholderComponentProps> {
  static propTypes = PlaceholderCommon.propTypes;

  isEmpty = false;

  constructor(props: PlaceholderComponentProps) {
    super(props);
  }

  componentDidMount() {
    if (this.isEmpty && PagesEditor.isActive()) {
      PagesEditor.resetChromes();
    }
  }

  /**
   * Renders the placeholder when it is empty. The required CSS styles are applied to the placeholder in edit mode.
   * @param {React.ReactNode | React.ReactElement[]} node react node
   * @returns react node
   */
  renderEmptyPlaceholder(node: React.ReactNode | React.ReactElement[]) {
    return <div className="sc-jss-empty-placeholder">{node}</div>;
  }

  render() {
    const childProps: PlaceholderComponentProps = { ...this.props };

    delete childProps.componentMap;

    if (this.state.error) {
      if (childProps.errorComponent) {
        return <childProps.errorComponent error={this.state.error} />;
      }

      return (
        <div className="sc-jss-placeholder-error">
          A rendering error occurred: {this.state.error.message}.
        </div>
      );
    }

    const renderingData = childProps.rendering;

    const placeholderData = PlaceholderCommon.getPlaceholderDataFromRenderingData(
      renderingData,
      this.props.name,
      this.props.sitecoreContext?.pageEditing
    );

    this.isEmpty = !placeholderData.length;

    const components = this.getComponentsForRenderingData(placeholderData);

    if (this.isEmpty) {
      const rendered = this.props.renderEmpty ? this.props.renderEmpty(components) : components;

      return this.props.sitecoreContext?.pageEditing
        ? this.renderEmptyPlaceholder(rendered)
        : rendered;
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

export const Placeholder = withSitecoreContext()(PlaceholderWithComponentMap);
