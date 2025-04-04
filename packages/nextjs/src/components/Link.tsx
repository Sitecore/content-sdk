﻿import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import {
  Link as ReactLink,
  LinkFieldValue,
  LinkField,
  LinkProps as ReactLinkProps,
  LinkPropTypes,
} from '@sitecore-content-sdk/react';

export type LinkProps = ReactLinkProps & {
  /**
   * If `href` match with `internalLinkMatcher` regexp, then it's internal link and NextLink will be rendered
   * @default /^\//g
   */
  internalLinkMatcher?: RegExp;
  /**
   * Next.js Link prefetch.
   */
  prefetch?: NextLinkProps['prefetch'];
};

/**
 * Matches relative URLs that end with a file extension.
 */
const FILE_EXTENSION_MATCHER = /^\/.*\.\w+$/;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (props: LinkProps, ref): JSX.Element | null => {
    const {
      field,
      editable = true,
      children,
      internalLinkMatcher = /^\//g,
      showLinkTextWithChildrenPresent,
      ...htmlLinkProps
    } = props;

    if (!field || (!field.value && !(field as LinkFieldValue).href && !field.metadata)) {
      return null;
    }

    const value = ((field as LinkFieldValue).href
      ? field
      : (field as LinkField).value) as LinkFieldValue;
    // fallback to {} if value is undefined; could happen if field is LinkFieldValue, href is empty in metadata mode
    const { href, querystring, anchor } = value || {};

    const isEditing = editable && (field as LinkFieldValue).metadata;

    if (href && !isEditing) {
      const text = showLinkTextWithChildrenPresent || !children ? value.text || value.href : null;

      const isMatching = internalLinkMatcher.test(href);
      const isFileUrl = FILE_EXTENSION_MATCHER.test(href);

      // determine if a link is a route or not. File extensions are not routes and should not be pre-fetched.
      if (isMatching && !isFileUrl) {
        return (
          <NextLink
            href={{ pathname: href, query: querystring, hash: anchor }}
            key="link"
            locale={false}
            title={value.title}
            target={value.target}
            className={value.class}
            prefetch={props.prefetch}
            {...htmlLinkProps}
            ref={ref}
            {...(process.env.TEST
              ? {
                  'data-nextjs-link': true,
                  'data-nextjs-prefetch': props.prefetch,
                }
              : {})}
          >
            {text}
            {children}
          </NextLink>
        );
      }
    }

    // prevent passing internalLinkMatcher or prefetch as it is an invalid DOM element prop
    const reactLinkProps = { ...props };
    delete reactLinkProps.internalLinkMatcher;
    delete reactLinkProps.prefetch;

    return (
      <ReactLink
        {...reactLinkProps}
        ref={ref}
        {...(process.env.TEST ? { 'data-react-link': true } : {})}
      />
    );
  }
);

Link.displayName = 'NextLink';

Link.propTypes = {
  internalLinkMatcher: PropTypes.instanceOf(RegExp),
  ...LinkPropTypes,
};
