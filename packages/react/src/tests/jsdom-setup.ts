/* eslint-disable spaced-comment */

/// <reference types="../../global" />

// eslint-disable-next-line no-var
declare var global: NodeJS.Global;
const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost',
});
const jsDomWindow = jsdom.window;

/**
 * @param {unknown} src
 * @param {unknown} target
 */
function copyProps(src: unknown, target: { [key: string]: unknown }) {
  const props = Object.getOwnPropertyNames(src)
    .filter((prop) => typeof target[prop] === 'undefined')
    .reduce(
      (result, prop) => ({
        ...result,
        [prop]: Object.getOwnPropertyDescriptor(src, prop),
      }),
      {}
    );

  Object.defineProperties(target, props);
}

global.window = jsDomWindow;
global.document = jsDomWindow.document;
global.navigator['#userAgent'] = 'node.js';
global.jsdom = jsdom;

global.HTMLElement = jsDomWindow.HTMLElement; // makes chai "happy" https://github.com/chaijs/chai/issues/1029
copyProps(jsDomWindow, global);
