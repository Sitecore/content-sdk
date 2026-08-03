'use client';
import React from 'react';
import { isFieldValueEmpty, type RichTextField } from '@sitecore-content-sdk/content/layout';
import { withFieldMetadata } from '../enhancers/withFieldMetadata';
import { withEmptyFieldEditingComponent } from '../enhancers/withEmptyFieldEditingComponent';
import { DefaultEmptyFieldEditingComponentText } from './DefaultEmptyFieldEditingComponents';
import { EditableFieldProps } from './sharedTypes';

/**
 * The interface for the RichText component props.
 * @public
 */
export interface RichTextProps extends EditableFieldProps<RichTextProps> {
  [htmlAttributes: string]: unknown;
  /** The rich text field data. */
  field?: RichTextField;
  /**
   * The HTML element that will wrap the contents of the field.
   * @default <div />
   */
  tag?: string;
  /** Ref forwarded to the root element. */
  ref?: React.Ref<HTMLElement>;
}

// Keep a stable dangerouslySetInnerHTML object per HTML string across re-renders.
const dangerouslySetInnerHTMLCache = new Map<string, { __html: string }>();

const getStableDangerouslySetInnerHTML = (
  html: string | undefined
): { __html: string } | undefined => {
  if (html === undefined || html === '') {
    return undefined;
  }

  let prop = dangerouslySetInnerHTMLCache.get(html);
  if (!prop) {
    prop = { __html: html };
    dangerouslySetInnerHTMLCache.set(html, prop);
  }
  return prop;
};

const RichTextComponent: React.FC<RichTextProps> = ({ field, tag = 'div', ref, ...otherProps }) => {
  // Stabilize the object reference so React DOM does not rewrite innerHTML on every
  // parent re-render when the HTML string is unchanged (preserves DOM nodes / listeners).
  const dangerouslySetInnerHTML = getStableDangerouslySetInnerHTML(field?.value);

  if (isFieldValueEmpty(field) || !dangerouslySetInnerHTML) {
    return null;
  }

  delete otherProps.editable; // prevent editable from being passed to the DOM

  const htmlProps = {
    dangerouslySetInnerHTML,
    ref,
    suppressHydrationWarning: field.metadata ? true : undefined,
    ...otherProps,
  };

  const Tag = (tag || 'div') as React.ElementType;
  return <Tag {...htmlProps} />;
};

/**
 * The RichText component.
 * @param {RichTextProps} props component props
 * @public
 */
export const RichText: React.FC<RichTextProps> = withFieldMetadata<RichTextProps>(
  withEmptyFieldEditingComponent(RichTextComponent, {
    defaultEmptyFieldEditingComponent: DefaultEmptyFieldEditingComponentText,
  })
);

RichText.displayName = 'RichText';
