/* eslint-disable jsdoc/require-jsdoc */
import { expect } from 'chai';
import type { Document } from '@sitecore-content-sdk/content/atoms';
import type { DefineRegistryResult } from '@json-render/react';
import { createNCC } from '.';

describe('create-ncc', () => {
  const mockDoc: Document = {
    name: 'TestComponent',
    root: 'root-el',
    elements: {
      'root-el': {
        type: 'Card',
        props: { title: 'Hello' },
        children: [],
      },
    },
    state: { count: 0 },
  };

  const mockRegistry: DefineRegistryResult = {
    registry: {} as any,
    handlers: () => ({}),
    executeAction: async () => {},
  };

  it('returns an FC with the document name as displayName', () => {
    const View = createNCC(mockDoc, mockRegistry);
    expect(View.displayName).to.equal('TestComponent');
  });

  it('returns a functional component', () => {
    const View = createNCC(mockDoc, mockRegistry);
    expect(typeof View).to.equal('function');
  });
});
