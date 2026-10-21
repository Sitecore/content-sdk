import type { Renderer2 } from '@angular/core';

/**
 * Options for {@link attachHoverPrefetch}.
 * @internal
 */
export interface HoverPrefetchOptions {
  /** Hover dwell time (ms) before `onPrefetch` fires. */
  delayMs: number;
  /** Called with the anchor's current `href` once the hover dwell time elapses. */
  onPrefetch: (href: string) => void;
}

/**
 * Attaches a debounced `mouseenter`-triggered prefetch listener to `anchor`. Hovering starts a
 * timer; if the pointer leaves before `delayMs` elapses, the timer is cancelled and nothing
 * fires. Each full hover-and-dwell cycle re-arms and can fire `onPrefetch` again — hovering is
 * a fresh, repeatable signal of intent, not a one-time trigger, so re-hovering after a previous
 * fire should be allowed to ask again rather than being permanently gated. The caller is
 * expected to pass that same intent through to `ClientLoaderDataService.prefetch({ force: true })`
 * so a possibly-stale staged answer from an earlier hover doesn't suppress a fresh one — see
 * `prefetchForUrl`'s `force` option.
 * @param {Renderer2} renderer - Renderer used to attach/detach the DOM listeners.
 * @param {HTMLAnchorElement} anchor - Anchor element to observe.
 * @param {HoverPrefetchOptions} options - Delay and prefetch callback.
 * @returns {() => void} Cleanup function that clears any pending timer and removes both listeners.
 * @internal
 */
export function attachHoverPrefetch(
  renderer: Renderer2,
  anchor: HTMLAnchorElement,
  options: HoverPrefetchOptions
): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const clearTimer = () => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
  };

  const unlistenEnter = renderer.listen(anchor, 'mouseenter', () => {
    if (timer !== undefined) {
      return;
    }
    timer = setTimeout(() => {
      timer = undefined;
      const href = anchor.getAttribute('href')?.trim() ?? '';
      if (href) {
        options.onPrefetch(href);
      }
    }, options.delayMs);
  });

  const unlistenLeave = renderer.listen(anchor, 'mouseleave', clearTimer);

  return () => {
    clearTimer();
    unlistenEnter();
    unlistenLeave();
  };
}
