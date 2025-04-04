import path from 'path';
import * as dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

/**
 * Loads and processes environment variables from `.env` files in the specified directory.
 * It supports multiple `.env` files, including
 * environment-specific files (e.g., `.env.development`, `.env.production`) and local overrides
 * (e.g., `.env.local`, `.env.development.local`).
 * @param {string} dir - The directory to search for `.env` files.
 */
export default function processEnv(dir: string) {
  // replicate Next.js handling/behavior, but without a default NODE_ENV
  // https://github.com/vercel/next.js/blob/v10.0.5/packages/next-env/index.ts#L80-L90
  const mode = process.env.NODE_ENV;
  const dotenvFiles = [
    mode && `.env.${mode}.local`,
    // Don't include `.env.local` for `test` environment
    // since normally you expect tests to produce the same
    // results for everyone
    mode !== 'test' && '.env.local',
    mode && `.env.${mode}`,
    '.env',
  ].filter(Boolean) as string[];

  // inspired by https://github.com/entropitor/dotenv-cli/blob/v4.0.0/cli.js#L53-L55
  dotenvFiles.forEach(function(env) {
    dotenvExpand.expand(dotenv.config({ path: path.resolve(dir, env) }));
  });
}
