import React from 'react';
import { withFieldMetadata } from '../enhancers/withFieldMetadata';
import { withEmptyFieldEditingComponent } from '../enhancers/withEmptyFieldEditingComponent';
import { DefaultEmptyFieldEditingComponentText } from './DefaultEmptyFieldEditingComponents';
import { EditableFieldProps } from './sharedTypes';
import { FieldMetadata, isFieldValueEmpty } from '@sitecore-content-sdk/content/layout';

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
 * The DateField component - Optimized version using JSX instead of React.createElement.
 *
 * This is a modernized version that uses JSX syntax for better readability and
 * maintainability, replacing React.createElement calls with native JSX.
 *
 * @public
 */
export const DateFieldOptimized = withFieldMetadata<DateFieldProps>(
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
        const Tag = (tag || 'span') as React.ElementType;
        return <Tag {...htmlProps}>{children}</Tag>;
      } else {
        return <React.Fragment>{children}</React.Fragment>;
      }
    },
    { defaultEmptyFieldEditingComponent: DefaultEmptyFieldEditingComponentText }
  )
);
