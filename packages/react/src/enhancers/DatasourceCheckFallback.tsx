'use client';
import React, { JSX } from 'react';
import { useSitecore } from '../components/SitecoreProvider';

export interface DatasourceCheckFallbackProps {
  /**
   * Element rendered in editing mode.
   */
  editingError: React.ReactNode;
  /**
   * Wrapped component element, rendered in Design Library mode.
   */
  children: React.ReactNode;
}

/**
 * Resolves the missing-datasource outcome from `SitecoreProvider` context when `page` is not available in props.
 * Accepts only React elements so it can be rendered from a Server Component.
 * @param {DatasourceCheckFallbackProps} props component props
 * @returns {JSX.Element | null} the wrapped component in Design Library, the editing error in editing mode, otherwise null
 */
export const DatasourceCheckFallback = ({
  editingError,
  children,
}: DatasourceCheckFallbackProps): JSX.Element | null => {
  const { page } = useSitecore();

  const isDesignLibrary = page?.mode?.isDesignLibrary;
  if (isDesignLibrary) {
    return <>{children}</>;
  }

  return page?.mode?.isEditing ? <>{editingError}</> : null;
};
