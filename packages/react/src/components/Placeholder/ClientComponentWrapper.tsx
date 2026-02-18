'use client';
import { ComponentRendering } from '@sitecore-content-sdk/content/layout';
import { useSitecore } from '../SitecoreProvider';
import React from 'react';
import { ChildComponentProps } from './models';
import { getComponentForRendering } from './placeholder-utils';

export interface ClientComponentWrapperProps {
  rendering: ComponentRendering;
  componentProps: ChildComponentProps;
  placeholderName: string;
}

export const ClientComponentWrapper = (props: ClientComponentWrapperProps) => {
  const { page, componentMap } = useSitecore();
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
