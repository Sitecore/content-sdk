'use client';
import React from 'react';
import { ComponentType } from 'react';
import { ComponentRendering } from '@sitecore-content-sdk/content/layout';
import { Page } from '@sitecore-content-sdk/content/client';
import { ComponentMap } from '../components/sharedTypes';
import { Placeholder } from '../components/Placeholder';

export type ComponentProps = {
  rendering: ComponentRendering;
  placeholders: Record<string, React.ReactNode>;
};

export type WrapperProps = {
  rendering: ComponentRendering;
  page: Page;
  componentMap: ComponentMap;
};

/**
 * Provides a slot-like functionality by wrapping a component and rendering placeholders defined in the layout data.
 * @param {ComponentType<T>} Component - The component to be wrapped around placeholders.
 * @returns {React.ReactNode} A new component that renders the original component with placeholders.
 * @public
 */
export const withClientPlaceholder = <T extends ComponentProps, W extends T & WrapperProps>(
  Component: ComponentType<T>
) => {
  return (props: W) => {
    const placeholders = props.rendering.placeholders || {};
    const phProps: Record<string, unknown> = {};

    for (const placeholder of Object.keys(placeholders)) {
      phProps[placeholder] = <Placeholder name={placeholder} rendering={props.rendering} />;
    }

    const displayName = Component.displayName || Component.name || 'Component';
    const propsCopy: T = { ...props, displayName };

    return <Component {...propsCopy} placeholders={phProps} />;
  };
};
