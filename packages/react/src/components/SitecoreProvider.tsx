'use client';
import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import fastDeepEqual from 'fast-deep-equal/es6/react';
import { Page } from '@sitecore-content-sdk/content/client';
import { SitecoreConfig } from '@sitecore-content-sdk/content/config';
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
   * When omitted, an empty import map is used (ex: code generation is disabled).
   */
  loadImportMap?: () => Promise<ImportMapImport>;

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
  setPage?: (value: Page) => void;
  /**
   * The page data.
   */
  page: Page;
  /**
   * The dynamic import for import map to be used in variant generation mode.
   */
  loadImportMap: () => Promise<ImportMapImport>;
  /**
   * The component map to use for rendering components.
   */
  componentMap: ComponentMap;
  /**
   * The API configuration defined in the `SitecoreConfig`.
   */
  api?: SitecoreProviderProps['api'];
}

/**
 * The options for the useSitecore hook.
 * @public
 */
export interface UseSitecoreOptions {
  /**
   * If set to true, the `updateContext` method will be injected into the component props.
   */
  updatable?: boolean;
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
  const { api, page: propsPage, componentMap, loadImportMap = () => Promise.resolve({ default: [] }), children } = props;

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
      componentMap,
      loadImportMap,
    }),
    [page, setPage, api, componentMap, loadImportMap]
  );

  return (
    <SitecoreProviderReactContext.Provider value={contextValue}>
      {children}
    </SitecoreProviderReactContext.Provider>
  );
};

SitecoreProvider.displayName = 'SitecoreProvider';

/**
 * This hook grants acсess to the current Sitecore page and api.
 * @param {UseSitecoreOptions} [options] hook options
 * @example
 * const EditMode = () => {
 *    const { page } = useSitecore();
 *    return <span>Edit Mode is {page.mode.isEditing ? 'active' : 'inactive'}</span>
 * }
 * @returns {SitecoreProviderState} The current Sitecore context, including the page and api.
 * @public
 */
export function useSitecore(options?: UseSitecoreOptions): SitecoreProviderState {
  const scContext = useContext(SitecoreProviderReactContext);
  const updatable = options?.updatable;

  return {
    ...scContext,
    setPage: updatable ? scContext.setPage : undefined,
  };
}
