module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.spec.json'
    }
  },
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1'
  }
};
