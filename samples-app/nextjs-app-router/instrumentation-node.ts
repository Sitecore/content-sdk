/**
 * Node.js-only instrumentation — imported exclusively from `instrumentation.ts`
 * when `NEXT_RUNTIME === 'nodejs'`.
 *
 * Registers a Tailwind CSS compiler so that Document class names that exist only
 * in runtime MMS Document JSON get compiled and injected at request time.
 */

import { registerTailwindCssCompiler } from '@sitecore-content-sdk/nextjs/instrumentation';

await registerTailwindCssCompiler('src/app/globals.css');

