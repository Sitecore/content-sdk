/* eslint-disable jsdoc/require-jsdoc */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import type { Document } from '@sitecore-content-sdk/content/atoms';
import { createView } from './createView';
import type { DefineRegistryResult } from '@json-render/react';

describe('component-layout/createView', () => {
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

  describe('createView()', () => {
    it('returns an FC with the document name as displayName', () => {
      const View = createView(mockDoc, mockRegistry);
      expect(View.displayName).to.equal('TestComponent');
    });

    it('returns a functional component', () => {
      const View = createView(mockDoc, mockRegistry);
      expect(typeof View).to.equal('function');
    });
  });
});
