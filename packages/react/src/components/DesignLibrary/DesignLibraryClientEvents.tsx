'use client';
import React, { useEffect } from 'react';
import * as dlHelpers from '@sitecore-content-sdk/core/editing';
import * as codegen from '@sitecore-content-sdk/core/codegen';
import { useSitecore } from '../../enhancers/withSitecore';
import { updateServerComponentAction } from '../../server-actions/update-server-component-action';
import { DesignLibraryClientEventsProps } from './models';

let {
  getDesignLibraryComponentPropsEvent,
  addServerComponentPreviewHandler,
  getDesignLibraryImportMapEvent,
  addStyleElement,
  sendErrorEvent,
} = codegen;
let { getDesignLibraryStatusEvent, addComponentUpdateHandler, postToDesignLibrary } = dlHelpers;
let _updateServerComponentAction = updateServerComponentAction;

export const __mockDependencies = (mocks: any) => {
  postToDesignLibrary = mocks.postToDesignLibrary;
  addComponentUpdateHandler = mocks.addComponentUpdateHandler;
  _updateServerComponentAction = mocks.updateServerComponentAction;
  addServerComponentPreviewHandler = mocks.addServerComponentPreviewHandler;
  getDesignLibraryImportMapEvent = mocks.getDesignLibraryImportMapEvent;
  getDesignLibraryComponentPropsEvent = mocks.getDesignLibraryComponentPropsEvent;
  addStyleElement = mocks.addStyleElement;
  sendErrorEvent = mocks.sendErrorEvent;
};

/**
 * Design Library component for rendering server components in app router application.
 * DesignLibraryClientEvents component serves as a communication bridge between DesignLibraryServer and the Design Studio on the client side.
 * It posts messages to Design Library Studio and sets up handlers to receive updates and previews which are then passed to the server component via server function updateServerComponentAction.
 * @param {DesignLibraryClientEventsProps} [props] The props. {@link DesignLibraryClientEventsProps}
 * @returns {JSX.Element} empty JSX element.
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
    postToDesignLibrary(getDesignLibraryStatusEvent(designLibraryStatus, component.uid));

    // add the component update handler
    const unsubUpdate = addComponentUpdateHandler(component, (updated) => {
      _updateServerComponentAction({ uid: updated.uid, updatedComponent: updated });
    });

    if (importMapError) {
      // an import map error occurred on the server side in DesignLibraryServer, post error event to Design Studio
      sendErrorEvent(component.uid, importMapError, codegen.DesignLibraryPreviewError.RenderInit);
    } else {
      if (isDesignLibrary && isVariantGeneration) {
        // add the component preview handler
        unsubPreview = addServerComponentPreviewHandler((eventArgs) => {
          _updateServerComponentAction({ uid: component.uid, previewComponent: eventArgs });
        });

        // post importmap event
        const importMapEvent = getDesignLibraryImportMapEvent(component.uid, importMap);
        postToDesignLibrary(importMapEvent);

        // const props event
        const propsEvent = getDesignLibraryComponentPropsEvent(
          component.uid,
          component.fields,
          component.params
        );
        postToDesignLibrary(propsEvent);

        if (previewComponentStyle) {
          // the generated component has custom styles, so add the css in style element and add it to document head
          addStyleElement(previewComponentStyle);
        }
      }
    }

    return () => {
      unsubUpdate && unsubUpdate();
      unsubPreview && unsubPreview();
    };
  }, [
    component,
    designLibraryStatus,
    importMap,
    importMapError,
    isDesignLibrary,
    isVariantGeneration,
    previewComponentStyle,
  ]);

  return <></>;
};
