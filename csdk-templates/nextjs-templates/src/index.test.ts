import { expect } from 'chai';
import { initializers } from './index';

describe('nextjs-templates initializers', () => {
  it('should expose an initializer for every template it provides', () => {
    expect(Object.keys(initializers)).to.have.members([
      'nextjs',
      'nextjs-app-router',
      'nextjs-app-router-cache-components',
    ]);

    for (const initializer of Object.values(initializers)) {
      expect(initializer.init).to.be.a('function');
    }
  });
});
