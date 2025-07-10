'use client';

import React from 'react';
import {
  getPlaceholderDataFromRenderingData,
  PaththroughPlaceholderProps,
  PlaceholderProps,
} from './PlaceholderCommon';
import { withComponentMap } from '../enhancers/withComponentMap';
import { ComponentRendering } from '@sitecore-content-sdk/core/layout';
import { PagesEditor } from '@sitecore-content-sdk/core/editing';
import { withSitecore } from '../enhancers/withSitecore';
import { BasePlaceholder } from './BasePlaceholder';
import { knownPhProps } from './placeholder-utils';

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

class PlaceholderComponent extends React.Component<
  PlaceholderComponentProps & PaththroughPlaceholderProps
> {
  isEmpty = false;
  state: Readonly<{ error?: Error }>;

  constructor(props: PlaceholderComponentProps & PaththroughPlaceholderProps) {
    super(props);
    this.state = {};
  }

  componentDidCatch(error: Error) {
    this.setState({ error });
  }

  componentDidMount() {
    if (this.isEmpty && PagesEditor.isActive()) {
      PagesEditor.resetChromes();
    }
  }

  render() {
    const paththroughProps = knownPhProps.reduce(
      (acc, prop) => {
        delete acc[prop];
        return acc;
      },
      { ...this.props }
    );

    if (this.state.error) {
      if (this.props.errorComponent) {
        return <this.props.errorComponent error={this.state.error} />;
      }

      return (
        <div className="sc-jss-placeholder-error">
          A rendering error occurred: {this.state.error.message}.
        </div>
      );
    }

    const placeholderData = getPlaceholderDataFromRenderingData(
      this.props.rendering,
      this.props.name,
      this.props.pageContext?.pageEditing
    );

    this.isEmpty = !placeholderData.length;

    return <BasePlaceholder placeholderProps={this.props} paththroughProps={paththroughProps} />;
  }
}

const PlaceholderWithComponentMap = withComponentMap(PlaceholderComponent);

export const Placeholder = withSitecore()(PlaceholderWithComponentMap);
