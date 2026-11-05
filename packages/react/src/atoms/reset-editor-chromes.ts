import { debug } from '@sitecore-content-sdk/content';
import { resetEditorChromes } from '@sitecore-content-sdk/content/editing';

/**
 * How long to wait after the last request before asking Pages to re-discover chromes.
 * @internal
 */
export const EDITOR_CHROMES_RESET_DEBOUNCE_MS = 100;

let resetTimer: ReturnType<typeof setTimeout> | undefined;

/**
 * Asks the Pages editor to re-discover chromes, debounced so that a burst of requests results in a single reset.
 *
 * Atoms are rendered by json-render, which does not expose a "render complete" hook. When the atoms
 * DOM is created (or re-created by a remount) after the Pages canvas has attached to the page,
 * the canvas keeps pointing at detached elements and nothing can be hovered or selected.
 *
 * Every reset fully restarts the Pages canvas (reloads its setup data, re-reads all chromes and
 * recreates field editors), so it is not cheap. Atoms in different Suspense boundaries can mount at
 * different times, so each request restarts the timer and the reset runs once, shortly after the last one.
 *
 * Has no effect outside of the Pages editor or on the server.
 * @internal
 */
export const scheduleEditorChromesReset = (): void => {
  if (resetTimer !== undefined) {
    clearTimeout(resetTimer);
  }

  resetTimer = setTimeout(() => {
    resetTimer = undefined;

    try {
      resetEditorChromes();
    } catch (err) {
      debug.editing('[Sitecore] Failed to reset editor chromes: %o', err);
    }
  }, EDITOR_CHROMES_RESET_DEBOUNCE_MS);
};
