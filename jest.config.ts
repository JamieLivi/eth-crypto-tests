export default {
  testEnvironment: 'node',
  verbose: true,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*'],
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'json-summary', 'text', 'json'],
  coveragePathIgnorePatterns: ['node_modules', 'dist', 'src/index.ts', 'jest.config.js', 'package.json'],
  reporters: [
    'default',
    [
      'jest-stare',
      {
        reportTitle: 'Cryptographic function tests',
        reportHeadline: 'Crypto functions tests',
        resultDir: 'results',
      },
    ],
  ],
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
  },
};
