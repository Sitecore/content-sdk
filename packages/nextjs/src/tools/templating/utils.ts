import chokidar from 'chokidar';

/**
 * Run watch mode, watching on @var paths
 * @param {string[]} paths paths to watch by chokidar
 * @param {Function<void>} cb callback to run on file change
 */
export function watchItems(paths: string[], cb: () => void): void {
  chokidar
    .watch(paths, { ignoreInitial: true, awaitWriteFinish: true })
    .on('add', cb)
    .on('unlink', cb);
}
