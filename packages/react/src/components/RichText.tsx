import React, { ForwardedRef, forwardRef } from 'react';
import { withFieldMetadata } from '../enhancers/withFieldMetadata';
import { withEmptyFieldEditingComponent } from '../enhancers/withEmptyFieldEditingComponent';
import { DefaultEmptyFieldEditingComponentText } from './DefaultEmptyFieldEditingComponents';
import { EditableFieldProps } from './sharedTypes';
import { FieldMetadata, isFieldValueEmpty } from '@sitecore-content-sdk/core/layout';

export interface RichTextField extends FieldMetadata {
  value?: string;
}

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

export const RichText: React.FC<RichTextProps> = withFieldMetadata<RichTextProps>(
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
          ...otherProps,
        };

        return React.createElement(tag || 'div', htmlProps);
      }
    ),
    { defaultEmptyFieldEditingComponent: DefaultEmptyFieldEditingComponentText, isForwardRef: true }
  ),
  true
);

RichText.displayName = 'RichText';
