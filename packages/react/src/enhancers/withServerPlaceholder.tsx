import React from 'react';
import { ComponentType } from 'react';
import { ServerPlaceholder } from '../components/Placeholder/ServerPlaceholder';
import { ComponentRendering } from '@sitecore-content-sdk/core/layout';
import { ComponentMap } from '../components/sharedTypes';
import { Page } from '@sitecore-content-sdk/core/client';

export type ComponentProps = {
  rendering: ComponentRendering;
  placeholders: Record<string, React.ReactNode>;
};

export type WrapperProps = {
  page: Page;
  componentMap: ComponentMap;
  rendering: ComponentRendering;
};

export const withServerPlaceholder = <T extends ComponentProps, W extends T & WrapperProps>(
  Component: ComponentType<T>
) => {
  return (props: W) => {
    const placeholders = props.rendering.placeholders;
    const phProps: Record<string, unknown> = {};
    for (const placeholder of Object.keys(placeholders)) {
      phProps[placeholder] = (
        <ServerPlaceholder
          name={placeholder}
          rendering={props.rendering}
          page={props.page}
          componentMap={props.componentMap}
        />
      );
    }
    const displayName = Component.displayName || Component.name || 'Component';
    const propsCopy: T = { ...props, displayName };

    return <Component {...propsCopy} placeholders={phProps} />;
  };
};
