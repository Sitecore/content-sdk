import React from 'react';
import PropTypes, { Requireable } from 'prop-types';
import { withFieldMetadata } from '../enhancers/withFieldMetadata';
import { withEmptyFieldEditingComponent } from '../enhancers/withEmptyFieldEditingComponent';
import { DefaultEmptyFieldEditingComponentText } from './DefaultEmptyFieldEditingComponents';
import { EditableFieldProps } from './sharedTypes';
import { FieldMetadata } from '@sitecore-content-sdk/core/layout';
import { isFieldValueEmpty } from '@sitecore-content-sdk/core/layout';

export interface DateFieldProps extends EditableFieldProps {
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

export const DateField: React.FC<DateFieldProps> = withFieldMetadata<DateFieldProps>(
  withEmptyFieldEditingComponent<DateFieldProps>(
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

DateField.propTypes = {
  field: PropTypes.shape({
    value: PropTypes.string,
    metadata: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
  tag: PropTypes.string,
  editable: PropTypes.bool,
  render: PropTypes.func,
  emptyFieldEditingComponent: PropTypes.oneOfType([
    PropTypes.object as Requireable<React.ComponentClass<unknown>>,
    PropTypes.func as Requireable<React.FC<unknown>>,
  ]),
};

DateField.displayName = 'Date';
