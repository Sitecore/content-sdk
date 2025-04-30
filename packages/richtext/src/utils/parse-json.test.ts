import { expect } from 'chai';
import { parseTiptapJSON } from './parse-json';
export { Node as TipTapNode, mergeAttributes } from '@tiptap/core';
import sinon from 'sinon';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { debug } from '@sitecore-content-sdk/core';

describe('parseTiptapJSON', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should parse JSON into HTML', () => {
    const jsonContent = [
      { type: 'paragraph', content: [{ type: 'text', text: 'On the server, or the browser' }] },
    ];
    const result = parseTiptapJSON(jsonContent);
    expect(result).to.equal('<p>On the server, or the browser</p>');
  });

  it('should parse JSON into HTML with duplicate extensions', () => {
    const jsonContent = [
      { type: 'paragraph', content: [{ type: 'text', text: 'On the server, or the browser' }] },
    ];
    const result = parseTiptapJSON(jsonContent, [Document, Paragraph, Text]);
    expect(result).to.equal('<p>On the server, or the browser</p>');
  });

  it('should parse JSON into HTML with custom extensions', () => {
    const CustomNode = TipTapNode.create({
      name: 'customNode',
      group: 'block',
      atom: true,
      addAttributes() {
        return {
          color: {
            default: 'pink',
          },
        };
      },
      parseHTML() {
        return [
          {
            tag: 'node-view',
          },
        ];
      },
      renderHTML({ HTMLAttributes }) {
        return ['node-view', mergeAttributes(HTMLAttributes)];
      },
      addNodeView() {
        return ({ node }) => {
          const dom = document.createElement('div');
          dom.classList.add('node-view');
          const span = document.createElement('span');
          span.setAttribute('style', `color: ${node.attrs.color}`);
          span.innerHTML = node.attrs.text;
          dom.append(span);
          return {
            dom,
          };
        };
      },
    });

    const jsonContent = [
      { type: 'customNode', color: 'green', text: 'On the server, or the browser' },
    ];
    const result = parseTiptapJSON(jsonContent, [CustomNode]);
    expect(result).to.equal('<span style="color: pink">On the server, or the browser</span>');
  });

  it('should log error and return empty when parsing fails', () => {
    const debugStub = sandbox.stub(debug, 'common');
    const jsonContent = [
      { type: 'not-paragraph', content: [{ type: 'text', text: 'On the server, or the browser' }] },
    ];
    const result = parseTiptapJSON(jsonContent);
    expect(result).to.equal('');
    expect(debugStub.callCount).to.be.equal(1);
    expect(debugStub.firstCall.args[0]).to.be.equal('TipTap rich text parsing failed. Error: %o');
    expect(debugStub.firstCall.args[1]).to.deep.equal(
      new RangeError('Unknown node type: not-paragraph')
    );
  });
});
