import { generateHTML } from '@tiptap/html';
import { JSONContent, Node } from '@tiptap/core';
export { Node as TipTapNode, mergeAttributes } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { debug } from '@sitecore-content-sdk/core';

export const parseTiptapJSON = (content: JSONContent[], extensions: Node[] = []) => {
  const defaultExtensions = [Document, Paragraph, Text];
  let result = '';
  try {
    result = generateHTML(
      {
        type: 'doc',
        content,
      },
      [...defaultExtensions, ...extensions]
    );
  } catch (e) {
    debug.common('TipTap rich text parsing failed. Error: %o', e);
  }
  return result;
};
