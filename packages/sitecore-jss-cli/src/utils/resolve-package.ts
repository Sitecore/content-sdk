import resolve from 'resolve';

/**
 * Resolves and loads the `package.json` file from the current working directory.
 * @returns {Promise<object>} A promise that resolves to the contents of the `package.json` file.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (): Promise<any> =>
  new Promise((resolvePromise, rejectPromise) => {
    resolve('./package.json', { basedir: process.cwd() }, (error, packageJson) => {
      if (error) {
        console.warn('No package.json could be found in the current directory.');
        rejectPromise();
      } else {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        resolvePromise(require(packageJson as string));
      }
    });
  });
