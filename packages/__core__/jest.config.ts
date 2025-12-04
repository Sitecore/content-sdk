/* eslint-disable */
// Importing @jest/types allows us to have intellisense over InitialOptions of Jest
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  displayName: '__core__',
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
  },
  coverageDirectory: './coverage',
  coverageReporters: ['cobertura', 'text'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/types/'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/types/'],
  coverageThreshold: {
    global: {
      branches: 99,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/*.ts', '!src/**/interfaces.ts'],
};

export default config;
