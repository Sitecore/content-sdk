import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as td from 'testdouble';

chai.use(chaiAsPromised);

export const mochaHooks = {
  afterEach() {
    td.reset();
  },
};
