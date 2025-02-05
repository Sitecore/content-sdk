/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import cli from './cli';
// import yargs from 'yargs';

describe('cli', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should set the $0 property to "jss" to prevent showing help with "jss.js" as the base command', async () => {
    const yargs = await import('yargs');

    const appCommands = yargs.default.usage('$0 <command>');
    const commands = {};

    cli(commands);
    expect((appCommands as any).$0).to.equal('jss');
  });

  it('should call the builder function of each command', async () => {
    const yargs = await import('yargs');

    const appCommands = yargs.default.usage('$0 <command>');
    const commands = {
      test: {
        builder: sinon.stub().returns(appCommands),
        handler: () => {},
      },
    };

    cli(commands);

    expect(commands.test.builder.calledOnce).to.be.true;
  });
});
