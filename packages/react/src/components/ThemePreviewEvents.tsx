'use client';
import { useEffect } from 'react';
import { useSitecore } from './SitecoreProvider';
import { addThemeUpdateHandler } from '@sitecore-content-sdk/content/editing';

/**
 * Listens for `theme-update` messages while in editing mode (Pages full-page editing
 * or Design Library low-code editing) and injects the received CSS for instant theme preview.
 * No-ops when `theming.mode` is `'none'` (the default).
 * @returns {null} renders nothing
 * @public
 */
export const ThemePreviewEvents = () => {
  const {
    page: { mode },
    theming,
  } = useSitecore();

  useEffect(() => {
    if (!mode.isEditing || theming?.mode === 'none') return;

    const unsubscribe = addThemeUpdateHandler();

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [mode.isEditing, theming?.mode]);

  return null;
};

