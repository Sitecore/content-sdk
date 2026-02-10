'use client';
import React from 'react';
import fastDeepEqual from 'fast-deep-equal/es6/react';
import { Page } from '@sitecore-content-sdk/content/client';
import { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import { resolveEdgeUrl } from '@sitecore-content-sdk/core/tools';
import { ComponentMap } from './sharedTypes';
import { ImportMapImport } from './DesignLibrary/models';

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
   * The page data.
   */
  page: Page;
  /**
   * The dynamic import for import map to be used in variant generation mode.
   */
  loadImportMap: () => Promise<ImportMapImport>;

  children: React.ReactNode;
}

/**
 * The state for the SitecoreProvider component.
 * @public
 */
export interface SitecoreProviderState {
  /**
   * Method to set the page.
   * @param {Page} value New page  value.
   * @returns {void}
   */
  setPage: (value: Page) => void;
  /**
   * The current page.
   */
  page: Page;
  /**
   * The API configuration defined in the `SitecoreConfig`.
   */
  api?: SitecoreProviderProps['api'];
}

/**
 * The context for the SitecoreProvider component.
 * @public
 */
export const SitecoreProviderReactContext = React.createContext<SitecoreProviderState>(
  {} as SitecoreProviderState
);

export const ComponentMapReactContext = React.createContext<ComponentMap>(new Map());

export const ImportMapReactContext = React.createContext<
  (() => Promise<ImportMapImport>) | undefined
>(undefined);

/**
 * The SitecoreProvider component.
 * @public
 */
export class SitecoreProvider extends React.Component<
  SitecoreProviderProps,
  SitecoreProviderState
> {
  static displayName = 'SitecoreProvider';

  constructor(props: SitecoreProviderProps) {
    super(props);

    // If any Edge ID is present but no edgeUrl, resolve using custom hostname or default
    let api = props.api;
    if (
      (props.api?.edge?.contextId || props.api?.edge?.clientContextId) &&
      !props.api?.edge?.edgeUrl
    ) {
      api = {
        ...props.api,
        edge: {
          ...props.api.edge,
          edgeUrl: resolveEdgeUrl(),
        },
      };
    }

    this.state = {
      page: props.page,
      setPage: this.setPage,
      api,
    };
  }

  componentDidUpdate(prevProps: SitecoreProviderProps) {
    // In case if somebody will manage SitecoreProvider state by passing fresh `page` prop
    // instead of using `updateContext`
    if (!fastDeepEqual(prevProps.page, this.props.page)) {
      this.setPage(this.props.page);

      return;
    }
  }

  /**
   * Update page state.
   * @param {Page} value New page value
   */
  setPage = (value: Page) => {
    this.setState({
      page: value,
    });
  };

  render() {
    return (
      <ImportMapReactContext.Provider value={this.props.loadImportMap}>
        <ComponentMapReactContext.Provider value={this.props.componentMap}>
          <SitecoreProviderReactContext.Provider value={this.state}>
            {this.props.children}
          </SitecoreProviderReactContext.Provider>
        </ComponentMapReactContext.Provider>
      </ImportMapReactContext.Provider>
    );
  }
}
