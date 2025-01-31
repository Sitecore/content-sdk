import { BaseAppArgs, Initializer } from '../../..';

export default class TestInitializer implements Initializer {
  appName = 'default-test-app';

  async init(_args: BaseAppArgs) {
    return {
      nextSteps: '',
      appName: this.appName,
    };
  }
}
