/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true
      }
    ]
  },
  moduleNameMapper: {
    '^../logging/winston': '<rootDir>/src/logging/winston.ts',
    '^../../config\\.json$': '<rootDir>/src/__mocks__/mock-config.json'
  }
}
