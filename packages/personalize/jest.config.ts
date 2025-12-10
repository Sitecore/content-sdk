import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  displayName: 'personalize',
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@sitecore-content-sdk/utils$': '<rootDir>/../utils/src/index.ts',
    '^@sitecore-content-sdk/__core__/browser$': '<rootDir>/../__core__/src/browser.ts',
    '^@sitecore-content-sdk/__core__/server$': '<rootDir>/../__core__/src/server.ts',
    '^@sitecore-content-sdk/__core__/internal$': '<rootDir>/../__core__/src/internal.ts',
    '^@sitecore-content-sdk/events/browser$': '<rootDir>/../events/src/browser.ts',
    '^@sitecore-content-sdk/events/server$': '<rootDir>/../events/src/server.ts',
  },
  coverageDirectory: './coverage',
  coverageReporters: ['cobertura', 'text'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/types/'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/types/'],
  collectCoverageFrom: ['src/**/*.ts', '!src/*.ts', '!src/**/interfaces.ts'],
};

export default config;
