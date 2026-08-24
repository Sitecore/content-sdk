/**
 * Extracts a single `@layer <name> { ... }` block from a full Tailwind CSS string.
 * Uses brace-counting to handle arbitrarily nested rules.
 * @param {string} css - Full compiled Tailwind CSS string.
 * @param {string} layerName - Layer name to extract (e.g. `'theme'`, `'utilities'`).
 * @returns {string} The complete layer block, or empty string if not found.
 * @internal
 */
export function extractLayer(css: string, layerName: string): string {
  const marker = `@layer ${layerName} {`;
  const start = css.indexOf(marker);
  if (start === -1) return '';
  let depth = 1;
  let i = start + marker.length;
  while (i < css.length && depth > 0) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}') depth--;
    i++;
  }
  const inner = css.slice(start + marker.length, i - 1).trim();
  return inner ? `@layer ${layerName} {\n${inner}\n}` : '';
}

/**
 * Extracts the CSS layers needed for document-scoped injection.
 * Includes `@layer theme` (CSS custom properties used by utility classes) and
 * `@layer utilities` (the actual utility rules). Skips `@layer base` (CSS resets)
 * since those are already present in the app's main bundle.
 * @param {string} css - Full compiled Tailwind CSS string.
 * @returns {string} Theme and utilities layers joined, or empty string if neither found.
 * @internal
 */
export function extractDocumentCssLayers(css: string): string {
  return [extractLayer(css, 'theme'), extractLayer(css, 'utilities')].filter(Boolean).join('\n');
}
