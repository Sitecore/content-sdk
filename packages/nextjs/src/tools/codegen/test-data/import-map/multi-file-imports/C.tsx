import React from 'react';
import { testClassInstance } from '../test-exports';

export const C = () => {
  console.log(testClassInstance, React);
  return <div>C</div>;
};
