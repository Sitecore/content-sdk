export { createCookieString } from './utils/cookies/create-cookie-string';
export { getCookieValueClientSide } from './utils/cookies/get-cookie-value-client-side';
export { getCookie } from './utils/cookies/get-cookie';
export { getCookieServerSide } from './utils/cookies/get-cookie-server-side';
export { cookieExists } from './utils/cookies/cookie-exists';
export { flattenObject, FlattenObjectDataParameters } from './utils/converters/flatten-object';
export { isShortISODateString } from './utils/validators/is-short-iso-date-string';
export { isISODateString, normalizeToISODateString } from './utils/validators/is-iso-date-string';
export { isValidEmail } from './utils/validators/is-valid-email';
export { generateV4UUID } from './utils/generators/generate-v4-uuid';
export {
  appendScriptWithAttributes,
  type ScriptAttributes,
} from './utils/browser/appendScriptWithAttributes';

export type { BasicTypes } from './utils/interfaces';

export type { Cookie, CookieProperties } from './utils/cookies/interfaces';
export type { NestedObject, FlattenedObject } from './utils/converters/flatten-object';
