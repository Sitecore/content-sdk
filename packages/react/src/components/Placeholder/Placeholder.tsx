'use client';
import React, { useEffect } from 'react';
import { PlaceholderProps } from './models';
import { PagesEditor } from '@sitecore-content-sdk/content/editing';
import { getPlaceholderRenderings } from './placeholder-utils';
import { useSitecore } from '../SitecoreProvider';
import { AppPlaceholder } from './AppPlaceholder';

/**
 * The Placeholder component.
 * Renders the components assigned to a placeholder in Sitecore. It also supports custom rendering and empty state.
 * @param {PlaceholderProps} props - The props for the Placeholder component.
 * @returns The rendered Placeholder component.
 * @public
 */
export const Placeholder = (props: PlaceholderProps) => {
  const { page, componentMap } = useSitecore();
  const placeholderRenderings = getPlaceholderRenderings(
    props.rendering,
    props.name,
    page.mode.isEditing
  );
  const isEmpty = !placeholderRenderings.length;
  useEffect(() => {
    if (isEmpty && PagesEditor.isActive()) {
      PagesEditor.resetChromes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array so it runs only once on mount

  const appProps = { ...props, page, componentMap };

  return <AppPlaceholder {...appProps} />;
};

