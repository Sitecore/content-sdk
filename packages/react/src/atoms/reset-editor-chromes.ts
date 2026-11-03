import { resetEditorChromes } from '@sitecore-content-sdk/content/editing';

let isResetScheduled = false;

/**
 * Asks the Pages editor to re-discover chromes, coalescing multiple calls made in the same tick into one.
 *
 * Atoms are rendered by json-render, which does not expose a "render complete" hook. When the atoms
 * DOM is created (or re-created by a remount) after the Pages canvas has attached to the page,
 * the canvas keeps pointing at detached elements and nothing can be hovered or selected.
 * Pages re-reads the whole page on every reset, so a single call per tick is sufficient even
 * when several atom-based components commit together.
 *
 * Has no effect outside of the Pages editor or on the server.
 * @internal
 */
export const scheduleEditorChromesReset = (): void => {
  if (isResetScheduled) {
    return;
  }

  isResetScheduled = true;
  queueMicrotask(() => {
    isResetScheduled = false;
    resetEditorChromes();
  });
};
