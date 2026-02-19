/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { normalizeEnvValue } from './normalize-env-value';

describe('normalizeEnvValue', () => {
  it('should return undefined for undefined', () => {
    expect(normalizeEnvValue(undefined)).to.be.undefined;
  });

  it('should return undefined for empty string', () => {
    expect(normalizeEnvValue('')).to.be.undefined;
  });

  it('should return undefined for whitespace-only string', () => {
    expect(normalizeEnvValue('   ')).to.be.undefined;
    expect(normalizeEnvValue('\t\n')).to.be.undefined;
  });

  it('should return undefined for the string "undefined"', () => {
    expect(normalizeEnvValue('undefined')).to.be.undefined;
  });

  it('should return undefined for the string "null"', () => {
    expect(normalizeEnvValue('null')).to.be.undefined;
  });

  it('should treat "undefined" and "null" case-insensitively', () => {
    expect(normalizeEnvValue('UNDEFINED')).to.be.undefined;
    expect(normalizeEnvValue('Undefined')).to.be.undefined;
    expect(normalizeEnvValue('NULL')).to.be.undefined;
    expect(normalizeEnvValue('Null')).to.be.undefined;
  });

  it('should return undefined when trimmed value is "undefined" or "null"', () => {
    expect(normalizeEnvValue('  undefined  ')).to.be.undefined;
    expect(normalizeEnvValue('  null  ')).to.be.undefined;
  });

  it('should return trimmed string for valid values', () => {
    expect(normalizeEnvValue('custom.example.com')).to.equal('custom.example.com');
    expect(normalizeEnvValue('  custom.example.com  ')).to.equal('custom.example.com');
  });

  it('should preserve case of valid values', () => {
    expect(normalizeEnvValue('My-Host.example.com')).to.equal('My-Host.example.com');
  });

  it('should return valid value that contains "undefined" as substring', () => {
    expect(normalizeEnvValue('my-undefined-host.com')).to.equal('my-undefined-host.com');
  });
});
