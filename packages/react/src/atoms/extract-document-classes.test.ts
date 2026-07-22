/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import type { Document } from '@sitecore-content-sdk/content/atoms';
import { extractDocumentClasses } from './extract-document-classes';

describe('extractDocumentClasses', () => {
  it('returns empty array when document has no elements', () => {
    expect(extractDocumentClasses({ name: 'empty', root: 'root', elements: {} } as Document)).to
      .be.empty;
    expect(extractDocumentClasses({ name: 'empty' } as Document)).to.be.empty;
  });

  it('collects unique class tokens from element className props', () => {
    const doc = {
      name: 'card',
      root: 'root',
      elements: {
        root: { type: 'Stack', props: { className: 'flex gap-4' }, children: ['title'] },
        title: {
          type: 'Heading',
          props: { className: 'text-red-500 flex', text: 'Hi' },
          children: [],
        },
        plain: { type: 'Text', props: { text: 'no class' }, children: [] },
      },
    } as unknown as Document;

    expect(extractDocumentClasses(doc).sort()).to.deep.equal(['flex', 'gap-4', 'text-red-500']);
  });

  it('ignores non-string className values', () => {
    const doc = {
      name: 'card',
      root: 'root',
      elements: {
        root: { type: 'Stack', props: { className: ['flex'] }, children: [] },
      },
    } as unknown as Document;

    expect(extractDocumentClasses(doc)).to.be.empty;
  });
});
