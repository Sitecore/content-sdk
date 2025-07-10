'use client';

import React from 'react';
import { EnhancedOmit } from '@sitecore-content-sdk/core/utils';
import {
  SitecoreProviderReactContext,
  SitecoreProviderState,
  SitecoreProviderPageContext,
} from '../components/SitecoreProvider';

export interface WithSitecoreOptions {
  /**
   * If set to true, the `updateContext` method will be injected into the component props.
   */
  updatable?: boolean;
}

// The props that HOC will inject
export interface WithSitecoreProps {
  /**
   * The current page context.
   */
  pageContext: SitecoreProviderPageContext;
  /**
   * The API configuration defined in the `SitecoreConfig`.
   */
  api?: SitecoreProviderState['api'];
  /**
   * Method to update the page context. This is only available if `updatable` is set to true.
   * @param {SitecoreProviderPageContext} value New page context value.
   * @returns {void}
   */
  updateContext?: ((value: SitecoreProviderPageContext) => void) | false;
}

// The props that HOC will receive.
export type WithSitecoreHocProps<ComponentProps> = EnhancedOmit<
  ComponentProps,
  keyof WithSitecoreProps
>;

/**
 * @param {WithSitecoreProviderOptions} [options]
 */
export function withSitecore(options?: WithSitecoreOptions) {
  return function withSitecoreProviderHoc<ComponentProps extends WithSitecoreProps>(
    Component: React.ComponentType<ComponentProps>
  ) {
    return function WithSitecoreProvider(props: WithSitecoreHocProps<ComponentProps>) {
      return (
        <SitecoreProviderReactContext.Consumer>
          {(value) => (
            <Component
              {...(props as ComponentProps)}
              pageContext={value.pageContext}
              api={value.api}
              updateContext={options && options.updatable && value.setContext}
            />
          )}
        </SitecoreProviderReactContext.Consumer>
      );
    };
  };
}

/**
 * This hook grants acсess to the current Sitecore page context and api.
 * by default JSS includes the following properties in this context:
 * - pageEditing - Provided by Layout Service, a boolean indicating whether the route is being accessed via the Sitecore Editor.
 * - pageState - Like pageEditing, but a string: normal, preview or edit.
 * - site - Provided by Layout Service, an object containing the name of the current Sitecore site context.
 * @param {WithSitecoreOptions} [options] hook options
 * @example
 * const EditMode = () => {
 *    const { pageContext } = useSitecore();
 *    return <span>Edit Mode is {pageContext.pageEditing ? 'active' : 'inactive'}</span>
 * }
 * @example
 * const EditMode = () => {
 *    const { pageContext, updateContext } = useSitecore({ updatable: true });
 *    const onClick = () => updateContext({ pageEditing: true });
 *    return <span onClick={onClick}>Edit Mode is {pageContext.pageEditing ? 'active' : 'inactive'}</span>
 * }
 * @returns {object} { api, pageContext, updateContext }
 */
export function useSitecore(options?: WithSitecoreOptions): WithSitecoreProps {
  const reactContext = React.useContext(SitecoreProviderReactContext);
  const updatable = options?.updatable;

  return {
    api: reactContext.api,
    pageContext: reactContext.pageContext,
    updateContext: updatable ? reactContext.setContext : undefined,
  };
}
