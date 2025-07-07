import React, { useEffect, useRef, useState } from 'react';
import { ComponentRendering } from '@sitecore-content-sdk/core/layout';
import { form } from '@sitecore-content-sdk/core';
import { useSitecore } from '../enhancers/withSitecore';

let { executeScriptElements, loadForm, subscribeToFormSubmitEvent } = form;

/**
 * Replace the form module functions for testing purposes.
 */
export const mockFormModule = (formModule: any) => {
  executeScriptElements = formModule.executeScriptElements;
  loadForm = formModule.loadForm;
  subscribeToFormSubmitEvent = formModule.subscribeToFormSubmitEvent;
};

/**
 * Rendering parameters for the Form component.
 */
export type FormProps = {
  rendering: ComponentRendering;
  params: {
    /**
     * The unique identifier of the rendering.
     */
    FormId: string; // Sitecore Form ID to render
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

  const isEditing = context.pageContext.pageEditing;

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
      // Do not send events while editing
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
