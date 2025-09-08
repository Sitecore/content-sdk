'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ComponentRendering } from '@sitecore-content-sdk/core/layout';
import { form } from '@sitecore-content-sdk/core';
import { useSitecore } from '../enhancers/withSitecore';

let { executeScriptElements, loadForm, subscribeToFormSubmitEvent } = form;

/**
 * Mock function to replace the form module functions for `testing` purposes.
 * @param {any} formModule - The form module to mock
 */
export const mockFormModule = (formModule: any) => {
  executeScriptElements = formModule.executeScriptElements;
  loadForm = formModule.loadForm;
  subscribeToFormSubmitEvent = formModule.subscribeToFormSubmitEvent;
};

/**
 * Shape of the Form component rendering data.
 * FormId is the rendering parameter that specifies the ID of the Sitecore Form to render.
 */
export type FormProps = {
  rendering: ComponentRendering;
  params: {
    /**
     * The ID of the Sitecore Form to render.
     */
    FormId: string;
    /**
     * CSS class to apply to the form
     */
    styles?: string;
    /**
     * The unique identifier of the rendering.
     */
    RenderingIdentifier?: string;
  };
};

export const Form = ({ params, rendering }: FormProps) => {
  const id = params?.RenderingIdentifier;
  const [error, setError] = useState(false);
  const [content, setContent] = useState('');
  const context = useSitecore();
  const formRef = useRef<HTMLDivElement>(null);

  const isEditing = context.page.mode.isEditing;

  useEffect(() => {
    if (!content) {
      // Forms must use clientContextId since they are rendered client-side
      const edgeId = context.api?.edge?.clientContextId;

      if (!edgeId) {
        /* eslint-disable no-console */
        console.warn(
          'Warning: clientContextId is missing – form cannot be loaded properly on the client'
        );
        return;
      }

      loadForm(edgeId, params.FormId, context.api?.edge?.edgeUrl)
        .then(setContent)
        .catch(() => {
          if (isEditing) {
            console.error(
              `Failed to load form with id ${params.FormId}. Check debug logs for content-sdk:form for more details.`
            );
          }
          setError(true);
        });
    } else {
      // If we are in editing mode, we don't want to send any events
      if (!isEditing) {
        subscribeToFormSubmitEvent(formRef.current, rendering.uid);
      }

      executeScriptElements(formRef.current);
    }
  }, [content]);

  if (isEditing && error) {
    return (
      <div className="sc-content-sdk-placeholder-error">
        There was a problem loading this section
      </div>
    );
  }

  return (
    <div
      ref={formRef}
      dangerouslySetInnerHTML={{ __html: content }}
      className={params.styles?.trimEnd()}
      id={id ? id : undefined}
    ></div>
  );
};
