/**
 * Reads `process.env` when running under Node; otherwise returns an empty object.
 * process.env is only available on the server in Angular
 * @param {string} name - The name of the environment variable to read.
 * @returns {Record<string, string | undefined>} Environment map for merging into config.
 * @internal
 */
export function readProcessEnv(name: string) {
  // Use globalThis so we do not need @types/node (lib tsconfig uses "types": []).
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;
  if (env) {
    return env[name];
  }
  return undefined;
}
