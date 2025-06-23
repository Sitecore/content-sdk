import loader from './component-props.loader';
import { expect } from 'chai';

describe('component-props.loader', () => {
  it('should strip exported function expressions from the source code', () => {
    const source = `import { foo } from 'module';

console.log('Hello, world!');

export const getComponentServerProps = async () => {
  return {
    props: { test: true },
  };
}`;

    const expected = `import { foo } from 'module';

console.log('Hello, world!');`;

    const result = loader(source).replace(/\r\n/g, '\n');

    expect(result).to.deep.equal(expected);
  });

  it('should strip exported function declarations from the source code', () => {
    const source = `import { foo } from 'module';

console.log('Hello, world!');

export async function getComponentServerProps() {
  return {
    props: { test: true },
  };
}`;

    const expected = `import { foo } from 'module';

console.log('Hello, world!');

export {};`;

    const result = loader(source).replace(/\r\n/g, '\n');

    expect(result).to.deep.equal(expected);
  });
});
