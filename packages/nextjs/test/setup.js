import '../src/tests/jsdom-setup.ts';
import '../src/tests/request.ts';
import * as td from 'testdouble';

export const mochaHooks = {
  afterEach() {
    td.reset();
  },
};
