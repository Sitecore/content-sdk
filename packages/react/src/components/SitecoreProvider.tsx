'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

export const SitecoreProvider: React.FC<SitecoreProviderProps> = ({
  api: apiProp,
  componentMap,
  layoutData,
  children,
}) => {
  const constructContext = useCallback(
    (layoutData?: LayoutServiceData): SitecoreProviderPageContext => {
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
    },
    []
  );

  const [pageContext, setPageContext] = useState<SitecoreProviderPageContext>(() =>
    constructContext(layoutData)
  );

  const api = useMemo(() => {
    if (apiProp?.edge?.contextId && !apiProp?.edge?.edgeUrl) {
      return {
        ...apiProp,
        edge: {
          ...apiProp.edge,
          edgeUrl: constants.SITECORE_EDGE_URL_DEFAULT,
        },
      };
    }
    return apiProp;
  }, [apiProp]);

  const setContext = useCallback(
    (value: SitecoreProviderPageContext | LayoutServiceData) => {
      setPageContext(
        value.sitecore
          ? constructContext(value as LayoutServiceData)
          : { ...(value as SitecoreProviderPageContext) }
      );
    },
    [constructContext]
  );

  useEffect(() => {
    setContext(layoutData);
  }, [layoutData, setContext]);

  const contextValue: SitecoreProviderState = {
    pageContext,
    setContext,
    api,
  };

  return (
    <ComponentMapReactContext.Provider value={componentMap}>
      <SitecoreProviderReactContext.Provider value={contextValue}>
        {children}
      </SitecoreProviderReactContext.Provider>
    </ComponentMapReactContext.Provider>
  );
};

SitecoreProvider.displayName = 'SitecoreProvider';
