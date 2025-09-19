import React from 'react';
import { ComponentType } from 'react';
import { ServerPlaceholder } from '../components/Placeholder';
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
  Component: ComponentType<T>,
  placeholders: string[]
) => {
  return (props: W) => {
    const phProps: Record<string, unknown> = {};
    for (const placeholder of placeholders) {
      phProps[placeholder] = (
        <ServerPlaceholder
          name={placeholder}
          rendering={props.rendering}
          page={props.page}
          componentMap={props.componentMap}
        />
      );
    }
    const propsCopy: T = { ...props };

    return <Component {...propsCopy} placeholders={phProps} />;
  };
};
