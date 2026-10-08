/**
 * Data  contract for scaffolding CSDK templates. Uses generic type for scaffolding prompts.
 */
export type ScaffoldInitData<T> = {
  // name of the template to init
  name: string;
  // Prompts for extra parameters for scaffolding
  prompts: T[];
  // path to template folder to initialize
  templatePath: string;
  // key-value collection of CSDK packages and their versions to be used in scaffolded sample
  versions: { [key: string]: string };
  // next steps to perform after scaffold
  nextSteps?: string;
};
