/* eslint-disable no-unused-expressions */
import { expect, spy } from 'chai';
import {
  isEditorActive,
  resetEditorChromes,
  ChromeRediscoveryGlobalFunctionName,
  PAGES_EDITING_MARKER,
  QUERY_PARAM_EDITING_SECRET,
  REDACTED_VALUE,
  redactEditingSecret,
} from './utils';

// must make TypeScript happy with `global` variable modification
interface CustomWindow {
  [key: string]: unknown;
  document: unknown;
}

interface Global {
  window: CustomWindow | undefined;
}

declare const global: Global;

describe('utils', () => {
  const pagesEditingDocument = {
    getElementById: (id: unknown) => (id === PAGES_EDITING_MARKER ? 'present' : null),
  };

  const nonPagesEditingDocument = {
    getElementById: (id: unknown) => (id === PAGES_EDITING_MARKER ? null : 'present'),
  };

  describe('isEditorActive', () => {
    it('should return false when invoked on server', () => {
      expect(isEditorActive()).to.be.false;
    });

    it('should return true when edit mode is active', () => {
      global.window = {
        document: pagesEditingDocument,
        location: { search: '' },
        Sitecore: null,
      };
      expect(isEditorActive()).to.be.true;
    });

    it('should return false when preview mode is active', () => {
      global.window = {
        document: nonPagesEditingDocument,
        location: { search: '?sc_horizon=preview' },
        Sitecore: null,
      };
      expect(isEditorActive()).to.be.false;
    });

    it('should return false when edit mode is not active', () => {
      global.window = {
        document: nonPagesEditingDocument,
        location: { search: '' },
        Sitecore: null,
      };
      expect(isEditorActive()).to.be.false;
    });

    after(() => {
      global.window = undefined;
    });
  });

  describe('redactEditingSecret', () => {
    it('should replace the editing secret and keep other params', () => {
      const query = { [QUERY_PARAM_EDITING_SECRET]: 'top-secret', route: '/home' };

      expect(redactEditingSecret(query)).to.deep.equal({
        [QUERY_PARAM_EDITING_SECRET]: REDACTED_VALUE,
        route: '/home',
      });
    });

    it('should redact an array value (secret passed multiple times)', () => {
      const result = redactEditingSecret({ [QUERY_PARAM_EDITING_SECRET]: ['one', 'two'] });

      expect(JSON.stringify(result)).to.not.include('one');
      expect(JSON.stringify(result)).to.not.include('two');
    });

    it('should not mutate the original query', () => {
      const query = { [QUERY_PARAM_EDITING_SECRET]: 'top-secret' };

      redactEditingSecret(query);

      expect(query[QUERY_PARAM_EDITING_SECRET]).to.equal('top-secret');
    });

    it('should return the query as is when there is no secret', () => {
      const query = { route: '/home' };

      expect(redactEditingSecret(query)).to.equal(query);
      expect(redactEditingSecret(undefined)).to.be.undefined;
    });
  });

  describe('resetEditorChromes', () => {
    it('should not throw when invoked on server', () => {
      expect(resetEditorChromes()).to.not.throw;
    });

    it('should reset chromes when edit mode is active', () => {
      const resetChromes = spy();
      global.window = {
        document: pagesEditingDocument,
        location: { search: '' },
        Sitecore: null,
      };
      global.window[ChromeRediscoveryGlobalFunctionName.name] = resetChromes;
      resetEditorChromes();
      expect(resetChromes).to.have.been.called.once;
    });

    it('should not throw when edit mode is not active', () => {
      global.window = {
        document: nonPagesEditingDocument,
        location: { search: '' },
        Sitecore: null,
      };
      expect(resetEditorChromes()).to.not.throw;
    });

    after(() => {
      global.window = undefined;
    });
  });
});
