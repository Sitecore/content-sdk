import { funco } from '../test-exports';
import { JSX } from 'react';

export const Component = (): JSX.Element => {
  funco();
  return <div>Wow a unit test</div>;
};
