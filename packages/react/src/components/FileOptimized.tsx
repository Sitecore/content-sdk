import { isFieldValueEmpty } from '@sitecore-content-sdk/content/layout';
import React from 'react';

export interface FileFieldValue {
  [propName: string]: unknown;
  src?: string;
  title?: string;
  displayName?: string;
}

/**
 * The interface for the File field.
 * @public
 */
export interface FileField {
  value: FileFieldValue;
}

export interface FileProps {
  [attributeName: string]: unknown;
  /** The file field data. */
  field: FileFieldValue | FileField;
  /** HTML attributes that will be appended to the rendered <a /> tag. */
  children?: React.ReactNode;
}

/**
 * The File component - Optimized version using JSX instead of React.createElement.
 *
 * This is a modernized version that uses JSX syntax for better readability and
 * maintainability, replacing React.createElement calls with native JSX.
 *
 * @param {FileProps} props component props
 * @public
 */
export const FileOptimized = ({ field, children, ...otherProps }: FileProps) => {
  const dynamicField: FileField | FileFieldValue = field;

  if (isFieldValueEmpty(dynamicField)) {
    return null;
  }

  // handle link directly on field for forgetful devs
  const file = (
    (dynamicField as FileFieldValue).src ? field : dynamicField.value
  ) as FileFieldValue;
  if (!file) {
    return null;
  }

  const linkText = !children ? file.title || file.displayName : null;
  const anchorAttrs = {
    href: file.src,
  };

  return (
    <a {...anchorAttrs} {...otherProps}>
      {linkText}
      {children}
    </a>
  );
};
