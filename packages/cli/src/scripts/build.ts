import path from 'path';
const tsx = require('tsx/cjs/api');
// import yargs, { CommandModule } from 'yargs';
// import * as elephant from './elephant';

/* eslint-disable prettier/prettier */
export const command = 'build';

export const describe = 'Handles build time automation';

export const builder = {
  config: {
    requiresArg: false,
    type: 'string',
    describe: 'Path to the Sitecore cli config',
  },
};

/**
 * Handler for the build command.
 * @param {any} argv - The arguments passed to the command.
 */
export async function handler(argv: any) {
  // console.log('hey hey from build');
  console.log(argv.config);
  console.log(path.resolve(process.cwd(), argv.config));
  // const loaded = await tsImport('./file.ts', __filename);
  const tsLoaded = tsx.require(path.resolve(process.cwd(), argv.config), __filename);
  console.log(tsLoaded.build.hey);
  console.log(tsLoaded);

  // console.log(path.resolve(process.cwd(), argv.config));
  const a = require(path.resolve(process.cwd(), argv.config));
  // console.log(a.build.commands);
  // console.log(a.build.hey);

  a.build.commands.forEach((command: any) => {
    // console.log('go command' + command);
    command();
  });

  // console.log('commands', a.build.commands);
  // a.build.commands.forEach((command: CommandModule) => {
  //   console.log('go command' + command.command);
  //   yargs.command(command).parse(command.command || '');
  // });
  // const b = import(path.resolve(process.cwd(), './../../', argv.config)).then((res) => {
  //   console.log(res);
  // });

  // console.log('b', b);

  // yargs.command(elephant).parse('elephant-in-the-room');
}
