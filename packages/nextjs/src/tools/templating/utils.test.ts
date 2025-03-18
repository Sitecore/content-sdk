/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */

import { expect } from 'chai';
import chokidar from 'chokidar';
import sinon from 'sinon';
import { watchItems } from './utils';

describe('utils', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('watchItems', () => {
    it('should watch items', () => {
      const onEventStub = sinon.stub();
      onEventStub.returns({
        on: onEventStub,
      });
      const watchStub = sinon.stub(chokidar, 'watch').returns({
        on: onEventStub,
      } as any);

      const cb = () => {};

      watchItems(['src/foo', 'src/bar'], cb);

      expect(watchStub.calledWith(['src/foo', 'src/bar'])).to.equal(true);
      expect(onEventStub.args[0]).to.deep.equal(['add', cb]);
      expect(onEventStub.args[1]).to.deep.equal(['unlink', cb]);
    });
  });
});
