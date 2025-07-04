import loader from './component-props.loader.js';
import { expect } from 'chai';

describe('component-props.loader', () => {
  it('should strip exported function expressions from the source code', async () => {
    const source = `import { foo } from 'module';

console.log('Hello, world!');

export const getComponentServerProps = async () => {
  return {
    props: { test: true },
  };
}`;

    const expected = `import { foo } from 'module';

console.log('Hello, world!');`;

    const result = await loader(source);

    expect(result.replace(/\r\n/g, '\n')).to.deep.equal(expected);
  });

  it('should strip exported function declarations from the source code', async () => {
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

    const result = await loader(source);

    expect(result.replace(/\r\n/g, '\n')).to.deep.equal(expected);
  });
});
