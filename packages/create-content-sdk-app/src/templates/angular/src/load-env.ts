/**
 * Must be imported before any module that reads `process.env` for Sitecore config (e.g. `sitecore.config.ts`).
 * ESM evaluates static imports before the rest of the entry module, so this file should be the first import
 * in `server.ts` and `main.server.ts`.
 */
import dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const current = dirname(fileURLToPath(import.meta.url));

const candidateRoots = [
  process.cwd(),
  resolve(current, '..'),
];

const seen = new Set<string>();
for (const root of candidateRoots) {
  const dir = resolve(root);
  if (seen.has(dir)) continue;
  seen.add(dir);
  const envPath = resolve(dir, '.env');
  const localPath = resolve(dir, '.env.local');
  if (existsSync(localPath)) {
    dotenv.config({ path: localPath });
    break;
  } else if (existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}
