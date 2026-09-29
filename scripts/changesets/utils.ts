import { realpathSync } from 'fs';
import { fileURLToPath } from 'url';

export const isMainModule = (): boolean => {
  try {
    return (
      !!process.argv[1] &&
      realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
    );
  } catch {
    return false;
  }
};
