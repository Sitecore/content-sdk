import { isEditorActive, resetEditorChromes } from '@sitecore-content-sdk/core/editing';

/**
 * Since Sitecore editors do not support Fast Refresh:
 * 1. Subscribe on events provided by webpack.
 * 2. Reset editor chromes when build is finished
 * @param {boolean} [forceReload] force page reload instead of reset chromes
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

export const getJssEditingSecret = (): string => {
  const secret = process.env.JSS_EDITING_SECRET;
  if (!secret || secret.length === 0) {
    throw new Error('The JSS_EDITING_SECRET environment variable is missing or invalid.');
  }
  return secret;
};
