import yargs, { Argv, CommandModule } from 'yargs';

/**
 * Initializes and configures the CLI application using yargs.
 * This function registers commands, sets up argument parsing, and handles command execution.
 * @param {object} commands - An object containing command modules to be registered with yargs.
 * Each key in the object represents a command name, and the value is a `CommandModule` object
 * that defines the command's behavior, arguments, and options.
 */
export default async function cli(commands?: {
  [key: string]: CommandModule & { disableStrictArgs?: boolean };
}) {
  let appCommands: Argv = yargs(process.argv.slice(2)).usage('$0 <command>');

  appCommands = appCommands.scriptName('sitecore-tools');

  // Register commands if available
  if (commands && Object.keys(commands).length > 0) {
    for (const cmd of Object.keys(commands)) {
      const commandObject = commands[cmd];

      if (typeof commandObject.builder === 'function') {
        appCommands = await commandObject.builder(appCommands);
      }

      if (typeof commandObject.builder === 'object') {
        const ogBuilder = commandObject.builder;
        const builderFunc = commandObject.disableStrictArgs
          ? (yarrrrg: Argv) => yarrrrg.options(ogBuilder)
          : (yarrrrg: Argv) => yarrrrg.options(ogBuilder).strict();

        commandObject.builder = builderFunc;
        appCommands = appCommands.command(commandObject);
      }
    }
  }

  return await appCommands
    .command({
      command: '*',
      handler: (argv) => {
        if (argv._.length > 0) {
          console.error(`Command not found: "${argv._[0]}"`);
        } else {
          console.error('No command provided');
        }
        appCommands.showHelp();
      },
    })
    .demandCommand(1, 'You need to specify a command to run')
    .strict()
    .parse();
}
