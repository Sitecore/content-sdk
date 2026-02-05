'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import fastDeepEqual from 'fast-deep-equal/es6/react';
import { Page } from '@sitecore-content-sdk/content/client';
import { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import { constants } from '@sitecore-content-sdk/core';
import { ComponentMap } from './sharedTypes';
import { ImportMapImport } from './DesignLibrary/models';
import {
  SitecoreProviderReactContext,
  ComponentMapReactContext,
  ImportMapReactContext,
  SitecoreProviderState,
} from './SitecoreProvider';

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
 * The SitecoreProvider component - Optimized functional component version.
 * 
 * This is a modernized version of the SitecoreProvider that uses React hooks
 * instead of class component lifecycle methods. It provides the same functionality
 * with better React 19+ optimization support.
 * 
 * @public
 */
export function SitecoreProviderOptimized(props: SitecoreProviderProps) {
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
}

SitecoreProviderOptimized.displayName = 'SitecoreProviderOptimized';
