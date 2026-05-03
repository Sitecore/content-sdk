import { computed, type Signal } from '@angular/core';

type LayoutParams = { RenderingIdentifier?: string; Styles?: string };

/**
 * CSS class/id helpers aligned with kit-nextjs-skate-park component wrappers.
 */
export function computedRenderingId(
  params: () => { [key: string]: string } | undefined,
): Signal<string | undefined> {
  return computed(() => {
    const layoutParams = params() as LayoutParams | undefined;
    const id = layoutParams?.RenderingIdentifier?.trim();
    return id || undefined;
  });
}

export function scComponentRoot(kind: string, params?: { [key: string]: string }): string {
  const layoutParams = params as LayoutParams | undefined;
  const extra = layoutParams?.Styles?.trim();
  const base = `component ${kind}`.trim();
  return extra ? `${base} ${extra}` : base;
}
