/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { tryCatch } from './try-catch';

describe('tryCatch', () => {
  describe('sync', () => {
    it('should return [result, null] when function succeeds without using the fallback', () => {
      const [result, error] = tryCatch(() => 42, 11);

      expect(result).to.equal(42);
      expect(error).to.be.null;
    });

    it('should return [fallback, Error] when the function fails and fallback is provided', () => {
      const [result, error] = tryCatch(() => {
        if (Date.now() > 1) throw new Error('oops');
        return 'success';
      }, 'default');

      expect(result).to.equal('default');
      expect(error).to.be.instanceOf(Error);
      expect(error?.message).to.equal('oops');
    });

    it('should return [undefined, Error] when the function fails and no fallback is provided', () => {
      const [result, error] = tryCatch(() => {
        if (Date.now() > 1) throw new Error('oops');
        return 'success';
      });

      expect(result).to.be.undefined;
      expect(error).to.be.instanceOf(Error);
      expect(error?.message).to.equal('oops');
    });
  });

  describe('async', () => {
    it('should return [result, null] when async function resolves without using the fallback', async () => {
      const [result, error] = await tryCatch(async () => 'hello', 'world');

      expect(result).to.equal('hello');
      expect(error).to.be.null;
    });

    it('should return [fallback, Error] when the function fails and fallback is provided', async () => {
      const [result, error] = await tryCatch(async () => {
        throw new Error('async error');
      }, 'default');

      expect(result).to.equal('default');
      expect(error).to.be.instanceOf(Error);
      expect(error?.message).to.equal('async error');
    });

    it('should return [undefined, Error] when the function fails and no fallback is provided', async () => {
      const [result, error] = await tryCatch(async () => {
        throw new Error('async oops');
      });

      expect(result).to.be.undefined;
      expect(error).to.be.instanceOf(Error);
      expect(error?.message).to.equal('async oops');
    });

    it('should wrap non-Error async rejections in an Error', async () => {
      const [result, error] = await tryCatch(async () => Promise.reject('async string error'));

      expect(result).to.be.undefined;
      expect(error).to.be.instanceOf(Error);
      expect(error?.message).to.equal('async string error');
    });
  });
});

