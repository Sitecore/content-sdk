/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Renderer2 } from '@angular/core';
import { attachHoverPrefetch } from './link-hover-prefetch';

/** Minimal Renderer2 stub backed by real DOM listeners (jsdom), sufficient for `.listen()`. */
function fakeRenderer(): Renderer2 {
  return {
    listen: (target: HTMLElement, event: string, callback: (e: Event) => void) => {
      target.addEventListener(event, callback);
      return () => target.removeEventListener(event, callback);
    },
  } as unknown as Renderer2;
}

describe('attachHoverPrefetch', () => {
  let anchor: HTMLAnchorElement;
  let renderer: Renderer2;
  let onPrefetch: ReturnType<typeof vi.fn<(href: string) => void>>;

  beforeEach(() => {
    vi.useFakeTimers();
    anchor = document.createElement('a');
    anchor.setAttribute('href', '/about');
    renderer = fakeRenderer();
    onPrefetch = vi.fn<(href: string) => void>();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fires onPrefetch with the href after the delay elapses on mouseenter', () => {
    attachHoverPrefetch(renderer, anchor, { delayMs: 100, onPrefetch });

    anchor.dispatchEvent(new Event('mouseenter'));
    expect(onPrefetch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);

    expect(onPrefetch).toHaveBeenCalledExactlyOnceWith('/about');
  });

  it('does not fire if mouseleave happens before the delay elapses', () => {
    attachHoverPrefetch(renderer, anchor, { delayMs: 100, onPrefetch });

    anchor.dispatchEvent(new Event('mouseenter'));
    vi.advanceTimersByTime(50);
    anchor.dispatchEvent(new Event('mouseleave'));
    vi.advanceTimersByTime(100);

    expect(onPrefetch).not.toHaveBeenCalled();
  });

  it('re-arms and fires again on a subsequent hover-and-dwell cycle', () => {
    attachHoverPrefetch(renderer, anchor, { delayMs: 100, onPrefetch });

    anchor.dispatchEvent(new Event('mouseenter'));
    vi.advanceTimersByTime(100);
    anchor.dispatchEvent(new Event('mouseleave'));
    anchor.dispatchEvent(new Event('mouseenter'));
    vi.advanceTimersByTime(100);

    expect(onPrefetch).toHaveBeenCalledTimes(2);
  });

  it('does not restart the timer on a second mouseenter before the first fires', () => {
    attachHoverPrefetch(renderer, anchor, { delayMs: 100, onPrefetch });

    anchor.dispatchEvent(new Event('mouseenter'));
    vi.advanceTimersByTime(60);
    anchor.dispatchEvent(new Event('mouseenter'));
    vi.advanceTimersByTime(60);

    expect(onPrefetch).toHaveBeenCalledExactlyOnceWith('/about');
  });

  it('cleanup prevents firing even if the timer would have elapsed', () => {
    const cleanup = attachHoverPrefetch(renderer, anchor, { delayMs: 100, onPrefetch });

    anchor.dispatchEvent(new Event('mouseenter'));
    cleanup();
    vi.advanceTimersByTime(100);

    expect(onPrefetch).not.toHaveBeenCalled();
  });

  it('cleanup removes the listeners so further hover events do nothing', () => {
    const cleanup = attachHoverPrefetch(renderer, anchor, { delayMs: 100, onPrefetch });
    cleanup();

    anchor.dispatchEvent(new Event('mouseenter'));
    vi.advanceTimersByTime(100);

    expect(onPrefetch).not.toHaveBeenCalled();
  });

  it('does not call onPrefetch when the anchor has no href at fire time', () => {
    anchor.removeAttribute('href');
    attachHoverPrefetch(renderer, anchor, { delayMs: 100, onPrefetch });

    anchor.dispatchEvent(new Event('mouseenter'));
    vi.advanceTimersByTime(100);

    expect(onPrefetch).not.toHaveBeenCalled();
  });
});
