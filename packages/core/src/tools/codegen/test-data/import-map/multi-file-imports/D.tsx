import * as React from '../fake-react';
import { testClassInstance } from '../test-exports';

export const D = () => {
  console.log(testClassInstance, React);
  return 'D';
};
