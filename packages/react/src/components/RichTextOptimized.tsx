'use client';
import React, { ForwardedRef, forwardRef } from 'react';
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
}

/**
 * The RichText component - Optimized version using JSX instead of React.createElement.
 * 
 * This is a modernized version that uses JSX syntax for better readability and
 * maintainability, replacing React.createElement calls with native JSX.
 * 
 * @param {RichTextProps} props component props
 * @public
 */
export const RichTextOptimized = withFieldMetadata<RichTextProps>(
  withEmptyFieldEditingComponent<RichTextProps>(
    forwardRef(
      (
        // eslint-disable-next-line no-unused-vars
        { field, tag = 'div', editable = true, ...otherProps }: RichTextProps,
        ref: ForwardedRef<HTMLElement>
      ) => {
        if (isFieldValueEmpty(field)) {
          return null;
        }

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
      }
    ),
    { defaultEmptyFieldEditingComponent: DefaultEmptyFieldEditingComponentText, isForwardRef: true }
  ),
  true
);
