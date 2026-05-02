import { computed, type Signal } from '@angular/core';

type params = { RenderingIdentifier?: string; Styles?: string };

/**
 * CSS class/id helpers aligned with kit-nextjs-skate-park component wrappers.
 */
export function computedRenderingId(
  params: () => { [key: string]: string } | undefined,
): Signal<string | undefined> {
  return computed(() => {
    const params = params() as LayoutParams | undefined;
    const id = layoutParams?.RenderingIdentifier?.trim();
    return id || undefined;
  });
}

export function scComponentRoot(kind: string, params?: { [key: string]: string }): string {
  const params = params as LayoutParams | undefined;
  const extra = layoutParams?.Styles?.trim();
  const base = `component ${kind}`.trim();
  return extra ? `${base} ${extra}` : base;
}
