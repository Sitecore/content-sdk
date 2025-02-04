import { SpawnSyncOptionsWithStringEncoding } from 'child_process';
import spawn from 'cross-spawn';

/**
 * Executes a command synchronously using `spawnSync` and handles process termination signals and exit codes.
 * @param {string} command - The command to execute (e.g., `npm`, `git`, `ls`).
 * @param {string[]} args - An array of arguments to pass to the command.
 * @param {SpawnSyncOptionsWithStringEncoding} [options] - Optional configuration for the `spawnSync` call.
 */
export default function(
  command: string,
  args: string[],
  options?: SpawnSyncOptionsWithStringEncoding
) {
  const result = spawn.sync(command, args, Object.assign({ stdio: 'inherit' }, options));

  if (result.signal) {
    if (result.signal === 'SIGKILL') {
      console.log(
        'The operation failed because the process exited too early. ' +
          'This probably means the system ran out of memory or someone called ' +
          '`kill -9` on the process.'
      );
    } else if (result.signal === 'SIGTERM') {
      console.log(
        'The operation failed because the process exited too early. ' +
          'Someone might have called `kill` or `killall`, or the system could ' +
          'be shutting down.'
      );
    }
    process.exit(1);
  }

  if (result.status && result.status > 0) {
    process.exit(result.status);
  }
}
