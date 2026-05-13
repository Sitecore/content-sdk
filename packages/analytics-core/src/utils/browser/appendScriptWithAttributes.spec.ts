import { appendScriptWithAttributes } from './appendScriptWithAttributes';
import { expect } from '@jest/globals';

describe('appendScriptWithAttributes', () => {
  const { window } = global;

  afterEach(() => {
    global.window ??= Object.create(window);
  });
  it('should append a script tag to the document with the provided parameters', async () => {
    const expectedAttributes = {
      async: true,
      src: 'https://d35vb5cccm4xzp.cloudfront.net/web-flow-libs/key/version.min.js',
    };
    const expected =
      // eslint-disable-next-line max-len
      '<script type="text/javascript" src="https://d35vb5cccm4xzp.cloudfront.net/web-flow-libs/key/version.min.js"></script>';
    appendScriptWithAttributes(expectedAttributes);
    expect(document.head.innerHTML).toEqual(expect.stringMatching(expected));
  });
});
