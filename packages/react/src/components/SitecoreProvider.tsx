/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import fastDeepEqual from 'fast-deep-equal/es6/react';
import { SitecoreConfig } from '@sitecore-content-sdk/core/config';
import { LayoutServiceContext, LayoutServiceData, RouteData } from '../index';
import { constants } from '@sitecore-content-sdk/core';
import { ComponentMap } from './sharedTypes';

export interface SitecoreProviderProps {
  /**
   * The API configuration defined in the `SitecoreConfig`.
   */
  api: SitecoreConfig['api'];
  /**
   * The component map to use for rendering components.
   */
  componentMap: ComponentMap;
  /**
   * The Sitecore Layout data.
   */
  layoutData?: LayoutServiceData;
  children: React.ReactNode;
}

export interface SitecoreProviderState {
  /**
   * Method to set the page context.
   * @param {SitecoreProviderPageContext | LayoutServiceData} value New page context value.
   * @returns {void}
   */
  setContext: (value: SitecoreProviderPageContext | LayoutServiceData) => void;
  /**
   * The current page context.
   */
  pageContext: SitecoreProviderPageContext;
  /**
   * The API configuration defined in the `SitecoreConfig`.
   */
  api?: SitecoreProviderProps['api'];
}

export const SitecoreProviderReactContext = React.createContext<SitecoreProviderState>(
  {} as SitecoreProviderState
);
export const ComponentMapReactContext = React.createContext<ComponentMap>(new Map());

/**
 * The page context provided by the SitecoreProvider.
 */
export type SitecoreProviderPageContext = LayoutServiceContext & {
  itemId?: string;
  route?: RouteData;
};

export class SitecoreProvider extends React.Component<
  SitecoreProviderProps,
  SitecoreProviderState
> {
  static displayName = 'SitecoreProvider';

  constructor(props: SitecoreProviderProps) {
    super(props);

    const pageContext: SitecoreProviderPageContext = this.constructContext(props.layoutData);

    // If any Edge ID is present but no edgeUrl, apply the default
    let api = props.api;
    if (
      (props.api?.edge?.contextId || props.api?.edge?.clientContextId) &&
      !props.api?.edge?.edgeUrl
    ) {
      api = {
        ...props.api,
        edge: {
          ...props.api.edge,
          edgeUrl: constants.SITECORE_EDGE_URL_DEFAULT,
        },
      };
    }

    this.state = {
      pageContext,
      setContext: this.setContext,
      api,
    };
  }

  constructContext(layoutData?: LayoutServiceData): SitecoreProviderPageContext {
    if (!layoutData) {
      return { pageEditing: false };
    }

    return {
      route: layoutData.sitecore.route,
      itemId: layoutData.sitecore.route?.itemId,
      ...layoutData.sitecore.context,
    };
  }

  componentDidUpdate(prevProps: SitecoreProviderProps) {
    // In case if somebody will manage SitecoreProvider state by passing fresh `layoutData` prop
    // instead of using `updateContext`
    if (!fastDeepEqual(prevProps.layoutData, this.props.layoutData)) {
      this.setContext(this.props.layoutData);

      return;
    }
  }

  /**
   * Update context state. Value can be @type {LayoutServiceData} which will be automatically transformed
   * or you can provide exact @type {SitecoreProviderPageContext}
   * @param {SitecoreProviderPageContext | LayoutServiceData} value New context value
   */
  setContext = (value: SitecoreProviderPageContext | LayoutServiceData) => {
    this.setState({
      pageContext: value.sitecore
        ? this.constructContext(value as LayoutServiceData)
        : { ...(value as SitecoreProviderPageContext) },
    });
  };

  render() {
    return (
      <ComponentMapReactContext.Provider value={this.props.componentMap}>
        <SitecoreProviderReactContext.Provider value={this.state}>
          {this.props.children}
        </SitecoreProviderReactContext.Provider>
      </ComponentMapReactContext.Provider>
    );
  }
}
