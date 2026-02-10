'use client';
import React, { useEffect } from 'react';
import * as dlHelpers from '@sitecore-content-sdk/content/editing';
import * as codegen from '@sitecore-content-sdk/content/codegen';
import { updateServerComponentAction } from '../../server-actions/update-server-component-action';
import {
  DesignLibraryPreviewEventsProps,
  DesignLibraryVariantGenerationEventsProps,
} from './models';

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
 * DesignLibraryPreviewEvents component serves as a communication bridge between DesignLibraryServer and the Design Studio on the client side.
 * It posts messages to Design Library Studio and sets up handlers to receive updates and previews which are then passed to the server component via server function updateServerComponentAction.
 * @param {DesignLibraryPreviewEventsProps} props The props. {@link DesignLibraryPreviewEventsProps}
 * @returns {JSX.Element} empty JSX element.
 */
export const DesignLibraryPreviewEvents = ({
  designLibraryStatus,
  component,
}: DesignLibraryPreviewEventsProps) => {
  useEffect(() => {
    if (!component?.uid) return;

    postToDesignLibrary(getDesignLibraryStatusEvent(designLibraryStatus, component.uid, true));

    const unsubUpdate = addComponentUpdateHandler(component, (updated) => {
      _updateServerComponentAction({ uid: updated.uid!, updatedComponent: updated });
    });

    // eslint-disable-next-line no-unused-vars
    const unsubPreview = addServerComponentPreviewHandler((_eventArgs) => {
      console.error(
        'Component Library variant generation for server components is temporarily disabled.'
      );
    });

    return () => {
      unsubUpdate && unsubUpdate();
      unsubPreview && unsubPreview();
    };
  }, [component, designLibraryStatus]);

  return <></>;
};

/**
 * Design Library component for rendering server components in app router application.
 * DesignLibraryVariantGenerationEvents component serves as a communication bridge between DesignLibraryServer and the Design Studio on the client side in variant generation mode.
 * It posts messages to Design Library Studio and sets up handlers to receive updates and previews which are then passed to the server component via server function updateServerComponentAction.
 * If the import map is not present then the import map error will be sent to Design Studio.
 * @param {DesignLibraryVariantGenerationEventsProps} props The props. {@link DesignLibraryVariantGenerationEventsProps}
 * @returns {JSX.Element} empty JSX element.
 */
export const DesignLibraryVariantGenerationEvents = ({
  designLibraryStatus,
  component,
  importMap,
  importMapError,
  previewComponentData,
}: DesignLibraryVariantGenerationEventsProps) => {
  useEffect(() => {
    if (!component?.uid) return;

    postToDesignLibrary(getDesignLibraryStatusEvent(designLibraryStatus, component.uid, true));

    const unsubUpdate = addComponentUpdateHandler(component, (updated) => {
      _updateServerComponentAction({
        uid: updated.uid!,
        updatedComponent: updated,
        previewComponent: previewComponentData,
      });
    });

    const unsubPreview = addServerComponentPreviewHandler((eventArgs) => {
      _updateServerComponentAction({ uid: component.uid!, previewComponent: eventArgs });
    });

    if (importMapError) {
      // an import map error occurred on the server side in DesignLibraryServer, post error event to Design Studio
      sendErrorEvent(component.uid, importMapError, codegen.DesignLibraryPreviewError.RenderInit);
    } else {
      const importMapEvent = getDesignLibraryImportMapEvent(component.uid, importMap!);
      postToDesignLibrary(importMapEvent);

      const propsEvent = getDesignLibraryComponentPropsEvent(
        component.uid,
        component.fields,
        component.params
      );
      postToDesignLibrary(propsEvent);

      if (previewComponentData?.message?.styles?.content) {
        // the generated component has custom styles, so add the css in style element and add it to document head
        addStyleElement(previewComponentData.message.styles.content);
      }
    }

    return () => {
      unsubUpdate && unsubUpdate();
      unsubPreview && unsubPreview();
    };
  }, [component, designLibraryStatus, importMap, importMapError, previewComponentData]);

  return <></>;
};
