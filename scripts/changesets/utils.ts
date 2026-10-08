import { realpathSync } from 'fs';
import { fileURLToPath } from 'url';

/**
 * True when the calling module is the script being run (not imported, e.g. by tests).
 * @param {string} moduleUrl - the caller's `import.meta.url`
 */
export const isMainModule = (moduleUrl: string): boolean => {
  try {
    return (
      !!process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(moduleUrl))
    );
  } catch {
    return false;
  }
};
