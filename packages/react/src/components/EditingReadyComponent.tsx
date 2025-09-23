'use client';
import React, { useEffect } from 'react';

/**
 * Component notifies the Pages when all of react page content is loaded.
 * This ensures additional Pages markup can be applied at the correct time.
 */
export const EditingReadyComponent = () => {
  useEffect(() => {
    const target = window.parent && window.parent !== window ? window.parent : window;
    target.postMessage({ name: 'contentsdk-editing:ready' }, '*');
  }, []);
  return <></>;
};
