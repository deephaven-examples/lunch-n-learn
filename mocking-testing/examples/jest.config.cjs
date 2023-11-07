/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // These settings can be used with NODE_OPTIONS=--experimental-vm-modules which
  // I attempted to configure to be able to use @deephave/utils as ESM, but I had
  // issues with jest.mock not working.
  // extensionsToTreatAsEsm: ['.ts'],
  // moduleNameMapper: {
  //   '^(\\.{1,2}/.*)\\.js$': '$1',
  // },
  // transform: {
  //   '^.+\\.ts?$': [
  //     'ts-jest',
  //     {
  //       useESM: true,
  //     },
  //   ],
  // },
};
