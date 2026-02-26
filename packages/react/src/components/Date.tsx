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

const DateFieldComponent: React.FC<DateFieldProps> = ({ field, tag, render, ...htmlProps }) => {
  if (isFieldValueEmpty(field)) {
    return null;
  }
  delete htmlProps.editable; // prevent editable from being passed to the DOM

  let children: React.ReactNode;

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
};

/**
 * The DateField component.
 * @public
 */
export const DateField: React.FC<DateFieldProps> = withFieldMetadata<DateFieldProps>(
  withEmptyFieldEditingComponent(DateFieldComponent, {
    defaultEmptyFieldEditingComponent: DefaultEmptyFieldEditingComponentText,
  })
);

DateField.displayName = 'Date';
