'use client';
import React from 'react';
import { FieldMetadata, isFieldValueEmpty } from '@sitecore-content-sdk/content/layout';
import { withFieldMetadata } from '../enhancers/withFieldMetadata';
import { withEmptyFieldEditingComponent } from '../enhancers/withEmptyFieldEditingComponent';
import { DefaultEmptyFieldEditingComponentText } from './DefaultEmptyFieldEditingComponents';
import { EditableFieldProps } from './sharedTypes';

/**
 * The interface for the RichText field.
 * @public
 */
export interface RichTextField extends FieldMetadata {
  value?: string;
}

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

const RichTextComponent: React.FC<RichTextProps> = ({ field, tag = 'div', ref, ...otherProps }) => {
  if (isFieldValueEmpty(field)) {
    return null;
  }

  delete otherProps.editable; // prevent editable from being passed to the DOM

  const htmlProps = {
    dangerouslySetInnerHTML: {
      __html: field.value,
    },
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
