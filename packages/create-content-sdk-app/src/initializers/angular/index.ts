import path from 'path';
import { BaseAppArgs, Initializer, transform } from '../../common';

export default class AngularInitializer implements Initializer {
  async init(args: BaseAppArgs) {
    const templatePath = path.resolve(__dirname, '../../templates/angular');

    await transform(templatePath, args);

    const response = {};
    return response;
  }
}
