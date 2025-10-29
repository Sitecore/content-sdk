import React from '../fake-react';
import { testClassInstance } from '../test-exports-2';

export const C = () => {
  console.log(testClassInstance, React);
  return 'C';
};
