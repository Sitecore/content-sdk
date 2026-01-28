'use client';
import { isEditorActive, resetEditorChromes } from '@sitecore-content-sdk/content/editing';
import React, { useEffect, JSX } from 'react';
/**
 * Updates editing chromes in app router / RSC context.
 * This ensures all the relevant Pages editing markup is applied once all client components are loaded.
 * @public
 */
export const ClientEditingChromesUpdate = (): JSX.Element => {
  useEffect(() => {
    if (isEditorActive()) {
      resetEditorChromes();
    }
  }, []);
  return <></>;
};
