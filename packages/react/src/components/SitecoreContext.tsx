/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import PropTypes from 'prop-types';
import fastDeepEqual from 'fast-deep-equal/es6/react';
import { SitecoreConfig } from '@sitecore-content-sdk/core/config';
import { LayoutServiceContext, LayoutServiceData, RouteData } from '../index';
import { constants } from '@sitecore-content-sdk/core';
import { ComponentMap } from './sharedTypes';

export interface SitecoreContextProps {
  api: SitecoreConfig['api'];
  componentMap: ComponentMap;
  layoutData?: LayoutServiceData;
  children: React.ReactNode;
}

export interface SitecoreContextState {
  setContext: (value: SitecoreContextValue | LayoutServiceData) => void;
  context: SitecoreContextValue;
  api?: SitecoreContextProps['api'];
}

export const SitecoreContextReactContext = React.createContext<SitecoreContextState>(
  {} as SitecoreContextState
);
export const ComponentMapReactContext = React.createContext<ComponentMap>(new Map());

export type SitecoreContextValue = LayoutServiceContext & {
  itemId?: string;
  route?: RouteData;
};

export class SitecoreContext extends React.Component<SitecoreContextProps, SitecoreContextState> {
  static propTypes = {
    children: PropTypes.any.isRequired,
    componentMap: PropTypes.instanceOf(Map),
    layoutData: PropTypes.shape({
      sitecore: PropTypes.shape({
        context: PropTypes.any,
        route: PropTypes.any,
      }),
    }),
  };

  static displayName = 'SitecoreContext';

  constructor(props: SitecoreContextProps) {
    super(props);

    const context: SitecoreContextValue = this.constructContext(props.layoutData);

    let api = props.api;

    if (props.api?.edge?.contextId && !props.api?.edge?.edgeUrl) {
      api = {
        ...props.api,
        edge: {
          ...props.api.edge,
          edgeUrl: constants.SITECORE_EDGE_URL_DEFAULT,
        },
      };
    }

    this.state = {
      context,
      setContext: this.setContext,
      api,
    };
  }

  constructContext(layoutData?: LayoutServiceData): SitecoreContextValue {
    if (!layoutData) {
      return {
        pageEditing: false,
      };
    }

    return {
      route: layoutData.sitecore.route,
      itemId: layoutData.sitecore.route?.itemId,
      ...layoutData.sitecore.context,
    };
  }

  componentDidUpdate(prevProps: SitecoreContextProps) {
    // In case if somebody will manage SitecoreContext state by passing fresh `layoutData` prop
    // instead of using `updateSitecoreContext`
    if (!fastDeepEqual(prevProps.layoutData, this.props.layoutData)) {
      this.setContext(this.props.layoutData);

      return;
    }
  }

  /**
   * Update context state. Value can be @type {LayoutServiceData} which will be automatically transformed
   * or you can provide exact @type {SitecoreContextValue}
   * @param {SitecoreContextValue | LayoutServiceData} value New context value
   */
  setContext = (value: SitecoreContextValue | LayoutServiceData) => {
    this.setState({
      context: value.sitecore
        ? this.constructContext(value as LayoutServiceData)
        : { ...(value as SitecoreContextValue) },
    });
  };

  render() {
    return (
      <ComponentMapReactContext.Provider value={this.props.componentMap}>
        <SitecoreContextReactContext.Provider value={this.state}>
          {this.props.children}
        </SitecoreContextReactContext.Provider>
      </ComponentMapReactContext.Provider>
    );
  }
}
