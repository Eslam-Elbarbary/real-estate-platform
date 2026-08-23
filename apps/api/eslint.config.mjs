import baseConfig from '@repo/config/eslint/base';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
];
