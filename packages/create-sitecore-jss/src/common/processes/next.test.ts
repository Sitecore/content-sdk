import { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import { nextSteps } from './next';
import chalk from 'chalk';

describe('next', () => {
  describe('nextSteps', () => {
    let log: SinonStub;

    beforeEach(() => {
      log = sinon.stub(console, 'log');
    });

    afterEach(() => {
      log?.restore();
    });

    it('displays appName in output', async () => {
      const appName = 'my-cool-app';
      await nextSteps(appName, '');

      const calls = log.getCalls();
      calls.forEach((call) => {
        console.log(call.args[0]);
      });
      expect(
        calls.some(
          (call) => call.args[0] === `JSS application ${chalk.green('my-cool-app')} is ready!`
        )
      ).to.equal(true);
    });

    it('displays single app name with single item wording in output', async () => {
      const appName = 'my-cool-app';
      await nextSteps(appName, '');

      const calls = log.getCalls();
      calls.forEach((call) => {
        console.log(call.args[0]);
      });
      expect(
        calls.some(
          (call) => call.args[0] === `JSS application ${chalk.green('my-cool-app')} is ready!`
        )
      ).to.equal(true);
    });

    it('displays next steps in output', async () => {
      const nextStepsText = 'do this';

      await nextSteps('my-cool-app', nextStepsText);

      const calls = log.getCalls();

      calls.forEach((call) => {
        console.log(call.args[0]);
      });
      expect(calls.some((call) => call.args[0] === nextStepsText)).to.equal(true);
    });

    it('do not display empty line if nextStepsText is missing', async () => {
      const nextStepsText = '';

      await nextSteps('my-cool-app', nextStepsText);

      const calls = log.getCalls();

      calls.forEach((call) => {
        console.log(call.args[0]);
      });
      expect(calls.some((call) => call.args[0] === nextStepsText)).to.equal(false);
    });
  });
});
