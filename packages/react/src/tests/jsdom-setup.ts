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

// Suppress React error-boundary test noise (expected errors that React logs to console.error)
const originalConsoleError = global.console.error;
global.console.error = (...args: unknown[]) => {
  const msg = args.length > 0 && typeof args[0] === 'string' ? args[0] : '';
  const isReactErrorBoundary =
    msg.includes('The above error occurred in the') ||
    msg.includes('React will try to recreate this component tree') ||
    msg.includes('An error occurred in component');
  const isReactErrorInfo =
    args.length === 2 &&
    typeof args[1] === 'object' &&
    args[1] !== null &&
    'componentStack' in (args[1] as object);
  if (isReactErrorBoundary || isReactErrorInfo) return;
  originalConsoleError.apply(global.console, args);
};
