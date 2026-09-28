import { Answers, DistinctQuestion } from 'inquirer';

type Arg = string | number | boolean;

/**
 * A base set of arguments used by the CLI.
 * Kept in sync structurally with create-content-sdk-app's `BaseAppArgs`.
 * Defined locally so this package never imports from create-content-sdk-app
 * (dependency direction is create-content-sdk-app -> template packages only).
 */
export type BaseAppArgs = {
  [key: string]: Arg | Arg[] | undefined;
  /** The template to be used */
  template: string;
  /** Destination path */
  destination: string;
  /** Suppress logs */
  silent?: boolean;
  /** Skip file-system related questions and use default actions */
  force?: boolean;
  /** Skip CLI argument value questions and use default values */
  yes?: boolean;
};

/**
 * A base set of CLI answers for the app.
 */
export type BaseAppAnswer = Answers & {};

/**
 * Result returned by an initializer.
 */
export type InitializerResults = {
  nextSteps?: string;
};

/**
 * Shared utilities injected by create-content-sdk-app into an initializer at runtime.
 * This is how template packages reuse the CLI's rendering pipeline without
 * depending on create-content-sdk-app.
 */
export type InitContext = {
  /**
   * Renders a template folder to the destination. The Content SDK package
   * versions are resolved and bound by create-content-sdk-app from this
   * package's own package.json, so initializers do not pass them.
   */
  transform: (templatePath: string, args: BaseAppArgs) => Promise<void>;
  /**
   * Base prompts contributed by the CLI, prepended to each initializer's prompts.
   */
  baseAppPrompts: DistinctQuestion<BaseAppAnswer>[];
};

/**
 * Initializer base type implemented by each template initializer.
 */
export interface Initializer {
  /**
   * Entrypoint for the initializer.
   * @param {BaseAppArgs} args CLI arguments
   * @param {InitContext} ctx shared utilities injected by create-content-sdk-app
   */
  init: (args: BaseAppArgs, ctx: InitContext) => Promise<InitializerResults>;
}
