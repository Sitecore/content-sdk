'use client';
import React from 'react';
import { EnhancedOmit } from '@sitecore-content-sdk/core/tools';
import {
  SitecoreProviderState,
  useSitecore,
  UseSitecoreOptions,
} from '../components/SitecoreProvider';

/**
 * The props that HOC will inject into the wrapped component — the full Sitecore context state.
 * @public
 */
export type WithSitecoreProps = SitecoreProviderState;

/**
 * The type of the props that the HOC-wrapped component will receive (injected props omitted).
 * @public
 */
export type WithSitecoreHocProps<ComponentProps> = EnhancedOmit<
  ComponentProps,
  keyof WithSitecoreProps
>;

/**
 * @deprecated `useSitecore` hook is a better practice for consuming Sitecore context in components
 * @param {UseSitecoreOptions} [options] - Options for whether return page context update method alongside the rest of context
 * @returns A higher-order component that injects Sitecore context into the wrapped component.
 * @public
 */
export function withSitecore(options?: UseSitecoreOptions) {
  return function withSitecoreProviderHoc<
    ComponentProps extends Partial<SitecoreProviderState> & Pick<SitecoreProviderState, 'page'>
  >(Component: React.ComponentType<ComponentProps>) {
    return function WithSitecoreProvider(props: WithSitecoreHocProps<ComponentProps>) {
      const scContext = useSitecore(options);
      return (
        <Component
          {...(props as ComponentProps)}
          page={scContext.page}
          api={scContext.api}
          setPage={scContext.setPage}
          componentMap={scContext.componentMap}
          loadImportMap={scContext.loadImportMap}
        />
      );
    };
  };
}
