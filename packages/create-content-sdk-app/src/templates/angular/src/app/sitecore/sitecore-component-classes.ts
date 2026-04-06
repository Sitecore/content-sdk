/**
 * CSS class/id helpers aligned with kit-nextjs-skate-park component wrappers.
 */
export function scComponentRoot(kind: string, params?: { [key: string]: string }): string {
  const styles = params?.['styles']?.trim();
  const base = `component ${kind}`.trim();
  return styles ? `${base} ${styles}` : base;
}

export function scRenderingId(params?: { [key: string]: string }): string | undefined {
  const id = params?.['RenderingIdentifier']?.trim();
  return id || undefined;
}
