type Arg = string | number | boolean;

/**
 * A base set of arguments used by CLI
 */
export type BaseAppArgs = {
  [key: string]: Arg | Arg[] | undefined;
  /**
   * The template to be used
   */
  template: string;
  /**
   * Destination path
   */
  destination: string;
  /**
   * Suppress logs
   */
  silent?: boolean;
  /**
   * Use to prevent any questions related to the file system operations.
   * Default actions will be executed
   */
  force?: boolean;
  /**
   * Use to prevent any questions related to the CLI argument values.
   * Default values will be used
   */
  yes?: boolean;
};
