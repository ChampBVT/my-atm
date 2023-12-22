const baseConfig = require('./jest.common.config.js');

/** @type {import('jest').Config} */
module.exports = {
  ...baseConfig,
  roots: ['test'],
  testMatch: ['**/*.e2e-spec.ts'],
  testTimeout: 15000,
  coveragePathIgnorePatterns: ['.(module|config).(t|j)s'],
};
