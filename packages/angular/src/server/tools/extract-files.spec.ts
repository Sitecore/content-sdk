/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, vi, beforeEach } from 'vitest';

type RecordedArgs = {
  gatherCompanionFiles?: unknown;
  componentMapPath?: string;
};

const contentMock = vi.hoisted(() => {
  const innerRun = vi.fn(async (_ctx: { scConfig: unknown }): Promise<void> => {});
  const recorded: RecordedArgs[] = [];
  const extractFiles = vi.fn((args: RecordedArgs = {}) => {
    recorded.push(args);
    return innerRun;
  });
  return { innerRun, extractFiles, recorded };
});

vi.mock('@sitecore-content-sdk/content/node-tools', () => ({
  extractFiles: contentMock.extractFiles,
  ExtractedFileType: { Component: 'component', Template: 'template', Style: 'style' },
}));

import { extractFiles } from './extract-files';
import { gatherAngularCompanionFiles } from './angular-source-utils';

describe('extractFiles (Angular wrapper)', () => {
  beforeEach(() => {
    contentMock.extractFiles.mockClear();
    contentMock.innerRun.mockClear();
    contentMock.recorded.length = 0;
  });

  it('delegates to the content extractor, injecting the Angular companion gatherer', () => {
    extractFiles();

    expect(contentMock.extractFiles).toHaveBeenCalledTimes(1);
    expect(contentMock.recorded[0].gatherCompanionFiles).toBe(gatherAngularCompanionFiles);
  });

  it('forwards user config while defaulting the companion gatherer', () => {
    extractFiles({ componentMapPath: './custom/component-map.ts' });

    expect(contentMock.recorded[0].componentMapPath).toBe('./custom/component-map.ts');
    expect(contentMock.recorded[0].gatherCompanionFiles).toBe(gatherAngularCompanionFiles);
  });

  it('allows overriding the companion gatherer via args', () => {
    const custom = vi.fn(() => []);
    extractFiles({ gatherCompanionFiles: custom });

    expect(contentMock.recorded[0].gatherCompanionFiles).toBe(custom);
  });

  it('invokes the underlying run with the provided scConfig', async () => {
    const command = extractFiles();
    const scConfig = { api: { edge: { edgeUrl: 'https://edge' } } } as never;

    await command({ scConfig });

    expect(contentMock.innerRun).toHaveBeenCalledTimes(1);
    expect(contentMock.innerRun.mock.calls[0][0]).toEqual({ scConfig });
  });
});
