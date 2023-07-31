module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    "indent": ["error", 2, { "SwitchCase": 1, "ignoredNodes": ["PropertyDefinition"] }],
    "quotes": ["error", "single", { "avoidEscape": true, "allowTemplateLiterals": true }],
    "semi": ["warn", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "eqeqeq": "warn",
    "no-cond-assign": ["warn", "always"],
    "no-unused-vars": "warn",
    "no-console": "warn",
    "brace-style": ["warn", "1tbs"],
    "strict": ["error", "safe"],
    "@typescript-eslint/naming-convention": [ "error", {
      "selector": "interface",
      "format": ["PascalCase"],
      "custom": {
        "regex": "^I[A-Z]",
        "match": true
      }
    }],
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/ban-ts-comment": "off"
  },
};
