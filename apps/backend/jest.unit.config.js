const baseConfig = require('./jest.common.config.js');

/** @type {import('jest').Config} */
module.exports = {
  ...baseConfig,
  testMatch: ['**/*.spec.ts'],
  coveragePathIgnorePatterns: [
    '.(module|union|input|resolver|model|repository|config).(t|j)s',
    'main.ts',
  ],
};
