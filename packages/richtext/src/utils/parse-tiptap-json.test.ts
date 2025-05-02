import { expect } from 'chai';
import { parseTiptapJSON } from './parse-tiptap-json';
import sinon from 'sinon';
import { debug } from '@sitecore-content-sdk/core';
import { Node, mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

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

  it('should parse JSON into HTML with duplicate StarterKit extension', () => {
    const consoleStub = sandbox.stub(console, 'warn');
    const jsonContent = [
      { type: 'paragraph', content: [{ type: 'text', text: 'On the server, or the browser' }] },
    ];
    const result = parseTiptapJSON(jsonContent, [StarterKit]);
    expect(consoleStub.callCount).to.equal(0);
    expect(result).to.equal('<p>On the server, or the browser</p>');
  });

  it('should parse JSON into HTML with custom extensions', () => {
    const CustomView = Node.create<{ HTMLAttributes: Record<string, any> }>({
      name: 'customView',
      group: 'block',
      content: 'inline*',
      addOptions() {
        return {
          HTMLAttributes: {},
        };
      },
      addAttributes() {
        return {
          color: {
            default: 'pink',
            renderHTML: (attributes) => {
              return {
                style: `color: ${attributes.color}`,
              };
            },
          },
        };
      },
      parseHTML() {
        return [
          {
            tag: 'p',
          },
        ];
      },
      renderHTML({ HTMLAttributes }) {
        return ['p', mergeAttributes(HTMLAttributes, this.options.HTMLAttributes), 0];
      },
    });

    const jsonContent = [
      {
        type: 'customView',
        content: [{ type: 'text', text: 'On the server, or the browser' }],
      },
    ];
    const result = parseTiptapJSON(jsonContent, [CustomView]);
    expect(result).to.equal('<p style="color: pink">On the server, or the browser</p>');
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
