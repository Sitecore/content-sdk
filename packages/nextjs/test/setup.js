const Module = require('module');

// Ensure a single React instance when tests load @sitecore-content-sdk/react.
// That package may otherwise resolve its own nested react and break hooks (e.g. useMemo).
const originalResolveFilename = Module._resolveFilename;
const forcedReactIds = new Set([
  'react',
  'react-dom',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  'react-dom/client',
]);

Module._resolveFilename = function (request, parent, isMain, options) {
  if (forcedReactIds.has(request)) {
    // Resolve from this package (nextjs) instead of the requiring package's nested copy.
    return originalResolveFilename.call(this, request, module, isMain, options);
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

require('ts-node/register/transpile-only');
require('../src/tests/request.ts');
require('../src/tests/jsdom-setup.ts');
