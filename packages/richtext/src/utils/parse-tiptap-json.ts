import { generateHTML } from '@tiptap/html';
import { JSONContent, Node } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { debug } from '@sitecore-content-sdk/core';

export const parseTiptapJSON = (content: JSONContent[], extensions: Node[] = []) => {
  // default extensions required to render tiptap content
  const defaultExtensions = [Document, Paragraph, Text];
  // all extensions, with duplicate ones removed
  const nonDuplicateExtensions = Array.from(new Set([...defaultExtensions, ...extensions]));
  let result = '';
  try {
    result = generateHTML(
      {
        type: 'doc',
        content,
      },
      nonDuplicateExtensions
    );
  } catch (e) {
    debug.common('TipTap rich text parsing failed. Error: %o', e);
  }
  return result;
};
