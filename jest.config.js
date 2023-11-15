const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig.json')

module.exports = {
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}),
  passWithNoTests: true,
  preset: 'ts-jest',
  snapshotSerializers: ['jest-serializer-path'],
  testEnvironment: 'node'
}
