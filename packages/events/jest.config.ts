import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  displayName: 'events',
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
    '^@sitecore-content-sdk/analytics-core/internal$':
      '<rootDir>/../analytics-core/src/internal.ts',
    '^@sitecore-content-sdk/analytics-core/utils$': '<rootDir>/../analytics-core/src/utils.ts',
    '^@sitecore-content-sdk/analytics-core$': '<rootDir>/../analytics-core/src/index.ts',
    '^@sitecore-content-sdk/core$': '<rootDir>/../core/src/index.ts',
  },
  coverageDirectory: './coverage',
  coverageReporters: ['cobertura', 'text'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/types/'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/types/'],
  collectCoverageFrom: ['src/**/*.ts', '!src/*.ts', '!src/**/interfaces.ts'],
};

export default config;
