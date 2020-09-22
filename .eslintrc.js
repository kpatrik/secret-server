module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true,
  },
  globals: {
    expect: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-unused-expressions': 0,
    'no-underscore-dangle': 0,
    'class-methods-use-this': 0,
  },
};
