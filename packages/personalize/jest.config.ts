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
    '^@sitecore-content-sdk/analytics-core/browser$': '<rootDir>/../analytics-core/src/browser.ts',
    '^@sitecore-content-sdk/analytics-core/server$': '<rootDir>/../analytics-core/src/server.ts',
    '^@sitecore-content-sdk/analytics-core/internal$':
      '<rootDir>/../analytics-core/src/internal.ts',
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
