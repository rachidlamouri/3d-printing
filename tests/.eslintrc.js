module.exports = {
  env: {
    mocha: true,
  },
  extends: '../.eslintrc',
  plugins: [
    'mocha',
  ],
  globals: {
    OpenJscadObject: 'readonly',
  },
  rules: {
    'func-names': 'off',
    'mocha/no-exclusive-tests': 'error',
    'no-unused-expressions': 'off',
    'prefer-arrow-callback': 'off',
  },
};
