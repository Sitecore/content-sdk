import '../src/tests/jsdom-setup.ts';
import * as td from 'testdouble';

export const mochaHooks = {
  afterEach() {
    td.reset();
  },
};
