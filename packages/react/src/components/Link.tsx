'use client';
import React, { RefAttributes } from 'react';
import {
  FieldMetadata,
  isFieldValueEmpty,
  type LinkField,
  type LinkFieldValue,
} from '@sitecore-content-sdk/content/layout';
import { withFieldMetadata } from '../enhancers/withFieldMetadata';
import { withEmptyFieldEditingComponent } from '../enhancers/withEmptyFieldEditingComponent';
import { DefaultEmptyFieldEditingComponentText } from './DefaultEmptyFieldEditingComponents';
import { EditableFieldProps } from './sharedTypes';

/**
 * The interface for the Link component props.
 * @public
 */
export type LinkProps = EditableFieldProps<LinkProps> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> &
  RefAttributes<HTMLAnchorElement> & {
    /** The link field data. */
    field: (LinkField | LinkFieldValue) & FieldMetadata;

    /**
     * Displays a link text ('description' in Sitecore) even when children exist
     */
    showLinkTextWithChildrenPresent?: boolean;
  };

const LinkComponent: React.FC<LinkProps> = ({
  field,
  showLinkTextWithChildrenPresent,
  ref,
  ...otherProps
}) => {
  const children = otherProps.children as React.ReactNode;
  const dynamicField: LinkField | LinkFieldValue = field;
  delete otherProps.editable; // prevent editable from being passed to the DOM

  if (isFieldValueEmpty(dynamicField)) {
    return null;
  }

  // handle link directly on field for forgetful devs
  const link = (dynamicField as LinkFieldValue).href
    ? (field as LinkFieldValue)
    : (dynamicField as LinkField).value;

  if (!link) {
    return null;
  }

  const anchor = link.linktype !== 'anchor' && link.anchor ? `#${link.anchor}` : '';
  const querystring = link.querystring ? `?${link.querystring}` : '';

  const anchorAttrs: { [attr: string]: unknown } = {
    href: `${link.href}${querystring}${anchor}`,
    className: link.class,
    title: link.title,
    target: link.target,
  };

  if (anchorAttrs.target === '_blank' && !anchorAttrs.rel) {
    // information disclosure attack prevention keeps target blank site from getting ref to window.opener
    anchorAttrs.rel = 'noopener noreferrer';
  }

  const linkText = showLinkTextWithChildrenPresent || !children ? link.text || link.href : null;

  return (
    <a {...anchorAttrs} {...otherProps} key="link" ref={ref}>
      {linkText}
      {children}
    </a>
  );
};

/**
 * The Link component.
 * @param {LinkProps} props component props
 * @public
 */
export const Link: React.FC<LinkProps> = withFieldMetadata<LinkProps>(
  withEmptyFieldEditingComponent(LinkComponent, {
    defaultEmptyFieldEditingComponent: DefaultEmptyFieldEditingComponentText,
  })
);

Link.displayName = 'Link';
