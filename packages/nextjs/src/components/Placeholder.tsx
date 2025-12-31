'use client';
import React, { useContext } from 'react';
import {
  Placeholder as ReactPlaceholder,
  PlaceholderComponentProps,
  WithSitecoreProps,
  EnhancedOmit,
} from '@sitecore-content-sdk/react';
import { ComponentPropsReactContext } from './ComponentPropsContext';

/**
 * React Placeholder component wrapped by withSitecore, so these properties shouldn't be passed to the Next.js Placeholder.
 */
type PlaceholderProps = EnhancedOmit<PlaceholderComponentProps, keyof WithSitecoreProps>;

/**
 * The Placeholder component.
 * @param {PlaceholderProps} props component props
 * @public
 */
export const Placeholder = (props: PlaceholderProps) => {
  const componentPropsContext = useContext(ComponentPropsReactContext);

  return (
    <ReactPlaceholder
      {...props}
      re
      modifyComponentProps={(initialProps) => {
        initialProps = props.modifyComponentProps?.(initialProps) ?? initialProps;

        if (!initialProps.rendering.uid) return initialProps;

        const data = componentPropsContext[initialProps.rendering.uid] as {
          [key: string]: unknown;
        };

        return { ...initialProps, ...data };
      }}
    />
  );
};
