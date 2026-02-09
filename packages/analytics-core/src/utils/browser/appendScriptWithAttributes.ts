/**
 * Appends a script element to the document head with the specified attributes.
 * @param {ScriptAttributes} attributes - The attributes to set on the script element.
 * @internal
 */
export function appendScriptWithAttributes(attributes: ScriptAttributes) {
  const sdkScriptElement = document.createElement('script');

  sdkScriptElement.type = 'text/javascript';
  sdkScriptElement.src = attributes.src;
  sdkScriptElement.async = attributes.async;

  document.head.appendChild(sdkScriptElement);
}

/**
 * The script attributes required to append a script element.
 * @internal
 */
export interface ScriptAttributes {
  /**
   * The async attribute.
   */
  async: boolean;
  /**
   * The src attribute.
   */
  src: string;
}
