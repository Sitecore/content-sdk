import yargs, { Argv, CommandModule, Arguments } from 'yargs';
import resolvePackage from './utils/resolve-package';
import runPackageScript from './utils/run-package-script';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

/**
 * Initializes and configures the CLI application using yargs.
 * This function registers commands, sets up argument parsing, and handles command execution.
 * @param {object} commands - An object containing command modules to be registered with yargs.
 * Each key in the object represents a command name, and the value is a `CommandModule` object
 * that defines the command's behavior, arguments, and options.
 */
export async function cli(commands: {
  [key: string]: CommandModule & { disableStrictArgs?: boolean };
}) {
  let appCommands = yargs.usage('$0 <command>');

  // this prevents yargs from showing help with 'jss.js' as the base command
  // when the command is just 'jss' as a global bin
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (appCommands as any).$0 = 'jss';

  for (const cmd of Object.keys(commands)) {
    const commandObject = commands[cmd];

    // command is a yargs builder function that takes a yargs and returns a yargs
    // YARRRRRGS :D
    if (typeof commandObject.builder === 'function') {
      appCommands = await commandObject.builder(appCommands);
    }

    // command is a yargs 'command module' (https://github.com/yargs/yargs/blob/master/docs/advanced.md#providing-a-command-module)
    if (typeof commandObject.builder === 'object') {
      const ogBuilder = commandObject.builder;

      // apply strict-ness to the args of each command
      const builderFunc = commandObject.disableStrictArgs
        ? (yarrrrg: Argv) => yarrrrg.options(ogBuilder)
        : (yarrrrg: Argv) => yarrrrg.options(ogBuilder).strict();

      commandObject.builder = builderFunc;

      appCommands = appCommands.command(commandObject);
    }
  }

  const argv = await appCommands.demandCommand(1).help().argv;

  if (!argv._[0]) {
    console.log('Missing command. Use --help to see all available options.');
  }
}

/**
 * Get package script commands
 */
export async function getPackageScriptCommands() {
  const packageJson = await resolvePackage();
  const result: { [key: string]: CommandModule } = {};

  if (!packageJson || !packageJson.scripts) {
    return result;
  }

  Object.keys(packageJson.scripts).forEach((script) => {
    if (script === 'jss') {
      return;
    }

    const command = makeCommand(script);

    result[script] = command;
  });

  return result;
}

/**
 * Creates a yargs command object for a package.json script.
 * This function is used to dynamically generate CLI commands based on scripts
 * defined in a project's `package.json` file.
 * @param {string} script - The name of the script from `package.json` (e.g., `build`, `start`).
 */
export function makeCommand(script: string) {
  return {
    command: script,
    describe: 'package.json script',
    builder: {},
    disableStrictArgs: true,
    handler: (argv: Arguments) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((argv as any)._[0]) {
        runPackageScript(process.argv.slice(2));
      }
    },
  };
}

/**
 * implements CLI commands when executed from a local node_modules folder
 */
export default async function() {
  const packageScripts = await getPackageScriptCommands();

  cli(Object.assign({}, packageScripts));
}
