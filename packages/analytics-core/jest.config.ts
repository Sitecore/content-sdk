import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  displayName: 'analytics-core',
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
  collectCoverageFrom: ['src/**/*.ts', '!src/*.ts', '!src/**/interfaces.ts'],
};

export default config;
