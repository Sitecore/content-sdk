﻿import { isFieldValueEmpty } from '@sitecore-content-sdk/core/layout';
import PropTypes from 'prop-types';
import React from 'react';

export interface FileFieldValue {
  [propName: string]: unknown;
  src?: string;
  title?: string;
  displayName?: string;
}

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

export const File: React.FC<FileProps> = ({ field, children, ...otherProps }) => {
  const dynamicField: FileField | FileFieldValue = field;

  if (isFieldValueEmpty(dynamicField)) {
    return null;
  }

  // handle link directly on field for forgetful devs
  const file = ((dynamicField as FileFieldValue).src
    ? field
    : dynamicField.value) as FileFieldValue;
  if (!file) {
    return null;
  }

  const linkText = !children ? file.title || file.displayName : null;
  const anchorAttrs = {
    href: file.src,
  };
  return React.createElement('a', { ...anchorAttrs, ...otherProps }, linkText, children);
};

File.propTypes = {
  field: PropTypes.oneOfType([
    PropTypes.shape({
      src: PropTypes.string,
    }),
    PropTypes.shape({
      value: PropTypes.object,
    }),
  ]).isRequired,
};

File.displayName = 'File';
