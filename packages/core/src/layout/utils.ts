import { ComponentRendering, ComponentFields, Field, GenericFieldValue } from './models';

/**
 * Safely extracts a field value from a rendering or fields object.
 * Null will be returned if the field is not defined.
 * @param {ComponentRendering | Fields} renderingOrFields the rendering or fields object to extract the field from
 * @param {string} fieldName the name of the field to extract
 * @returns {T | undefined} the field value or null if the field is not defined
 */
export function getFieldValue<T>(
  renderingOrFields: ComponentRendering | ComponentFields,
  fieldName: string
): T | undefined;
// eslint-disable-next-line no-redeclare
export function getFieldValue<T>(
  renderingOrFields: ComponentRendering | ComponentFields,
  fieldName: string,
  defaultValue: T
): T;
/**
 * @param {ComponentRendering | Fields} renderingOrFields the rendering or fields object to extract the field from
 * @param {string} fieldName the name of the field to extract
 * @param {T} [defaultValue] the default value to return if the field is not defined
 * @returns {Field | T} the field value or the default value if the field is not defined
 */
// eslint-disable-next-line no-redeclare
export function getFieldValue<T>(
  renderingOrFields: ComponentRendering | ComponentFields,
  fieldName: string,
  defaultValue?: T
) {
  if (!renderingOrFields || !fieldName) {
    return defaultValue;
  }

  const fields = renderingOrFields as ComponentFields;
  const field = (fields[fieldName] as unknown) as Field<T>;
  if (field && typeof field.value !== 'undefined') {
    return field.value;
  }

  const rendering = renderingOrFields as ComponentRendering;
  if (
    !rendering.fields ||
    !rendering.fields[fieldName] ||
    typeof (rendering.fields[fieldName] as Field).value === 'undefined'
  ) {
    return defaultValue;
  }

  return ((rendering.fields[fieldName] as unknown) as Field<T>).value;
}

/**
 * Gets rendering definitions in a given child placeholder under a current rendering.
 * @param {ComponentRendering} rendering
 * @param {string} placeholderName
 * @returns {ComponentRendering[]} child placeholder
 */
export function getChildPlaceholder(
  rendering: ComponentRendering,
  placeholderName: string
): ComponentRendering[] {
  if (
    !rendering ||
    !placeholderName ||
    !rendering.placeholders ||
    !rendering.placeholders[placeholderName]
  ) {
    return [];
  }

  return rendering.placeholders[placeholderName];
}

/**
 * Returns a regular expression pattern for a dynamic placeholder name.
 * @param {string} placeholder Placeholder name with a dynamic segment (e.g. 'main-{*}')
 * @returns Regular expression pattern for the dynamic segment
 */
export const getDynamicPlaceholderPattern = (placeholder: string) => {
  return new RegExp(`^${placeholder.replace(/\{\*\}+/i, '\\d+')}$`);
};

/**
 * Checks if the placeholder name is dynamic.
 * @param {string} placeholder Placeholder name
 * @returns True if the placeholder name is dynamic
 */
export const isDynamicPlaceholder = (placeholder: string) => placeholder.indexOf('{*}') !== -1;

/**
 * The default value for an empty Date field.
 * This value is defined as a default one by .NET
 */
export const EMPTY_DATE_FIELD_VALUE = '0001-01-01T00:00:00Z';

/**
 * Determines if the passed in field object's value is empty.
 * @param {GenericFieldValue | Partial<Field>} field the field object.
 * Partial<T> type is used here because _field.value_ could be required or optional for the different field types
 */
export function isFieldValueEmpty(field: GenericFieldValue | Partial<Field>): boolean {
  const isImageFieldEmpty = (fieldValue: GenericFieldValue) =>
    !(fieldValue as { [key: string]: unknown }).src;
  const isFileFieldEmpty = (fieldValue: GenericFieldValue) =>
    !(fieldValue as { [key: string]: unknown }).src;
  const isLinkFieldEmpty = (fieldValue: GenericFieldValue) =>
    !(fieldValue as { [key: string]: unknown }).href;
  const isDateFieldEmpty = (fieldValue: GenericFieldValue) => {
    if (typeof fieldValue === 'string') {
      return fieldValue === EMPTY_DATE_FIELD_VALUE;
    } else {
      return !(
        typeof (fieldValue as Date)?.getMonth === 'function' &&
        !isNaN((fieldValue as Date)?.getMonth())
      );
    }
  };

  const isEmpty = (fieldValue: GenericFieldValue) => {
    if (fieldValue === null || fieldValue === undefined) {
      return true;
    }

    if (typeof fieldValue === 'object') {
      return (
        isImageFieldEmpty(fieldValue) &&
        isFileFieldEmpty(fieldValue) &&
        isLinkFieldEmpty(fieldValue) &&
        isDateFieldEmpty(fieldValue)
      );
    } else if (typeof fieldValue === 'number' || typeof fieldValue === 'boolean') {
      // Avoid returning true for 0 and false values
      return false;
    } else {
      return !fieldValue || isDateFieldEmpty(fieldValue);
    }
  };

  if (!field) return true;

  const dynamicField = field as Partial<Field>;
  if (dynamicField.value !== undefined) {
    return isEmpty(dynamicField.value);
  }

  return isEmpty(field as GenericFieldValue);
}
