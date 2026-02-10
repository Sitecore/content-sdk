import { LayoutServiceData } from './models';

/**
 * Options for content URL rewriting.
 * Affects how source is matched in string values (e.g. URL fields, rich text with img/src, href).
 * @public
 */
export interface ContentRewriteOptions {
  /**
   * - 'normal': replace every occurrence of source with target in each string.
   * - 'prefix': replace only when the string starts with source (e.g. URL prefix).
   * @default 'normal'
   */
  type?: 'prefix' | 'normal';
}

/**
 * Performs a single string replacement according to options.
 * @param {string} str - String to process
 * @param {string | RegExp} source - String or RegExp to replace
 * @param {string} target - Replacement string
 * @param {ContentRewriteOptions} options - Rewrite options
 * @returns {string} Rewritten string
 * @internal
 */
function replaceInString(
  str: string,
  source: string | RegExp,
  target: string,
  options: ContentRewriteOptions
): string {
  if (options.type === 'prefix' && typeof source === 'string') {
    return str.startsWith(source) ? target + str.slice(source.length) : str;
  }
  if (options.type === 'prefix' && source instanceof RegExp) {
    const match = str.match(source);
    if (match && match.index === 0) {
      return str.replace(source, target);
    }
    return str;
  }
  // normal: replace all
  if (typeof source === 'string') {
    return str.split(source).join(target);
  }
  return str.replace(source, target);
}

/**
 * Deep traversal that replaces source with target in every string value.
 * Covers URL fields (e.g. field.value.src), rich text (HTML with img src, a href), and any other string in the layout.
 * @param {T} value - Any value (layout, object, array, string)
 * @param {string | RegExp} source - String or RegExp to replace (e.g. Edge host URL or pattern)
 * @param {string} target - Replacement string (e.g. custom host URL)
 * @param {ContentRewriteOptions} options - Rewrite options
 * @returns {T} New value with replacements applied
 * @internal
 */
function deepReplace<T>(
  value: T,
  source: string | RegExp,
  target: string,
  options: ContentRewriteOptions
): T {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'string') {
    return replaceInString(value, source, target, options) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => deepReplace(item, source, target, options)) as T;
  }

  if (typeof value === 'object') {
    if (Object.getPrototypeOf(value) !== Object.prototype) {
      return value;
    }
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>)) {
      result[key] = deepReplace(
        (value as Record<string, unknown>)[key],
        source,
        target,
        options
      );
    }
    return result as T;
  }

  return value;
}

/**
 * Rewrites content URLs in layout data by replacing source with target in every string value.
 * Use for media URLs (Image field value.src), rich text (HTML with &lt;img src="..."&gt;, &lt;a href="..."&gt;), and link fields.
 * This is an unopinionated helper: it replaces in all strings, so use a specific source/target to avoid unintended rewrites.
 * @param {LayoutServiceData} layout - Layout service data (route, placeholders, component fields)
 * @param {string | RegExp} source - String or RegExp to replace (e.g. 'https://edge-staging.sitecore-staging.cloud' or regex)
 * @param {string} target - Replacement string (e.g. 'https://custom.example.com')
 * @param {ContentRewriteOptions} options - Optional. type 'normal' (default) replaces all occurrences; 'prefix' replaces only at string start.
 * @returns {LayoutServiceData} New layout with replacements applied (does not mutate input)
 * @public
 * @example
 * // Replace Edge staging host with custom host in all content (URLs and rich text)
 * const rewritten = rewriteContentInLayout(layout, 'https://edge-staging.sitecore-staging.cloud', 'https://my-cdn.example.com');
 * @example
 * // Replace with regex (e.g. any Edge host)
 * const rewritten = rewriteContentInLayout(layout, /https?:\/\/edge(-staging)?\.sitecore[^/]+/gi, 'https://custom.example.com');
 */
export function rewriteContentInLayout(
  layout: LayoutServiceData,
  source: string | RegExp,
  target: string,
  options: ContentRewriteOptions = {}
): LayoutServiceData {
  const opts: ContentRewriteOptions = { type: 'normal', ...options };
  return deepReplace(layout, source, target, opts);
}
