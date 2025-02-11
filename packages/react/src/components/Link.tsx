import React, { RefAttributes, forwardRef } from 'react';
import PropTypes, { Requireable } from 'prop-types';
import { FieldMetadata, isFieldValueEmpty } from '@sitecore-content-sdk/core/layout';
import { withFieldMetadata } from '../enhancers/withFieldMetadata';
import { withEmptyFieldEditingComponent } from '../enhancers/withEmptyFieldEditingComponent';
import { DefaultEmptyFieldEditingComponentText } from './DefaultEmptyFieldEditingComponents';
import { EditableFieldProps } from './sharedTypes';

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

export interface LinkField {
  value: LinkFieldValue;
}

export type LinkProps = EditableFieldProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> &
  RefAttributes<HTMLAnchorElement> & {
    /** The link field data. */
    field: (LinkField | LinkFieldValue) & FieldMetadata;

    /**
     * Displays a link text ('description' in Sitecore) even when children exist
     */
    showLinkTextWithChildrenPresent?: boolean;
  };

export const Link: React.FC<LinkProps> = withFieldMetadata<LinkProps, HTMLAnchorElement>(
  withEmptyFieldEditingComponent<LinkProps, HTMLAnchorElement>(
    // eslint-disable-next-line react/display-name
    forwardRef<HTMLAnchorElement, LinkProps>(
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

        const element = React.createElement(
          'a',
          { ...anchorAttrs, ...otherProps, key: 'link', ref },
          linkText,
          children
        );

        return <React.Fragment>{element}</React.Fragment>;
      }
    ),
    { defaultEmptyFieldEditingComponent: DefaultEmptyFieldEditingComponentText, isForwardRef: true }
  ),
  true
);

export const LinkPropTypes = {
  field: PropTypes.oneOfType([
    PropTypes.shape({
      href: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.oneOf([null]).isRequired]),
    }),
    PropTypes.shape({
      value: PropTypes.object,
    }),
  ]).isRequired,
  editable: PropTypes.bool,
  showLinkTextWithChildrenPresent: PropTypes.bool,
  emptyFieldEditingComponent: PropTypes.oneOfType([
    PropTypes.object as Requireable<React.ComponentClass<unknown>>,
    PropTypes.func as Requireable<React.FC<unknown>>,
  ]),
};

Link.propTypes = LinkPropTypes;

Link.displayName = 'Link';
