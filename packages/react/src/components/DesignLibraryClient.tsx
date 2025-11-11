'use client';
import React, { useEffect } from 'react';
import { updateServerComponentAction } from '../server-actions/update-server-component-action';
import { useSitecore } from '../enhancers/withSitecore';
import { ComponentRendering } from '@sitecore-content-sdk/core/layout';
import {
  DesignLibraryStatus,
  getDesignLibraryStatusEvent,
  addComponentUpdateHandler,
} from '@sitecore-content-sdk/core/editing';
import { postToDL, sendErrorEvent } from './DesignLibrary';
import * as codegen from '@sitecore-content-sdk/core/codegen';

export type DesignLibraryClientProps = {
  designLibraryStatus: DesignLibraryStatus;
  component: ComponentRendering;
  importMap?: codegen.ImportEntryPayload[];
  importMapError?: string;
  previewComponentStyle?: string;
};

export const DesignLibraryClient = ({
  designLibraryStatus,
  component,
  importMap,
  importMapError,
  previewComponentStyle,
}: DesignLibraryClientProps) => {
  const { page } = useSitecore();
  const isVariantGeneration = page.mode.designLibrary?.isVariantGeneration;
  const isDesignLibrary = page.mode.isDesignLibrary;

  useEffect(() => {
    let unsubPreview: () => void;
    // - post to DL designlibraryStatus
    postToDL(getDesignLibraryStatusEvent(designLibraryStatus, component.uid));

    // add the component update handler
    const unsubUpdate = addComponentUpdateHandler(component, (updated) => {
      console.log('updated component: ', updated);
      updateServerComponentAction({ uid: updated.uid, updatedComponent: updated });
    });

    if (importMapError) {
      sendErrorEvent(component.uid, importMapError, codegen.DesignLibraryPreviewError.RenderInit);
    } else {
      if (isDesignLibrary && isVariantGeneration) {
        // add the component preview handler
        unsubPreview = codegen.addServerComponentPreviewHandler((eventArgs) => {
          updateServerComponentAction({ uid: component.uid, previewComponent: eventArgs });
        });

        // post importmap event
        const importMapEvent = codegen.getDesignLibraryImportMapPayloadEvent(
          component.uid,
          importMap
        );
        postToDL(importMapEvent);

        // const props event
        const propsEvent = codegen.getDesignLibraryComponentPropsEvent(
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
