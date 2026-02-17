'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import fastDeepEqual from 'fast-deep-equal/es6/react';
import { Page } from '@sitecore-content-sdk/content/client';
import { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import { constants } from '@sitecore-content-sdk/core';
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
 * @param {SitecoreProviderProps} props - The props for the SitecoreProvider component.
 * @param {SitecoreProviderProps['api']} props.api - The API configuration.
 * @param {SitecoreProviderProps['page']} props.page - The page data.
 * @param {SitecoreProviderProps['componentMap']} props.componentMap - The component map.
 * @param {SitecoreProviderProps['loadImportMap']} props.loadImportMap - The function to load the import map.
 * @param {React.ReactNode} props.children - The children to render.
 * @returns {React.ReactNode} The SitecoreProvider component.
 * @public
 */
export const SitecoreProvider = (props: SitecoreProviderProps) => {
  const { api: propsApi, page: propsPage, componentMap, loadImportMap, children } = props;

  // Apply default edgeUrl if any Edge ID is present but no edgeUrl
  const api = useMemo(() => {
    if (
      (propsApi?.edge?.contextId || propsApi?.edge?.clientContextId) &&
      !propsApi?.edge?.edgeUrl
    ) {
      return {
        ...propsApi,
        edge: {
          ...propsApi.edge,
          edgeUrl: constants.SITECORE_EDGE_URL_DEFAULT,
        },
      };
    }
    return propsApi;
  }, [propsApi]);

  const [page, setPageInternal] = useState<Page>(propsPage);

  // Memoize setPage callback
  const setPage = useCallback((value: Page) => {
    setPageInternal(value);
  }, []);

  // Handle page prop changes using useEffect instead of componentDidUpdate
  useEffect(() => {
    if (!fastDeepEqual(propsPage, page)) {
      setPage(propsPage);
    }
  }, [propsPage, page, setPage]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo<SitecoreProviderState>(
    () => ({
      page,
      setPage,
      api,
    }),
    [page, setPage, api]
  );

  return (
    <ImportMapReactContext.Provider value={loadImportMap}>
      <ComponentMapReactContext.Provider value={componentMap}>
        <SitecoreProviderReactContext.Provider value={contextValue}>
          {children}
        </SitecoreProviderReactContext.Provider>
      </ComponentMapReactContext.Provider>
    </ImportMapReactContext.Provider>
  );
};

SitecoreProvider.displayName = 'SitecoreProvider';
