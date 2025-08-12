import React, { JSX } from 'react';
import {
  ComponentMap,
  ServerPlaceholder,
  SitecoreProviderPageContext,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

const PartialDesignDynamicPlaceholder = (
  props: ComponentProps & {
    componentMap: ComponentMap;
    pageContext: SitecoreProviderPageContext;
  }
): JSX.Element => (
  <ServerPlaceholder
    name={props.rendering?.params?.sig || ''}
    rendering={props.rendering}
    componentMap={props.componentMap}
    pageContext={props.pageContext}
  />
);

export default PartialDesignDynamicPlaceholder;

export const isRsc = true;
