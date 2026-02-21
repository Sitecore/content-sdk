import { isFieldValueEmpty } from '@sitecore-content-sdk/content/layout';
import { ImageField, ImageFieldValue, LinkField, LinkFieldValue } from '../field-types';

export { isFieldValueEmpty };

/**
 * Extracts a `LinkFieldValue` from either a bare value or a wrapped `LinkField`.
 * @param {LinkField | LinkFieldValue | undefined} field The link field or value.
 * @returns {LinkFieldValue | null}
 */
export function getLinkFieldValue(
  field: LinkField | LinkFieldValue | undefined
): LinkFieldValue | null {
  if (!field) return null;
  const asValue = field as LinkFieldValue;
  const asField = field as LinkField;

  if (asValue.href !== undefined) return asValue;
  if (asField.value) return asField.value;
  return null;
}

/**
 * Builds the `href` string for a link field, including anchor and querystring.
 * @param {LinkFieldValue} link The link value.
 * @returns {string}
 */
export function buildLinkHref(link: LinkFieldValue): string {
  const anchor = link.linktype !== 'anchor' && link.anchor ? `#${link.anchor}` : '';
  const qs = link.querystring ? `?${link.querystring}` : '';
  return `${link.href ?? ''}${qs}${anchor}`;
}

/**
 * Extracts an `ImageFieldValue` from either a bare value or a wrapped `ImageField`.
 * @param {ImageField | ImageFieldValue | undefined} field The image field or value.
 * @returns {ImageFieldValue | null}
 */
export function getImageFieldValue(
  field: ImageField | ImageFieldValue | undefined
): ImageFieldValue | null {
  if (!field) return null;
  const asValue = field as ImageFieldValue;
  const asField = field as ImageField;

  if (asValue.src !== undefined) return asValue;
  if (asField.value) return asField.value;
  return null;
}
