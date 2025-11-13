import React from 'react';
import { withFieldMetadata } from '../enhancers/withFieldMetadata';
import { withEmptyFieldEditingComponent } from '../enhancers/withEmptyFieldEditingComponent';
import { DefaultEmptyFieldEditingComponentText } from './DefaultEmptyFieldEditingComponents';
import { EditableFieldProps } from './sharedTypes';
import { FieldMetadata } from '@sitecore-content-sdk/core/layout';
import { isFieldValueEmpty } from '@sitecore-content-sdk/core/layout';

/**
 * The props for the DateField component.
 * @public
 */
export interface DateFieldProps extends EditableFieldProps<DateFieldProps> {
  /** The date field data. */
  [htmlAttributes: string]: unknown;
  field: FieldMetadata & {
    value?: string;
  };
  /**
   * The HTML element that will wrap the contents of the field.
   */
  tag?: string;

  render?: (date: Date | null) => React.ReactNode;
}

/**
 * The DateField component.
 * @public
 */
export const DateField: React.FC<DateFieldProps> = withFieldMetadata<DateFieldProps>(
  withEmptyFieldEditingComponent<DateFieldProps>(
    // eslint-disable-next-line no-unused-vars
    ({ field, tag, editable = true, render, ...otherProps }) => {
      if (isFieldValueEmpty(field)) {
        return null;
      }

      let children: React.ReactNode;

      const htmlProps: {
        [htmlAttr: string]: unknown;
        children?: React.ReactNode;
      } = {
        ...otherProps,
      };

      if (render) {
        children = render(field.value ? new Date(field.value) : null);
      } else {
        children = field.value;
      }

      if (tag) {
        return React.createElement(tag || 'span', htmlProps, children);
      } else {
        return <React.Fragment>{children}</React.Fragment>;
      }
    },
    { defaultEmptyFieldEditingComponent: DefaultEmptyFieldEditingComponentText }
  )
);

DateField.displayName = 'Date';
