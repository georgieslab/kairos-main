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
};