module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/**/*.test.ts'],
  verbose: true,
  silent: false,
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
