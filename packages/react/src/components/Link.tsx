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
import { isJavascriptUrl, reportBlockedJavascriptUrl } from './javascript-url';

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

    /**
     * Renders children even when the link field value is empty.
     * When true, an empty anchor element containing the children is rendered instead of null.
     * @default false
     */
    renderChildrenWhenEmpty?: boolean;
  };

const LinkComponent: React.FC<LinkProps> = ({
  field,
  showLinkTextWithChildrenPresent,
  renderChildrenWhenEmpty,
  ref,
  ...otherProps
}) => {
  const children = otherProps.children as React.ReactNode;
  const dynamicField: LinkField | LinkFieldValue = field;
  delete otherProps.editable; // prevent editable from being passed to the DOM

  const renderEmptyLink = () => {
    if (!renderChildrenWhenEmpty || !children) {
      return null;
    }

    return (
      <a {...otherProps} key="link" ref={ref}>
        {children}
      </a>
    );
  };

  const isEmptyField = isFieldValueEmpty(dynamicField);

  // handle link directly on field for forgetful devs
  const link = !isEmptyField
    ? (dynamicField as LinkFieldValue).href
      ? (field as LinkFieldValue)
      : (dynamicField as LinkField).value
    : undefined;

  if (isEmptyField || !link) {
    return renderEmptyLink();
  }

  const anchor = link.linktype !== 'anchor' && link.anchor ? `#${link.anchor}` : '';
  const querystring = link.querystring ? `?${link.querystring}` : '';
  const { href: hrefProp, ...domProps } = otherProps;

  const fieldHref = `${link.href}${querystring}${anchor}`;
  const resolvedHref = hrefProp ?? fieldHref;
  // React blocks javascript: hrefs. Keep the anchor and its text so the content
  // and Pages editing chrome stay in place, and omit the href.
  const blocked = isJavascriptUrl(resolvedHref);

  const anchorAttrs: { [attr: string]: unknown } = {
    href: resolvedHref,
    className: link.class,
    title: link.title,
    target: link.target,
  };

  if (blocked) {
    reportBlockedJavascriptUrl(resolvedHref);
    delete anchorAttrs.href;
  }

  if (anchorAttrs.target === '_blank' && !anchorAttrs.rel) {
    // information disclosure attack prevention keeps target blank site from getting ref to window.opener
    anchorAttrs.rel = 'noopener noreferrer';
  }

  const linkText = showLinkTextWithChildrenPresent || !children ? link.text || link.href : null;

  return (
    <a {...anchorAttrs} {...domProps} key="link" ref={ref}>
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
