import React, { useEffect } from '../fake-react';
import testExportsDefault, { testClassInstance } from '../test-exports';

export const E = () => {
  console.log(testClassInstance, testExportsDefault, React, useEffect);
  return <div>E</div>;
};
