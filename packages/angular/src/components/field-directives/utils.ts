/**
 * "className" property will be transformed into or appended to "class" instead.
 * @param {string} fieldAttrs all other props included on the image component
 * @returns {void}
 */
export const getClassFromField = (fieldAttrs: { [key: string]: unknown }): string | undefined => {
  if (fieldAttrs.className) {
    if (fieldAttrs.class) {
      let mergedClass: string = fieldAttrs.className as string;
      mergedClass += ` ${fieldAttrs.class}`;
      return mergedClass;
    } else {
      return fieldAttrs.className as string | undefined;
    }
  }
  return fieldAttrs.class as string | undefined;
};
