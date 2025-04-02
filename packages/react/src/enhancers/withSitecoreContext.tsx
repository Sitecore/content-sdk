﻿import React from 'react';
import { EnhancedOmit } from '@sitecore-content-sdk/core/utils';
import {
  SitecoreContextReactContext,
  SitecoreContextState,
  SitecoreContextValue,
} from '../components/SitecoreContext';

export interface WithSitecoreContextOptions {
  updatable?: boolean;
}

// The props that HOC will inject
export interface WithSitecoreContextProps {
  sitecoreContext: SitecoreContextValue;
  api?: SitecoreContextState['api'];
  updateSitecoreContext?: ((value: SitecoreContextValue) => void) | false;
}

// The props that HOC will receive.
export type WithSitecoreContextHocProps<ComponentProps> = EnhancedOmit<
  ComponentProps,
  keyof WithSitecoreContextProps
>;

/**
 * @param {WithSitecoreContextOptions} [options]
 */
export function withSitecoreContext(options?: WithSitecoreContextOptions) {
  return function withSitecoreContextHoc<ComponentProps extends WithSitecoreContextProps>(
    Component: React.ComponentType<ComponentProps>
  ) {
    return function WithSitecoreContext(props: WithSitecoreContextHocProps<ComponentProps>) {
      return (
        <SitecoreContextReactContext.Consumer>
          {(context) => (
            <Component
              {...(props as ComponentProps)}
              sitecoreContext={context.context}
              api={context.api}
              updateSitecoreContext={options && options.updatable && context.setContext}
            />
          )}
        </SitecoreContextReactContext.Consumer>
      );
    };
  };
}

/**
 * This hook grants acсess to the current Sitecore page context
 * by default JSS includes the following properties in this context:
 * - pageEditing - Provided by Layout Service, a boolean indicating whether the route is being accessed via the Sitecore Editor.
 * - pageState - Like pageEditing, but a string: normal, preview or edit.
 * - site - Provided by Layout Service, an object containing the name of the current Sitecore site context.
 * @param {WithSitecoreContextOptions} [options] hook options
 * @example
 * const EditMode = () => {
 *    const { sitecoreContext } = useSitecoreContext();
 *    return <span>Edit Mode is {sitecoreContext.pageEditing ? 'active' : 'inactive'}</span>
 * }
 * @example
 * const EditMode = () => {
 *    const { sitecoreContext, updateSitecoreContext } = useSitecoreContext({ updatable: true });
 *    const onClick = () => updateSitecoreContext({ pageEditing: true });
 *    return <span onClick={onClick}>Edit Mode is {sitecoreContext.pageEditing ? 'active' : 'inactive'}</span>
 * }
 * @returns {object} { sitecoreContext, updateSitecoreContext }
 */
export function useSitecoreContext(options?: WithSitecoreContextOptions): WithSitecoreContextProps {
  const reactContext = React.useContext(SitecoreContextReactContext);
  const updatable = options?.updatable;

  return {
    api: reactContext.api,
    sitecoreContext: reactContext.context,
    updateSitecoreContext: updatable ? reactContext.setContext : undefined,
  };
}
