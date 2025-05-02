import { generateHTML } from '@tiptap/html';
import { JSONContent, Extensions } from '@tiptap/core';
import { debug } from '@sitecore-content-sdk/core';
import StarterKit from '@tiptap/starter-kit';

export const parseTiptapJSON = (content: JSONContent[], extensions: Extensions = []) => {
  // prevent warns when StarterKit is passed in extensions
  const nonDuplicateExtensions = Array.from(new Set([StarterKit, ...extensions]));
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
