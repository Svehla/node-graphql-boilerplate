module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  roots: ['<rootDir>/src'],
  testRegex: '^.+\\.test\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
}
