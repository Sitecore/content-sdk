/**
 * Vitest config for `yarn changeset:test`.
 * Covers the changeset and release helper scripts under `scripts/`.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');

export default defineConfig({
  root: repoRoot,
  test: {
    include: ['scripts/changesets/**/*.test.ts', 'scripts/release/**/*.test.ts'],
    environment: 'node',
    testTimeout: 15000,
  },
});
