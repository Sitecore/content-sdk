'use client';
import React, { RefAttributes, useEffect } from 'react';
import {
  FieldMetadata,
  isFieldValueEmpty,
  type LinkField,
  type LinkFieldValue,
} from '@sitecore-content-sdk/content/layout';
import { isJavascriptUrl } from '@sitecore-content-sdk/core/tools';
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
  href: hrefProp,
  ...otherProps
}) => {
  const children = otherProps.children as React.ReactNode;
  const dynamicField: LinkField | LinkFieldValue = field;
  delete otherProps.editable; // prevent editable from being passed to the DOM

  const isEmptyField = isFieldValueEmpty(dynamicField);

  // handle link directly on field for forgetful devs
  const link = !isEmptyField
    ? (dynamicField as LinkFieldValue).href
      ? (field as LinkFieldValue)
      : (dynamicField as LinkField).value
    : undefined;

  const anchor = link && link.linktype !== 'anchor' && link.anchor ? `#${link.anchor}` : '';
  const querystring = link?.querystring ? `?${link.querystring}` : '';
  const fieldHref = link ? `${link.href}${querystring}${anchor}` : undefined;
  // An href prop overrides the field value. Judge that final href.
  const resolvedHref = hrefProp ?? fieldHref;
  const blockedHref =
    typeof resolvedHref === 'string' && isJavascriptUrl(resolvedHref) ? resolvedHref : undefined;

  useEffect(() => {
    if (blockedHref) {
      console.error(
        `Link blocked a javascript: URL ("${blockedHref}"). The link text is rendered without an href.`
      );
    }
  }, [blockedHref]);

  const renderEmptyLink = () => {
    if (!renderChildrenWhenEmpty || !children) {
      return null;
    }

    return (
      <a
        {...otherProps}
        {...(blockedHref || hrefProp === undefined ? {} : { href: hrefProp })}
        key="link"
        ref={ref}
      >
        {children}
      </a>
    );
  };

  if (isEmptyField || !link) {
    return renderEmptyLink();
  }

  // React blocks javascript: hrefs. Keep the anchor and its text so the content
  // and Pages editing chrome stay in place, and omit the href.
  const anchorAttrs: { [attr: string]: unknown } = {
    ...(blockedHref ? {} : { href: resolvedHref }),
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
