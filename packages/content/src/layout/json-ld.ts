import { HTMLScript } from '../models';

/**
 * Lookup table and regular expression for escaping JSON strings in script tags.
 * @internal
 */
const ESCAPE_LOOKUP: Record<string, string> = {
  '&': '\\u0026',
  '<': '\\u003c',
  '>': '\\u003e',
  '/': '\\u002f',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
};

/**
 * Regular expression for matching characters that need to be escaped in JSON strings within script tags.
 * @internal
 */
const ESCAPE_REGEXP = /[&<>/\u2028\u2029]/g;

/**
 * Escapes a JSON string for safe embedding in a `<script>` tag.
 * @param {string} json JSON string to escape
 * @returns {string} HTML/script-safe JSON string
 * @internal
 */
const escapeForScriptTag = (json: string): string =>
  json.replace(ESCAPE_REGEXP, (match) => ESCAPE_LOOKUP[match]);

/**
 * Type guard for a valid JSON-LD schema node — a non-null, non-array object.
 * @param {unknown} schema candidate schema entry
 * @returns {boolean} whether `schema` is a valid schema node object
 * @internal
 */
const isValidSchema = (schema: unknown): schema is Record<string, unknown> =>
  typeof schema === 'object' && schema !== null && !Array.isArray(schema);

/**
 * Builds the `<script type="application/ld+json">` data for the JSON-LD structured data
 * schemas returned by the Sitecore Layout Service (`sitecore.context.schemas`), for
 * consumption by any rendering layer (Next.js, React, Angular, etc). All schema objects
 * are serialized into a single script as a JSON array. Invalid entries (`null`, `undefined`,
 * arrays, or other non-object values) are filtered out before serialization.
 * @param {Record<string, unknown>[]} [schemas] JSON-LD schema node objects (e.g. `sitecore.context.schemas`)
 * @returns {HTMLScript | null} script tag data, or `null` if there are no schemas to render
 * @public
 */
export const getJsonLdSchemas = (schemas?: Record<string, unknown>[] | null): HTMLScript | null => {
  if (!schemas || !Array.isArray(schemas)) return null;

  const validSchemas = schemas.filter(isValidSchema);

  if (validSchemas.length === 0) return null;

  return {
    type: 'application/ld+json',
    innerHTML: escapeForScriptTag(JSON.stringify(validSchemas)),
  };
};
