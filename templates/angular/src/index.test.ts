import { expect } from 'chai';
import { initializers } from './index';

describe('angular-templates initializers', () => {
  it('should expose an initializer for every template it provides', () => {
    expect(Object.keys(initializers)).to.have.members(['angular']);

    for (const initializer of Object.values(initializers)) {
      expect(initializer.init).to.be.a('function');
    }
  });
});
