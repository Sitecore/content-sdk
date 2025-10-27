import React from 'react';
import { ComponentType } from 'react';
import { AppPlaceholder } from '../components/Placeholder/AppPlaceholder';
import { ComponentRendering } from '@sitecore-content-sdk/core/layout';
import { Page } from '@sitecore-content-sdk/core/client';
import { ComponentMap } from '../components/sharedTypes';

export type ComponentProps = {
  rendering: ComponentRendering;
  placeholders: Record<string, React.ReactNode>;
};

export type WrapperProps = {
  rendering: ComponentRendering;
  page: Page;
  componentMap: ComponentMap;
};

export const withAppPlaceholder = <T extends ComponentProps, W extends T & WrapperProps>(
  Component: ComponentType<T>
) => {
  return (props: W) => {
    const placeholders = props.rendering.placeholders;
    const phProps: Record<string, unknown> = {};
    for (const placeholder of Object.keys(placeholders)) {
      phProps[placeholder] = (
        <AppPlaceholder
          name={placeholder}
          rendering={props.rendering}
          componentMap={props.componentMap}
          page={props.page}
        />
      );
    }
    const displayName = Component.displayName || Component.name || 'Component';
    const propsCopy: T = { ...props, displayName };

    return <Component {...propsCopy} placeholders={phProps} />;
  };
};
