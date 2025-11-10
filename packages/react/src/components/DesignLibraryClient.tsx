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
import { postToDL } from './DesignLibrary';
import * as codegen from '@sitecore-content-sdk/core/codegen';

export type DesignLibraryClientProps = {
  designLibraryStatus: DesignLibraryStatus;
  component: ComponentRendering;
  importMap?: codegen.ImportEntryPayload[];
};

export const DesignLibraryClient = ({
  designLibraryStatus,
  component,
  importMap,
}: DesignLibraryClientProps) => {
  const { page } = useSitecore();
  const isVariantGeneration = page.mode.designLibrary?.isVariantGeneration;
  const isDesignLibrary = page.mode.isDesignLibrary;

  useEffect(() => {
    let unsubPreview: () => void;
    // - post to DL designlibraryStatus
    postToDL(getDesignLibraryStatusEvent(designLibraryStatus, component.uid));

    if (isDesignLibrary && isVariantGeneration && importMap) {
      unsubPreview = codegen.addServerComponentPreviewHandler((eventArgs) => {
        console.log('preview event args: ', eventArgs);
        updateServerComponentAction({ uid: component.uid, previewComponent: eventArgs });
      });

      // post importmap event
      const importMapEvent = codegen.getDesignLibraryImportMapPayloadEvent(
        component.uid,
        importMap
      );
      postToDL(importMapEvent);

      // const props evemt
      const propsEvent = codegen.getDesignLibraryComponentPropsEvent(
        component.uid,
        component.fields,
        component.params
      );
      postToDL(propsEvent);

      // post error event if any that comes from DL server
    }

    // add the component update handler
    const unsubUpdate = addComponentUpdateHandler(component, (updated) => {
      console.log('updated component: ', updated);
      updateServerComponentAction({ uid: updated.uid, updatedComponent: updated });
    });

    // useEffect will cleanup event handler on re-render
    return () => {
      unsubUpdate && unsubUpdate();
      unsubPreview && unsubPreview();
    };
  });

  return <></>;
};
