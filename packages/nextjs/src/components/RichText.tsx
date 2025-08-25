'use client';
import React, { useEffect, useRef, JSX } from 'react';
import { useRouter as usePageRouter } from 'next/compat/router';
import { useRouter as useAppRouter } from 'next/navigation';
import {
  RichText as ReactRichText,
  RichTextProps as ReactRichTextProps,
} from '@sitecore-content-sdk/react';

export type RichTextProps = ReactRichTextProps & {
  /**
   * Selector which should be used in order to prefetch it and attach event listeners
   * @default 'a[href^="/"]'
   */
  internalLinksSelector?: string;

  /**
   * Controls the prefetch of internal links. This can be beneficial if you have RichText fields
   * with large numbers of internal links in them.
   * - `true` (default): The full route & its data will be prefetched.
   * - `hover`: Prefetching will happen on hover.
   * - `false`: Prefetching will not happen.
   * @default true
   */
  prefetchLinks?: boolean | 'hover';
};

export const prefetched: { [cacheKey: string]: boolean } = {};

export const RichText = (props: RichTextProps): JSX.Element => {
  const {
    internalLinksSelector = 'a[href^="/"]',
    prefetchLinks = true,
    editable = true,
    ...rest
  } = props;
  const hasText = props.field && props.field.value;
  const isEditing = editable && props.field && props.field.metadata;

  const pageRouter = usePageRouter();
  const appRouter = useAppRouter();
  const richTextRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // NOT IN EDIT MODE
    if (hasText && !isEditing) {
      initializeLinks();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasText]);

  const routeHandler = (ev: MouseEvent) => {
    if (!ev.currentTarget) return;

    ev.preventDefault();

    const pathname = (ev.currentTarget as HTMLAnchorElement).href;

    if (pageRouter) {
      pageRouter.push(pathname, pathname, { locale: false });
    } else {
      appRouter.push(pathname);
    }
  };

  const initializeLinks = () => {
    const node = richTextRef.current;

    // selects all links that start with '/'
    const internalLinks = node && node.querySelectorAll<HTMLAnchorElement>(internalLinksSelector);

    if (!internalLinks || !internalLinks.length) return;

    internalLinks.forEach((link) => {
      if (link.target === '_blank') return;

      const prefetch = () => {
        if (pageRouter) {
          pageRouter.prefetch(link.pathname, undefined, { locale: false });
        } else {
          appRouter.prefetch(link.pathname);
        }

        prefetched[link.pathname] = true;
      };

      if (!prefetched[link.pathname] && prefetchLinks !== false) {
        if (prefetchLinks === true) {
          prefetch();
        }

        if (prefetchLinks === 'hover') {
          const mouseOverHandler = () => {
            prefetch();

            link.removeEventListener('mouseover', mouseOverHandler);
          };

          link.addEventListener('mouseover', mouseOverHandler, false);
        }
      }

      link.addEventListener('click', routeHandler, false);
    });
  };

  return <ReactRichText ref={richTextRef} editable={editable} {...rest} />;
};

RichText.displayName = 'NextRichText';
