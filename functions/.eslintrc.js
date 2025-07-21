<<<<<<< HEAD
// functions/.eslintrc.js - Fixed for Node.js environment

module.exports = {
  env: {
    browser: false,
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", {"allowTemplateLiterals": true}],
    "max-len": ["error", {"code": 120}],
    "object-curly-spacing": ["error", "never"],
    "comma-dangle": ["error", "never"],
    "require-jsdoc": "off",
    "valid-jsdoc": "off",
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
=======
exports.extends = [
  "eslint:recommended",
  "google",
];

exports.env = {
  es6: true,
  node: true,
};

exports.rules = {
  quotes: ["error", "double"],
  "max-len": ["error", { "code": 120 }]
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
};