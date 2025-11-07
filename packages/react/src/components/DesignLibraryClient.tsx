'use client';
import React, { useEffect } from 'react';
import { updateServerComponentAction } from '../server-actions/update-server-component-action';
import { useSitecore } from '../enhancers/withSitecore';
import { EDITING_COMPONENT_PLACEHOLDER } from '@sitecore-content-sdk/core/layout';
import {
  DesignLibraryStatus,
  getDesignLibraryStatusEvent,
  addComponentUpdateHandler,
} from '@sitecore-content-sdk/core/editing';
import { postToDL } from './DesignLibrary';
import * as codegen from '@sitecore-content-sdk/core/codegen';

export type DesignLibraryClientProps = {
  designLibraryStatus: DesignLibraryStatus;
  importMap?: codegen.ImportEntryPayload[];
};

export const DesignLibraryClient = (props: DesignLibraryClientProps) => {
  console.log('DesignLibraryClient render');

  const { page } = useSitecore();
  const route = page.layout.sitecore.route;
  const rendering = route?.placeholders[EDITING_COMPONENT_PLACEHOLDER]?.[0];
  const isVariantGeneration = page.mode.designLibrary?.isVariantGeneration;
  const isDesignLibrary = page.mode.isDesignLibrary;

  console.log('DesignLibraryClient rendering: ', rendering);
  console.log('isVariantGeneration:', isVariantGeneration);
  console.log('importMap length:', props.importMap?.length);
  console.log(props.importMap);

  useEffect(() => {
    let unsubPreview: () => void;
    console.log('DesignLibraryClient mounted!');
    // - post to DL designlibraryStatus
    postToDL(getDesignLibraryStatusEvent(props.designLibraryStatus, rendering.uid));

    if (isDesignLibrary && isVariantGeneration && props.importMap) {
      unsubPreview = codegen.addServerComponentPreviewHandler((eventArgs) => {
        console.log('preview event args: ', eventArgs);
        updateServerComponentAction({ uid: rendering.uid, previewComponent: eventArgs });
      });

      // post importmap event
      const importMapEvent = codegen.getDesignLibraryImportMapPayloadEvent(
        rendering.uid,
        props.importMap
      );
      postToDL(importMapEvent);

      // const props evemt
      const propsEvent = codegen.getDesignLibraryComponentPropsEvent(
        rendering.uid,
        rendering.fields,
        rendering.params
      );
      postToDL(propsEvent);

      // post error event if any that comes from DL server
    }

    // add the component update handler
    const unsubUpdate = addComponentUpdateHandler(rendering, (updated) => {
      console.log('updated component: ', updated);
      updateServerComponentAction({ uid: updated.uid, updatedComponent: updated });
    });

    // add the component preview handler
    if (isVariantGeneration) {
      console.log('DesignLibraryClient adding preview handler for variant generation');
    }

    // useEffect will cleanup event handler on re-render
    return () => {
      unsubUpdate && unsubUpdate();
      unsubPreview && unsubPreview();
    };
  });

  const handleClick = async () => {
    updateServerComponentAction({
      uid: 'ha-ha',
      updatedComponent: rendering,
    });
  };

  // return <DesignLibrary serverFunct={myServerFunct} loadImportMap={undefined} />;
  return (
    <>
      <div>DesignLibraryClient</div>
      <button onClick={handleClick}>Run server func</button>
    </>
  );
};
