/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { extractDocumentCssLayers, extractLayer } from './css-layers';

describe('css-layers', () => {
  const sample = `
@layer base { html { margin: 0 } }
@layer theme { :root { --color-red-500: #ef4444 } }
@layer utilities {
  .text-red-500 { color: var(--color-red-500) }
  .flex { display: flex }
}
`;

  it('extractLayer returns a single named layer block', () => {
    expect(extractLayer(sample, 'theme')).to.include('--color-red-500');
    expect(extractLayer(sample, 'theme')).to.match(/^@layer theme \{/);
    expect(extractLayer(sample, 'missing')).to.equal('');
  });

  it('extractDocumentCssLayers returns theme and utilities, skipping base', () => {
    const result = extractDocumentCssLayers(sample);
    expect(result).to.include('@layer theme');
    expect(result).to.include('@layer utilities');
    expect(result).to.include('.text-red-500');
    expect(result).to.not.include('@layer base');
  });
});
