module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ["airbnb-base"],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {},
};

module.exports = {
  parser: "babel-eslint",
  extends: ["eslint-config-airbnb-base", "eslint-config-prettier"].map(
    require.resolve
  ),
  plugins: ["prettier"],
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        singleQuote: true,
        trailingComma: "es5",
      },
    ],
    "max-len": [2, 130, 4],
    "no-param-reassign": [
      2,
      {
        props: false,
      },
    ],
    "no-plusplus": 0,
    "no-underscore-dangle": 0,
    "prefer-rest-params": 0,
  },
};
