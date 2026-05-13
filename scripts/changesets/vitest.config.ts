/**
 * Vitest config for `yarn changeset:test` only.
 * Do not modify implementation under test: `changelog.ts`, `cascade-version.ts`.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');

export default defineConfig({
  root: repoRoot,
  test: {
    include: ['scripts/changesets/**/*.test.ts'],
    environment: 'node',
    testTimeout: 15000,
  },
});
