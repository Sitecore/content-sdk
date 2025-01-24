import { ComponentFields, getFieldValue } from '@xmcloud-jss/sitecore-jss/layout';

/**
 * "class" property will be transformed into or appended to "className" instead.
 * @param {string} otherAttrs all other props included on the image component
 * @returns {void}
 */
export const addClassName = (otherAttrs: { [key: string]: unknown }): void => {
  if (otherAttrs.class) {
    // if any classes are defined properly already
    if (otherAttrs.className) {
      let className: string = otherAttrs.className as string;
      className += ` ${otherAttrs.class}`;
      otherAttrs.className = className;
    } else {
      otherAttrs.className = otherAttrs.class;
    }
    delete otherAttrs.class;
  }
};

/**
 * Used in FEAAS and BYOC implementations to convert datasource item field values into component props
 * @param {ComponentFields} fields field collection from Sitecore
 * @returns JSON object that can be used as props
 */
export const getDataFromFields = (fields: ComponentFields): { [key: string]: unknown } => {
  let data: { [key: string]: unknown } = {};
  data = Object.entries(fields).reduce((acc, [key]) => {
    acc[key] = getFieldValue(fields, key);
    return acc;
  }, data);
  return data;
};
