/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      'ts-jest',
      {
        useESM: true
      }
    ]
  },
  moduleNameMapper: {
    '^../logging/winston': '<rootDir>/src/logging/winston.ts',
    '^../modules/functions.js': '<rootDir>/src/modules/functions.ts'
  }
}
