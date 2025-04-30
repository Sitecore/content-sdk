import { generateHTML } from '@tiptap/html';
import { JSONContent, Node } from '@tiptap/core';

export const parseTiptapJSON = (content: JSONContent[], extensions: Node[]) => {
  return generateHTML(
    {
      type: 'doc',
      content,
    },
    extensions
  );
};
