'use client';
import React, { RefAttributes, forwardRef } from 'react';
import { FieldMetadata, isFieldValueEmpty } from '@sitecore-content-sdk/content/layout';
import { withFieldMetadata } from '../enhancers/withFieldMetadata';
import { withEmptyFieldEditingComponent } from '../enhancers/withEmptyFieldEditingComponent';
import { DefaultEmptyFieldEditingComponentText } from './DefaultEmptyFieldEditingComponents';
import { EditableFieldProps } from './sharedTypes';

/**
 * The interface for the Link field value.
 * @public
 */
export interface LinkFieldValue {
  [attributeName: string]: unknown;
  href?: string;
  className?: string;
  class?: string;
  title?: string;
  target?: string;
  text?: string;
  anchor?: string;
  querystring?: string;
  linktype?: string;
}

/**
 * The interface for the Link field.
 * @public
 */
export interface LinkField {
  value: LinkFieldValue;
}

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

/**
 * The Link component - Optimized version using JSX instead of React.createElement.
 * 
 * This is a modernized version that uses JSX syntax for better readability and
 * maintainability, replacing React.createElement calls with native JSX.
 * 
 * @param {LinkProps} props component props
 * @public
 */
export const LinkOptimized = withFieldMetadata<LinkProps, HTMLAnchorElement>(
  withEmptyFieldEditingComponent<LinkProps, HTMLAnchorElement>(
    forwardRef<HTMLAnchorElement, LinkProps>(
      // eslint-disable-next-line no-unused-vars
      ({ field, editable = true, showLinkTextWithChildrenPresent, ...otherProps }, ref) => {
        const children = otherProps.children as React.ReactNode;
        const dynamicField: LinkField | LinkFieldValue = field;

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

        const linkText =
          showLinkTextWithChildrenPresent || !children ? link.text || link.href : null;

        return (
          <React.Fragment>
            <a {...anchorAttrs} {...otherProps} key="link" ref={ref}>
              {linkText}
              {children}
            </a>
          </React.Fragment>
        );
      }
    ),
    { defaultEmptyFieldEditingComponent: DefaultEmptyFieldEditingComponentText, isForwardRef: true }
  ),
  true
);
