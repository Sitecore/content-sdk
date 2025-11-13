import { isEditorActive, resetEditorChromes } from '@sitecore-content-sdk/core/editing';
import { GetServerSidePropsContext, GetStaticPropsContext } from 'next';
import { REWRITE_HEADER_NAME } from '../middleware/middleware';

/**
 * Since Sitecore editors do not support Fast Refresh:
 * 1. Subscribe on events provided by webpack.
 * 2. Reset editor chromes when build is finished
 * @param {boolean} [forceReload] force page reload instead of reset chromes
 * @public
 */
export const handleEditorFastRefresh = (forceReload = false): void => {
  if (process.env.NODE_ENV !== 'development' || !isEditorActive()) {
    // Only run if development mode and editor is active
    return;
  }
  const eventSource = new window.EventSource('/_next/webpack-hmr');

  window.addEventListener('beforeunload', () => eventSource.close());

  eventSource.onopen = () => console.log('[Sitecore Editor Fast Refresh Listener] Online');

  eventSource.onmessage = (event) => {
    if (event.data.indexOf('{') === -1) return; // heartbeat

    const payload = JSON.parse(event.data);

    console.debug(`[Sitecore Editor Fast Refresh Listener] Saw event: ${JSON.stringify(payload)}`);

    if (payload.action !== 'built') return;

    if (forceReload) return window.location.reload();

    setTimeout(() => {
      console.log(
        '[Sitecore Editor HMR Listener] Sitecore editor does not support Fast Refresh, reloading chromes...'
      );
      resetEditorChromes();
    }, 500);
  };
};

export const getEditingSecret = (): string => {
  const secret = process.env.SITECORE_EDITING_SECRET;
  if (!secret || secret.length === 0) {
    throw new Error('The SITECORE_EDITING_SECRET environment variable is missing or invalid.');
  }
  return secret;
};

/**
 * Extracts the path from the Next.js context parameters.
 * @param {GetStaticPropsContext | GetServerSidePropsContext} context - The Next.js context parameters.
 * @returns The extracted path.
 * @public
 */
export const extractPath = (context: GetStaticPropsContext | GetServerSidePropsContext) => {
  return context.params === undefined
    ? '/'
    : Array.isArray(context.params.path)
    ? context.params.path.join('/')
    : context.params.path ?? '/';
};

/**
 * Determines whether context is GetServerSidePropsContext (SSR) or GetStaticPropsContext (SSG)
 * @param {GetServerSidePropsContext | GetStaticPropsContext} context
 * @public
 */
export const isServerSidePropsContext = (
  context: GetServerSidePropsContext | GetStaticPropsContext
): context is GetServerSidePropsContext => {
  return (<GetServerSidePropsContext>context).req !== undefined;
};

/**
 * For App Router application, extracts the site and locale information from the rewrite header which is in format /[site]/[locale]/[...path].
 * @param {Headers} headers - The `Headers` object containing the rewrite header.
 * @returns An object containing the `site` and `locale` extracted from the rewrite header.
 * @public
 */
export const parseRewriteHeader = (headers: Headers) => {
  const rewriteHeader = headers.get(REWRITE_HEADER_NAME);
  const rewriteSegments = rewriteHeader?.split('/').filter((segment) => segment) || [];
  const site = rewriteSegments[0];
  const locale = rewriteSegments[1];
  return { site, locale };
};
