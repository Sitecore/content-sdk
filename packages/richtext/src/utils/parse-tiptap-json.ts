import { generateHTML } from '@tiptap/html';
import { JSONContent, Extensions } from '@tiptap/core';
import { debug } from '@sitecore-content-sdk/core';
import StarterKit from '@tiptap/starter-kit';

/**
 * Parses JSON formatted for Tiptap into HTML
 * @param {JSONContent} content Tiptap-formatted JSON content to be parsed
 * @param {Extensions} extensions Tiptap extensions to replace the default setup with StarterKit
 * @returns {string} Transformed HTML
 */
export const getRichTextHtml = (content: JSONContent, extensions?: Extensions) => {
  // prevent warns when StarterKit is passed in extensions
  extensions = extensions ?? [StarterKit];
  try {
    return generateHTML(content, extensions);
  } catch (e) {
    debug.common('TipTap rich text parsing failed. Error: %o', e);
    throw e;
  }
};
