'use client';
import { ComponentRendering } from '@sitecore-content-sdk/content/layout';
import { ComponentMapReactContext } from '../SitecoreProvider';
import { useContext } from 'react';
import React from 'react';
import { useSitecore } from '../../enhancers/withSitecore';
import { ChildComponentProps } from './models';
import { getComponentForRendering } from './placeholder-utils';

export interface ClientComponentWrapperProps {
  rendering: ComponentRendering;
  componentProps: ChildComponentProps;
  placeholderName: string;
}

export const ClientComponentWrapper = (props: ClientComponentWrapperProps) => {
  const { page } = useSitecore();
  const componentMap = useContext(ComponentMapReactContext);
  const componentPropsWithContext = {
    ...props.componentProps,
    rendering: props.rendering,
    componentMap,
    page,
  };
  const { component: Component } = getComponentForRendering(
    props.rendering,
    props.placeholderName,
    componentMap
  );
  return <Component {...componentPropsWithContext} />;
};
