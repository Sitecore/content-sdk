'use client';
import React, { ReactElement } from 'react';
import { FieldMetadata, isFieldValueEmpty } from '@sitecore-content-sdk/content/layout';
import { withFieldMetadata } from '../enhancers/withFieldMetadata';
import { withEmptyFieldEditingComponent } from '../enhancers/withEmptyFieldEditingComponent';
import { DefaultEmptyFieldEditingComponentText } from './DefaultEmptyFieldEditingComponents';
import { EditableFieldProps } from './sharedTypes';

/**
 * The interface for the Text field.
 * @public
 */
export interface TextField extends FieldMetadata {
  value?: string | number;
}

export interface TextProps extends EditableFieldProps<TextProps> {
  [htmlAttributes: string]: unknown;
  /** The text field data. */
  field?: TextField;
  /**
   * The HTML element that will wrap the contents of the field.
   */
  tag?: string;
  /**
   * If false, HTML-encoding of the field value is disabled and the value is rendered as-is.
   */
  encode?: boolean;
}

/**
 * The Text component - Optimized version using JSX instead of React.createElement.
 * 
 * This is a modernized version that uses JSX syntax for better readability and
 * maintainability, replacing all React.createElement calls with native JSX.
 * 
 * @public
 */
export const TextOptimized = withFieldMetadata<TextProps>(
  withEmptyFieldEditingComponent<TextProps>(
    ({ field, tag, editable = true, encode = true, ...otherProps }) => {
      if (isFieldValueEmpty(field)) {
        return null;
      }

      // can't use editable value if we want to output unencoded
      if (!encode) {
        // eslint-disable-next-line no-param-reassign, no-unused-vars
        editable = false;
      }

      let output: string | number | (ReactElement | string)[] =
        field.value === undefined ? '' : field.value;

      // when string value isn't formatted, we should format line breaks
      const splitted = String(output).split('\n');

      if (splitted.length) {
        const formatted: (ReactElement | string)[] = [];

        splitted.forEach((str, i) => {
          const isLast = i === splitted.length - 1;

          formatted.push(str);

          if (!isLast) {
            formatted.push(<br key={i} />);
          }
        });

        output = formatted;
      }

      let children = null;
      const htmlProps: {
        [htmlAttributes: string]: unknown;
        children?: React.ReactNode;
      } = {
        ...otherProps,
      };

      if (!encode) {
        htmlProps.dangerouslySetInnerHTML = {
          __html: output,
        };
      } else {
        children = output;
      }

      const Tag = (tag || 'span') as React.ElementType;

      if (field.metadata) {
        return (
          <Tag {...htmlProps} suppressHydrationWarning={true}>
            {children}
          </Tag>
        );
      } else if (tag || !encode) {
        return <Tag {...htmlProps}>{children}</Tag>;
      } else {
        return <React.Fragment>{children}</React.Fragment>;
      }
    },
    { defaultEmptyFieldEditingComponent: DefaultEmptyFieldEditingComponentText }
  )
);

TextOptimized.displayName = 'TextOptimized';
