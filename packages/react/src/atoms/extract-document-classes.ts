import type { Document } from '@sitecore-content-sdk/content/atoms';

/**
 * Extracts all unique Tailwind CSS class tokens from a Document's element props.
 *
 * Walks the flat `doc.elements` map and collects every `className` string found
 * in element props, splitting on whitespace and deduplicating. The resulting array
 * can be passed directly to a CSS compiler (e.g. via `setAtomsCssCompiler`) to
 * generate the utility rules needed for the Document's components.
 * @param {Document} doc - The Document to extract classes from.
 * @returns {string[]} Deduplicated array of Tailwind class tokens.
 * @public
 */
export function extractDocumentClasses(doc: Document): string[] {
  if (!doc?.elements) return [];

  const seen = new Set<string>();

  for (const element of Object.values(doc.elements)) {
    const props = element.props as Record<string, unknown> | undefined;
    const cn = props?.className;
    if (typeof cn === 'string') {
      for (const token of cn.split(/\s+/)) {
        if (token) seen.add(token);
      }
    }
  }

  return [...seen];
}

