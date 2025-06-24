import { BaseAppArgs, Initializer } from '../../..';

export default class TestInitializer implements Initializer {
  async init(_args: BaseAppArgs) {
    return {
      nextSteps: '',
    };
  }
}
