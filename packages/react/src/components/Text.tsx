import React, { ReactElement } from 'react';
import { withFieldMetadata } from '../enhancers/withFieldMetadata';
import { withEmptyFieldEditingComponent } from '../enhancers/withEmptyFieldEditingComponent';
import { DefaultEmptyFieldEditingComponentText } from './DefaultEmptyFieldEditingComponents';
import { EditableFieldProps } from './sharedTypes';
import { FieldMetadata, isFieldValueEmpty } from '@sitecore-content-sdk/core/layout';

export interface TextField extends FieldMetadata {
  value?: string | number;
}

export interface TextProps extends EditableFieldProps {
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

export const Text: React.FC<TextProps> = withFieldMetadata<TextProps>(
  withEmptyFieldEditingComponent<TextProps>(
    ({ field, tag, editable = true, encode = true, ...otherProps }) => {
      if (isFieldValueEmpty(field)) {
        return null;
      }

      // can't use editable value if we want to output unencoded
      if (!encode) {
        // eslint-disable-next-line no-param-reassign
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

      if (tag || !encode) {
        return React.createElement(tag || 'span', htmlProps, children);
      } else {
        return <React.Fragment>{children}</React.Fragment>;
      }
    },
    { defaultEmptyFieldEditingComponent: DefaultEmptyFieldEditingComponentText }
  )
);

Text.displayName = 'Text';
