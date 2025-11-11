'use client';
import React, { useEffect } from 'react';
import {
  getDesignLibraryStatusEvent,
  addComponentUpdateHandler,
} from '@sitecore-content-sdk/core/editing';
import * as codegen from '@sitecore-content-sdk/core/codegen';
import { useSitecore } from '../../enhancers/withSitecore';
import { updateServerComponentAction } from '../../server-actions/update-server-component-action';
import { postToDL, sendErrorEvent } from './design-library-utils';
import { DesignLibraryClientEventsProps } from './models';

let {
  getDesignLibraryComponentPropsEvent,
  addServerComponentPreviewHandler,
  getDesignLibraryImportMapEvent,
} = codegen;

/**
 * Design Library component for rendering server components in app router application.
 * DesignLibraryClientEvents component serves as a communication bridge between DesignLibraryServer and the Design Studio on the client side.
 * It posts messages to Design Library Studio and sets up handlers to receive updates and previews which are then passed to the server component via server function updateServerComponentAction.
 * @param {DesignLibraryClientEventsProps} [props]
 * @param {DesignLibraryStatus} [props.designLibraryStatus] The design library status to be posted as a message to the Design Studio.
 * @param {ComponentRendering} [props.component] The component rendering data that is being edited in the Design Studio.
 * @param {ImportEntryInfo[]} [props.importMap] The import map payload to be posted as a message to the Design Studio.
 * @param {string} [props.importMapError] Any error that occurred while loading the import map to be posted as a message to the Design Studio.
 * @param {string} [props.previewComponentStyle] The preview component style contents to be added to the DOM when rendering generated component.
 * @returns {JSX.Element} emtpty JSX element.
 */
export const DesignLibraryClientEvents = ({
  designLibraryStatus,
  component,
  importMap,
  importMapError,
  previewComponentStyle,
}: DesignLibraryClientEventsProps) => {
  const { page } = useSitecore();
  const isVariantGeneration = page.mode.designLibrary?.isVariantGeneration;
  const isDesignLibrary = page.mode.isDesignLibrary;

  useEffect(() => {
    let unsubPreview: () => void;
    // - post to DL designlibraryStatus
    postToDL(getDesignLibraryStatusEvent(designLibraryStatus, component.uid));

    // add the component update handler
    const unsubUpdate = addComponentUpdateHandler(component, (updated) => {
      updateServerComponentAction({ uid: updated.uid, updatedComponent: updated });
    });

    if (importMapError) {
      sendErrorEvent(component.uid, importMapError, codegen.DesignLibraryPreviewError.RenderInit);
    } else {
      if (isDesignLibrary && isVariantGeneration) {
        // add the component preview handler
        unsubPreview = addServerComponentPreviewHandler((eventArgs) => {
          updateServerComponentAction({ uid: component.uid, previewComponent: eventArgs });
        });

        // post importmap event
        const importMapEvent = getDesignLibraryImportMapEvent(component.uid, importMap);
        postToDL(importMapEvent);

        // const props event
        const propsEvent = getDesignLibraryComponentPropsEvent(
          component.uid,
          component.fields,
          component.params
        );
        postToDL(propsEvent);

        if (previewComponentStyle) {
          // create new style element and attach it to DOM
          const style = document.createElement('style');
          const styleId = 'content-sdk-style-preview';
          const styleElement = document.getElementById(styleId);

          // remove existing style element if it exists to avoid duplicates
          if (styleElement) {
            styleElement.remove();
          }

          style.setAttribute('id', styleId);
          style.innerHTML = previewComponentStyle;
          document.head.appendChild(style);
        }
      }
    }

    return () => {
      unsubUpdate && unsubUpdate();
      unsubPreview && unsubPreview();
    };
  }, []);

  return <></>;
};
