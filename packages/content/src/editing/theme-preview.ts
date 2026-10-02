import { DesignLibraryEvent } from './design-library';
import { validateEvent } from './design-library';

/**
 * Event name posted (via `window.postMessage`) to update the previewed theme CSS.
 * @public
 */
export const THEME_UPDATE_EVENT_NAME = 'theme-update';

/**
 * Id of the `<style>` element used to preview theme CSS while in editing mode.
 * @internal
 */
export const THEME_PREVIEW_STYLE_ID = 'sitecore-theme-preview';

/**
 * Event args for the `theme-update` event.
 * `message.css` is the raw CSS to inject; an empty string clears the previewed theme.
 * @public
 */
export interface ThemeUpdateEventArgs extends DesignLibraryEvent {
  name: typeof THEME_UPDATE_EVENT_NAME;
  message: {
    css: string;
  };
}

/**
 * Finds the theme preview `<style>` element (creating it if needed) and replaces its
 * content with the given CSS. Always (re)appended as the last child of `<head>` so it
 * takes precedence over the page-level theme `<link>` (same specificity, later source
 * order wins). Passing an empty string clears the previewed theme.
 * @param {string} css raw CSS to inject into the style element
 * @internal
 */
export const applyThemePreviewCss = (css: string): void => {
  document.getElementById(THEME_PREVIEW_STYLE_ID)?.remove();

  const style = document.createElement('style');
  style.setAttribute('id', THEME_PREVIEW_STYLE_ID);
  style.textContent = css;
  // last child of <head> wins the cascade over the page-level theme <link>
  document.head.appendChild(style);
};

/**
 * Adds the browser-side event handler for the `theme-update` message.
 * Used to support live preview of themes while in editing mode: the message's
 * CSS body is injected into a dedicated `<style>` element in `<head>`.
 * @returns {(() => void) | undefined} an unsubscribe function, or undefined if `window` is unavailable
 * @internal
 */
export const addThemeUpdateHandler = (): (() => void) | undefined => {
  if (typeof window === 'undefined') return;

  const handler = (e: MessageEvent) => {
    if (!validateEvent(e, THEME_UPDATE_EVENT_NAME)) {
      return;
    }

    const eventArgs = e.data as ThemeUpdateEventArgs;
    const css = eventArgs.message?.css;

    if (typeof css !== 'string') {
      console.debug(
        'Theme Preview: event skipped - message.css must be a string, received %o',
        css
      );
      return;
    }

    applyThemePreviewCss(css);
  };

  window.addEventListener('message', handler);

  return () => {
    window.removeEventListener('message', handler);
  };
};

