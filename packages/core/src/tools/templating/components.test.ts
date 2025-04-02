/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

describe('components', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('getComponentList', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should return list of components', () => {
      const items = [
        {
          path: 'src/components/Foo',
          componentName: 'Foo',
          moduleName: 'Foo',
        },
        {
          path: 'src/components/Bar',
          componentName: 'Bar-Component',
          moduleName: 'BarComponent',
        },
      ];

      const logStub = sinon.stub(console, 'debug');
      const getItemsStub = sinon.stub();
      const componentsModule = proxyquire('./components', {
        './utils': { getItems: getItemsStub },
      });
      const getComponentList = componentsModule.getComponentList;
      getItemsStub.returns(items);

      expect(getComponentList('src/components')).to.deep.equal(items);
      expect(getItemsStub.called).to.be.true;

      const getItemsStubArgs = getItemsStub.getCall(0).args[0];

      expect(getItemsStubArgs.resolveItem('src/components', 'Foo-Bar')).to.deep.equal({
        path: 'src/components/Foo-Bar',
        componentName: 'Foo-Bar',
        moduleName: 'FooBar',
      });

      getItemsStubArgs.cb!('FooBar');

      expect(logStub.calledOnceWith('Registering Content SDK component FooBar')).to.be.true;
    });
  });
});
