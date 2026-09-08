import { HTMLScript } from '../models';
import { LayoutServiceContext } from './models';

/**
 * Escapes a JSON string for safe embedding in a `<script>` tag.
 * @param {string} json JSON string to escape
 * @returns {string} HTML/script-safe JSON string
 * @internal
 */
const escapeForScriptTag = (json: string): string => {
  const ESCAPE_LOOKUP: Record<string, string> = {
    '&': '\\u0026',
    '<': '\\u003c',
    '>': '\\u003e',
    '/': '\\u002f',
    '\u2028': '\\u2028',
    '\u2029': '\\u2029',
  };
  const ESCAPE_REGEXP = /[&<>/\u2028\u2029]/g;

  return json.replace(ESCAPE_REGEXP, (match) => ESCAPE_LOOKUP[match]);
};

/**
 * Builds the `<script type="application/ld+json">` data for the JSON-LD structured data
 * schemas returned by the Sitecore Layout Service (`sitecore.context.schemas`), for
 * consumption by any rendering layer (Next.js, React, Angular, etc). All schema objects
 * are serialized into a single script as a JSON array.
 * @param {LayoutServiceContext} [context] Context data from a Sitecore layout response
 * @returns {HTMLScript | null} script tag data, or `null` if there are no schemas to render
 * @public
 */
export const getJsonLdSchema = (context?: LayoutServiceContext | null): HTMLScript | null => {
  const schemas = context?.schemas;

  if (!schemas || !Array.isArray(schemas) || schemas.length === 0) return null;

  return {
    type: 'application/ld+json',
    innerHTML: escapeForScriptTag(JSON.stringify(schemas)),
  };
};

