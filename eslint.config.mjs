// import react from 'eslint-plugin-react';
// import typescriptEslint from '@typescript-eslint/eslint-plugin';
// import prettier from 'eslint-plugin-prettier';
// import globals from 'globals';
// import tsParser from '@typescript-eslint/parser';
// import path from 'node:path';
// import { fileURLToPath } from 'node:url';
// import js from '@eslint/js';
// import { FlatCompat } from '@eslint/eslintrc';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const compat = new FlatCompat({
//   baseDirectory: __dirname,
//   recommendedConfig: js.configs.recommended,
//   allConfig: js.configs.all
// });

// export default [...compat.extends(
//   'eslint:recommended',
//   'plugin:react/recommended',
//   'plugin:@typescript-eslint/recommended',
//   'prettier',
// ), {
//   plugins: {
//     react,
//     '@typescript-eslint': typescriptEslint,
//     prettier,
//   },
//   languageOptions: {
//     globals: {
//       ...globals.browser,
//     },
//     parser: tsParser,
//     ecmaVersion: 'latest',
//     sourceType: 'module',
//   },
//   settings: {
//     react: {
//       version: 'detect',
//     },
//   },
//   rules: {
//     'prettier/prettier': ['error'],
//     'linebreak-style': [1, 'unix'],
//     semi: ['error', 'always'],
//     quotes: ['warn', 'single'],
//     'key-spacing': ['warn', {
//       beforeColon: false,
//       afterColon: true,
//     }],
//     'new-cap': ['warn', {
//       newIsCap: true,
//       capIsNew: false,
//     }],
//     'no-multiple-empty-lines': ['warn', {
//       max: 1,
//     }],
//     'comma-style': ['warn', 'last'],
//     'comma-spacing': ['warn', {
//       before: false,
//       after: true,
//     }],
//     'comma-dangle': ['warn', 'always-multiline'],
//     'no-implicit-coercion': 'off',
//     'no-invalid-this': 'warn',
//     'no-multi-spaces': 'warn',
//     'no-new-func': 'warn',
//     'global-require': 'off',
//     'no-console': 'warn',
//     'object-curly-spacing': ['error', 'always'],
//     'space-before-function-paren': 'off',
//     'no-trailing-spaces': 'warn',
//     'space-before-blocks': ['error', 'always'],
//     'semi-spacing': ['error', {
//       before: false,
//       after: true,
//     }],
//     'arrow-spacing': ['error', {
//       before: true,
//       after: true,
//     }],
//     'space-infix-ops': 'error',
//     '@typescript-eslint/no-explicit-any': 'off',
//     '@typescript-eslint/no-inferrable-types': 'off',
//     'react/react-in-jsx-scope': 'off',
//     'react/prop-types': 'off',
//     // '@typescript-eslint/ban-types': 'warn',
//     'prefer-const': 'warn',
//     '@typescript-eslint/no-non-null-assertion': 'off',
//     '@typescript-eslint/no-unused-vars': 'off',
//   },
// }];

import react from 'eslint-plugin-react';
import tsParser from '@typescript-eslint/parser';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import js from '@eslint/js';


/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  {
    files: ['src/**/*.ts', 'src/*.ts', 'test/*.ts', 'eslint.config.js'],
    ignores: ['node_modules/*', '.vscode/*'],
    plugins: {
      react,
      '@typescript-eslint': typescriptEslint,
      prettier,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      semi: ['warn', 'always'],
      quotes: ['warn', 'single'],
      indent: ['warn', 2, { SwitchCase: 1 }],
      'key-spacing': [
        'warn',
        {
          beforeColon: false,
          afterColon: true,
        },
      ],
      'new-cap': [
        'warn',
        {
          newIsCap: true,
          capIsNew: false,
        },
      ],
      'no-multiple-empty-lines': [
        'warn',
        {
          max: 1,
        },
      ],
      'comma-style': ['warn', 'last'],
      'comma-spacing': [
        'warn',
        {
          before: false,
          after: true,
        },
      ],
      'comma-dangle': ['warn', 'always-multiline'],
      'no-implicit-coercion': 'off',
      'no-invalid-this': 'warn',
      'no-multi-spaces': 'warn',
      'no-new-func': 'warn',
      'global-require': 'off',
      'no-console': 'warn',
      'object-curly-spacing': ['error', 'always'],
      'space-before-function-paren': [
        'warn',
        {
          anonymous: 'never',
          named: 'never',
          asyncArrow: 'always',
        },
      ],
      'no-trailing-spaces': 'warn',
      'space-before-blocks': ['error', 'always'],
      'semi-spacing': [
        'error',
        {
          before: false,
          after: true,
        },
      ],
      'arrow-spacing': [
        'error',
        {
          before: true,
          after: true,
        },
      ],
      'space-infix-ops': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'no-unused-vars': 'off',
      'no-unused-private-class-members': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'block-spacing': 'error',
      'no-undef': 'off',
      'no-dupe-class-members': 'warn',
      'no-extra-boolean-cast': 'off'
    },
  },
];