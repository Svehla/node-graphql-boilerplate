module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  rules: {
    semi: 'off',
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/semi': ['error', 'never'],
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: false, variables: false, typedefs: true },
    ],
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/prefer-interface': 0,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/ban-ts-ignore': 0, // no `do not use` @ts-ignore
    '@typescript-eslint/no-this-alias': 0,
    '@typescript-eslint/explicit-module-boundary-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    // "@typescript-eslint/explicit-member-accessibility": [ { accessibility: "no-public", overrides: { properties: "explicit" } } ],
    'prefer-arrow-callback': 2,
    'arrow-parens': ['error', 'as-needed'],
    eqeqeq: 'error',
    'max-len': ['warn', { code: 100, ignoreComments: true }],
    'new-parens': 'error',
    'no-bitwise': 'error',
    'no-console': ['warn', { allow: ['time', 'timeEnd', 'warn', 'info', 'error'] }],
    'no-caller': 'error',
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1, maxBOF: 0 }],
    'object-literal-key-quotes': 0,
    'sort-imports-es6-autofix/sort-imports-es6': [
      2,
      {
        ignoreCase: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],
    'no-irregular-whitespace': 'warn',
  },
  plugins: ['sort-imports-es6-autofix'],
}
