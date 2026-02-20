import { ComponentRendering, PlaceholdersData } from '@sitecore-content-sdk/content/layout';

/**
 * Returns the array of `ComponentRendering` items for a named placeholder
 * within the given rendering's `placeholders` map.
 * Returns an empty array when the placeholder does not exist.
 * @param {ComponentRendering} rendering The parent rendering that owns placeholders.
 * @param {string} placeholderName The placeholder key.
 * @returns {ComponentRendering[]}
 * @public
 */
export function getPlaceholderRenderings(
  rendering: ComponentRendering,
  placeholderName: string
): ComponentRendering[] {
  const placeholders = rendering.placeholders as PlaceholdersData | undefined;
  if (!placeholders) return [];
  return placeholders[placeholderName] ?? [];
}

/**
 * Returns `true` when `placeholders` is defined and contains the named key.
 * @param {ComponentRendering} rendering The rendering to inspect.
 * @param {string} placeholderName The placeholder key.
 * @returns {boolean}
 * @public
 */
export function hasPlaceholder(rendering: ComponentRendering, placeholderName: string): boolean {
  return !!rendering.placeholders?.[placeholderName];
}
